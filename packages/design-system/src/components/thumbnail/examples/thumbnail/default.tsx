/** The playground's stage: one thumbnail, its type and size set from the rail. */
import { Thumbnail, type ThumbnailProps } from '@wideset/react';

export default function ThumbnailDefault(props: ThumbnailProps) {
  return <Thumbnail size="xl" {...props} />;
}
