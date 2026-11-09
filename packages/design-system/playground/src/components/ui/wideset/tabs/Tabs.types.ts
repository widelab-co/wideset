import type * as RadixTabs from '@radix-ui/react-tabs';
import type { RemixiconComponentType } from '@remixicon/react';
import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import type { MotionProps } from '@/lib/wideset/motion/Motion.types';
import type { RemixiconProps } from '@/lib/wideset/icon.types';
import type { tabsVariants } from './Tabs.variants';

export type TabsSize = VariantProps<typeof tabsVariants>['size'];
export type TabsType = VariantProps<typeof tabsVariants>['type'];

export type TabsContextValue = {
  size: TabsSize;
  type: TabsType;
  divider?: boolean;
  disabled?: boolean;
  motion: boolean;
};

/** Named sections displayed one at a time. */
export type TabsProps = {
  /**
   * Visual style variant of the tabs.
   * - `regular` — underline indicator, tabs aligned to content width; the divider spans the container
   * - `fullWidth` — underline indicator, tabs stretch to fill the container
   * - `pills` — pill-shaped tabs, no outline; the active item takes the neutral selected fill
   * - `ghost` — borderless tabs; a soft background slides to the active item
   */
  type?: TabsType;
  /**
   * Size of the tabs, controls label typography and padding.
   * @default 'sm'
   */
  size?: TabsSize;
  /**
   * Whether to render a bottom border beneath the tab list. It runs the full width of the
   * container; without it a `regular` list fits its tabs.
   * Ignored when `type` is `pills` or `ghost`.
   * @default true
   */
  divider?: boolean;
  /**
   * Disables all tab items. Individual items can still be disabled via `Tabs.Item`.
   * @default false
   */
  disabled?: boolean;
} & MotionProps &
  Omit<ComponentProps<typeof RadixTabs.Root>, 'size'>;

/** The container arranging tab triggers. */
export type TabsListProps = ComponentProps<typeof RadixTabs.List>;

/** An individual item within `Tabs`. */
export type TabsItemProps = ComponentProps<typeof RadixTabs.Trigger> & {
  /** The value that identifies this tab. */
  value: string;
  /** Forces the active visual state — useful when using `asChild` with router links. */
  active?: boolean;
  /** Disables this specific tab item. Overrides the parent `Tabs` `disabled` prop. */
  disabled?: boolean;
};

/** The content surface rendered within `Tabs`. */
export type TabsContentProps = ComponentProps<typeof RadixTabs.Content>;

/** The text label associated with `Tabs`. */
export type TabsLabelProps = React.HTMLAttributes<HTMLSpanElement>;

/** A count displayed beside a tab label. */
export type TabsCountProps = {
  /** The quantity, rendered as a `Count`: a number or a short capped value such as `99+`. */
  children?: React.ReactNode;
  /** Additional CSS classes for layout overrides. */
  className?: string;
};

/** An icon rendered within `Tabs`. */
export type TabsIconProps = RemixiconProps & {
  /** Icon component to render. */
  icon: RemixiconComponentType;
  /** Renders the icon in a muted colour to signal the disabled state. */
  disabled?: boolean;
};
