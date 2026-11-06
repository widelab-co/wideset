/**
 * A file kind fixes the glyph and the hue, so the same kind looks the same in every list. Map
 * your file's MIME type or extension to one of the five; anything else, an archive or a sound,
 * is a `document`. In an upload list `FileItem.Thumbnail` does that mapping from the file name.
 */
import { Thumbnail } from '@wideset/react';

export default function ThumbnailFileTypes() {
  return (
    <div className="gap-ws-7 flex flex-wrap items-center">
      <Thumbnail size="xl" type="pdf" />
      <Thumbnail size="xl" type="spreadsheet" />
      <Thumbnail size="xl" type="document" />
      <Thumbnail size="xl" type="video" />
      <Thumbnail size="xl" type="picture" />
    </div>
  );
}
