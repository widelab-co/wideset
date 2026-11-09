import type { VariantProps } from 'class-variance-authority';

import type { countVariants } from './Count.variants';

/** How many items sit behind a label: a tab, a list group, a filter. */
export type CountProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** The quantity: a number, or a short capped value such as `99+`. */
  children?: React.ReactNode;
  /** Additional CSS classes for layout overrides. */
  className?: string;
  /**
   * Draws the count in an outlined pill. Use it where the count stands alone or beside an icon;
   * beside a text label leave it off.
   */
  contained?: VariantProps<typeof countVariants>['contained'];
};
