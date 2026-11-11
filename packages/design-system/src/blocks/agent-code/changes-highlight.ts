// TODO(custom): a small TypeScript tokenizer for the diff's colouring; Wideset has no code or diff component.

export type TokenKind = 'comment' | 'string' | 'number' | 'keyword' | 'plain';

/** A run of one line's text, from `start`, and what it is. */
export type Token = { kind: TokenKind; start: number; text: string };

/*
  One alternation, tried left to right at each place: a comment wins over everything inside it,
  then a string (its closing quote optional, so an unclosed one still reads as a string), a
  number, a keyword. What matches none of them is plain code. `type` counts only where it
  declares or imports a type, so an attribute or a property called `type` stays plain.
*/
const TOKEN =
  /(\/\/.*|\/\*.*?\*\/)|('(?:\\.|[^'\\])*'?|"(?:\\.|[^"\\])*"?|`(?:\\.|[^`\\])*`?)|(\b\d+(?:\.\d+)?\b)|(\b(?:as|async|await|break|case|catch|class|const|default|else|enum|export|extends|false|for|from|function|if|import|in|interface|let|new|null|of|return|switch|throw|true|try|typeof|undefined|var|void|while|type(?=\s+[\w${]))\b)/g;

const KIND: TokenKind[] = ['comment', 'string', 'number', 'keyword'];

/** A line inside a block comment: it opens one, or goes on with the comment's leading star. */
const IN_BLOCK_COMMENT = /^\s*(?:\/\*|\*(?:\s|\/|$))/;

/**
 * One line of TypeScript as runs of comment, string, number, keyword and plain code. Line by
 * line, because a diff shows lines out of their file: a hunk can start in the middle of anything.
 */
export function tokenize(line: string): Token[] {
  // ponytail: a line is read on its own, so a block comment is known only by its leading star
  // (a wrapped multiplication would read as one) and a template string spanning lines colours
  // as code after its first line; a real lexer over the whole file if that shows.
  if (IN_BLOCK_COMMENT.test(line)) return [{ kind: 'comment', start: 0, text: line }];
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
