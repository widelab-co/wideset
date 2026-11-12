import { cva } from 'class-variance-authority';

import { sidebarCollapseMotion } from '../../motion/recipes';

export const sidebarVariants = cva(
  // Figma Sidebar: Static/Fill/Foreground with a 1px Static/Stroke/Subtle line on its right edge,
  // beside a page on the same white.
  'bg-ws-static-foreground border-ws-static-subtle gap-ws-7 pl-ws-5 py-ws-7 relative flex h-full flex-col overflow-hidden border-r',
  {
    variants: {
      collapsed: {
        true: 'pr-ws-5 w-[3.25rem] items-center',
        // The right padding holds a scrollable section's bar (8px + 2px gap), so every part, the
        // scrolling one included, ends on the same right edge.
        false: 'pr-ws-6 w-[16.25rem]',
      },
    },
    defaultVariants: { collapsed: false },
  },
);

export const sidebarMotionVariants = cva('', {
  variants: {
    enabled: { true: sidebarCollapseMotion, false: '' },
  },
  defaultVariants: { enabled: true },
});
