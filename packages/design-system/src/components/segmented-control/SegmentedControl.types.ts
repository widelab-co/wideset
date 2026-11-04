import type * as RadioGroup from '@radix-ui/react-radio-group';
import type { RemixiconComponentType } from '@remixicon/react';
import type { VariantProps } from 'class-variance-authority';
import type {
  ComponentPropsWithoutRef,
  ForwardRefExoticComponent,
  HTMLAttributes,
  PropsWithoutRef,
  ReactNode,
  RefAttributes,
} from 'react';

import type { MotionProps } from '../../motion/Motion.types';
import type {
  segmentedControlItemVariants,
  segmentedControlVariants,
} from './SegmentedControl.variants';
import type { SegmentedControlIcon } from './SegmentedControlIcon';
import type { SegmentedControlItem } from './SegmentedControlItem';

export type SegmentedControlSize = VariantProps<typeof segmentedControlVariants>['size'];
export type SegmentedControlVariant = VariantProps<typeof segmentedControlVariants>['variant'];

export type SegmentedControlContextValue = {
  size: SegmentedControlSize;
  variant: SegmentedControlVariant;
  motion: boolean;
};

/** A group of mutually exclusive toggle options. */
export type SegmentedControlProps = {
  /** Controls the height and padding of the control and its items. */
  size?: SegmentedControlSize;
  /** Layout variant — `regular` auto-sizes to content, `fullWidth` expands to fill the container. */
  variant?: SegmentedControlVariant;
  /** Controlled selected value. Pair with `onValueChange` to handle updates. */
  value?: string;
  /** Initial selected value for uncontrolled usage. */
  defaultValue?: string;
  /** Fired when the selected value changes. Receives the new value string. */
  onValueChange?: (value: string) => void;
  /** Accessible name of the group, e.g. `"View mode"`. Give the group a name with this or `aria-labelledby`. */
  'aria-label'?: string;
  /** ID of a visible element that names the group. Use instead of `aria-label` when a heading or label is on screen. */
  'aria-labelledby'?: string;
} & MotionProps &
  Omit<
    ComponentPropsWithoutRef<typeof RadioGroup.Root>,
    'value' | 'defaultValue' | 'onValueChange'
  >;

/** An icon rendered within `SegmentedControl`. */
export type SegmentedControlIconProps = {
  /** Icon component from `@remixicon/react` to render inside the item. */
  icon: RemixiconComponentType;
} & HTMLAttributes<HTMLDivElement>;

/**
 * Icon-only items (icon set, no children) must provide an accessible name. An item whose only
 * child is `SegmentedControl.Icon` is icon-only too and needs an `aria-label` the same way; the
 * type cannot tell it apart from a label, so the item checks it at runtime and warns.
 *
 * For the square icon-only padding, `SegmentedControl.Icon` must be a direct child of the item
 * (a Fragment around it is fine). An icon rendered by your own wrapper component keeps the label
 * padding; it still warns when the item has no accessible name.
 */
type SegmentedControlItemIconProps =
  | {
      /** Optional icon rendered before children. Use `SegmentedControl.Icon` as a child for icon + label combinations. */
      icon?: undefined;
    }
  | {
      /** Icon component from `@remixicon/react`. */
      icon: RemixiconComponentType;
      /** Content rendered inside the component. */
      children: ReactNode;
    }
  | {
      /** Icon component from `@remixicon/react`. */
      icon: RemixiconComponentType;
      children?: never;
      /** Accessible name for an icon-only item. */
      'aria-label': string;
    }
  | {
      /** Icon component from `@remixicon/react`. */
      icon: RemixiconComponentType;
      children?: never;
      /** ID of the element providing the accessible name for an icon-only item. */
      'aria-labelledby': string;
    };

/** An individual item within `SegmentedControl`. */
export type SegmentedControlItemProps = ComponentPropsWithoutRef<typeof RadioGroup.Item> &
  Omit<VariantProps<typeof segmentedControlItemVariants>, 'iconOnly'> &
  SegmentedControlItemIconProps;

export type SegmentedControlWithSubComponents = ForwardRefExoticComponent<
  PropsWithoutRef<SegmentedControlProps> & RefAttributes<HTMLDivElement>
> & {
  Item: typeof SegmentedControlItem;
  Icon: typeof SegmentedControlIcon;
};
