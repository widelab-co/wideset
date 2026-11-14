// TODO(custom): a file's kind as an icon on a neutral tile; Wideset's Thumbnail colours each kind and has no folder, deck or audio kind.
import {
  type RemixiconComponentType,
  RiFilePdf2Line,
  RiFileTextLine,
  RiFolder3Line,
  RiMicLine,
  RiSlideshowLine,
  RiTableLine,
  RiVidiconLine,
} from '@remixicon/react';
import { cn } from '@wideset/react';

import type { Kind } from './data';

const ICONS: Record<Kind, RemixiconComponentType> = {
  folder: RiFolder3Line,
  pdf: RiFilePdf2Line,
  doc: RiFileTextLine,
  deck: RiSlideshowLine,
  sheet: RiTableLine,
  recording: RiVidiconLine,
};

/**
 * What a row or a tile holds, at a glance: the kind's line icon on a bordered white tile, the
 * same grey for every kind. In a list of thirty files a colour per kind would be the loudest
 * thing on the page, and the kind is not a judgement. Audio recordings take the microphone.
 */
export function FileIcon({
  kind,
  name,
  className,
}: {
  kind: Kind;
  name?: string;
  className?: string;
}) {
  const Icon =
    kind === 'recording' && /\.(m4a|mp3|wav)$/i.test(name ?? '') ? RiMicLine : ICONS[kind];
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
