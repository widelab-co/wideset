import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';
import { formatDateToISOString, formatISODateToAnotherFormat } from 'src/logic/date';

import {
  type DateRangePickerProps,
  type DateRangePreset,
  dateRangePresetLabels,
  type DateRangeValue,
} from './DateRangePicker.types';

type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const buildPresetResolvers = (
  weekStartsOn: WeekStartsOn,
): Record<DateRangePreset, (date: Date) => [Date, Date]> => {
  const weekOptions = { weekStartsOn } as const;
  return {
    custom: (date) => [date, date],
    today: (date) => [date, date],
    yesterday: (date) => [subDays(date, 1), subDays(date, 1)],
    thisWeek: (date) => [startOfWeek(date, weekOptions), endOfWeek(date, weekOptions)],
    lastWeek: (date) => [
      startOfWeek(subWeeks(date, 1), weekOptions),
      endOfWeek(subWeeks(date, 1), weekOptions),
    ],
    thisMonth: (date) => [startOfMonth(date), endOfMonth(date)],
    lastMonth: (date) => [startOfMonth(subMonths(date, 1)), endOfMonth(subMonths(date, 1))],
    thisYear: (date) => [startOfYear(date), endOfYear(date)],
    lastYear: (date) => [startOfYear(subYears(date, 1)), endOfYear(subYears(date, 1))],
  };
};

export const getPresetRange = (
  preset: DateRangePreset,
  weekStartsOn: WeekStartsOn = 1,
  today: Date = new Date(),
): DateRangeValue => {
  const resolvers = buildPresetResolvers(weekStartsOn);
  const [from, to] = resolvers[preset](startOfDay(today));
  return { from: formatDateToISOString(from), to: formatDateToISOString(to) };
};

/** A preset's label: the caller's `presetLabels` entry, or the built-in one when it has none. */
export const getPresetLabel = (
  preset: DateRangePreset,
  presetLabels: DateRangePickerProps['presetLabels'],
): string => presetLabels?.[preset] ?? dateRangePresetLabels[preset];

export const formatRangeDisplay = (
  range: DateRangeValue | undefined,
  preset: DateRangePreset | undefined,
  dateFormat: string,
  presetLabels?: DateRangePickerProps['presetLabels'],
): string => {
  if (preset && preset !== 'custom') return getPresetLabel(preset, presetLabels);
  if (!range?.from) return '';
  const fromStr = formatISODateToAnotherFormat(range.from, dateFormat);
  if (!range.to || range.from === range.to) return fromStr ?? '';
  const toStr = formatISODateToAnotherFormat(range.to, dateFormat);
  return `${fromStr} – ${toStr}`;
};
