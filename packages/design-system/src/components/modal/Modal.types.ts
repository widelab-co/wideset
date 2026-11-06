import type * as ModalPrimitive from '@radix-ui/react-dialog';
import type { ComponentPropsWithoutRef, HTMLAttributes } from 'react';

import type { MotionProps } from '../../motion/Motion.types';

export type ModalProps = ModalPrimitive.DialogProps;

/** The content surface rendered within `Modal`. */
export type ModalContentProps = ComponentPropsWithoutRef<typeof ModalPrimitive.Content> &
  MotionProps & {
    /** Renders the close button in the top-right corner. Defaults to `true`. */
    showCloseButton?: boolean;
    /** Accessible label for that close button. Defaults to `'Close modal'`. */
    closeAriaLabel?: string;
    /** Prevents closing the modal by outside click and Escape key. */
    persistent?: boolean;
    /** Focuses into modal after opening. */
    autoFocusOnOpen?: boolean;
  };

/** A control that closes the associated dialog. */
export type ModalCloseProps = ComponentPropsWithoutRef<typeof ModalPrimitive.Close>;

/** The header area for a title and supporting content. */
export type ModalHeaderProps = HTMLAttributes<HTMLDivElement>;

/**
 * The main content area. It scrolls in a `ScrollArea` once the modal reaches the viewport's
 * height; `className` and the other props go to the padded content inside it.
 */
export type ModalBodyProps = HTMLAttributes<HTMLDivElement>;

/** The action area beneath the main content. */
export type ModalFooterProps = HTMLAttributes<HTMLDivElement> & {
  /** Footer layout. `extension` separates the secondary and primary actions; defaults to `default`. */
  variant?: 'default' | 'extension';
};

/** Props for `Modal.Trigger` — the Radix Dialog trigger. */
export type ModalTriggerProps = ComponentPropsWithoutRef<typeof ModalPrimitive.Trigger>;

/** Props for `Modal.Title`. */
export type ModalTitleProps = ComponentPropsWithoutRef<typeof ModalPrimitive.Title>;

/** Props for `Modal.Description`. */
export type ModalDescriptionProps = ComponentPropsWithoutRef<typeof ModalPrimitive.Description>;

/** Props for `Modal.Overlay` — the scrim behind the content. */
export type ModalOverlayProps = ComponentPropsWithoutRef<typeof ModalPrimitive.Overlay> &
  MotionProps;
