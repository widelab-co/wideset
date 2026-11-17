// TODO(custom): a small JavaScript tokenizer for the editor's colouring and checks; Wideset has no code editor.

export type TokenKind = 'comment' | 'string' | 'number' | 'keyword' | 'plain';

/** A run of one line's text, from `start`, and what it is. */
export type Token = { kind: TokenKind; start: number; text: string };

/*
  One alternation, tried left to right at each place: a comment wins over everything inside it,
  then a string (its closing quote optional, so an unclosed one still reads as a string), a
  number, a keyword. What matches none of them is plain code.
*/
const TOKEN =
  /(\/\/.*|\/\*.*?\*\/)|('(?:\\.|[^'\\])*'?|"(?:\\.|[^"\\])*"?|`(?:\\.|[^`\\])*`?)|(\b\d+(?:\.\d+)?\b)|(\b(?:async|await|break|case|catch|const|default|else|export|false|for|from|function|if|import|in|let|new|null|of|return|switch|throw|true|try|undefined|var|while)\b)/g;

const KIND: TokenKind[] = ['comment', 'string', 'number', 'keyword'];

/**
 * One line of JavaScript as runs of comment, string, number, keyword and plain code. Line by
 * line, so the editor redraws only text and the checks can point at a line and column.
 */
export function tokenize(line: string): Token[] {
  // ponytail: a block comment or template string spanning lines colours as code after its first
  // line; a real lexer if scripts grow past a page.
  const tokens: Token[] = [];
  let at = 0;
  for (const match of line.matchAll(TOKEN)) {
    const start = match.index;
    if (start > at) tokens.push({ kind: 'plain', start: at, text: line.slice(at, start) });
    tokens.push({ kind: KIND[match.slice(1).findIndex(Boolean)], start, text: match[0] });
    at = start + match[0].length;
  }
  if (at < line.length) tokens.push({ kind: 'plain', start: at, text: line.slice(at) });
  return tokens;
}
