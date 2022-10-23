import {Position, Range, TextDocument} from 'vscode-languageserver-textdocument'

export enum TokenType
{
	invalid,
	eof,
	whitespace,
	comment,
	newline,
	dot,
	semi,
	ident,
	leftParen,
	rightParen,
	leftBrace,
	rightBrace,
	leftSquare,
	rightSquare,
	comma,
	colon,
	binLit,
	octLit,
	hexLit,
	intLit,
	stringLit,
	charLit,
	boolLit,
	nullptrLit,
	invert,
	incOp,
	mulOp,
	addOp,
	shiftOp,
	bitOp,
	relOp,
	equOp,
	logicOp,

	locationSpec,
	storageSpec,
	type,
	assignOp,

	deleteStmt,
	newStmt,
	returnStmt,
	ifStmt,
	elifStmt,
	elseStmt,
	whileStmt,
	doStmt,

	noneType,
	arrow,
	classDef,
	functionDef,
	operatorDef,
	decorator,
	visibility,

	// XXX: These only exist because of the current parser structure and aren't real tokens.
	float32Lit,
	float64Lit
}

function isPositionEqual(posA: Position, posB: Position)
{
	return posA.line === posB.line &&
		posA.character === posB.character
}

function isRangeEqual(rangeA: Range, rangeB: Range)
{
	return isPositionEqual(rangeA.start, rangeB.start) &&
		isPositionEqual(rangeA.end, rangeB.end)
}

export class Token
{
	private _type: TokenType = TokenType.invalid
	private _value = ''
	private _location: Range = {start: {line: -1, character: -1}, end: {line: -1, character: -1}}
	private _length = 0

	constructor(token?: Token)
	{
		if (token)
		{
			this._type = token._type
			this._value = token._value
			this._location =
			{
				start:
				{
					line: token._location.start.line,
					character: token._location.start.character
				},
				end:
				{
					line: token._location.end.line,
					character: token._location.end.character
				}
			}
			this._length = token._length
		}
	}

	get type()
	{
		return this._type
	}

	get value()
	{
		return this._value
	}

	set value(value: string)
	{
		this._value = value
	}

	get location()
	{
		return this._location
	}

	get length()
	{
		return this._length
	}

	get valid()
	{
		return this._type != TokenType.invalid
	}

	public set(type: TokenType, value?: string)
	{
		this._type = type
		this._value = value ?? ''
	}

	public reset()
	{
		this._type = TokenType.invalid
		this._value = ''
		this._location.start = this._location.end
		this._length = 0
	}

	public beginsAt(position: Position)
	{
		this._location.start = position
	}

	public endsAt(position: Position)
	{
		this._location.end = position
	}

	public calcLength(file: TextDocument)
	{
		const beginOffset = file.offsetAt(this._location.start)
		const endOffset = file.offsetAt(this._location.end)
		this._length = endOffset - beginOffset
	}

	public typeIsOneOf(...types: TokenType[])
	{
		return types.some(type => this._type === type, this)
	}

	public clone() { return new Token(this) }

	public toString()
	{
		return `<Token ${this._type}@${this._location.start.line}:${this.location.start.character} -> ${this._value}>`
	}

	public isEqual(token: Token)
	{
		return this._type === token._type &&
			this._value === token._value &&
			isRangeEqual(this._location, token._location) &&
			this._length === token._length
	}
}
