import { cva } from 'class-variance-authority';

/**
 * The full-height row the sidebar and the page sit in. Flat and Frame lay everything on the
 * page's white (Static/Fill/Foreground); Inset shows the grey app frame (Static/Fill/Background)
 * around a raised page, as Figma's Screens › Calendar.
 */
export const appShellVariants = cva('flex h-dvh', {
  variants: {
    direction: {
      flat: 'bg-ws-static-foreground',
      frame: 'bg-ws-static-foreground',
      inset: 'bg-ws-static-background',
    },
  },
  defaultVariants: { direction: 'flat' },
});

/**
 * The page. Flat and Frame: full-bleed, the only scroll container. Inset: a white card 12px from
 * the top, right and bottom and 8px from the sidebar, 16px radius, `shadow-ws-low`; the page
 * scrolls inside it, so its corners stay put.
 */
export const appShellMainVariants = cva('min-w-0 flex-1 overflow-y-auto', {
  variants: {
    direction: {
      flat: '',
      frame: '',
      inset:
        'bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 relative flex flex-col',
    },
  },
  defaultVariants: { direction: 'flat' },
});
