import { Button } from '@wideset/react';
import { useEffect, useRef, useState } from 'react';

import { FILES, ME, NOW, splitPath, type Thread, VIEWED } from './changes-data';
import type { Anchor } from './changes-diff';
import { FileDiff } from './changes-file-diff';
import { FileSection } from './changes-file-section';
import { ChangesToolbar } from './changes-toolbar';

/** A line of a changed file to bring into view; a new `key` asks again for the same line. */
/** A changed file to bring into view, at one of its lines or, with no `line`, from its top. */
export type Reveal = { path: string; line?: number; key: number };

type ChangesPaneProps = {
  reveal?: Reveal;
  /** The review threads, kept by the pane's owner so the Checks pane counts the same ones. */
  threads: Thread[];
  onThreadsChange: (change: (threads: Thread[]) => Thread[]) => void;
  /** Puts a request in the session's composer. */
  onAsk?: (text: string) => void;
};

const ADDED = FILES.reduce((sum, file) => sum + file.added, 0);
const REMOVED = FILES.reduce((sum, file) => sum + file.removed, 0);

/**
 * The Changes pane: what the session changed, to review. A bar with the totals, a filter and the
 * way to the pull request; under it the changed files in git's order, each a section that folds,
 * with its diff and the review threads on their lines. Ticking Viewed folds a file, as reading it
 * is what the tick records, and unticking opens it again. The diff is the pane's one heavy
 * thing; nothing here is filled, since the session's composer owns the screen's filled button.
 *
 * `reveal` is a line to bring into view (a comment followed from the Checks pane): its file
 * opens, whatever the filter and its tick, and the line comes to the middle of the pane. `onAsk`
 * takes the words of Ask Tandem to fix to the session's composer.
 */
export function ChangesPane({ reveal, threads, onThreadsChange, onAsk }: ChangesPaneProps) {
  const [query, setQuery] = useState('');
  const [viewed, setViewed] = useState(VIEWED);
  const [open, setOpen] = useState(() =>
    FILES.map((file) => file.path).filter((path) => !VIEWED.includes(path)),
  );
  const scroller = useRef<HTMLDivElement>(null);
  /** The `reveal` already scrolled to, so folding a file later does not scroll again. */
  const revealed = useRef<number>(undefined);

  useEffect(() => {
    if (!reveal) return;
    setQuery('');
    setOpen((current) => [...new Set([...current, reveal.path])]);
  }, [reveal]);

  useEffect(() => {
    if (!reveal || revealed.current === reveal.key || query || !open.includes(reveal.path)) return;
    revealed.current = reveal.key;
    const pane = scroller.current;
    const file = `[aria-label="${reveal.path}"]`;
    const target = pane?.querySelector(
      reveal.line === undefined ? file : `${file} [data-new-line="${reveal.line}"]`,
    );
    // The pane's own scroll only: `scrollIntoView` would move every box around it as well. A line
    // comes to the middle, a file's top to the pane's top.
    if (pane && target) {
      pane.scrollTop +=
        target.getBoundingClientRect().top -
        pane.getBoundingClientRect().top -
        (reveal.line === undefined ? 0 : pane.clientHeight / 2);
    }
  }, [reveal, open, query]);

  const needle = query.trim().toLowerCase();
  const shown = FILES.filter((file) => file.path.toLowerCase().includes(needle));
  const anyOpen = shown.some((file) => open.includes(file.path));

  const setOpenFor = (paths: string[], value: boolean) =>
    setOpen((current) => [
      ...current.filter((path) => !paths.includes(path)),
      ...(value ? paths : []),
    ]);

  const setViewedFor = (path: string, value: boolean) => {
    setViewed((current) => [...current.filter((item) => item !== path), ...(value ? [path] : [])]);
    setOpenFor([path], !value);
  };

  const update = (id: string, change: (thread: Thread) => Thread) =>
    onThreadsChange((current) =>
      current.map((thread) => (thread.id === id ? change(thread) : thread)),
    );

  const comment = (path: string, anchor: Anchor, text: string) =>
    onThreadsChange((current) => [
      ...current,
      {
        id: `t${current.length + 1}`,
        path,
        anchor,
        comments: [{ id: 'c1', author: ME, postedAt: NOW.toISOString(), text }],
        resolved: false,
        sent: false,
      },
    ]);

  const reply = (id: string, text: string) =>
    update(id, (thread) => ({
      ...thread,
      comments: [
        ...thread.comments,
        {
          id: `c${thread.comments.length + 1}`,
          author: ME,
          postedAt: NOW.toISOString(),
          text,
        },
      ],
    }));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChangesToolbar
        total={FILES.length}
        shown={shown.length}
        added={ADDED}
        removed={REMOVED}
        query={query}
        onQueryChange={setQuery}
        anyOpen={anyOpen}
        onToggleAll={() =>
          setOpenFor(
            shown.map((file) => file.path),
            !anyOpen,
          )
        }
      />

      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto">
        {FILES.map((file) => (
          <FileSection
            key={file.path}
            file={file}
            open={open.includes(file.path)}
            hidden={!shown.includes(file)}
            viewed={viewed.includes(file.path)}
            onOpenChange={(value) => setOpenFor([file.path], value)}
            onViewedChange={(value) => setViewedFor(file.path, value)}
          >
            <FileDiff
              file={file}
              threads={threads.filter((thread) => thread.path === file.path)}
              onComment={(anchor, text) => comment(file.path, anchor, text)}
              onReply={reply}
              onResolve={(id, resolved) => update(id, (thread) => ({ ...thread, resolved }))}
              onSend={(id) => {
                const thread = threads.find((item) => item.id === id);
                if (!thread) return;
                const [{ author, text }] = thread.comments;
                onAsk?.(
                  `Fix ${author.name}’s comment on ${splitPath(thread.path).name}:${thread.anchor.line}: “${text}”`,
                );
                update(id, (item) => ({ ...item, sent: true }));
              }}
            />
          </FileSection>
        ))}

        {shown.length === 0 && (
          <div className="gap-ws-7 px-ws-11 py-ws-16 flex flex-col items-center text-center">
            <p className="typography-body-md text-ws-static-subtle">
              No changed file has “{query.trim()}” in its path.
            </p>
            <Button variant="secondary" preset="border" size="sm" onClick={() => setQuery('')}>
              Clear filter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
