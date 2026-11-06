import { useComposedRefs } from '@radix-ui/react-compose-refs';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { RiArrowDownSLine, RiCloseLine } from '@remixicon/react';
import React, { useMemo, useRef, useState } from 'react';
import { IconButton } from 'src/components/button/IconButton';
import { Checkbox } from 'src/components/checkbox/Checkbox';
import { ListItem } from 'src/components/list-item/ListItem';
import { Popup } from 'src/components/popup/Popup';
import { ScrollArea } from 'src/components/scroll-area/ScrollArea';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { useKeyboardNavigation } from './FilterButton.hooks';
import { frozenAnchor } from './FilterButton.logic';
import type { FilterButtonProps } from './FilterButton.types';
import {
  filterButtonClearPlaceholderVariants,
  filterButtonClearSizes,
  filterButtonClearVariants,
  filterButtonLabelsVariants,
  filterButtonPlaceholderVariants,
  filterButtonTriggerMotionVariants,
  filterButtonTriggerVariants,
  filterButtonValueVariants,
} from './FilterButton.variants';

export const FilterButton = React.forwardRef<HTMLButtonElement, FilterButtonProps>(
  (
    {
      className,
      options,
      placeholder = 'Filter',
      onChange,
      value,
      defaultValue,
      label = 'Filter',
      size,
      disabled,
      clearFilterAriaLabel = 'Clear filter',
      defaultMotion,
      // eslint-disable-next-line unused-imports/no-unused-vars
      selected: _selected,
      ...props
    },
    ref,
  ) => {
    const motion = useDefaultMotion(defaultMotion);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const composedRef = useComposedRefs(ref, triggerRef);
    const isControlled = value !== undefined;
    const [innerValue, setInnerValue] = useState<string[]>(isControlled ? [] : defaultValue || []);
    const selectedValues = isControlled ? value : innerValue;

    const handleSelect = (optionValue: string) => {
      if (disabled) return;

      const updatedValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((selectedValue) => selectedValue !== optionValue)
        : [...selectedValues, optionValue];

      if (!isControlled) {
        setInnerValue(updatedValues);
      }

      onChange(updatedValues);
    };

    const handleReset = () => {
      const emptyValue: string[] = [];

      setInnerValue(emptyValue);
      onChange(emptyValue);
    };

    const { getItemProps, focusFirstEnabled } = useKeyboardNavigation({
      itemCount: options.length,
      isDisabled: (index) => Boolean(options[index]?.disabled),
      onSelect: (index) => handleSelect(options[index].value),
    });

    const hasSelection = selectedValues.length > 0;

    // The trigger's summary grows as options are picked ("Design, +3"). The list must not follow it
    // while it is open, or it slides out from under the pointer. So while open the popup anchors to
    // a copy of the trigger frozen at its opening width, pinned to whichever side has not moved:
    // the left in a left-aligned toolbar, the right in a right-aligned one.
    const openRect = useRef<DOMRect | null>(null);
    const makeAnchor = () => ({
      getBoundingClientRect: () => {
        const live = triggerRef.current?.getBoundingClientRect() ?? new DOMRect();
        if (!openRect.current) return live;
        const { left, top, width, height } = frozenAnchor(openRect.current, live);
        return new DOMRect(left, top, width, height);
      },
      contextElement: triggerRef.current ?? undefined,
    });
    const anchorRef = useRef(makeAnchor());
    const handleOpenChange = (open: boolean) => {
      openRect.current = open ? (triggerRef.current?.getBoundingClientRect() ?? null) : null;
      // A new object each time: Radix registers a virtual anchor only when its identity changes,
      // and it drops the anchor when the trigger stops being one.
      anchorRef.current = makeAnchor();
    };

    const displayedValue = useMemo(() => {
      if (!selectedValues.length) return;

      const label = options.find((option) => option.value === selectedValues[0])?.label;

      return selectedValues.length > 1 ? `${label}, +${selectedValues.length - 1}` : label;
    }, [selectedValues, options]);

    return (
      <Popup onOpenChange={handleOpenChange}>
        <PopoverPrimitive.Anchor virtualRef={anchorRef} />
        <div data-slot="filter-button-wrapper" className="flex max-w-full items-center">
          <Popup.Trigger asChild>
            <button
              data-slot="filter-button"
              {...props}
              className={cn(
                filterButtonTriggerVariants({ size, selected: hasSelection, disabled }),
                filterButtonTriggerMotionVariants({ enabled: motion }),
                className,
              )}
              ref={composedRef}
              disabled={disabled}
            >
              {hasSelection ? (
                <span className={filterButtonLabelsVariants({ size })}>
                  <span>{label}</span>
                  {displayedValue && (
                    <span className={filterButtonValueVariants({ size, disabled })}>
                      {displayedValue}
                    </span>
                  )}
                </span>
              ) : (
                <span className={filterButtonPlaceholderVariants({ size })}>{placeholder}</span>
              )}
              {hasSelection ? (
                <span
                  aria-hidden="true"
                  className={filterButtonClearPlaceholderVariants({ size })}
                />
              ) : (
                <RiArrowDownSLine aria-hidden="true" focusable="false" />
              )}
            </button>
          </Popup.Trigger>
          {hasSelection && (
            <IconButton
              icon={RiCloseLine}
              variant="secondary"
              preset="ghost"
              size={filterButtonClearSizes[size ?? 'sm']}
              aria-label={clearFilterAriaLabel}
              defaultMotion={motion}
              disabled={disabled}
              className={filterButtonClearVariants({ size })}
              onClick={() => {
                handleReset();
                triggerRef.current?.focus();
              }}
            />
          )}
        </div>
        <Popup.Container
          // Width floor: max(trigger, Size/28) so the list neither shrinks below
          // the menu minimum nor jumps around as the trigger's own width
          // changes with the selection summary. Height: no taller than the room left to the
          // window edge, 10px short of it as Select's list; the list inside stops at 18rem.
          className="rounded-ws-container-sm z-ws-popout max-h-[var(--radix-popover-content-available-height)] w-auto min-w-[max(var(--radix-popover-trigger-width),var(--spacing-ws-28))] overflow-hidden"
          collisionPadding={10}
          defaultMotion={motion}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            focusFirstEnabled();
          }}
        >
          <ScrollArea defaultMotion={motion} className="max-h-[18rem]">
            <div
              role="listbox"
              aria-multiselectable
              aria-label={label}
              className="p-ws-3 outline-none"
            >
              {options.map((option, index) => {
                const selected = selectedValues.includes(option.value);

                return (
                  <ListItem
                    key={option.value}
                    role="option"
                    aria-selected={selected}
                    disabled={option.disabled}
                    onClick={() => {
                      if (option.disabled) return;
                      handleSelect(option.value);
                    }}
                    // Figma binds the row's min-height to `Size/14` (32px); the
                    // padding alone (Gap/3 + 20px content + Gap/3) only reaches 28px.
                    defaultMotion={motion}
                    className={cn('min-h-ws-14', {
                      'bg-ws-dynamic-primary-alpha-default': selected,
                    })}
                    {...getItemProps(index)}
                  >
                    <ListItem.Prefix>
                      <Checkbox
                        checked={selected}
                        className="pointer-events-none"
                        tabIndex={-1}
                        defaultMotion={motion}
                      />
                    </ListItem.Prefix>
                    <ListItem.Label>{option.label}</ListItem.Label>
                  </ListItem>
                );
              })}
            </div>
          </ScrollArea>
        </Popup.Container>
      </Popup>
    );
  },
);

FilterButton.displayName = 'FilterButton';

export type { FilterButtonOption, FilterButtonProps } from './FilterButton.types';
export { filterButtonTriggerVariants } from './FilterButton.variants';
