import { forwardRef, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { formatDateToISOString, parseISODate } from 'src/logic/date';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { Calendar } from '../calendar/Calendar';
import { DatePickerTrigger } from '../datepicker/DatePickerTrigger';
import { Popup } from '../popup/Popup';
import { formatRangeDisplay, getPresetRange } from './DateRangePicker.logic';
import type {
  DateRangePickerProps,
  DateRangePreset,
  DateRangeValue,
} from './DateRangePicker.types';
import { DateRangePickerPresets } from './DateRangePickerPresets';

const DateRangePicker = forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    {
      className,
      id,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      onSelect,
      selected,
      defaultSelected,
      defaultDatePreset,
      activeDatePreset: controlledPreset,
      dateFormat = 'MM/dd/yy',
      placeholder = 'Select date range',
      size,
      preset,
      variant,
      disabled,
      disabledDates,
      showDatePresets = false,
      presetLabels,
      defaultMotion,
      ...calendarProps
    },
    ref,
  ) => {
    const motion = useDefaultMotion(defaultMotion);
    const { weekStartsOn, today } = calendarProps;
    const [isOpen, setIsOpen] = useState(false);
    const [internalRange, setInternalRange] = useState<DateRangeValue | undefined>(() => {
      if (defaultDatePreset) return getPresetRange(defaultDatePreset, weekStartsOn, today);
      return defaultSelected;
    });
    const [internalPreset, setInternalPreset] = useState<DateRangePreset | undefined>(
      defaultDatePreset,
    );
    // The range after the first click, kept here until the second click reports it: in
    // controlled mode `selected` does not change in between, so the calendar would drop it.
    const [pendingRange, setPendingRange] = useState<DateRangeValue>();

    const isRangeControlled = selected !== undefined;
    const isPresetControlled = controlledPreset !== undefined;
    const range = isRangeControlled ? selected : internalRange;
    const currentPreset = isPresetControlled ? controlledPreset : internalPreset;

    const handleOpenChange = (open: boolean) => {
      setIsOpen(open);
      setPendingRange(undefined);
    };

    const handlePresetSelect = (presetKey: DateRangePreset) => {
      if (presetKey === 'custom') {
        if (!isPresetControlled) setInternalPreset('custom');
        setPendingRange(undefined);
        return;
      }

      const presetRange = getPresetRange(presetKey, weekStartsOn, today);
      if (!isRangeControlled) setInternalRange(presetRange);
      if (!isPresetControlled) setInternalPreset(presetKey);
      setIsOpen(false);
      onSelect?.(presetRange, presetKey);
    };

    const handleCalendarSelect = (dateRange: DateRange | undefined) => {
      const newRange: DateRangeValue = {
        from: formatDateToISOString(dateRange?.from),
        to: formatDateToISOString(dateRange?.to),
      };
      if (!isRangeControlled) setInternalRange(newRange);
      if (!isPresetControlled) setInternalPreset('custom');

      if (!pendingRange) {
        setPendingRange(newRange);
        return;
      }

      setPendingRange(undefined);
      onSelect?.(newRange, 'custom');
    };

    const shownRange = pendingRange ?? range;
    const calendarRange: DateRange | undefined = shownRange
      ? { from: parseISODate(shownRange.from), to: parseISODate(shownRange.to) }
      : undefined;

    return (
      <Popup onOpenChange={handleOpenChange} open={isOpen}>
        <Popup.Trigger asChild>
          <DatePickerTrigger
            data-slot="date-range-picker"
            ref={ref}
            id={id}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            aria-invalid={ariaInvalid}
            className={className}
            placeholder={placeholder}
            value={formatRangeDisplay(range, currentPreset, dateFormat, presetLabels)}
            size={size}
            preset={preset}
            variant={variant}
            disabled={disabled}
            defaultMotion={motion}
          />
        </Popup.Trigger>
        <Popup.Container align="start" className="w-auto" defaultMotion={motion}>
          <div className="flex">
            {showDatePresets && (
              <DateRangePickerPresets
                activeDatePreset={currentPreset}
                onDatePresetSelect={handlePresetSelect}
                presetLabels={presetLabels}
                defaultMotion={motion}
              />
            )}
            <Calendar
              {...calendarProps}
              selected={calendarRange}
              onSelect={handleCalendarSelect}
              mode="range"
              disabled={disabledDates}
              defaultMotion={motion}
            />
          </div>
        </Popup.Container>
      </Popup>
    );
  },
);

DateRangePicker.displayName = 'DateRangePicker';

export { DateRangePicker };
