// TODO(custom): product picture tile (116px, outlined); Wideset's Thumbnail is internal and stops at 40px.
import type { RemixiconComponentType } from '@remixicon/react';

/**
 * The record's picture: Figma's Order Badge, a 116px outlined tile. A block ships no binary
 * assets, so an icon of the product stands in for the photo.
 */
export function OrderThumbnail({ icon: Icon }: { icon: RemixiconComponentType }) {
  return (
    // Figma's stroke (#ddd) and radius (12px) are unbound: Static/Stroke/Base and Container/md.
    <div
      aria-hidden="true"
      className="border-ws-static-base rounded-ws-container-md text-ws-static-subtle flex size-[7.25rem] shrink-0 items-center justify-center border"
    >
      <Icon className="size-ws-18" />
    </div>
  );
}
