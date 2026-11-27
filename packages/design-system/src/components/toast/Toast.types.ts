import type { VariantProps } from 'class-variance-authority';
import type {
  ComponentPropsWithoutRef,
  ComponentType,
  ForwardRefExoticComponent,
  HTMLAttributes,
  PropsWithoutRef,
  ReactNode,
  RefAttributes,
} from 'react';

import type { MotionProps } from '../../motion/Motion.types';
import type { ButtonProps } from '../button/Button.types';
import type { IconButtonProps } from '../button/IconButton.types';
import type { toastVariants } from './Toast.variants';

export type ToastStatus = NonNullable<VariantProps<typeof toastVariants>['status']>;

export type ToastVariant = 'basic' | 'expanded';

type ToastFooter = ReactNode | ((duration: number) => ReactNode);

type ToastShowOptionsBasic = {
  /** Compact toast layout for short messages and lightweight actions. */
  variant?: 'basic';
  /** Additional supporting copy displayed under the main content in the toast API. */
  description?: string;
  footer?: never;
};

type ToastShowOptionsExpanded = {
  /** Expanded layout with support for description, footer, and progress. */
  variant: 'expanded';
  /** Additional supporting copy displayed under the main content in the toast API. */
  description?: string;
  /** Optional footer content rendered below the expanded toast body. */
  footer?: ToastFooter;
};

export type ToastShowOptions = ToastShowOptionsBasic | ToastShowOptionsExpanded;

export type ToastShowConfig = {
  /** Main toast content rendered as plain text or custom React nodes. */
  content: ReactNode;
  /** Optional inline action rendered beside or below the message. */
  action?: ReactNode;
  /** Semantic status used to communicate the meaning of the feedback. */
  status?: ToastStatus;
  /** Auto-dismiss duration in milliseconds. Use `0` to keep the toast visible until dismissed. */
  duration?: number;
} & ToastShowOptions;

export type ToastPosition =
  'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export type ToastItem = {
  /** Unique toast ID returned by `showToast` and accepted by `dismissToast`. */
  id: string;
  /** Main content of the queued toast. */
  content: ReactNode;
  /** Optional action rendered beside the message. */
  action?: ReactNode;
  /** The visual style status of the toast. */
  status?: ToastStatus;
  /** Layout variant for the toast content. `footer` and `progress` are supported only in `expanded` variant. */
  variant?: ToastVariant;
  /** Supporting text displayed below the label. */
  description?: string;
  /** Optional footer rendered below the expanded toast body. Accepts a React node or a callback that receives the remaining duration. */
  footer?: ToastFooter;
  /** Auto-dismiss duration in milliseconds. Use `0` to keep the toast visible until it is dismissed manually. */
  duration?: number;
  /** Marks a queued toast as leaving during its exit animation. */
  isExiting?: boolean;
  /** Creation timestamp in milliseconds used to track remaining duration. */
  createdAt: number;
};

export type ToastContextType = {
  /** Adds a toast to the queue and returns the generated toast id. */
  showToast: (config: ToastShowConfig) => string;
  /** Dismisses a toast by id. */
  dismissToast: (id: string) => void;
};

export type ToastStateContextType = Pick<ToastProps, 'status' | 'variant'>;

type ToastPropsBase = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'className'> & {
  /** Additional CSS classes merged with the toast root element. */
  className?: string;
  /** Toast content, typically composed from `Toast.Message`, `Toast.Description`, and `Toast.Action`. */
  children?: ReactNode;
  /** Called when the dismiss button is pressed. */
  onDismiss?: () => void;
  /** Progress value from `0` to `100`. Only applies to the `expanded` variant. */
  progress?: number;
  /** Auto-dismiss duration in milliseconds. Use `0` to keep the toast visible until dismissed. */
  duration?: number;
  /** Accessible label for the dismiss button. Defaults to `'Dismiss'`. */
  dismissAriaLabel?: string;
  /** Accessible label for the progress bar. Defaults to `'Progress'`. */
  progressAriaLabel?: string;
} & VariantProps<typeof toastVariants>;

type ToastPropsBasic = ToastPropsBase & {
  /** Compact toast layout for short messages and a single inline action. */
  variant?: 'basic';
  footer?: never;
};

type ToastPropsExpanded = ToastPropsBase & {
  /** Expanded toast layout with support for description, footer, and progress. */
  variant: 'expanded';
  /** Optional footer content rendered below the expanded toast body. */
  footer?: ToastFooter;
};

/** A toast notification: `basic` for a short message with one inline action, `expanded` with a footer. */
export type ToastProps = ToastPropsBasic | ToastPropsExpanded;

/** An action styled for `Toast`. */
export type ToastActionProps = ButtonProps;

/** Icon-only action rendered in the toast's top-right cluster, before the dismiss button. */
export type ToastIconActionProps = Omit<IconButtonProps, 'preset' | 'variant' | 'size'> &
  ({ 'aria-label': string } | { 'aria-labelledby': string });

/** The message displayed inside the feedback surface. */
export type ToastMessageProps = {
  /** Primary toast message content. */
  children: ReactNode;
};

/** Supporting descriptive text. */
export type ToastDescriptionProps = ComponentPropsWithoutRef<'span'>;

/** The floating surface or stack containing feedback content. */
export type ToastContainerProps = {
  /** Toasts currently rendered in the viewport. */
  toasts: ToastItem[];
  /** Called when a toast should be dismissed from the rendered queue. */
  onDismiss: (id: string) => void;
  /** Screen edge where the toast stack is anchored. */
  position: ToastPosition;
  /** Current timestamp used to derive time-based toast state. */
  now: number;
} & MotionProps;

/** The provider managing feedback state for its descendants. */
export type ToastProviderProps = {
  /** Application subtree that can render and trigger toasts. */
  children: ReactNode;
  /** Screen edge where the toast stack should appear. */
  position?: ToastPosition;
} & MotionProps;

export type ToastWithSubComponents = ForwardRefExoticComponent<
  PropsWithoutRef<ToastProps> & RefAttributes<HTMLDivElement>
> & {
  Action: ComponentType<ToastActionProps>;
  IconAction: ForwardRefExoticComponent<
    PropsWithoutRef<ToastIconActionProps> & RefAttributes<HTMLButtonElement>
  >;
  Message: ComponentType<ToastMessageProps>;
  Description: ComponentType<ToastDescriptionProps>;
};
