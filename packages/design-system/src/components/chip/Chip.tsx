import { type FocusEvent, forwardRef, type KeyboardEvent, useState } from 'react';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { ChipContext } from './Chip.context';
import type { ChipProps, ChipWithSubComponents } from './Chip.types';
import { chipMotionVariants, chipVariants } from './Chip.variants';
import { ChipIcon } from './ChipIcon';

const Chip = forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      className,
      size = 'md',
      variant = 'primary',
      style = 'filled',
      disabled,
      defaultMotion,
      children,
      onKeyDown,
      onKeyUp,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const motion = useDefaultMotion(defaultMotion);
    const [keyboardPressed, setKeyboardPressed] = useState(false);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || event.target !== event.currentTarget) return;
      if (event.key === ' ') {
        event.preventDefault();
        if (!disabled) setKeyboardPressed(true);
        return;
      }
      if (event.key === 'Enter' && !disabled) {
        event.preventDefault();
        setKeyboardPressed(true);
        event.currentTarget.click();
      }
    };

    const handleKeyUp = (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === ' ' || event.key === 'Enter') setKeyboardPressed(false);

      onKeyUp?.(event);
      if (event.defaultPrevented || event.target !== event.currentTarget) return;
      if (event.key === ' ' && !disabled) {
        event.currentTarget.click();
      }
    };

    const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
      setKeyboardPressed(false);
      onBlur?.(event);
    };

    return (
      <ChipContext.Provider value={{ size, variant, style }}>
        <div
          className={cn(
            chipVariants({ size, variant, style }),
            chipMotionVariants({ enabled: motion }),
            className,
          )}
          ref={ref}
          tabIndex={disabled ? -1 : 0}
          data-disabled={disabled || undefined}
          aria-disabled={disabled || undefined}
          data-pressed={(keyboardPressed && !disabled) || undefined}
          role="button"
          data-slot="chip"
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
          {...props}
        >
          {children}
        </div>
      </ChipContext.Provider>
    );
  },
) as ChipWithSubComponents;

Chip.displayName = 'Chip';
Chip.Icon = ChipIcon;

export { Chip };
