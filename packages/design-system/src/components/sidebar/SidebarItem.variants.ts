import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { hoverTintMotion } from '../../motion/recipes';

export const sidebarItemVariants = cva(
  cn(
    // text-left: with asChild on a <button> (a collapsible group) the label would centre.
    'rounded-ws-control-lg gap-ws-5 px-ws-5 py-ws-3 flex w-full cursor-pointer items-center text-left no-underline',
    // The ring is drawn inset: sidebar items sit flush against the ScrollArea
    // viewport (collapsed rail) or under its scrollbar strip (expanded), so an
    // outer ring would be clipped or covered on the right.
    'focus-visible:wds-focus-visible focus-visible:-outline-offset-2 focus-visible:outline-current',
    'hover:not-aria-disabled:bg-ws-dynamic-tertiary-alpha-strong-default hover:not-aria-disabled:text-ws-static-strong',
    'active:not-aria-disabled:bg-ws-dynamic-tertiary-alpha-strong-pressed active:not-aria-disabled:text-ws-static-strong',
    'aria-disabled:text-ws-dynamic-secondary-disabled aria-disabled:pointer-events-none aria-disabled:cursor-default',
  ),
  {
    variants: {
      active: {
        true: 'text-ws-static-strong bg-ws-dynamic-tertiary-alpha-strong-default',
        false: 'text-ws-static-base',
      },
      collapsed: {
        true: 'h-ws-15 justify-center px-0',
        false: 'h-ws-14',
      },
      nested: { true: '', false: '' },
    },
    compoundVariants: [
      // Figma Sidebar Item `Nesting=Level 1`: the child's icon starts under the parent's label
      // (item padding + icon + gap), so the tree reads by indent alone, with no guide line.
      {
        nested: true,
        collapsed: false,
        class: 'pl-[calc(var(--spacing-ws-5)*2+var(--spacing-ws-10))]',
      },
    ],
    defaultVariants: { active: false, collapsed: false, nested: false },
  },
);

export const sidebarItemMotionVariants = cva('', {
  variants: {
    enabled: { true: hoverTintMotion, false: '' },
  },
  defaultVariants: { enabled: true },
});

/** The row's trailing count or badge: on the item's right padding, never placed by hand. */
export const sidebarItemSuffixVariants = cva(
  'typography-label-sm text-ws-static-subtle flex shrink-0 items-center tabular-nums',
);

export const sidebarItemIconVariants = cva('size-ws-10 shrink-0', {
  variants: {
    active: { true: '', false: 'text-ws-static-subtle' },
  },
  defaultVariants: { active: false },
});
