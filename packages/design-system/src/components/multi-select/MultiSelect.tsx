import { RiCloseLine } from '@remixicon/react';
import {
  Children,
  type ComponentRef,
  forwardRef,
  isValidElement,
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { IconButton } from '../button/IconButton';
import { DropdownMenu } from '../dropdown/DropdownMenu';
import { Search } from '../search/Search';
import { Select } from '../select/Select';
import { SelectContext } from '../select/Select.context';
import {
  selectClearButtonIconVariants,
  selectClearButtonVariants,
  selectValueRightPaddingVariants,
} from '../select/Select.variants';
import { SelectContent } from '../select/SelectContent';
import { SelectTrigger } from '../select/SelectTrigger';
import type {
  MultiSelectContentProps,
  MultiSelectGroupProps,
  MultiSelectLabelProps,
  MultiSelectProps,
  MultiSelectSeparatorProps,
  MultiSelectTriggerProps,
} from './MultiSelect.types';
import { multiSelectTriggerVariants } from './MultiSelect.variants';
import { MultiSelectOption } from './MultiSelectOption';
import { MultiSelectValue } from './MultiSelectValue';

const SELECT_ALL_VALUE = 'wideset_multi_select_all' as const;

export const MultiSelect = ({
  options = [],
  className,
  id,
  name,
  placeholder,
  hideArrow,
  size,
  preset,
  variant = 'primary',
  children,
  value,
  defaultValue,
  onValueChange,
  disabled,
  clearable,
  onClear,
  maxVisibleTags,
  multiValuesLabel,
  portalContainer,
  open,
  defaultOpen,
  onOpenChange,
  modal,
  hasSelectAll = false,
  hasSearch = false,
  noResultsLabel = 'No results found',
  selectAllLabel = 'Select all',
  deselectAllLabel = 'Deselect all',
  clearSelectionAriaLabel = 'Clear selection',
  defaultMotion,
  ...triggerProps
}: MultiSelectProps) => {
  const motion = useDefaultMotion(defaultMotion);
  const isControlled = value !== undefined;
  const isOpenControlled = open !== undefined;

  const [internalValue, setInternalValue] = useState<string[]>(defaultValue ?? []);
  const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen ?? false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = useMemo(
    () => options.filter((o) => o.label.toLowerCase().includes(searchQuery.toLowerCase())),
    [options, searchQuery],
  );

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const searchRef = useCallback((input: HTMLInputElement | null) => {
    searchInputRef.current = input;
    input?.focus();
  }, []);

  const selectedValues = isControlled ? value : internalValue;
  const currentOpen = isOpenControlled ? open : internalOpen;

  const optionsMap = useMemo(
    () =>
      options.reduce<Record<string, (typeof options)[number]>>(
        (acc, option) => ({
          ...acc,
          [option.value]: option,
        }),
        {},
      ),
    [options],
  );

  const selectedOptions = useMemo(
    () =>
      selectedValues.map((selectedValue) => {
        const option = optionsMap[selectedValue];
        return {
          value: selectedValue,
          label: option?.label ?? selectedValue,
        };
      }),
    [selectedValues, optionsMap],
  );

  const hasValue = selectedOptions.length > 0;
  const tagsGrow = maxVisibleTags === undefined;
  const areTagsVisible = hasValue && (tagsGrow || selectedOptions.length <= maxVisibleTags);
  const hasClearButton = clearable && hasValue && !disabled;

  const setSelected = (newValues: string[]) => {
    if (!isControlled) {
      setInternalValue(newValues);
    }
    onValueChange?.(newValues);
  };

  const handleItemSelect = (optionValue: string, isSelected: boolean) => {
    if (isSelected) {
      setSelected(selectedValues.filter((valueItem) => valueItem !== optionValue));
      return;
    }

    setSelected([...selectedValues, optionValue]);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) {
      if (!isOpenControlled) {
        setInternalOpen(false);
      }
      onOpenChange?.(false);
      return;
    }

    if (!nextOpen) {
      setSearchQuery('');
    }

    if (!isOpenControlled) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const handleClearClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setSelected([]);
    onOpenChange?.(false);
    onClear?.();
    triggerRef.current?.focus();
  };

  const selectableFilteredOptions = useMemo(
    () => (hasSelectAll ? filteredOptions.filter((o) => !o.disabled) : []),
    [filteredOptions, hasSelectAll],
  );

  const allFilteredSelected =
    selectableFilteredOptions.length > 0 &&
    selectableFilteredOptions.every((o) => selectedValues.includes(o.value));
  const someFilteredSelected = selectableFilteredOptions.some((o) =>
    selectedValues.includes(o.value),
  );

  const handleSelectAllChange = () => {
    if (allFilteredSelected) {
      const filteredSet = new Set(selectableFilteredOptions.map((o) => o.value));
      setSelected(selectedValues.filter((v) => !filteredSet.has(v)));
    } else {
      setSelected([
        ...new Set([...selectedValues, ...selectableFilteredOptions.map((o) => o.value)]),
      ]);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const menu = event.currentTarget.closest('[role="menu"]');
      const items = Array.from(
        menu?.querySelectorAll<HTMLElement>(
          '[role="menuitemcheckbox"]:not([aria-disabled="true"])',
        ) ?? [],
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
      const items = Array.from(
        (event.currentTarget as HTMLElement).querySelectorAll<HTMLElement>(
          '[role="menuitemcheckbox"]:not([aria-disabled="true"])',
        ),
      );
      if (items.length > 0 && event.target === items[0]) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    }
  };

  const handleValueRemove = (optionValue: string) => {
    setSelected(selectedValues.filter((valueItem) => valueItem !== optionValue));
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    triggerProps.onKeyDown?.(event);
    if (event.defaultPrevented || event.key !== 'Backspace') return;
    if (disabled || !areTagsVisible) return;

    event.preventDefault();
    handleValueRemove(selectedValues[selectedValues.length - 1]);
  };

  const isComposable = Children.toArray(children).some(
    (child) =>
      isValidElement(child) &&
      (child.type === MultiSelectTrigger ||
        child.type === MultiSelectContent ||
        child.type === DropdownMenu.Trigger ||
        child.type === SelectContent),
  );

  return (
    <SelectContext.Provider value={{ motion }}>
      {isComposable ? (
        <DropdownMenu open={currentOpen} onOpenChange={handleOpenChange} modal={modal}>
          {children}
        </DropdownMenu>
      ) : (
        <div data-slot="multi-select" className="flex w-full items-center">
          <DropdownMenu open={currentOpen} onOpenChange={handleOpenChange} modal={modal}>
            <DropdownMenu.Trigger asChild>
              <SelectTrigger
                ref={triggerRef}
                data-slot="multi-select-trigger"
                id={id}
                name={name}
                type="button"
                disabled={disabled}
                className={cn(multiSelectTriggerVariants({ size, tagsGrow }), className)}
                size={size}
                preset={preset}
                variant={variant}
                hideArrow={hideArrow}
                shouldUsePrimitive={false}
                {...triggerProps}
                onKeyDown={handleTriggerKeyDown}
                data-disabled={disabled}
              >
                <div
                  className={cn(
                    'gap-ws-2 flex min-w-0 flex-1 items-center',
                    tagsGrow ? 'flex-wrap' : 'overflow-hidden',
                    tagsGrow &&
                      (size === 'sm'
                        ? 'min-h-ws-11'
                        : size === 'lg'
                          ? 'min-h-ws-13'
                          : 'min-h-ws-12'),
                    hasClearButton && selectValueRightPaddingVariants({ size }),
                  )}
                >
                  <MultiSelectValue
                    hasValue={hasValue}
                    placeholder={placeholder}
                    areTagsVisible={areTagsVisible}
                    selectedOptions={selectedOptions}
                    size={size}
                    hasClearButton={hasClearButton}
                    multiValuesLabel={multiValuesLabel}
                    onRemoveValue={handleValueRemove}
                    wrap={tagsGrow}
                  />
                </div>
              </SelectTrigger>
            </DropdownMenu.Trigger>

            <SelectContent
              data-slot="multi-select-content"
              shouldUsePrimitive={false}
              portalContainer={portalContainer}
              align="start"
              sideOffset={4}
              onKeyDown={handleContentKeyDown}
            >
              {hasSearch && (
                <>
                  <Search
                    ref={searchRef}
                    className="m-ws-5 w-auto shrink-0"
                    value={searchQuery}
                    onChange={handleFilterChange}
                    onClear={handleSearchClear}
                    onKeyDown={handleSearchKeyDown}
                    defaultMotion={motion}
                  />
                  <Select.Separator
                    data-slot="multi-select-separator"
                    className="-mx-ws-3 shrink-0"
                  />
                </>
              )}
              {hasSelectAll && (
                <>
                  <MultiSelectOption
                    key={SELECT_ALL_VALUE}
                    option={{
                      value: SELECT_ALL_VALUE,
                      label: allFilteredSelected ? deselectAllLabel : selectAllLabel,
                    }}
                    indeterminateState={
                      !someFilteredSelected ? false : allFilteredSelected ? true : 'indeterminate'
                    }
                    isDisabled={false}
                    onSelect={handleSelectAllChange}
                  />
                  <Select.Separator
                    data-slot="multi-select-separator"
                    className="-mx-ws-3 shrink-0"
                  />
                </>
              )}
              {filteredOptions.length > 0 &&
                filteredOptions.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  const isOptionDisabled = Boolean(disabled || option.disabled);
                  return (
                    <MultiSelectOption
                      key={option.value}
                      option={option}
                      isSelected={isSelected}
                      isDisabled={isOptionDisabled}
                      onSelect={() => handleItemSelect(option.value, isSelected)}
                    />
                  );
                })}
              {!filteredOptions.length && hasSearch && searchQuery.trim() && (
                <p
                  role="status"
                  className="typography-label-sm text-ws-dynamic-secondary-default px-ws-7 py-ws-5"
                >
                  {noResultsLabel}
                </p>
              )}
            </SelectContent>
          </DropdownMenu>

          {hasClearButton && (
            <IconButton
              onClick={handleClearClick}
              aria-label={clearSelectionAriaLabel}
              icon={RiCloseLine}
              preset="ghost"
              variant="secondary"
              defaultMotion={motion}
              className={selectClearButtonVariants({
                size,
                hideArrow,
              })}
              iconClassName={selectClearButtonIconVariants({ size })}
            />
          )}
        </div>
      )}
    </SelectContext.Provider>
  );
};

