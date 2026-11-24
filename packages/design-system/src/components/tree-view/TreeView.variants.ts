import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { hoverTintMotion } from '../../motion/recipes';

/**
 * The item is the focus target (`role="treeitem"`), but it also holds its group, so the ring
 * is drawn on its own row only. Inset, as the sidebar's: rows sit flush with a scroll area.
 * Written out in full: Tailwind finds classes in the source text, not in built strings.
 */
export const treeViewItemVariants = cva(
  cn(
    'outline-none',
    '[&:focus-visible>[data-slot=tree-view-item-row]]:wds-focus-visible',
    '[&:focus-visible>[data-slot=tree-view-item-row]]:-outline-offset-2',
    '[&:focus-visible>[data-slot=tree-view-item-row]]:outline-ws-dynamic-primary-strong-default',
  ),
);

export const treeViewItemRowVariants = cva(
  cn(
    'gap-ws-3 px-ws-5 h-ws-13 rounded-ws-control-lg typography-label-sm flex w-full cursor-pointer items-center text-left select-none',
    'hover:not-data-disabled:bg-ws-dynamic-tertiary-alpha-strong-default hover:not-data-disabled:text-ws-static-strong',
    'active:not-data-disabled:bg-ws-dynamic-tertiary-alpha-strong-pressed',
    'data-disabled:text-ws-dynamic-secondary-disabled data-disabled:cursor-default',
  ),
  {
    variants: {
      // The selected row takes the sidebar's current-page fill.
      selected: {
        true: 'bg-ws-dynamic-tertiary-alpha-strong-default text-ws-static-strong',
        false: '',
      },
      // A row that holds others (a folder) reads one step quieter than a leaf (a file).
      branch: { true: 'text-ws-static-base', false: 'text-ws-static-strong' },
      motion: { true: hoverTintMotion, false: '' },
    },
    defaultVariants: { selected: false, branch: false, motion: true },
  },
);

/** The row's quiet parts (chevron, icon, suffix) take the disabled colour with the row's text. */
export const treeViewQuietPartClassName =
  'text-ws-static-subtle in-data-disabled:text-ws-dynamic-secondary-disabled';

export const treeViewChevronVariants = cva(cn('size-ws-9 shrink-0', treeViewQuietPartClassName), {
  variants: {
    expanded: { true: 'rotate-90', false: '' },
    motion: {
      true: 'transition-transform duration-(--ws-motion-duration-fast) ease-(--ws-motion-ease-smooth-out)',
      false: '',
    },
  },
  defaultVariants: { expanded: false, motion: true },
});

/**
 * One level in: the guide line runs under the chevron above, the rows start under its icon.
 * The padding gives back the line's 1px, so a child's chevron sits exactly under its parent's icon.
 */
export const treeViewGroupVariants = cva(
  'ml-ws-9 border-ws-static-subtle border-l pl-[calc(var(--spacing-ws-3)-1px)]',
);
