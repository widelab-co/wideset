// TODO(custom): call transcript (speaker, time, text; the spoken line marked and followed; search with the match marked); Wideset has no transcript or timed list.
import { RiSearchLine } from '@remixicon/react';
import { Avatar, TextInput } from '@wideset/react';
import { useEffect, useRef, useState } from 'react';

import type { Line } from './data';
import { formatClock } from './format';
import { Highlight } from './highlight';
import { Section } from './section';

type TranscriptProps = {
  lines: Line[];
  time: number;
  playing: boolean;
  onSeek: (time: number) => void;
};

/**
 * What was said, a turn a row: who, when, what. The line being spoken carries the selected
 * treatment and, while the call plays, the list scrolls to keep it in view (not while searching,
 * when the reader is somewhere else). A row is one target across its width: it seeks there. The
 * search keeps the lines that match and marks the match.
 */
export function Transcript({ lines, time, playing, onSeek }: TranscriptProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const [query, setQuery] = useState('');
  const needle = query.trim().toLowerCase();

  const current = lines.findLast((line) => line.at <= time)?.at;
  const shown = needle
    ? lines.filter(
        (line) =>
          line.text.toLowerCase().includes(needle) ||
          line.speaker.name.toLowerCase().includes(needle),
      )
    : lines;

  useEffect(() => {
    const list = listRef.current;
    const row = list?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!playing || needle || !list || !row) return;
    const smooth =
      typeof window.matchMedia === 'function' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Keep the spoken line a third of the way down, so what comes next is in view.
    list.scrollTo({
      top: row.offsetTop - list.clientHeight / 3,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, [current, playing, needle]);

  return (
    <Section
      title="Transcript"
      className="min-h-0"
      action={
        <TextInput
          size="sm"
          className="w-[16rem]"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        >
          <TextInput.Prefix inner>
            <TextInput.Icon icon={RiSearchLine} />
          </TextInput.Prefix>
          <TextInput.Input
            type="search"
            placeholder="Search the transcript"
            aria-label="Search the transcript"
          />
          {query && (
            <TextInput.Suffix inner>
              <TextInput.ClearButton onClear={() => setQuery('')} />
            </TextInput.Suffix>
          )}
        </TextInput>
      }
    >
      {shown.length ? (
        <ol
          ref={listRef}
          aria-label="Transcript lines"
          className="-mx-ws-7 px-ws-3 pt-ws-3 pb-ws-12 relative min-h-0 flex-1 overflow-y-auto"
        >
          {shown.map((line) => (
            <li key={line.at}>
              <button
                type="button"
                aria-current={line.at === current || undefined}
                onClick={() => onSeek(line.at)}
                className="gap-ws-7 px-ws-5 py-ws-5 rounded-ws-control-lg hover:bg-ws-dynamic-tertiary-alpha-strong-default aria-[current=true]:bg-ws-dynamic-primary-alpha-strong-default focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex w-full cursor-pointer items-start text-left"
              >
                <Avatar
                  size="sm"
                  initials={line.speaker.initials}
                  color={line.speaker.color}
                  aria-hidden
                />
                <span className="gap-ws-1 flex min-w-0 flex-1 flex-col">
                  <span className="gap-ws-5 flex items-baseline">
                    <span className="typography-label-strong-sm text-ws-static-strong">
                      <Highlight text={line.speaker.name} query={query.trim()} />
                    </span>
                    <span className="typography-label-sm text-ws-static-subtle tabular-nums">
                      {formatClock(line.at)}
                    </span>
                  </span>
                  <span className="typography-body-md text-ws-static-base">
                    <Highlight text={line.text} query={query.trim()} />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <p role="status" className="typography-body-md text-ws-static-subtle py-ws-5">
          Nothing in the call matches “{query.trim()}”.
        </p>
      )}
    </Section>
  );
}
