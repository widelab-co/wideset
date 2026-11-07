import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { hoverTintMotion } from '../../motion/recipes';

/* The dashed frame is an SVG <rect> drawn by FileUploadDropzone, not a CSS
   border: Figma's dash is exactly 4 on / 4 off, and CSS `border-dashed` has a
   UA-defined pitch that cannot be tuned. The rect reads its colour from
   `--dropzone-stroke`, set by the state classes below; it sits inside the
   padding box, so the zone keeps Figma's 180 / 132px height. */
export const dropzoneVariants = cva(
  cn(
    'rounded-ws-container-md gap-ws-5 p-ws-16 relative flex flex-col items-center justify-center',
    'bg-ws-dynamic-secondary-alpha-default text-ws-static-base',
    '[--dropzone-stroke:var(--border-color-ws-dynamic-secondary-default)]',
    /* The ring colour is set unconditionally, as Button does: `transition-colors`
       covers `outline-color`, so a colour applied only under `focus-visible`
       animates from the initial `currentColor` — a black flash before the brand
       ring. */
    'focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default',
  ),
  {
    variants: {
      /* Hover and pressed belong to `Type=Area`, where the whole zone is the
         control. `Type=Button` keeps the zone at its default colours and
         hovers the Browse button alone, as Figma draws it — the zone is still
         a drop target, but not something you click. */
      type: {
        area: cn(
          'cursor-pointer',
          'hover:bg-ws-dynamic-secondary-alpha-hover hover:[--dropzone-stroke:var(--border-color-ws-dynamic-secondary-hover)]',
          'active:bg-ws-dynamic-secondary-alpha-pressed active:[--dropzone-stroke:var(--border-color-ws-dynamic-secondary-pressed)]',
        ),
        button: 'cursor-default',
      },
      /* A file dragged over the zone takes the hover look on both types — it
         is a drop target either way. Browsers do not apply `:hover` during a
         native drag, so it has to be explicit. Figma has no drag state. */
      isDragActive: {
        true: 'bg-ws-dynamic-secondary-alpha-hover [--dropzone-stroke:var(--border-color-ws-dynamic-secondary-hover)]',
        false: '',
      },
      disabled: {
        true: cn(
          'pointer-events-none cursor-default',
          'bg-ws-dynamic-secondary-alpha-default text-ws-static-subtle',
          '[--dropzone-stroke:var(--border-color-ws-dynamic-secondary-disabled)]',
        ),
        false: '',
      },
    },
    defaultVariants: {
      type: 'area',
      disabled: false,
      isDragActive: false,
    },
  },
);

export const dropzoneMotionVariants = cva('', {
  variants: {
    enabled: { true: hoverTintMotion, false: '' },
  },
  defaultVariants: { enabled: true },
});

export const dropzoneStrokeMotionVariants = cva('', {
  variants: {
    enabled: {
      true: 'transition-[stroke] duration-(--ws-motion-duration-quick) ease-(--ws-motion-ease-out)',
      false: '',
    },
  },
  defaultVariants: { enabled: true },
});
