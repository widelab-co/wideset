import React from 'react';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { DropdownMenu } from '../dropdown/DropdownMenu';
import { Button } from './Button';
import { ButtonContext } from './Button.context';
import { ButtonIcon } from './ButtonIcon';
import { ButtonTruncatedText } from './ButtonTruncatedText';
import type { SplitButtonProps, SplitButtonWithSubComponents } from './SplitButton.types';
import {
  splitButtonContentVariants,
  splitButtonIconButtonVariants,
  splitButtonIconVariants,
  splitButtonMainVariants,
  splitButtonMotionVariants,
  splitButtonWrapperVariants,
} from './SplitButton.variants';

const SplitButton = React.forwardRef<HTMLButtonElement, SplitButtonProps>(function SplitButton(
  {
    className,
    type = 'button',
    preset,
    variant,
    size,
    children,
    icon: Icon,
    disabled,
    menuContent,
    open,
    defaultOpen,
    onOpenChange,
    menuSide = 'bottom',
    menuAlign = 'end',
    iconDisabled,
    iconAriaLabel = 'More options',
    defaultMotion,
    onClick,
    ...props
  },
  ref,
) {
  const motion = useDefaultMotion(defaultMotion);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen && iconDisabled) return;
      onOpenChange?.(nextOpen);
    },
    [iconDisabled, onOpenChange],
  );

  const handleMainClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onClick?.(e);
    },
    [onClick],
  );

  return (
    <ButtonContext.Provider value={{ size, preset }}>
      <DropdownMenu open={open} defaultOpen={defaultOpen} onOpenChange={handleOpenChange}>
        <div data-slot="split-button" className={splitButtonWrapperVariants({ className })}>
          <button
            className={cn(
              splitButtonMainVariants({ preset, size, variant }),
              splitButtonMotionVariants({ enabled: motion }),
            )}
            ref={ref}
            type={type}
            disabled={disabled}
            onClick={handleMainClick}
            {...props}
          >
            <span className={splitButtonContentVariants({ size })}>{children}</span>
          </button>
          <DropdownMenu.Trigger asChild>
            <button
              className={cn(
                splitButtonIconButtonVariants({ preset, size, variant }),
                splitButtonMotionVariants({ enabled: motion }),
              )}
              aria-label={iconAriaLabel}
              type="button"
              disabled={iconDisabled}
            >
              <Button.Icon icon={Icon} className={splitButtonIconVariants({ size })} />
            </button>
          </DropdownMenu.Trigger>
        </div>
        {menuContent != null && (
          <DropdownMenu.Content side={menuSide} align={menuAlign} defaultMotion={motion}>
            {menuContent}
          </DropdownMenu.Content>
        )}
      </DropdownMenu>
    </ButtonContext.Provider>
  );
}) as SplitButtonWithSubComponents;

SplitButton.displayName = 'SplitButton';
export const SplitButtonIcon = ButtonIcon;
SplitButton.Icon = SplitButtonIcon;
export const SplitButtonTruncatedText = ButtonTruncatedText;
SplitButton.TruncatedText = SplitButtonTruncatedText;

export { SplitButton };
