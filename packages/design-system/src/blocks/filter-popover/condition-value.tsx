import { DatePicker, DateRangePicker, MultiSelect, Select, TextInput } from '@wideset/react';

import { type Condition, FIELDS } from './conditions';
import { TODAY } from './data';

/** The sample's own today as a local Date, for the calendars: drop it to follow the clock. */
const [year, month, day] = TODAY.split('-').map(Number);
const SAMPLE_TODAY = new Date(year, month - 1, day);
const DATE_FORMAT = 'MMM d, yyyy';

/** How a list field's choices are named: in a placeholder, and in the summary past two ("3 owners"). */
const NOUN: Record<string, { one: string; many: string }> = {
  stage: { one: 'a stage', many: 'stages' },
  owner: { one: 'an owner', many: 'owners' },
  customer: { one: 'a customer', many: 'customers' },
};

/**
 * A condition's value, in the control its field and test call for: one option from a list (is,
 * is not), several (is any of), an amount in dollars, one day (before, after) or two (between).
 * Every control fills its column of the row.
 */
export function ConditionValue({
  condition,
  onChange,
}: {
  condition: Condition;
  onChange: (next: Partial<Condition>) => void;
}) {
  const { field, operator } = condition;
  const { label, kind, options = [] } = FIELDS[field];
  const name = `${label} value`;

  if (kind === 'amount') {
    return (
      <TextInput
        size="sm"
        inputMode="numeric"
        autoComplete="off"
        placeholder="0"
        value={condition.amount}
        onChange={(event) => onChange({ amount: event.target.value.replace(/[^\d.,]/g, '') })}
        className="w-full"
      >
        <TextInput.Prefix>$</TextInput.Prefix>
        <TextInput.Input aria-label={name} className="tabular-nums" />
      </TextInput>
    );
  }

  if (kind === 'date') {
    return operator === 'between' ? (
      <DateRangePicker
        size="sm"
        aria-label={name}
        placeholder="Pick the days"
        dateFormat={DATE_FORMAT}
        weekStartsOn={1}
        today={SAMPLE_TODAY}
        defaultMonth={SAMPLE_TODAY}
        selected={{ from: condition.from, to: condition.to }}
        onSelect={(range) => onChange({ from: range?.from, to: range?.to })}
        className="w-full"
      />
    ) : (
      <DatePicker
        size="sm"
        aria-label={name}
        placeholder="Pick a day"
        dateFormat={DATE_FORMAT}
        weekStartsOn={1}
        today={SAMPLE_TODAY}
        defaultMonth={SAMPLE_TODAY}
        selected={condition.from}
        onSelect={(from) => onChange({ from })}
        className="w-full"
      />
    );
  }

  return operator === 'anyOf' ? (
    <MultiSelect
      size="sm"
      aria-label={name}
      placeholder={`Choose ${NOUN[field].many}`}
      options={options}
      value={condition.values}
      onValueChange={(values) => onChange({ values })}
      maxVisibleTags={2}
      multiValuesLabel={NOUN[field].many}
      hasSearch={options.length > 6}
      className="w-full"
    />
  ) : (
    <Select
      size="sm"
      preset="border"
      aria-label={name}
      placeholder={`Choose ${NOUN[field].one}`}
      options={options}
      value={condition.values[0] ?? ''}
      onValueChange={(value) => onChange({ values: value ? [value] : [] })}
      hasSearch={options.length > 6}
      className="w-full"
    />
  );
}
