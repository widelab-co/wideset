// TODO(custom): a file's kind as an icon on a neutral tile; Wideset's Thumbnail colours each kind and has no folder kind.
import {
  type RemixiconComponentType,
  RiFilePdf2Line,
  RiFileTextLine,
  RiFolder3Line,
  RiTableLine,
} from '@remixicon/react';
import { cn } from '@wideset/react';

import type { Kind } from './data';

const ICONS: Record<Kind | 'folder', RemixiconComponentType> = {
  folder: RiFolder3Line,
  pdf: RiFilePdf2Line,
  doc: RiFileTextLine,
  sheet: RiTableLine,
};

/**
 * What a row or a tile holds, at a glance: the kind's line icon on a bordered white tile, the
 * same grey for every kind. In a list of thirty files a colour per kind would be the loudest
 * thing on the page, and the kind is not a judgement.
 */
export function FileIcon({ kind, className }: { kind: Kind | 'folder'; className?: string }) {
  const Icon = ICONS[kind];
  return (
    <span
      aria-hidden="true"
      className={cn(
        'border-ws-static-subtle bg-ws-static-foreground rounded-ws-control-lg size-ws-14 flex shrink-0 items-center justify-center border',
        className,
      )}
    >
      <Icon className="size-ws-9 text-ws-static-subtle" />
    </span>
  );
}
