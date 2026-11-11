import { Button } from '@wideset/react';
import { useState } from 'react';

import { FILES, ME, NOW, type Thread, THREADS, VIEWED } from './changes-data';
import type { Anchor } from './changes-diff';
import { FileDiff } from './changes-file-diff';
import { FileSection } from './changes-file-section';
import { ChangesToolbar } from './changes-toolbar';

const ADDED = FILES.reduce((sum, file) => sum + file.added, 0);
const REMOVED = FILES.reduce((sum, file) => sum + file.removed, 0);

/**
 * The Changes pane: what the session changed, to review. A bar with the totals, a filter and the
 * way to the pull request; under it the changed files in git's order, each a section that folds,
 * with its diff and the review threads on their lines. Ticking Viewed folds a file, as reading it
 * is what the tick records, and unticking opens it again. The diff is the pane's one heavy
 * thing; nothing here is filled, since the session's composer owns the screen's filled button.
 */
export function ChangesPane() {
  const [query, setQuery] = useState('');
  const [viewed, setViewed] = useState(VIEWED);
  const [open, setOpen] = useState(() =>
    FILES.map((file) => file.path).filter((path) => !VIEWED.includes(path)),
  );
  const [threads, setThreads] = useState(THREADS);

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
    setThreads((current) => current.map((thread) => (thread.id === id ? change(thread) : thread)));

  const comment = (path: string, anchor: Anchor, text: string) =>
    setThreads((current) => [
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

      <div className="min-h-0 flex-1 overflow-y-auto">
        {shown.map((file) => (
          <FileSection
            key={file.path}
            file={file}
            open={open.includes(file.path)}
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
              onSend={(id) => update(id, (thread) => ({ ...thread, sent: true }))}
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
