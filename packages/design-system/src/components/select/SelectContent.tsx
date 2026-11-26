import * as SelectPrimitive from '@radix-ui/react-select';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { DropdownMenu } from '../dropdown/DropdownMenu';
import { useSelectContext } from './Select.context';
import type { SelectContentProps } from './Select.types';
import {
  selectContentMotionVariants,
  selectContentVariants,
  selectMenuContentVariants,
  selectViewportVariants,
} from './Select.variants';

export const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(
  (
    {
      className,
      children,
      position = 'popper',
      shouldUsePrimitive = true,
      portalContainer,
      defaultMotion,
      ...props
    },
    ref,
  ) => {
    const { motion: selectMotion } = useSelectContext();
    const motion = useDefaultMotion(defaultMotion ?? selectMotion);

    if (!shouldUsePrimitive) {
      return (
        <DropdownMenu.Content
          ref={ref as React.Ref<React.ComponentRef<typeof DropdownMenu.Content>>}
          data-slot="select-content"
          portalContainer={portalContainer}
          defaultMotion={motion}
          className={cn(selectMenuContentVariants(), className)}
          {...props}
        >
          {children}
        </DropdownMenu.Content>
      );
    }

    // Portals to document.body by default; z-index comes from selectContentVariants (z-ws-popout),
    // so the list clears Modal (z-ws-modal) and Sidepanel (z-ws-drawer) with no setup. Do not
    // point portalContainer at a modal: inside it the list is clipped by the modal's overflow.
    return (
      <SelectPrimitive.Portal container={portalContainer}>
        <SelectPrimitive.Content
          ref={ref}
          data-slot="select-content"
          className={cn(
            selectContentVariants({ position }),
            selectContentMotionVariants({ enabled: motion }),
            'max-h-[var(--radix-select-content-available-height)]',
            className,
          )}
          sideOffset={4}
          position={position}
          {...props}
        >
          <SelectPrimitive.Viewport className={selectViewportVariants()}>
            {children}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    );
  },
);

SelectContent.displayName = 'Select.Content';
