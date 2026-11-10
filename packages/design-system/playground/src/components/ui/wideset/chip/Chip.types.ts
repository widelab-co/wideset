import type { RemixiconComponentType } from '@remixicon/react';
import type { VariantProps } from 'class-variance-authority';
import type {
  ButtonHTMLAttributes,
  ForwardRefExoticComponent,
  HTMLAttributes,
  PropsWithoutRef,
  RefAttributes,
} from 'react';

import type { MotionProps } from '@/lib/wideset/motion/Motion.types';
import type { RemixiconProps } from '@/lib/wideset/icon.types';
import type { IconButtonProps } from '../button/IconButton.types';
import type { chipVariants } from './Chip.variants';
import type { ChipAction } from './ChipAction';
import type { ChipIcon } from './ChipIcon';
import type { ChipIconButton } from './ChipIconButton';
import type { ChipLabel } from './ChipLabel';

export type ChipContextValue = {
  size: VariantProps<typeof chipVariants>['size'];
  variant: VariantProps<typeof chipVariants>['variant'];
  style: VariantProps<typeof chipVariants>['style'];
  disabled: boolean;
  motion: boolean;
};

/**
 * A passive visual container for a label, optional main action, and optional removal button.
 * Supply handlers on Action and IconButton; selection and removal are owned by the consumer.
 */
export type ChipProps = Omit<HTMLAttributes<HTMLDivElement>, 'style'> &
  MotionProps &
  VariantProps<typeof chipVariants> & {
    /** Disables both the main action and the removal button. */
    disabled?: boolean;
  };

/** The optional native main button. Place the leading Icon and Label inside it. */
export type ChipActionProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Main action supplied by the consumer; Chip does not automatically toggle or select. */
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
  /** Disables only this action. A disabled Chip always disables it too. */
  disabled?: boolean;
  /** Native button type; defaults to `button`, so activation does not submit a form. */
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
};

/** A decorative leading icon. Place it before Label, inside Action when one is present. */
export type ChipIconProps = RemixiconProps & {
  /** Icon component rendered inside the chip and styled from the current chip context. */
  icon: RemixiconComponentType;
};

/** The chip's text label, inside an action or directly inside a passive chip. */
export type ChipLabelProps = HTMLAttributes<HTMLSpanElement>;

/**
 * An independent native icon button, normally used for removal. Place it after Action or Label
 * as a sibling. It inherits appearance, motion, and disabled state from Chip.
 */
export type ChipIconButtonProps = Omit<
  IconButtonProps,
  'size' | 'variant' | 'preset' | 'asChild' | 'children' | 'icon' | 'defaultMotion'
> & {
  /** Decorative icon; defaults to the close icon. */
  icon?: RemixiconComponentType;
  /** Consumer-owned action, normally removing the item from application state. Chip does not hide itself. */
  onClick?: IconButtonProps['onClick'];
  /** Accessible action name including the value, such as `Remove Warsaw`. Use this or aria-labelledby. */
  'aria-label'?: string;
  /** ID of the element that names this button. Use instead of aria-label when appropriate. */
  'aria-labelledby'?: string;
  /** Disables only this button. A disabled Chip always disables it too. */
  disabled?: boolean;
  /** Native button type; defaults to `button`. */
  type?: IconButtonProps['type'];
};

export type ChipWithSubComponents = ForwardRefExoticComponent<
  PropsWithoutRef<ChipProps> & RefAttributes<HTMLDivElement>
> & {
  Action: typeof ChipAction;
  Icon: typeof ChipIcon;
  IconButton: typeof ChipIconButton;
  Label: typeof ChipLabel;
};
