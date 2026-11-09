import { cva } from 'class-variance-authority';

import { sidebarCollapseMotion } from '../../motion/recipes';

export const sidebarVariants = cva(
  'gap-ws-7 px-ws-5 py-ws-7 relative flex h-full flex-col overflow-hidden',
  {
    variants: {
      // What the sidebar sits on, from the enclosing AppShell's direction. Figma Sidebar:
      // Static/Fill/Foreground with a 1px Static/Stroke/Subtle line on its right edge (page,
      // Flat). Figma's Communication tints it with Static/Fill/Alpha/Subtle and drops the line
      // (tinted, Frame). Figma's Calendar drops both and shows the grey app frame around an
      // inset page (frame, Inset).
      surface: {
        page: 'bg-ws-static-foreground border-ws-static-subtle border-r',
        tinted: 'bg-ws-static-alpha-subtle',
        frame: 'bg-transparent',
      },
      collapsed: {
        true: 'w-[3.25rem] items-center',
        false: 'w-[16.25rem]',
      },
    },
    compoundVariants: [
      // Beside an inset page (`ml-ws-5`) the nav sits centred in its column: the left padding
      // equals the right padding plus the page's margin, so items never hug the window edge.
      { surface: 'frame', collapsed: false, class: 'pl-ws-9' },
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
} as const;

export const sidebarMotionVariants = cva('', {
  variants: {
    enabled: { true: sidebarCollapseMotion, false: '' },
  },
  defaultVariants: { enabled: true },
});
