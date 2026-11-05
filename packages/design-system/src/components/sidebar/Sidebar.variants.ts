import { cva } from 'class-variance-authority';

import { sidebarCollapseMotion } from '../../motion/recipes';

export const sidebarVariants = cva(
  // The app frame sits on the grey canvas; the page beside it (`main`) is the white foreground.
  'bg-ws-static-background border-ws-static-subtle gap-ws-7 px-ws-5 py-ws-7 relative flex h-full flex-col overflow-hidden border-r',
  {
    variants: {
      collapsed: {
        true: 'w-[3.25rem] items-center',
        false: 'w-[16.25rem]',
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

/** A group of items under one heading; items keep the section's own spacing. */
export const sidebarGroupVariants = cva('gap-ws-2 flex w-full min-w-0 flex-col');

/** Figma Sidebar Item `Type=Group`: Caption/Strong/Medium, Static/Text/Subtle, padding 4/8, no icon. */
export const sidebarGroupLabelVariants = cva(
  'typography-caption-strong-md text-ws-static-subtle px-ws-5 py-ws-3 truncate',
  {
    variants: {
      collapsed: { true: 'sr-only', false: '' },
    },
    defaultVariants: { collapsed: false },
  },
);
