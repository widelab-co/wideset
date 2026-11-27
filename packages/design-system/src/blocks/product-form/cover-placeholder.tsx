// TODO(custom): a neutral image placeholder filling Card.Media; Wideset has no image placeholder.
import { RiImageAddLine, RiImageLine } from '@remixicon/react';

import type { Photo } from './data';

/** The cover's stand-in: an image icon for the added photo, or a note that there is none yet. */
export function CoverPlaceholder({ cover }: { cover: Photo | undefined }) {
  return (
    <div className="bg-ws-static-alpha-subtle gap-ws-3 flex size-full flex-col items-center justify-center">
      {cover ? (
        <RiImageLine
          role="img"
          aria-label={`Cover: ${cover.name}`}
          className="size-ws-12 text-ws-static-subtle"
        />
      ) : (
        <>
          <RiImageAddLine aria-hidden="true" className="size-ws-12 text-ws-static-subtle" />
          <span className="typography-caption-md text-ws-static-subtle">No cover yet</span>
        </>
      )}
    </div>
  );
}
