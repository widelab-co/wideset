// TODO(custom): a file's text to read (line numbers, colouring, the changed lines marked in the gutter); Wideset has no code view.
import { cn } from '@wideset/react';

import type { Change, RepoFile } from './files-data';
import { type Token, TOKEN_COLOUR, tokenize } from './highlight';

const CODE = 'typography-body-md tracking-ws-normal font-ws-mono whitespace-pre';

/** The bar beside a changed line, as editors draw it: green for a new line, blue for a changed one. */
const BAR: Record<Change, string> = {
  added: 'bg-ws-semantic-inverse-positive',
  modified: 'bg-ws-semantic-inverse-info',
};

/**
 * The open file, read only: its lines numbered, coloured by the tokenizer (prose is left plain)
 * and, between the numbers and the code, a bar beside every line the session added or changed.
 * Long lines scroll sideways under numbers that stay put; the region takes the focus, so the
 * keyboard scrolls it too. The numbers and bars are not read aloud: the file's header says how
 * many lines changed.
 */
export function FilesCode({ file }: { file: RepoFile }) {
  const name = file.path.slice(file.path.lastIndexOf('/') + 1);
  // Prose has nothing to colour: a line of it is one plain run.
  const tokensOf = (text: string): Token[] =>
    name.endsWith('.md') ? [{ kind: 'plain', start: 0, text }] : tokenize(text);

  return (
    <div
      role="region"
      aria-label={`Contents of ${name}`}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrolling region must be reachable by keyboard
      tabIndex={0}
      className="focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default min-h-0 flex-1 overflow-auto -outline-offset-2"
    >
      <div className="py-ws-5 flex min-h-full w-max min-w-full">
        <div
          aria-hidden="true"
          className={cn(
            CODE,
            'bg-ws-static-foreground text-ws-static-subtle z-ws-base left-ws-0 sticky text-right tabular-nums select-none',
          )}
        >
          {file.lines.map((line, index) => (
            <div key={index} className="flex">
              <span className="pl-ws-11 pr-ws-5 flex-1">{index + 1}</span>
              <span className={cn('w-ws-2 shrink-0', line.change && BAR[line.change])} />
            </div>
          ))}
        </div>
        <pre className={cn(CODE, 'pl-ws-7 pr-ws-11 min-w-0 flex-1')}>
          <code>
            {file.lines.map((line, index) => (
              <span key={index} className="block">
                {/* An empty line still takes its height. */}
                {line.text === ''
                  ? ' '
                  : tokensOf(line.text).map((token) => (
                      <span key={token.start} className={TOKEN_COLOUR[token.kind]}>
                        {token.text}
                      </span>
                    ))}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
