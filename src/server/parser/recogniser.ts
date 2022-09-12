export function isNewLine(c: string) { return c == '\n' || c == '\r' }
export function isWhiteSpace(c: string) { return c == ' ' || c == '\t' || isNewLine(c) }

export function isAlpha(c: string)
{
	return (c >= 'a' && c <= 'z') ||
		(c >= 'A' && c <= 'Z') ||
		(c >= '\u00C0' && c <= '\u2000') ||
		(c >= '\u2070' && c <= '\uD7FF') ||
		(c >= '\uE000' && c <= '\uFE4F') ||
		(c >= '\uFE70' && c <= '\uFEFF') ||
		(c >= '\u{00010000}' && c <= '\u{0002FA1F}')
}

export function isDigit(c: string) { return c >= '0' && c <= '9' }
export function isAlphaNum(c: string) { return isAlpha(c) || isDigit(c) }
export function isUnderscore(c: string) { return c == '_' }


export function isHex(c: string)
{
	return (c >= '0' && c <= '9') ||
		(c >= 'A' && c <= 'F') ||
		(c >= 'a' && c <= 'f')
}

export function isDot(c: string) { return c == '.' }

export function isNormalAlpha(c: string)
{
	return c == ' ' || c == '!' ||
		(c >= '#' && c <= '&') ||
		(c >= '(' && c <= '[') ||
		(c >= ']' && c <= '~') ||
		(c >= '\u0080' && c <= '\uD7FF') ||
		(c >= '\uE000' && c <= '\u{0010FFFF}')
}

export function isSingleQuote(c: string) { return c == '\'' }
export function isDoubleQuote(c: string) { return c == '"' }


export function isEquals(c: string) { return c == '=' }
