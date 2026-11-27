import { cva } from 'class-variance-authority';

/**
 * The full-height row the sidebar and the page sit in. Flat and Frame lay everything on the
 * page's white (Static/Fill/Foreground); Inset shows the grey app frame (Static/Fill/Background)
 * around a raised page, as Figma's Screens › Calendar; Canvas makes that grey the page itself, as
 * Figma's Screens › Crypto.
 */
export const appShellVariants = cva('flex h-dvh', {
  variants: {
    direction: {
      flat: 'bg-ws-static-foreground',
      frame: 'bg-ws-static-foreground',
      inset: 'bg-ws-static-background',
      canvas: 'bg-ws-static-background',
    },
  },
  defaultVariants: { direction: 'inset' },
});

/**
 * The page. Flat and Frame: full-bleed, the only scroll container. Inset: a white card 12px from
 * the top, right and bottom and 8px from the sidebar, 16px radius, `shadow-ws-low`; the page
 * scrolls inside it, so its corners stay put. Canvas: full-bleed on the grey, no fill of its own;
 * the screen's white sections are its content.
 */
export const appShellMainVariants = cva('ws-scrollbar min-w-0 flex-1 overflow-y-auto', {
  variants: {
    direction: {
      flat: '',
      frame: '',
      inset:
        'bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 relative flex flex-col',
      canvas: '',
    },
  },
  defaultVariants: { direction: 'inset' },
});

/**
 * The bar at the top of the page, as the starting points draw it: 48px, edge to edge, 20px of
 * padding and 8px between its parts (Figma Screens › Kanban, Header Row: 48px, padding 8/20, a
 * bottom line). It sticks to the top of `AppShell.Main`, so it carries the page's fill: white, or
 * the grey itself in Canvas, where it also drops the line. The line is Static/Stroke/Base on the
 * raised Inset page and Static/Stroke/Subtle on the full-bleed white of Flat and Frame. Loose text
 * in it reads as the crumbs do (Caption/Medium, subtle).
 */
export const appShellPageBarVariants = cva(
  'typography-caption-md text-ws-static-subtle h-ws-18 gap-ws-5 px-ws-11 z-ws-sticky sticky top-0 flex shrink-0 items-center',
  {
    variants: {
      direction: {
        flat: 'bg-ws-static-foreground border-ws-static-subtle border-b',
        frame: 'bg-ws-static-foreground border-ws-static-subtle border-b',
        inset: 'bg-ws-static-foreground border-ws-static-base border-b',
        canvas: 'bg-ws-static-background',
      },
    },
    defaultVariants: { direction: 'inset' },
  },
);

/** The page's small tools, pushed to the far end of the bar. */
export const appShellPageBarActionsVariants = cva('gap-ws-5 ml-auto flex shrink-0 items-center');

/**
 * Pulled left by its own padding so the glyph, not the 32px box, sits 20px from the bar's edge,
 * on the line the page's content starts from.
 */
export const appShellSidebarTriggerVariants = cva('-ml-ws-5 shrink-0');
