import { FileUpload, FormField } from '@wideset/react';
import { type DragEvent, useRef, useState } from 'react';

import type { Photo, ProductDraft } from './data';
import { FormSection } from './form-section';
import { PhotoTile } from './photo-tile';
import type { Errors } from './validate';

type MediaSectionProps = {
  /** Prefix for the field ids; the drop zone is `${id}-photos`, where a failed publish lands. */
  id: string;
  photos: Photo[];
  errors: Errors;
  onChange: (patch: Partial<ProductDraft>) => void;
};

/**
 * The product's photos as a grid of square tiles, the cover first, and the drop zone as the next
 * tile, so adding one puts it where it will appear. With no file library to hand, the zone opens
 * the hidden input FileUpload renders and takes drops itself; the files are only named here.
 */
export function MediaSection({ id, photos, errors, onChange }: MediaSectionProps) {
  const upload = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const zoneId = `${id}-photos`;

  const add = (files: FileList | null) => {
    const added = Array.from(files ?? []).filter((file) => file.type.startsWith('image/'));
    if (added.length === 0) return;
    const stamp = Date.now();
    onChange({
      photos: [...photos, ...added.map((file, i) => ({ id: `${stamp}-${i}`, name: file.name }))],
    });
  };

  const move = (from: number, to: number) => {
    const next = [...photos];
    next.splice(to, 0, ...next.splice(from, 1));
    onChange({ photos: next });
  };

  const drop = {
    id: zoneId,
    className: 'flex-1',
    onDragOver: (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      setDragging(true);
    },
    onDragLeave: () => setDragging(false),
    onDrop: (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      setDragging(false);
      add(event.dataTransfer.files);
    },
  };

  return (
    <FormSection
      title="Media"
      description="Photos for lists and the product page. The first one is the cover."
    >
      <FormField
        label="Photos"
        required
        helperText="PNG or JPG, up to 20 MB each."
        errorText={errors.photos}
      >
        <ul aria-label="Photos" className="gap-ws-7 grid grid-cols-[repeat(4,minmax(0,1fr))]">
          {photos.map((photo, index) => (
            <PhotoTile
              key={photo.id}
              photo={photo}
              index={index}
              count={photos.length}
              onMove={(to) => move(index, to)}
              onRemove={() => {
                onChange({ photos: photos.filter((p) => p.id !== photo.id) });
                // The tile and its button go; focus waits on the drop zone instead of the page.
                document.getElementById(zoneId)?.focus();
              }}
            />
          ))}
          <li className="flex min-w-0">
            <FileUpload
              ref={upload}
              className="aspect-square min-w-0 flex-1 self-start"
              labels={{ dropzone: 'Add photos', dropzoneActive: 'Drop to add' }}
              isDragActive={dragging}
              zoneProps={drop}
              inputProps={{
                accept: 'image/png,image/jpeg',
                multiple: true,
                onChange: (event) => {
                  add(event.target.files);
                  event.target.value = '';
                },
              }}
              onBrowse={() => upload.current?.querySelector('input')?.click()}
            />
          </li>
        </ul>
      </FormField>
    </FormSection>
  );
}
