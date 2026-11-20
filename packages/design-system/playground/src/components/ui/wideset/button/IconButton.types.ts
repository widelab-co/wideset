import type { VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react';

import type { MotionProps } from '@/lib/wideset/motion/Motion.types';
import type { ButtonIconProps } from './Button.types';
import type { iconButtonVariants } from './IconButton.variants';

/** An icon-only action button; provide an accessible name. */
export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  MotionProps &
  VariantProps<typeof iconButtonVariants> & {
    /** Accessible action name. Provide this or `aria-labelledby`. */
    'aria-label'?: string;
    /** ID of the element naming the action. Provide this or `aria-label`. */
    'aria-labelledby'?: string;
    /** Whether to render onto a child via Radix Slot. Set its accessible name on IconButton; it is forwarded to the child. */
    asChild?: boolean;
    /** Optional child element used when `asChild` is enabled. */
    children?: ReactNode;
    /** Additional CSS classes merged with the icon button root. */
    className?: string;
    /** Disables the icon button visually and functionally. */
    disabled?: boolean;
    /** Icon rendered as the main visible content of the button. */
    icon: ButtonIconProps['icon'];
    /** Additional CSS classes merged with the rendered icon. */
    iconClassName?: string;
    /** Called when the user activates the icon button. */
    onClick?: MouseEventHandler<HTMLButtonElement>;
    /** Native button type used for form behavior. */
    type?: 'button' | 'submit' | 'reset';
  } & ({ 'aria-label': string } | { 'aria-labelledby': string });
