// TODO(custom): the editor's checks (a syntax error, an unused name); a stand-in for the linter a real editor runs.
import { tokenize } from './highlight';

export type Problem = {
  severity: 'error' | 'warning';
  message: string;
  /** The rule's name, as a linter prints it. */
  rule: string;
  /** 1-based, as editors count. */
  line: number;
  column: number;
  /** How many characters the mark under the code covers. */
  length: number;
};

const PAIRS: Record<string, string> = { ')': '(', ']': '[', '}': '{' };

/**
 * Checks one JavaScript file the way a linter in an editor would, and reports what it finds,
 * errors first: the first syntax error (an unclosed string or bracket, or a stray closing one),
 * since a parser stops there, then every `const` or `let` that is never used again.
 */
export function lint(source: string): Problem[] {
  const lines = source.split('\n');
  // Each line with comments and strings blanked out, so only code is checked and columns hold.
  const code = lines.map((line) =>
    tokenize(line)
      .map((token) =>
        token.kind === 'comment' || token.kind === 'string'
          ? ' '.repeat(token.text.length)
          : token.text,
      )
      .join(''),
  );

  const syntax = (): Problem | undefined => {
    const open: { char: string; line: number; column: number }[] = [];
    for (const [index, line] of lines.entries()) {
      const unclosed = tokenize(line).find(
        (token) =>
          token.kind === 'string' && (token.text.length < 2 || token.text.at(-1) !== token.text[0]),
      );
      if (unclosed) {
        return {
          severity: 'error',
          message: 'Unterminated string constant.',
          rule: 'syntax',
          line: index + 1,
          column: unclosed.start + 1,
          length: unclosed.text.length,
        };
      }
      for (const [column, char] of [...code[index]].entries()) {
        if ('([{'.includes(char)) open.push({ char, line: index + 1, column: column + 1 });
        if (!PAIRS[char]) continue;
        if (open.at(-1)?.char === PAIRS[char]) {
          open.pop();
          continue;
        }
        return {
          severity: 'error',
          message: `Unexpected token '${char}'.`,
          rule: 'syntax',
          line: index + 1,
          column: column + 1,
          length: 1,
        };
      }
    }
    const last = open.at(-1);
    if (!last) return undefined;
    return {
      severity: 'error',
      message: `'${last.char}' is never closed.`,
      rule: 'syntax',
      ...last,
      length: 1,
    };
  };

  const unused: Problem[] = [];
  const all = code.join('\n');
  for (const [index, line] of code.entries()) {
    for (const match of line.matchAll(/\b(?:const|let)\s+([A-Za-z_]\w*)\s*=/g)) {
      const name = match[1];
      // A use is the name on its own, not a property of something else (`lead.region`).
      const uses = all.match(new RegExp(String.raw`(?<![\w.])${name}(?!\w)`, 'g'));
      if ((uses?.length ?? 0) > 1) continue;
      unused.push({
        severity: 'warning',
        message: `'${name}' is assigned a value but never used.`,
        rule: 'no-unused-vars',
        line: index + 1,
        column: match.index + match[0].lastIndexOf(name) + 1,
        length: name.length,
      });
    }
  }

  const error = syntax();
  return error ? [error, ...unused] : unused;
}
