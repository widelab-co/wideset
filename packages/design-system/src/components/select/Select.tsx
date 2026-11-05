import * as SelectPrimitive from '@radix-ui/react-select';
import { RiCloseLine } from '@remixicon/react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { IconButton } from '../button/IconButton';
import { ListItem } from '../list-item/ListItem';
import { Search } from '../search/Search';
import { SelectContext } from './Select.context';
import type {
  SelectGroupProps,
  SelectItemIndicatorProps,
  SelectItemTextProps,
  SelectProps,
  SelectValueProps,
} from './Select.types';
import {
  selectClearButtonIconVariants,
  selectClearButtonVariants,
  selectValuePrefixVariants,
  selectValueRightPaddingVariants,
} from './Select.variants';
import { SelectContent } from './SelectContent';
import { SelectLabel } from './SelectLabel';
import { SelectOption } from './SelectOption';
import { SelectSearch } from './SelectSearch';
import { SelectSeparator } from './SelectSeparator';
import { SelectTrigger } from './SelectTrigger';

export const Select = ({
  options,
  placeholder,
  className,
  variant = 'primary',
  size,
  preset,
  hideArrow,
  clearable,
  id,
  name,
  children,
  onClear,
  onValueChange,
  value,
  defaultValue,
  open,
  defaultOpen,
  onOpenChange,
  dir,
  required,
  disabled,
  hasSearch = false,
  clearSelectionAriaLabel = 'Clear selection',
  defaultMotion,
  ...triggerProps
}: SelectProps) => {
  const motion = useDefaultMotion(defaultMotion);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(defaultValue ?? '');
  const [searchQuery, setSearchQuery] = useState('');

  const currentValue = isControlled ? value : internalValue;

  const filteredOptions = useMemo(() => {
    if (!hasSearch || !searchQuery) return options ?? [];
    return (options ?? []).filter((o) => o.label.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [options, searchQuery, hasSearch]);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const searchRef = useCallback((input: HTMLInputElement | null) => {
    searchInputRef.current = input;
    // setTimeout defers focus past Radix's FocusScope.onMountAutoFocus, which otherwise
    // moves focus to the first/selected option and overrides our focus call.
    if (input) setTimeout(() => input.focus(), 0);
  }, []);

  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSearchQuery('');
    }
    onOpenChange?.(nextOpen);
  };

  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleClear = () => {
    handleValueChange('');
    handleOpenChange(false);
    onClear?.();
    triggerRef.current?.focus();
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const viewport = event.currentTarget.closest('[data-radix-select-viewport]');
      const items = Array.from(
        viewport?.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])') ??
          [],
      );
      if (items.length === 0) return;
      (event.key === 'ArrowDown' ? items[0] : items[items.length - 1]).focus();
      return;
    }
    event.stopPropagation();
  };

  const handleContentKeyDown = (event: React.KeyboardEvent) => {
    if (
      hasSearch &&
      event.shiftKey &&
      event.key === 'Tab' &&
      event.target !== searchInputRef.current
    ) {
      event.preventDefault();
      searchInputRef.current?.focus();
      return;
    }

    if (hasSearch && event.key === 'ArrowUp' && event.target !== searchInputRef.current) {
      const viewport = (event.currentTarget as HTMLElement).querySelector(
        '[data-radix-select-viewport]',
      );
      const items = Array.from(
        viewport?.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])') ??
          [],
      );
      if (items.length > 0 && event.target === items[0]) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    }
  };

  const optionsList = filteredOptions.map((option) => (
    <SelectOption
      key={option.value}
      value={option.value}
      textValue={option.label}
      disabled={option.disabled}
      variant={option.variant}
    >
      {option.prefix && <ListItem.Prefix>{option.prefix}</ListItem.Prefix>}
      <ListItem.Label>{option.label}</ListItem.Label>
    </SelectOption>
  ));

  const hasValue = Boolean(currentValue) && currentValue !== '';
  const selectedOption = options?.find((option) => option.value === currentValue);
  const hasPrefix = Boolean(selectedOption?.prefix);
  const hasClearButton = clearable && hasValue && !disabled;

  const trigger = (
    <SelectTrigger
      ref={triggerRef}
      className={className}
      variant={variant}
      size={size}
      preset={preset}
      disabled={disabled}
      hideArrow={hideArrow}
      id={id}
      name={name}
      {...triggerProps}
    >
      {/* The value row takes the space the arrow leaves and cuts a long label with an ellipsis:
          a field never wraps to a second line. */}
      <div className={cn('flex min-w-0 flex-1 items-center', hasPrefix && 'h-full')}>
        {hasPrefix && (
          <div className={cn(selectValuePrefixVariants({ size }))} data-disabled={disabled}>
            {selectedOption?.prefix}
          </div>
        )}
        {hasValue ? (
          <span
            className={cn(
              'min-w-0 flex-1 truncate',
              hasClearButton && selectValueRightPaddingVariants({ size }),
            )}
          >
            {selectedOption?.label}
          </span>
        ) : (
          <SelectValue
            placeholder={placeholder}
            className={cn(
              'min-w-0 flex-1 truncate',
              hasClearButton && selectValueRightPaddingVariants({ size }),
            )}
          />
        )}
      </div>
    </SelectTrigger>
  );

  const isComposable = React.Children.toArray(children).some(
    (child) =>
      React.isValidElement(child) && (child.type === SelectTrigger || child.type === SelectContent),
  );

  return (
    <SelectContext.Provider value={{ motion }}>
      {isComposable ? (
        <SelectPrimitive.Root
          onValueChange={handleValueChange}
          value={currentValue}
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          dir={dir}
          required={required}
          disabled={disabled}
          name={name}
        >
          {children}
        </SelectPrimitive.Root>
      ) : (
        <SelectPrimitive.Root
          onValueChange={handleValueChange}
          value={currentValue}
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={handleOpenChange}
          dir={dir}
          required={required}
          disabled={disabled}
          name={name}
        >
          {clearable ? (
            <div data-slot="select-wrapper" className="flex items-center">
              {trigger}
              {hasClearButton && (
                <IconButton
                  onClick={handleClear}
                  aria-label={clearSelectionAriaLabel}
                  defaultMotion={motion}
                  icon={RiCloseLine}
                  preset="ghost"
                  variant="secondary"
                  className={selectClearButtonVariants({ size, hideArrow })}
                  iconClassName={selectClearButtonIconVariants({ size })}
                />
              )}
            </div>
          ) : (
            trigger
          )}
          <SelectContent onKeyDown={handleContentKeyDown}>
            {hasSearch && (
              <>
                <Search
                  ref={searchRef}
                  data-slot="select-search"
                  className="m-ws-5 w-auto shrink-0"
                  value={searchQuery}
                  size="sm"
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setTimeout(() => searchInputRef.current?.focus(), 0);
                  }}
                  onClear={() => {
                    setSearchQuery('');
                    setTimeout(() => searchInputRef.current?.focus(), 0);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  defaultMotion={motion}
                />
                <SelectSeparator className="-mx-ws-3 shrink-0" />
              </>
            )}
            {optionsList}
          </SelectContent>
        </SelectPrimitive.Root>
      )}
    </SelectContext.Provider>
  );
};

