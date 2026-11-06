import { RiUpload2Line } from '@remixicon/react';
import type { HTMLAttributes, KeyboardEvent } from 'react';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { Button } from '../button/Button';
import type { FileUploadDropzoneProps } from './FileUpload.types';
import {
  dropzoneMotionVariants,
  dropzoneStrokeMotionVariants,
  dropzoneVariants,
} from './FileUpload.variants';

const ZONE_ACTIVATION_PROPS = ['onClick', 'onKeyDown', 'onKeyUp', 'tabIndex', 'role'] as const;

/**
 * The zone takes only the drag props from a library's root props. Activation
 * — click, keyboard, role, tab stop — is this component's and always ends in
 * `onBrowse`; a library's click-anywhere root props would otherwise make the
 * area a second, invisible button on `Type=Button`, or open the picker twice on `Type=Area`.
 */
const dropOnly = (zoneProps?: HTMLAttributes<HTMLElement>) => {
  if (!zoneProps) return undefined;
  const rest = { ...zoneProps };
  ZONE_ACTIVATION_PROPS.forEach((key) => delete rest[key]);
  return rest;
};

/**
 * The drop area. With `browse` it carries a Browse button (Figma's
 * `Type=Button`); without one the whole zone is the control (`Type=Area`).
 * Either way `onBrowse` opens the picker. Wire `zoneProps` to a file-handling
 * library's root props for drag and drop.
 */
export const FileUploadDropzone = ({
  disabled = false,
  isDragActive = false,
  browse = false,
  onBrowse,
  zoneProps,
  labels,
  defaultMotion,
}: FileUploadDropzoneProps) => {
  const motion = useDefaultMotion(defaultMotion);
  const type = browse ? 'button' : 'area';

  const dropzoneLabel = isDragActive
    ? (labels?.dropzoneActive ?? 'Drop files here')
    : browse
      ? (labels?.dropzoneBrowse ?? 'Drop files here to upload or...')
      : (labels?.dropzone ?? 'Click or drop files to upload');

  const open = () => {
    if (!disabled) onBrowse();
  };

  /* `Type=Area` has no button inside it, so the zone itself is the control: it
     takes the button role, sits in the tab order and answers Enter / Space. */
  const areaProps =
    type === 'area'
      ? {
          role: 'button',
          tabIndex: disabled ? -1 : 0,
          'aria-disabled': disabled || undefined,
          onClick: open,
          onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            open();
          },
        }
      : undefined;

  return (
    <div
      data-slot="file-upload-dropzone"
      {...dropOnly(zoneProps)}
      {...areaProps}
      className={cn(
        dropzoneVariants({ type, disabled, isDragActive }),
        dropzoneMotionVariants({ enabled: motion }),
        zoneProps?.className,
      )}
    >
      {/* Figma's dashed frame: 1px, 4 on / 4 off, following the 12px corners.
          A CSS border-dashed cannot be given that pitch — see dropzoneVariants. */}
      <svg
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute inset-0 size-full overflow-visible"
      >
        <rect
          x="0.5"
          y="0.5"
          strokeWidth="1"
          strokeDasharray="4 4"
          // The path starts at x + rx = 12.5, so without this every dash straddles a
          // half pixel and rasterises as a soft 5 / 3; shifted by 0.5 it lands on
          // whole pixels along the top edge, crisp 4 / 4 like Figma's.
          strokeDashoffset="0.5"
          className={cn(
            'h-[calc(100%-1px)] w-[calc(100%-1px)] fill-none stroke-(--dropzone-stroke) [rx:var(--radius-ws-container-md)]',
            dropzoneStrokeMotionVariants({ enabled: motion }),
          )}
        />
      </svg>
      <RiUpload2Line aria-hidden="true" focusable="false" className="size-ws-12 shrink-0" />
      {/* Label and Browse button share their own 16px stack — the 8px gap above
          only separates the icon from the block below it. */}
      <div className="gap-ws-9 flex w-full flex-col items-center">
        <span className="typography-label-sm text-center">{dropzoneLabel}</span>
        {browse && (
          <Button
            variant="secondary"
            preset="border"
            size="sm"
            disabled={disabled}
            className={cn(isDragActive && 'pointer-events-none opacity-0')}
            onClick={() => onBrowse()}
            type="button"
            defaultMotion={motion}
          >
            {labels?.browse ?? 'Browse files'}
          </Button>
        )}
      </div>
    </div>
  );
};

FileUploadDropzone.displayName = 'FileUpload.Dropzone';
