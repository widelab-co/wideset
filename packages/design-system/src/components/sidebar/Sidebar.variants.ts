import { cva } from 'class-variance-authority';

import { sidebarCollapseMotion } from '../../motion/recipes';

export const sidebarVariants = cva(
  'gap-ws-7 pl-ws-5 py-ws-7 relative flex h-full flex-col overflow-hidden',
  {
    variants: {
      // What the sidebar sits on, from the enclosing AppShell's direction. Figma Sidebar:
      // Static/Fill/Foreground with a 1px Static/Stroke/Subtle line on its right edge (page,
      // Flat). Figma's Communication tints it with Static/Fill/Alpha/Subtle and drops the line
      // (tinted, Frame). Figma's Calendar drops both and shows the grey app frame around an
      // inset page (frame, Inset and Canvas).
      surface: {
        page: 'bg-ws-static-foreground border-ws-static-subtle border-r',
        tinted: 'bg-ws-static-alpha-subtle',
        frame: 'bg-transparent',
      },
      collapsed: {
        true: 'pr-ws-5 w-[3.25rem] items-center',
        // The right padding holds a scrollable section's bar (8px + 2px gap), so every part, the
        // scrolling one included, ends on the same right edge.
        false: 'pr-ws-6 w-[16.25rem]',
      },
    },
    compoundVariants: [
      // Beside an inset page (`ml-ws-5`) the nav sits centred in its column: the left padding
      // equals the right padding plus the page's margin, 18px a side expanded and 16px collapsed,
      // so items and their highlight never hug the window edge.
      { surface: 'frame', collapsed: false, class: 'pl-ws-10' },
      { surface: 'frame', collapsed: true, class: 'pl-ws-9 w-[3.75rem]' },
    ],
    defaultVariants: { collapsed: false, surface: 'page' },
  },
);

/** The sidebar surface each AppShell direction asks for. */
export const sidebarSurfaceByDirection = {
  flat: 'page',
  frame: 'tinted',
  inset: 'frame',
  canvas: 'frame',
} as const;

export const sidebarMotionVariants = cva('', {
  variants: {
    enabled: { true: sidebarCollapseMotion, false: '' },
  },
  defaultVariants: { enabled: true },
});
