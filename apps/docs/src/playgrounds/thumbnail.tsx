import { RiFlashlightFill } from '@remixicon/react';
import { Thumbnail, type ThumbnailProps } from '@wideset/react';

import { playground } from '../lib/playground-kit';

const PRODUCT_PHOTO =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?&w=128&h=128&dpr=2&q=80&fit=crop';
const APP_LOGO = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="9" cy="12" r="7" fill="#1ec3be"/><circle cx="15" cy="12" r="7" fill="#4178fa" fill-opacity=".85"/></svg>',
)}`;

/** The content each type needs on the stage, as props and as the JSX that prints them. */
const CONTENT: Record<string, { props: ThumbnailProps; code: string }> = {
  icon: { props: { icon: RiFlashlightFill }, code: 'icon={RiFlashlightFill}' },
  image: { props: { src: PRODUCT_PHOTO, alt: '' }, code: `src="${PRODUCT_PHOTO}" alt=""` },
  logo: {
    props: { type: 'logo', src: APP_LOGO, alt: '' },
    code: 'type="logo" src={app.logoUrl} alt=""',
  },
  text: { props: { text: 'M' }, code: 'text="M"' },
};

/**
 * Type and size come from `ThumbnailProps`. `icon`, `image` and `text` follow from their content
 * prop, so the stage passes that content and prints `type` only where it is required: the logo
 * and the five file kinds. The anatomy draws a glyph tile and a picture tile, one per part.
 */
export default playground({
  from: 'ThumbnailProps',
  // Figma's order: the four content types, then the file kinds.
  order: {
    type: ['icon', 'image', 'logo', 'text', 'pdf', 'spreadsheet', 'document', 'video', 'picture'],
  },
  defaults: { size: 'xl' },
  render: (v) => (
    <Thumbnail
      size={v.size as ThumbnailProps['size']}
      {...(CONTENT[String(v.type)]?.props ?? ({ type: v.type } as ThumbnailProps))}
    />
  ),
  code: (v) => {
    const size = v.size === 'md' ? '' : ` size="${v.size}"`;
    return `<Thumbnail${size} ${CONTENT[String(v.type)]?.code ?? `type="${v.type}"`} />`;
  },
  anatomy: () => (
    <div className="flex items-center gap-ws-7">
      <Thumbnail size="xl" icon={RiFlashlightFill} />
      <Thumbnail size="xl" src={PRODUCT_PHOTO} alt="" />
    </div>
  ),
});
