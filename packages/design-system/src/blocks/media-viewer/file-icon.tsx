// TODO(custom): a file's kind as an icon on a neutral tile; Wideset's Thumbnail colours each kind and has no deck or image-of-a-chart kind.
import {
  type RemixiconComponentType,
  RiFilePdf2Line,
  RiImageLine,
  RiSlideshowLine,
} from '@remixicon/react';
import { cn } from '@wideset/react';

import type { Kind } from './data';

const ICONS: Record<Kind, RemixiconComponentType> = {
  pdf: RiFilePdf2Line,
  deck: RiSlideshowLine,
  image: RiImageLine,
};

/**
 * What a row holds, at a glance: the kind's line icon on a bordered tile, the same grey for every
 * kind (copied from the Files block). In a list of files a colour per kind would be the loudest
 * thing on the page, and the kind is not a judgement.
 */
export function FileIcon({ kind, className }: { kind: Kind; className?: string }) {
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
