import { startOfMonth } from 'date-fns';
import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import type { CalendarProps } from './Calendar.types';
import { calendarClassNames, calendarMotionVariants } from './Calendar.variants';
import { CalendarFooter } from './CalendarFooter';
import { CalendarMonthCaption } from './CalendarMonthCaption';

const getInitialMonth = (props: CalendarProps, defaultMonth?: Date): Date => {
  if (defaultMonth) return startOfMonth(defaultMonth);

  if (props.mode === 'range' && props.selected?.from instanceof Date) {
    return startOfMonth(props.selected.from);
  }

  if (props.mode === 'single' && props.selected instanceof Date) {
    return startOfMonth(props.selected);
  }

  if (props.mode === 'multiple' && props.selected?.length) {
    return startOfMonth(new Date(Math.min(...props.selected.map((date) => date.getTime()))));
  }

  return startOfMonth(props.today ?? new Date());
};

const Calendar = ({
  className,
  classNames,
  showOutsideDays = false,
  components,
  footer,
  yearsPerPage = 16,
  onMonthSelect,
  onYearSelect,
  month: controlledMonth,
  defaultMonth,
  onMonthChange,
  monthCaptionAriaLabels,
  monthGridLabels,
  yearGridLabels,
  defaultMotion,
  ...props
}: CalendarProps) => {
  const motion = useDefaultMotion(defaultMotion);
  const isControlled = controlledMonth !== undefined;
  const [internalMonth, setInternalMonth] = React.useState<Date>(
    () => controlledMonth ?? getInitialMonth(props, defaultMonth),
  );

  const currentMonth = controlledMonth ?? internalMonth;

  const handleMonthChange = React.useCallback(
    (nextMonth: Date) => {
      if (!isControlled) {
        setInternalMonth(nextMonth);
      }
      onMonthChange?.(nextMonth);
    },
    [isControlled, onMonthChange],
  );

  return (
    <DayPicker
      month={currentMonth}
      onMonthChange={handleMonthChange}
      showOutsideDays={showOutsideDays}
      hideNavigation
      className={cn('p-ws-5 w-fit', className)}
      classNames={Object.fromEntries(
        Object.entries(calendarClassNames).map(([key, value]) => [
          key,
          cn(
            value,
            key === 'day_button' && calendarMotionVariants({ enabled: motion }),
            classNames?.[key as keyof typeof classNames],
          ),
        ]),
      )}
      components={{
        MonthCaption: ({ calendarMonth }) => (
          <CalendarMonthCaption
            calendarMonth={calendarMonth}
            displayMonth={currentMonth}
            numberOfMonths={props.numberOfMonths}
            onMonthChange={handleMonthChange}
            onMonthSelect={onMonthSelect}
            onYearSelect={onYearSelect}
            yearsPerPage={yearsPerPage}
            ariaLabels={monthCaptionAriaLabels}
            monthGridLabels={monthGridLabels}
            yearGridLabels={yearGridLabels}
            defaultMotion={motion}
          />
        ),
        ...components,
      }}
      footer={footer && <CalendarFooter footer={footer} />}
      data-slot="calendar"
      {...props}
    />
  );
};
Calendar.displayName = 'Calendar';

export { Calendar };
