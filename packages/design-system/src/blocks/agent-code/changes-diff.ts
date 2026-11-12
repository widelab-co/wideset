// TODO(custom): reads a unified diff (the text `git diff` prints) into hunks and numbered lines; Wideset has no diff component.

export type LineKind = 'added' | 'removed' | 'context';

/** One line of a diff: its number on the side it exists on (old, new or both) and its text. */
export type DiffLine = { kind: LineKind; old?: number; new?: number; text: string };

/** A run of changed lines with the unchanged lines around them, under its `@@` header. */
export type Hunk = { header: string; lines: DiffLine[] };

/** Where a comment sits: a line of the new file, or a removed line of the old one. */
export type Anchor = { side: 'old' | 'new'; line: number };

const HUNK_HEADER = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/;

const KIND: Record<string, LineKind> = { '+': 'added', '-': 'removed', ' ': 'context' };

/**
 * A file's patch as hunks. Line numbers are counted from each hunk header: an added line moves
 * the new side on, a removed line the old side, an unchanged line both.
 */
export function parsePatch(patch: string): Hunk[] {
  const hunks: Hunk[] = [];
  let old = 0;
  let next = 0;
  for (const raw of patch.trim().split('\n')) {
    const header = HUNK_HEADER.exec(raw);
    if (header) {
      old = Number(header[1]);
      next = Number(header[2]);
      hunks.push({ header: raw, lines: [] });
      continue;
    }
    const kind = KIND[raw[0] ?? ' '];
    const hunk = hunks.at(-1);
    if (!kind || !hunk) continue;
    hunk.lines.push({
      kind,
      old: kind === 'added' ? undefined : old++,
      new: kind === 'removed' ? undefined : next++,
      text: raw.slice(1),
    });
  }
  return hunks;
}

/** How many lines a patch adds and removes. */
export function countChanges(hunks: Hunk[]) {
  const lines = hunks.flatMap((hunk) => hunk.lines);
  return {
    added: lines.filter((line) => line.kind === 'added').length,
    removed: lines.filter((line) => line.kind === 'removed').length,
  };
}

/** The place a comment on this line is kept under: the new file's line, or the old one's if removed. */
export function anchorOf(line: DiffLine): Anchor {
  return line.kind === 'removed'
    ? { side: 'old', line: line.old ?? 0 }
    : { side: 'new', line: line.new ?? 0 };
}

export const sameAnchor = (a: Anchor, b: Anchor) => a.side === b.side && a.line === b.line;
