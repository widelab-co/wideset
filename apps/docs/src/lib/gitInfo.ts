import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';

import type { Entry } from './catalog';

/**
 * Build-time facts from git about a component's folder (`packages/design-system/src/components/
 * <name>`), for the sidebar's NEW marks: when it first appeared and when it last changed. Read
 * once per folder and cached; a checkout without history reads as unknown.
 */
const PACKAGE = resolve(process.cwd(), '../../packages/design-system');
const cache = new Map<string, string | null>();
const git = (args: string[]) => {
  const key = args.join(' ');
  if (!cache.has(key)) {
    try {
      cache.set(
        key,
        execFileSync('git', args, { cwd: PACKAGE, encoding: 'utf8' }).trim().split('\n')[0] || null,
      );
    } catch {
      cache.set(key, null);
    }
  }
  return cache.get(key)!;
};
const folderOf = (entry: Entry) => dirname(entry.sourceFiles[0] ?? `src/components/${entry.id}/x`);

const changedAt = (entry: Entry) => git(['log', '-1', '--format=%cI', '--', folderOf(entry)]);

const NEW_DAYS = 60;
/**
 * The components to mark NEW: their folder first appeared in git within the last 60 days. When
 * that is most of them (the history starts with the repository's migration, so every folder
 * shares one first date), the rule says nothing; the three most recently changed folders stand
 * in, so the mark is visible.
 */
export const newIds = (entries: Entry[]) => {
  const since = Date.now() - NEW_DAYS * 86_400_000;
  const added = entries.filter((entry) => {
    const first = git([
      'log',
      '--diff-filter=A',
      '--format=%cs',
      '--reverse',
      '--',
      folderOf(entry),
    ]);
    return first !== null && Date.parse(first) >= since;
  });
  if (added.length > 0 && added.length <= entries.length / 2)
    return new Set(added.map((e) => e.id));
  // No history at all (a checkout without git): no marks.
  if (entries.every((entry) => changedAt(entry) === null)) return new Set<string>();
  return new Set(
    [...entries]
      .sort((a, b) => (changedAt(b) ?? '').localeCompare(changedAt(a) ?? ''))
      .slice(0, 3)
      .map((entry) => entry.id),
  );
};