MultiSelect.displayName = 'MultiSelect';

export const MultiSelectTrigger = forwardRef<
  ComponentRef<typeof DropdownMenu.Trigger>,
  MultiSelectTriggerProps
>((props, ref) => <DropdownMenu.Trigger ref={ref} data-slot="multi-select-trigger" {...props} />);
MultiSelectTrigger.displayName = 'MultiSelect.Trigger';
MultiSelect.Trigger = MultiSelectTrigger;
export const MultiSelectContent = forwardRef<
  ComponentRef<typeof SelectContent>,
  MultiSelectContentProps
>((props, ref) => <SelectContent ref={ref} data-slot="multi-select-content" {...props} />);
MultiSelectContent.displayName = 'MultiSelect.Content';
MultiSelect.Content = MultiSelectContent;
MultiSelect.Value = MultiSelectValue;
MultiSelect.Option = MultiSelectOption;
export const MultiSelectGroup = forwardRef<
  ComponentRef<typeof DropdownMenu.Group>,
  MultiSelectGroupProps
>((props, ref) => <DropdownMenu.Group ref={ref} data-slot="multi-select-group" {...props} />);
MultiSelectGroup.displayName = 'MultiSelect.Group';
MultiSelect.Group = MultiSelectGroup;
export const MultiSelectLabel = forwardRef<
  ComponentRef<typeof DropdownMenu.Label>,
  MultiSelectLabelProps
>((props, ref) => <DropdownMenu.Label ref={ref} data-slot="multi-select-label" {...props} />);
MultiSelectLabel.displayName = 'MultiSelect.Label';
MultiSelect.Label = MultiSelectLabel;
export const MultiSelectSeparator = forwardRef<
  ComponentRef<typeof DropdownMenu.Separator>,
  MultiSelectSeparatorProps
>((props, ref) => (
  <DropdownMenu.Separator ref={ref} data-slot="multi-select-separator" {...props} />
));
MultiSelectSeparator.displayName = 'MultiSelect.Separator';
MultiSelect.Separator = MultiSelectSeparator;
