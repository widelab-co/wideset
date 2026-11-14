// TODO(custom): a photo in a media grid (preview, cover mark, remove and reorder); Wideset has no MediaTile or image grid.
import { RiArrowLeftSLine, RiArrowRightSLine, RiCloseLine, RiImageLine } from '@remixicon/react';
import { IconButton, Tag } from '@wideset/react';

import type { Photo } from './data';

type PhotoTileProps = {
  photo: Photo;
  /** Its place in the grid, from 0; the first photo is the cover. */
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove: () => void;
};

/**
 * One added photo. Blocks ship no images, so the picture is a neutral tile with an image icon;
 * in a product it is the photo, cropped square. The cover carries its mark on the picture,
 * Remove sits in the other corner, and the arrows under it move the photo one place, which is
 * how the cover changes without dragging.
 */
export function PhotoTile({ photo, index, count, onMove, onRemove }: PhotoTileProps) {
  return (
    <li className="gap-ws-3 flex min-w-0 flex-col">
      <div className="bg-ws-static-alpha-subtle rounded-ws-container-md relative flex aspect-square items-center justify-center">
        <RiImageLine aria-hidden="true" className="size-ws-12 text-ws-static-subtle" />
        {index === 0 && (
          <Tag size="sm" color="secondary" className="top-ws-5 left-ws-5 absolute">
            Cover
          </Tag>
        )}
        <IconButton
          icon={RiCloseLine}
          size="xs"
          variant="secondary"
          preset="border"
          aria-label={`Remove ${photo.name}`}
          onClick={onRemove}
          className="top-ws-5 right-ws-5 absolute"
        />
      </div>
      <div className="gap-ws-2 flex items-center">
        <span className="typography-caption-md text-ws-static-subtle min-w-0 flex-1 truncate">
          {photo.name}
        </span>
        <IconButton
          icon={RiArrowLeftSLine}
          size="xs"
          variant="secondary"
          preset="ghost"
          aria-label={index === 1 ? `Make ${photo.name} the cover` : `Move ${photo.name} earlier`}
          disabled={index === 0}
          onClick={() => onMove(index - 1)}
        />
        <IconButton
          icon={RiArrowRightSLine}
          size="xs"
          variant="secondary"
          preset="ghost"
          aria-label={`Move ${photo.name} later`}
          disabled={index === count - 1}
          onClick={() => onMove(index + 1)}
        />
      </div>
    </li>
  );
}
