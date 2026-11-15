'use client';

import { RiCloseLine } from '@remixicon/react';
import React from 'react';
import { cn } from '@/lib/wideset/utils';

import { IconButton } from '../button/IconButton';
import { useTextInputContext } from './TextInput.context';
import { setNativeInputValue } from './TextInput.logic';
import type { TextInputClearButtonProps } from './TextInput.types';
import {
  textInputClearButtonIconVariants,
  textInputClearButtonSizes,
  textInputClearButtonVariants,
} from './TextInput.variants';

export const TextInputClearButton = React.forwardRef<HTMLButtonElement, TextInputClearButtonProps>(
  (
    {
      icon = RiCloseLine,
      'aria-label': ariaLabel = 'Clear',
      onClear,
      onClick,
      onMouseDown,
      className,
      iconClassName,
      defaultMotion,
      ...props
    },
    ref,
  ) => {
    const { size, disabled, currentValue, inputRef, inputProps, motion } = useTextInputContext();

    if (!currentValue || disabled || inputProps?.readOnly) return null;

    return (
      <IconButton
        ref={ref}
        data-slot="text-input-clear-button"
        aria-label={ariaLabel}
        icon={icon}
        preset="ghost"
        variant="secondary"
        size={textInputClearButtonSizes[size ?? 'md']}
        iconClassName={cn(textInputClearButtonIconVariants({ size }), iconClassName)}
        className={cn(textInputClearButtonVariants({ size }), className)}
        defaultMotion={defaultMotion ?? motion}
        {...props}
        // Mouse-down moves focus to the button before the click lands, so the
        // field visibly loses its focus ring for a frame. Keep focus where it is.
        onMouseDown={(event) => {
          onMouseDown?.(event);
          event.preventDefault();
        }}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          event.preventDefault();
          event.stopPropagation();
          const input = inputRef.current;
          if (!input) return;
          // A real `input` event, so every `onChange` on the input (and form
          // libraries reading `event.target.name`) sees the clear as an edit.
          setNativeInputValue(input, '');
          input.focus();
          onClear?.();
        }}
      />
    );
  },
);

TextInputClearButton.displayName = 'TextInput.ClearButton';
