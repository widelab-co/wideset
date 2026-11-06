/**
 * Match the row the thumbnail sits in: small in menu and sidebar items, medium (the default) in a
 * small table, large in a medium or large table and in a file row. Extra small and extra large
 * are for denser and roomier layouts of your own. The corner radius, the glyph and the letters
 * step with the size.
 */
import { Thumbnail } from '@wideset/react';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export default function ThumbnailSizes() {
  return (
    <div className="gap-ws-9 flex flex-col">
      <div className="gap-ws-7 flex flex-wrap items-center">
        {sizes.map((size) => (
          <Thumbnail key={size} size={size} />
        ))}
      </div>
      <div className="gap-ws-7 flex flex-wrap items-center">
        {sizes.map((size) => (
          <Thumbnail key={size} size={size} text="M" />
        ))}
      </div>
    </div>
  );
}
