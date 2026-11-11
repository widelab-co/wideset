// TODO(custom): a code editor (line numbers, colouring, current line, problem marks) as a textarea over a coloured copy; Wideset has no code editor and no monospace font token (Tailwind's font-mono stands in).
import { cn } from '@wideset/react';
import { type KeyboardEvent, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

import type { ScriptFile } from './data';
import { type Token, tokenize, type TokenKind } from './highlight';
import type { Problem } from './lint';

const INDENT = '  ';

/** The textarea and its coloured copy share every metric, so the caret sits on the letters. */
const CODE = 'typography-body-md tracking-ws-normal whitespace-pre font-mono';
const PAD = 'py-ws-5 pl-ws-7 pr-ws-9';

/**
 * Two colours and a grey: keywords one, literals (strings and numbers) the other, comments the
 * quiet grey; plain code keeps the text colour. The two are text tokens that read in both
 * themes. The decorative set has none: its text (`*-on-subtle`) is near black in light, its
 * strong fills too dark on the dark editor.
 */
const COLOUR: Record<TokenKind, string> = {
  keyword: 'text-ws-semantic-info',
  string: 'text-ws-semantic-positive',
  number: 'text-ws-semantic-positive',
  comment: 'text-ws-static-subtle',
  plain: 'text-ws-static-strong',
};

const MARK: Record<Problem['severity'], string> = {
  error: 'underline decoration-wavy decoration-ws-semantic-negative',
  warning: 'underline decoration-wavy decoration-ws-semantic-notice',
};

/** Where the caret should land: a problem's line and column (1-based); `key` re-runs it. */
export type Reveal = { line: number; column: number; key: number };

type Piece = { from: number; to: number; kind: TokenKind; mark?: Problem['severity'] };

/** A line cut at every token and problem edge, so a mark can cover part of a token. */
function pieces(line: string, tokens: Token[], problems: Problem[]): Piece[] {
  const marks = problems.map((problem) => ({
    from: problem.column - 1,
    to: problem.column - 1 + problem.length,
    severity: problem.severity,
  }));
  const cuts = [
    ...new Set([
      0,
      line.length,
      ...tokens.map((t) => t.start),
      ...marks.flatMap((m) => [m.from, m.to]),
    ]),
  ]
    .filter((at) => at >= 0 && at <= line.length)
    .sort((a, b) => a - b);
  return cuts.slice(0, -1).map((from, index) => ({
    from,
    to: cuts[index + 1],
    kind: tokens.findLast((token) => token.start <= from)?.kind ?? 'plain',
    mark: marks.find((mark) => mark.from <= from && from < mark.to)?.severity,
  }));
}

type CodeEditorProps = {
  file: ScriptFile;
  value: string;
  onChange: (value: string) => void;
  /** This file's problems, marked under the code. */
  problems: Problem[];
  reveal?: Reveal;
};

/**
 * The editor: a plain textarea, its text transparent, over a coloured copy of the same text, so
 * typing, selecting, copying and the screen reader all work as in any field while the copy shows
 * the colours, the current line and wavy marks under problems. The line numbers follow the text.
 * Tab indents (Shift+Tab outdents) and Enter keeps the indent; Escape, then Tab, leaves the field.
 */
export function CodeEditor({ file, value, onChange, problems, reveal }: CodeEditorProps) {
  const area = useRef<HTMLTextAreaElement>(null);
  const copy = useRef<HTMLPreElement>(null);
  const pending = useRef<[number, number] | null>(null);
  const escaped = useRef(false);
  const hintId = useId();
  const [caretLine, setCaretLine] = useState(0);
  const lines = value.split('\n');

  // After an edit made here, the caret goes where the edit left it.
  useLayoutEffect(() => {
    if (!pending.current || !area.current) return;
    area.current.setSelectionRange(...pending.current);
    pending.current = null;
  });

  // A problem clicked in the panel puts the caret on it and brings its line into view.
  useEffect(() => {
    const field = area.current;
    if (!reveal || !field) return;
    const before = field.value.split('\n').slice(0, reveal.line - 1);
    const offset = before.reduce((sum, line) => sum + line.length + 1, 0) + reveal.column - 1;
    field.focus();
    field.setSelectionRange(offset, offset);
    setCaretLine(reveal.line - 1);
    copy.current?.children[reveal.line - 1]?.scrollIntoView?.({ block: 'center' });
  }, [reveal]);

  const followCaret = () => {
    const field = area.current;
    if (field) setCaretLine(field.value.slice(0, field.selectionStart).split('\n').length - 1);
  };

  // ponytail: edits made here (Tab, Enter) skip the browser's undo stack; keep a history of
  // values if Ctrl+Z over them matters.
  const edit = (next: string, start: number, end = start) => {
    pending.current = [start, end];
    onChange(next);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const { selectionStart: from, selectionEnd: to, value: text } = event.currentTarget;
    const leaving = escaped.current;
    escaped.current = event.key === 'Escape';
    const plain = !event.altKey && !event.ctrlKey && !event.metaKey;
    const lineStart = text.lastIndexOf('\n', from - 1) + 1;

    if (event.key === 'Enter' && plain && !event.shiftKey) {
      event.preventDefault();
      let indent = /^ */.exec(text.slice(lineStart, from))![0];
      if (/[{([]\s*$/.test(text.slice(lineStart, from))) indent += INDENT;
      edit(`${text.slice(0, from)}\n${indent}${text.slice(to)}`, from + 1 + indent.length);
      return;
    }

    if (event.key !== 'Tab' || leaving || !plain) return;
    event.preventDefault();
    if (from === to && !event.shiftKey) {
      edit(text.slice(0, from) + INDENT + text.slice(to), from + INDENT.length);
      return;
    }
    // A selection, or Shift+Tab: every line it touches moves by one step.
    const block = text.slice(lineStart, to).split('\n');
    const moved = block.map((line) =>
      event.shiftKey ? line.replace(/^ {1,2}/, '') : INDENT + line,
    );
    const start = Math.max(lineStart, from + moved[0].length - block[0].length);
    const end = to + moved.join('\n').length - block.join('\n').length;
    edit(
      text.slice(0, lineStart) + moved.join('\n') + text.slice(to),
      start,
      from === to ? start : end,
    );
  };

  return (
    <div className="min-h-0 flex-1 overflow-auto">
      <div className="flex min-h-full w-max min-w-full">
        {/* Numbers stay put while long lines scroll sideways. */}
        <div
          aria-hidden="true"
          className={cn(
            CODE,
            'bg-ws-static-foreground py-ws-5 pl-ws-9 pr-ws-3 z-ws-base sticky left-0 text-right tabular-nums select-none',
          )}
        >
          {lines.map((_, index) => (
            <div
              key={index}
              className={index === caretLine ? 'text-ws-static-strong' : 'text-ws-static-subtle'}
            >
              {index + 1}
            </div>
          ))}
        </div>

        <div className="relative min-w-0 flex-1">
          <pre ref={copy} aria-hidden="true" className={cn(CODE, 'py-ws-5')}>
            {lines.map((line, index) => {
              const here = problems.filter((problem) => problem.line === index + 1);
              const tokens: Token[] =
                file.language === 'js' ? tokenize(line) : [{ kind: 'plain', start: 0, text: line }];
              return (
                <div
                  key={index}
                  className={cn(
                    'pl-ws-7 pr-ws-9',
                    index === caretLine && 'bg-ws-static-alpha-subtle',
                  )}
                >
                  {line === ''
                    ? ' '
                    : pieces(line, tokens, here).map((piece) => (
                        <span
                          key={piece.from}
                          className={cn(COLOUR[piece.kind], piece.mark && MARK[piece.mark])}
                        >
                          {line.slice(piece.from, piece.to)}
                        </span>
                      ))}
                </div>
              );
            })}
          </pre>
          <textarea
            ref={area}
            value={value}
            wrap="off"
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            aria-label={`Code of ${file.name}`}
            aria-describedby={hintId}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={onKeyDown}
            onSelect={followCaret}
            className={cn(
              CODE,
              PAD,
              'absolute inset-0 resize-none overflow-hidden border-0 bg-transparent text-transparent caret-(--ws-static-text-strong) outline-hidden',
            )}
          />
          <p id={hintId} className="sr-only">
            Tab indents and Shift+Tab outdents. Press Escape, then Tab, to leave the editor.
          </p>
        </div>
      </div>
    </div>
  );
}
