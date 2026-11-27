import { RiArrowDownSLine, RiCloseLine } from '@remixicon/react';
import React, { useRef } from 'react';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { IconButton } from '../button/IconButton';
import { Popup } from '../popup/Popup';
import {
  selectClearButtonIconVariants,
  selectTriggerSuffixIconVariants,
  selectTriggerSuffixVariants,
  selectTriggerVariants,
  selectValueLeftPaddingVariants,
} from '../select/Select.variants';
import { TextInput } from '../text-input/TextInput';
import { TextInputContext } from '../text-input/TextInput.context';
import { useComboBoxContext } from './ComboBox.context';
import type { ComboBoxTriggerProps } from './ComboBox.types';
import { comboBoxTriggerMotionVariants } from './ComboBox.variants';
import { comboBoxClearButtonVariants } from './ComboBoxTrigger.variants';

const ComboBoxTrigger = React.forwardRef<HTMLDivElement, ComboBoxTriggerProps>(
  (
    {
      children,
      className,
      size,
      variant,
      preset,
      disabled,
      hasPrefix,
      open,
      inputRef,
      inputValue,
      displayedLabel,
      placeholder,
      hasClearButton,
      clearSelectionAriaLabel = 'Clear selection',
      onInputChange,
      onInputKeyDown,
      onInputBlur,
      onClick,
      onKeyDown,
      defaultMotion,
      id,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const context = useComboBoxContext();
    const motion = useDefaultMotion(defaultMotion ?? context.motion);
    const internalInputRef = useRef<HTMLInputElement>(null);
    const isOpen = open ?? context.open;

    const resolvedInputRef = inputRef ?? context.inputRef ?? internalInputRef;
    const resolvedInputValue = inputValue ?? context.inputValue;
    const resolvedDisplayedLabel = displayedLabel ?? context.displayedLabel;
    const resolvedHasClearButton = hasClearButton ?? context.hasClearButton;

    const comboboxProps = {
      'aria-controls': context.contentId,
      'aria-expanded': isOpen,
      'aria-haspopup': 'listbox',
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      // Only when given: an `undefined` here would override the danger variant's own value.
      ...(ariaInvalid !== undefined && { 'aria-invalid': ariaInvalid }),
    } as const;

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      context.onInputChange?.(event.target.value);
      onInputChange?.(event.target.value);
    };

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      context.onInputKeyDown?.(event);
      onInputKeyDown?.(event);
    };

    const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      context.onInputBlur?.(event);
      onInputBlur?.(event);
    };

    const handleTriggerOpen = (
      event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
    ) => {
      if (onClick) {
        onClick(event as React.MouseEvent<HTMLDivElement>);
        if (event.defaultPrevented) return;
      }

      context.onOpenChange(true);
    };

    const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled || event.target !== event.currentTarget) return;

      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      if (event.key === 'Enter') {
        handleTriggerOpen(event);
        return;
      }

      if (event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault();
        handleTriggerOpen(event);
      }
    };

    return (
      <TextInputContext.Provider
        value={{
          size,
          variant,
          disabled,
          inputRef: resolvedInputRef,
          currentValue: String(resolvedInputValue ?? ''),
          handleChange: handleInputChange,
          motion,
        }}
      >
        <Popup.Trigger asChild>
          <div
            ref={ref}
            id={id}
            data-slot="combo-box-trigger"
            role={isOpen ? undefined : 'combobox'}
            {...(isOpen
              ? {
                  'aria-controls': undefined,
                  'aria-expanded': undefined,
                  'aria-haspopup': undefined,
                }
              : comboboxProps)}
            data-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={handleTriggerKeyDown}
            className={cn(
              selectTriggerVariants({ size, preset, variant }),
              comboBoxTriggerMotionVariants({ enabled: motion }),
              !disabled && 'cursor-text',
              hasPrefix && 'pl-0',
              className,
            )}
            {...props}
          >
            {children}
            {isOpen ? (
              <TextInput.Input
                onKeyDown={handleInputKeyDown}
                onBlur={handleInputBlur}
                placeholder={resolvedDisplayedLabel || placeholder}
                className={cn(
                  'h-auto min-w-0 flex-1 px-0',
                  hasPrefix && selectValueLeftPaddingVariants({ size }),
                )}
                role="combobox"
                {...comboboxProps}
                aria-activedescendant={context.activeDescendantId}
                aria-autocomplete="list"
              />
            ) : (
              <span
                className={cn(
                  'min-w-0 flex-1 truncate',
                  !resolvedDisplayedLabel && 'text-ws-static-subtle',
                  hasPrefix && selectValueLeftPaddingVariants({ size }),
                )}
              >
                {resolvedDisplayedLabel || placeholder}
              </span>
            )}
            {resolvedHasClearButton && (
              <IconButton
                onClick={context.onClear}
                aria-label={clearSelectionAriaLabel}
                defaultMotion={motion}
                icon={RiCloseLine}
                preset="ghost"
                variant="secondary"
                className={comboBoxClearButtonVariants({ size })}
                iconClassName={selectClearButtonIconVariants({ size })}
              />
            )}
            <div
              className={cn(
                selectTriggerSuffixVariants({ size, preset }),
                !disabled && 'cursor-pointer',
              )}
            >
              <RiArrowDownSLine
                aria-hidden="true"
                focusable="false"
                className={selectTriggerSuffixIconVariants({ size })}
                data-disabled={disabled}
              />
            </div>
          </div>
        </Popup.Trigger>
      </TextInputContext.Provider>
    );
  },
);

ComboBoxTrigger.displayName = 'ComboBox.Trigger';

export { ComboBoxTrigger };
