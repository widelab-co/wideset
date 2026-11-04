import {
  RiCheckboxCircleFill,
  RiCloseLine,
  RiErrorWarningFill,
  RiInformationFill,
} from '@remixicon/react';
import React, { forwardRef, isValidElement } from 'react';
import { cn } from 'src/lib/utils';

import { IconButton } from '../button/IconButton';
import { ProgressBar } from '../progress-bar/ProgressBar';
import { ToastStateProvider } from './Toast.context';
import type {
  ToastActionProps,
  ToastDescriptionProps,
  ToastMessageProps,
  ToastProps,
  ToastStatus,
  ToastWithSubComponents,
} from './Toast.types';
import { toastDismissVariants, toastIconExpandedVariants, toastVariants } from './Toast.variants';
import { ToastAction } from './ToastAction';
import { ToastDescription } from './ToastDescription';
import { ToastIconAction } from './ToastIconAction';
import { ToastMessage } from './ToastMessage';

const iconsMap: Record<ToastStatus, typeof RiCheckboxCircleFill | null> = {
  error: RiErrorWarningFill,
  success: RiCheckboxCircleFill,
  info: RiInformationFill,
  neutral: null,
};

const isToastSlot = (child: React.ReactNode, slot: React.ElementType) =>
  isValidElement(child) && child.type === slot;

/**
 * True when the node is the slot itself or wraps one — an icon action composed
 * as `DropdownMenu > Trigger asChild > Toast.IconAction` still belongs in the
 * top-right actions cluster.
 */
const containsToastSlot = (node: React.ReactNode, slot: React.ElementType): boolean => {
  if (isToastSlot(node, slot)) return true;
  if (!isValidElement(node)) return false;

  const nested = (node.props as { children?: React.ReactNode }).children;
  return React.Children.toArray(nested).some((child) => containsToastSlot(child, slot));
};

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      className,
      status,
      variant = 'basic',
      progress,
      footer,
      duration,
      onDismiss,
      dismissAriaLabel = 'Dismiss',
      progressAriaLabel = 'Progress',
      children,
      ...props
    },
    ref,
  ) => {
    const IconComponent = iconsMap[status as ToastStatus];
    const isExpanded = variant === 'expanded';
    const childArray = React.Children.toArray(children);

    const messageSlot = childArray.find((child) => isToastSlot(child, ToastMessage)) as
      React.ReactElement<ToastMessageProps> | undefined;
    const descriptionSlot = childArray.find((child) => isToastSlot(child, ToastDescription)) as
      React.ReactElement<ToastDescriptionProps> | undefined;
    const actionSlot = childArray.find((child) => isToastSlot(child, ToastAction)) as
      React.ReactElement<ToastActionProps> | undefined;
    const iconActionSlots = childArray.filter((child) => containsToastSlot(child, ToastIconAction));

    const messageContent = messageSlot
      ? messageSlot.props.children
      : childArray.filter(
          (child) =>
            !isToastSlot(child, ToastMessage) &&
            !isToastSlot(child, ToastDescription) &&
            !isToastSlot(child, ToastAction) &&
            !containsToastSlot(child, ToastIconAction),
        );

    return (
      <div
        ref={ref}
        data-slot="toast"
        className={cn(toastVariants({ status, variant }), className)}
        role={status === 'error' ? 'alert' : 'status'}
        {...props}
      >
        <ToastStateProvider state={{ status, variant }}>
          {isExpanded ? (
            <div className="flex flex-1 flex-col">
              {/* Figma: 16px content inset on every side (root owns
                  pt-ws-9), icon→text gap 12 — the dismiss X lands 16px from the
                  top and right corner. */}
              <div className="gap-ws-7 px-ws-9 pb-ws-9 flex items-start">
                {IconComponent && (
                  <IconComponent
                    aria-hidden="true"
                    focusable="false"
                    className={toastIconExpandedVariants({ status })}
                  />
                )}

                <div className="flex-1">
                  <div className="gap-ws-7 flex items-start justify-between">
                    <div className="typography-body-md">
                      <div
                        data-slot="toast-message"
                        className={cn(
                          'typography-label-sm text-ws-static-base',
                          Boolean(descriptionSlot) && 'mb-ws-5',
                        )}
                      >
                        {messageContent}
                      </div>
                      {descriptionSlot}
                    </div>

                    {(iconActionSlots.length > 0 || onDismiss) && (
                      // Figma's "Actions" cluster: icon buttons before the
                      // dismiss X; each carries ml-ws-3 for the 4px gap.
                      <div className="flex shrink-0 items-start">
                        {iconActionSlots}
                        {onDismiss && (
                          <IconButton
                            icon={RiCloseLine}
                            preset="ghost"
                            variant="secondary"
                            size="sm"
                            aria-label={dismissAriaLabel}
                            onClick={onDismiss}
                            className={toastDismissVariants({ status })}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {actionSlot && (
                    <div className="mt-ws-9 gap-ws-7 flex flex-wrap items-center">{actionSlot}</div>
                  )}
                </div>
              </div>

              {footer && (
                <div className="bg-ws-static-alpha-subtle typography-body-md text-ws-static-subtle px-ws-9 py-ws-7">
                  {typeof footer === 'function' ? footer(duration ?? 0) : footer}
                </div>
              )}

              {typeof progress === 'number' && (
                <ProgressBar value={progress} aria-label={progressAriaLabel}>
                  <ProgressBar.Track className="bg-(--ws-dynamic-stroke-secondary-default)" />
                </ProgressBar>
              )}
            </div>
          ) : (
            <>
              {IconComponent && (
                <IconComponent
                  aria-hidden="true"
                  focusable="false"
                  className="mr-ws-5 size-ws-11"
                />
              )}
              <div className="gap-ws-7 flex flex-1 items-center justify-between">
                <div data-slot="toast-message" className="typography-label-strong-sm">
                  {messageContent}
                </div>
                {actionSlot}
              </div>
              <div className="ml-auto flex items-center leading-0">
                {iconActionSlots}
                {onDismiss && (
                  <IconButton
                    icon={RiCloseLine}
                    preset="ghost"
                    variant="inverse"
                    size="sm"
                    aria-label={dismissAriaLabel}
                    onClick={onDismiss}
                    className={toastDismissVariants({ status, variant })}
                  />
                )}
              </div>
            </>
          )}
        </ToastStateProvider>
      </div>
    );
  },
) as ToastWithSubComponents;

Toast.displayName = 'Toast';

Toast.Action = ToastAction;
Toast.IconAction = ToastIconAction;
Toast.Message = ToastMessage;
Toast.Description = ToastDescription;

export { Toast };
