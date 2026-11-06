import React from 'react';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { Popup } from '../popup/Popup';
import { ScrollArea } from '../scroll-area/ScrollArea';
import { selectContentVariants } from '../select/Select.variants';
import { useComboBoxContext } from './ComboBox.context';
import type { ComboBoxContentProps } from './ComboBox.types';
import { comboBoxContentMotionVariants } from './ComboBox.variants';

const ComboBoxContent = React.forwardRef<HTMLDivElement, ComboBoxContentProps>(
  ({ children, className, defaultMotion, ...props }, ref) => {
    const { contentId, filteredOptions, motion: comboBoxMotion } = useComboBoxContext();
    const motion = useDefaultMotion(defaultMotion ?? comboBoxMotion);

    return filteredOptions.length > 0 ? (
      <Popup.Container
        ref={ref}
        data-slot="combo-box-content"
        defaultMotion={motion}
        // `document?.body` still throws on the server: `document` is not declared there at all.
        className={cn(
          selectContentVariants({ position: 'popper' }),
          comboBoxContentMotionVariants({ enabled: motion }),
          'max-h-[var(--radix-popover-content-available-height)] w-[var(--radix-popover-trigger-width)] min-w-[var(--radix-popover-trigger-width)]',
          className,
        )}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        {...props}
      >
        <ScrollArea defaultMotion={motion} className="max-h-[18rem]">
          <ul id={contentId} role="listbox" className="p-ws-3">
            {typeof children === 'function'
              ? filteredOptions.map((option) => (
                  <React.Fragment key={option.value}>{children(option)}</React.Fragment>
                ))
              : children}
          </ul>
        </ScrollArea>
      </Popup.Container>
    ) : null;
  },
);

ComboBoxContent.displayName = 'ComboBox.Content';

export { ComboBoxContent };
