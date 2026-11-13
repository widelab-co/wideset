import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { hoverTintMotion } from '../../motion/recipes';

/** The ring sits inside the row, as on the items: an outer one would be clipped by the scroll area. */
const insetFocus =
  'focus-visible:wds-focus-visible focus-visible:-outline-offset-2 focus-visible:outline-current';

export const sidebarGroupVariants = cva(
  // gap-[inherit]: the head and the rows keep the spacing of the list the group sits in.
  'relative flex min-w-0 flex-col gap-[inherit]',
  {
    variants: {
      // An item head with a chevron: the item leaves the chevron its room, and the row lights
      // while the pointer is on either part, so the two read as one row.
      withTrigger: {
        true: cn(
          '[&>[data-slot=sidebar-item]]:pr-ws-14',
          '[&:has(>[data-slot=sidebar-group-trigger]:hover)>[data-slot=sidebar-item]:not([aria-disabled])]:bg-ws-dynamic-tertiary-alpha-strong-default',
          '[&:has(>[data-slot=sidebar-group-trigger]:hover)>[data-slot=sidebar-item]:not([aria-disabled])]:text-ws-static-strong',
        ),
        false: '',
      },
    },
    defaultVariants: { withTrigger: false },
  },
);

/** The chevron button at the head item's right end: a square as tall as the row. */
export const sidebarGroupTriggerVariants = cva(
  cn(
    'rounded-ws-control-lg size-ws-14 absolute top-0 right-0 flex cursor-pointer items-center justify-center',
    'text-ws-static-subtle hover:text-ws-static-strong',
    insetFocus,
  ),
);

export const sidebarGroupContentVariants = cva('flex min-w-0 flex-col gap-[inherit]');

/**
 * Figma Sidebar Item `Type=Folder`, the whole row is the toggle. The chevron follows the title
 * (Figma still has it before), centred on the title's line and in its colour (currentColor).
 */
export const sidebarSectionHeaderToggleVariants = cva(
  cn(
    'rounded-ws-control-lg p-ws-5 gap-ws-3 flex w-full min-w-0 cursor-pointer items-center text-left',
    'text-ws-static-subtle hover:text-ws-static-strong',
    insetFocus,
  ),
  {
    variants: {
      collapsed: { true: 'justify-center', false: '' },
    },
    defaultVariants: { collapsed: false },
  },
);

/** Closed it points at the row (right), open it turns down to the rows it shows. */
export const sidebarGroupChevronVariants = cva('size-ws-10 shrink-0', {
  variants: {
    open: { true: 'rotate-90', false: '' },
    motion: {
      true: 'transition-transform duration-(--ws-motion-duration-fast) ease-(--ws-motion-ease-smooth-out)',
      false: '',
    },
  },
  defaultVariants: { open: false, motion: true },
});

export const sidebarGroupMotionVariants = cva('', {
  variants: {
    enabled: { true: hoverTintMotion, false: '' },
  },
  defaultVariants: { enabled: true },
});
