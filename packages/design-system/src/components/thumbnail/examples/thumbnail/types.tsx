/**
 * What the tile shows follows the prop you pass: `icon` a Remix glyph on the purple tile (a bar
 * chart when you pass nothing), `src` a picture cropped to fill it, `type="logo"` with `src` a
 * logo at glyph size on a white tile with a hairline border, so any mark reads on any surface,
 * and `text` a letter or two. Next to a name the tile is decorative: leave `alt` empty there and
 * describe the picture or logo only when the thumbnail stands alone.
 */
import { RiFlashlightFill } from '@remixicon/react';
import { Thumbnail } from '@wideset/react';

const PRODUCT_PHOTO =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?&w=128&h=128&dpr=2&q=80&fit=crop';
const APP_LOGO = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="9" cy="12" r="7" fill="#1ec3be"/><circle cx="15" cy="12" r="7" fill="#4178fa" fill-opacity=".85"/></svg>',
)}`;

export default function ThumbnailTypes() {
  return (
    <div className="gap-ws-7 flex flex-wrap items-center">
      <Thumbnail size="xl" icon={RiFlashlightFill} />
      <Thumbnail size="xl" src={PRODUCT_PHOTO} alt="Wireless headphones" />
      <Thumbnail size="xl" type="logo" src={APP_LOGO} alt="Relay" />
      <Thumbnail size="xl" text="M" />
    </div>
  );
}
