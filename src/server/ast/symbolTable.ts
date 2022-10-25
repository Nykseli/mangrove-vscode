import {Parser} from '../parser/parser'

export enum SymbolTypes
{
	integer = 0x01,
	unsigned = integer | 0x02,
	int8Bit = 0x00,
	int16Bit = 0x04,
	int32Bit = 0x08,
	int64Bit = 0x0C,
	character = 0x10,
	list = 0x20,
	string = character | list,
	struct = 0x40,
	dict = struct | list,
	type = 0x80,
	invalid = 0xFF
}

export class SymbolType
{
	private type: SymbolTypes = SymbolTypes.invalid

	constructor(type?: SymbolTypes)
	{
		if (type)
			this.type = type
	}

	assign(type: SymbolTypes) { this.type = type }
	combine(type: SymbolTypes) { return this.type | type }
	append(type: SymbolTypes) { this.type |= type }
	mask(type: SymbolTypes) { return this.type & type }
	isEqual(symbolType: SymbolType) { return this.type === symbolType.type }

	get isInvalid() { return this.type === SymbolTypes.invalid }
}

export class MangroveSymbol
{
	private readonly _ident: string
	private _type: SymbolType = new SymbolType()
	private _struct?: SymbolStruct

	constructor(ident: string, type?: SymbolType)
	{
		this._ident = ident
		if (type)
			this._type = type
	}

	allocStruct(parser: Parser)
	{
		this._struct = new SymbolStruct(parser)
		this._type.assign(SymbolTypes.struct)
	}

	isEqual(symbol: MangroveSymbol) { return this._ident === symbol._ident && this._type.isEqual(symbol._type) }

	get value() { return this._ident }
	set type(type: SymbolType) { this._type = type }
	get type() { return this._type }
	get structure() { return this._struct }
}

export class SymbolTable
{
	private parentTable?: SymbolTable
	private table: Map<string, MangroveSymbol> = new Map()

	constructor(parser: Parser)
	{
		this.parentTable = parser.symbolTable
		parser.symbolTable = this
	}

	add(ident: string)
	{
		if (this.table.has(ident))
		{
			console.error('Symbol already defined in current scope')
			return
		}
		// Check if ident is already in the table, if it is this must fail.
		const symbol = new MangroveSymbol(ident)
		this.table.set(ident, symbol)
		return symbol
	}

	insert(symbol: MangroveSymbol) { this.table.set(symbol.value, symbol) }
	findLocal(ident: string) { return this.table.get(ident) }

	find(ident: string): MangroveSymbol | undefined
	{
		const symbol = this.findLocal(ident)
		if (symbol)
			return symbol
		else if (this.parentTable)
			return this.parentTable.find(ident)
		return
	}

	pop(parser: Parser)
	{
		if (this.parentTable)
			parser.symbolTable = this.parentTable
	}
}

export class SymbolStruct
{
	private contents: SymbolTable
	private _members: MangroveSymbol[] = []

	constructor(parser: Parser, members?: MangroveSymbol[])
	{
		this.contents = new SymbolTable(parser)
		if (members)
			this._members = members
	}

	get symbolTable() { return this.contents }
	get members() { return this._members }
}
