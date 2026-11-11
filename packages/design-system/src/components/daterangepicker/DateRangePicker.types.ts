import type { VariantProps } from 'class-variance-authority';
import type { AriaAttributes } from 'react';
import type { Matcher, PropsBase, PropsRange } from 'react-day-picker';

import type { MotionProps } from '../../motion/Motion.types';
import type { textInputVariants } from '../text-input/TextInput.variants';

export const dateRangePresetLabels = {
  custom: 'Custom',
  today: 'Today',
  yesterday: 'Yesterday',
  thisWeek: 'This Week',
  lastWeek: 'Last Week',
  thisMonth: 'This Month',
  lastMonth: 'Last Month',
  thisYear: 'This Year',
  lastYear: 'Last Year',
} as const;

export type DateRangePreset = keyof typeof dateRangePresetLabels;

export type DateRangeValue = {
  /** Start of the range as an ISO date string (`YYYY-MM-DD`). */
  from?: string;
  /** End of the range as an ISO date string (`YYYY-MM-DD`). */
  to?: string;
};

type DateRangePickerVariants = Pick<
  VariantProps<typeof textInputVariants>,
  'size' | 'preset' | 'variant'
>;

type DateRangePickerDefaultValue =
  | {
      /** Initial range for uncontrolled usage. Mutually exclusive with defaultDatePreset. */
      defaultSelected?: DateRangeValue;
      defaultDatePreset?: never;
    }
  | {
      /** Initial preset for uncontrolled usage. Mutually exclusive with defaultSelected. */
      defaultDatePreset?: DateRangePreset;
      defaultSelected?: never;
    };

/** A date range picker with optional presets. */
export type DateRangePickerProps = DateRangePickerVariants &
  MotionProps &
  Omit<
    PropsBase,
    'mode' | 'disabled' | 'id' | 'aria-label' | 'aria-labelledby' | 'aria-describedby'
  > &
  Omit<PropsRange, 'mode' | 'selected' | 'onSelect'> &
  DateRangePickerDefaultValue & {
    /** Additional class name forwarded to the trigger element. */
    className?: string;
    /** Id of the trigger button, so a `<label htmlFor>` can name it. */
    id?: string;
    /** Accessible name of the trigger button when no visible label is associated. */
    'aria-label'?: string;
    /** Id of the element that names the trigger button. */
    'aria-labelledby'?: string;
    /** Ids of the elements that describe the trigger button, such as a FormField's helper text. */
    'aria-describedby'?: string;
    /** Marks the trigger button invalid; FormField sets it while it shows an error. */
    'aria-invalid'?: AriaAttributes['aria-invalid'];
    /** date-fns format string used to render the selected range in the trigger (e.g. `'MMMM d, yyyy'`). Defaults to `'MM/dd/yy'`. */
    dateFormat?: string;
    /** Placeholder shown in the trigger when no range is selected. Defaults to `'Select date range'`. */
    placeholder?: string;
    /** Shows the preset side panel (Today, This Week, Last Month, …) alongside the calendar. Defaults to `false`. */
    showDatePresets?: boolean;
    /** The date the calendar marks as today and the presets (Today, This Week, Last Month, …) count from. Defaults to the current date; set it to show a fixed sample date. */
    today?: Date;
    /** Selected range. Provide to make the component controlled. */
    selected?: DateRangeValue;
    /** Active preset. Provide to make the component controlled. */
    activeDatePreset?: DateRangePreset;
    /** Disables the trigger and prevents the popup from opening. */
    disabled?: boolean;
    /** Dates or matchers that should be unselectable inside the calendar grid. */
    disabledDates?: Matcher | Matcher[];
    /** Fired when a range or preset is picked. Receives the new range and the matching preset (`'custom'` for arbitrary range selections). */
    onSelect?: (range?: DateRangeValue, preset?: DateRangePreset) => void;
    /** Override labels for one or more presets shown in the side panel. Unspecified keys fall back to the built-in English labels. Only relevant when `showDatePresets` is `true`. */
    presetLabels?: Partial<Record<keyof typeof dateRangePresetLabels, string>>;
  };

/** The column of preset range buttons beside the calendar. */
export type DateRangePickerPresetsProps = MotionProps & {
  /** Currently selected date preset. */
  activeDatePreset?: DateRangePreset;
  /** Called with the selected date preset. */
  onDatePresetSelect: (preset: DateRangePreset) => void;
  /** Override labels for one or more presets. Unspecified keys fall back to the built-in English labels. */
  presetLabels?: Partial<Record<keyof typeof dateRangePresetLabels, string>>;
};
