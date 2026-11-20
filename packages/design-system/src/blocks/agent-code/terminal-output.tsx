// TODO(custom): a shell's log (each command with who ran it and how it ended, then what it printed, in monospace); Wideset has no terminal or log part.
import { RiRobot2Line } from '@remixicon/react';
import { cn, StatusBadge } from '@wideset/react';
import { useEffect, useRef } from 'react';

import { type Line, type Run, type Span, stateOf, type Tone } from './terminal-data';

const TONE: Record<Exclude<Tone, 'link'>, string> = {
  subtle: 'text-ws-static-subtle',
  strong: 'text-ws-static-strong',
  positive: 'text-ws-semantic-positive',
  negative: 'text-ws-semantic-negative',
  notice: 'text-ws-semantic-notice',
};

/** Monospace for the command and its output only: the marks beside them keep the interface's type. */
const MONO = 'font-ws-mono tracking-ws-normal';

function OutputSpan({ span }: { span: Span }) {
  if (typeof span === 'string') return span;
  const [tone, text] = span;
  return tone === 'link' ? (
    <a
      href={text}
      target="_blank"
      rel="noreferrer"
      className="text-ws-static-strong focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default rounded-ws-control-sm underline decoration-from-font"
    >
      {text}
    </a>
  ) : (
    <span className={TONE[tone]}>{text}</span>
  );
}

/** A line keeps its spaces and breaks anywhere, as a terminal wraps; a blank one keeps its height. */
function OutputLine({ line }: { line: Line }) {
  return (
    <div className="min-h-[1lh] wrap-anywhere whitespace-pre-wrap">
      {line.map((span, index) => (
        // Output is only ever added to, so a span's place is its identity.
        <OutputSpan key={index} span={span} />
      ))}
    </div>
  );
}

/**
 * One shell's log, on the pane's own surface so it follows the theme: every command is a line
 * with the prompt, who ran it (the agent, or you) and how it ended in its meaning's colour, then
 * its output in monospace with the few colours a terminal gives a log. It stays scrolled to the
 * newest line, and a long line wraps instead of scrolling sideways.
 */
export function TerminalOutput({ runs }: { runs: Run[] }) {
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [runs]);

  return (
    <div ref={scroller} className="h-full overflow-y-auto">
      <div
        role="log"
        aria-label="Output"
        className="typography-body-sm text-ws-static-base gap-ws-11 px-ws-11 py-ws-9 flex flex-col"
      >
        {runs.map(({ id, by, command, state, output }) => {
          const { label, color } = stateOf(state);
          return (
            <section key={id} aria-label={command} className="gap-ws-3 flex flex-col">
              {/* The marks sit on the command's first line, however far the command wraps. */}
              <div className="gap-ws-7 flex items-start">
                <p className={cn(MONO, 'text-ws-static-strong min-w-0 flex-1 wrap-anywhere')}>
                  <span aria-hidden="true" className="text-ws-static-subtle select-none">
                    ${' '}
                  </span>
                  {command}
                </p>
                <div className="gap-ws-5 flex h-[1lh] shrink-0 items-center">
                  <span className="typography-caption-md text-ws-static-subtle gap-ws-2 flex items-center">
                    {by === 'tandem' && <RiRobot2Line aria-hidden="true" className="size-ws-8" />}
                    {by === 'tandem' ? 'Tandem' : 'You'}
                  </span>
                  <StatusBadge size="sm" color={color}>
                    {label}
                  </StatusBadge>
                </div>
              </div>
              {output.length > 0 && (
                <div className={MONO}>
                  {output.map((line, index) => (
                    <OutputLine key={index} line={line} />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