Select.displayName = 'Select';

export const SelectGroup = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Group>,
  SelectGroupProps
>((props, ref) => <SelectPrimitive.Group ref={ref} data-slot="select-group" {...props} />);
SelectGroup.displayName = 'Select.Group';
Select.Group = SelectGroup;
export const SelectValue = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Value>,
  SelectValueProps
>((props, ref) => <SelectPrimitive.Value ref={ref} data-slot="select-value" {...props} />);
SelectValue.displayName = 'Select.Value';
Select.Value = SelectValue;
export const SelectItemText = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ItemText>,
  SelectItemTextProps
>((props, ref) => <SelectPrimitive.ItemText ref={ref} data-slot="select-item-text" {...props} />);
SelectItemText.displayName = 'Select.ItemText';
Select.ItemText = SelectItemText;
export const SelectItemIndicator = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ItemIndicator>,
  SelectItemIndicatorProps
>((props, ref) => (
  <SelectPrimitive.ItemIndicator ref={ref} data-slot="select-item-indicator" {...props} />
));
SelectItemIndicator.displayName = 'Select.ItemIndicator';
Select.ItemIndicator = SelectItemIndicator;
Select.Content = SelectContent;
Select.Option = SelectOption;
Select.Label = SelectLabel;
Select.Search = SelectSearch;
Select.Separator = SelectSeparator;
Select.Trigger = SelectTrigger;
