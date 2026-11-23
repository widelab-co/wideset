// TODO(custom): one condition of a filter builder (join word, field, test, value, remove); Wideset has no filter builder, only FilterButton for one field and a short list.
import { RiCloseLine } from '@remixicon/react';
import { IconButton, Select } from '@wideset/react';
import { useEffect, useRef } from 'react';

import { ConditionValue } from './condition-value';
import {
  blank,
  type Condition,
  FIELD_IDS,
  FIELDS,
  type Join,
  type Operator,
  OPERATORS,
} from './conditions';

/** The row's columns, the same in every row so fields, tests and values line up. */
const ROW = 'gap-ws-5 grid grid-cols-[4.5rem_9rem_8.5rem_minmax(0,1fr)_auto] items-center';

const FIELD_OPTIONS = FIELD_IDS.map((id) => ({ value: id, label: FIELDS[id].label }));
const JOIN_OPTIONS = [
  { value: 'and', label: 'and' },
  { value: 'or', label: 'or' },
];

type ConditionRowProps = {
  condition: Condition;
  /** Its place in the filter: the first reads "Where", the second holds the join, the rest repeat it. */
  index: number;
  join: Join;
  onJoinChange: (join: Join) => void;
  onChange: (condition: Condition) => void;
  onRemove: () => void;
  /** Its field takes the focus when it appears: the row just added. */
  focusOnMount?: boolean;
};

/**
 * One condition as a sentence: where (or the join word) · field · test · value · remove. A new
 * field starts the row again on its first test, since the old value means nothing to it; a new
 * test keeps what still fits (one option of several, the first day of two).
 */
export function ConditionRow({
  condition,
  index,
  join,
  onJoinChange,
  onChange,
  onRemove,
  focusOnMount,
}: ConditionRowProps) {
  const row = useRef<HTMLDivElement>(null);
  // The row just added hands the keyboard its first choice, the field.
  useEffect(() => {
    if (focusOnMount) row.current?.querySelector<HTMLElement>('[aria-label="Field"]')?.focus();
  }, [focusOnMount]);

  const { field, operator } = condition;
  const fieldLabel = FIELDS[field].label;
  const set = (next: Partial<Condition>) => onChange({ ...condition, ...next });

  const setOperator = (next: Operator) =>
    set({
      operator: next,
      values: next === 'anyOf' ? condition.values : condition.values.slice(0, 1),
      to: next === 'between' ? condition.to : undefined,
    });

  return (
    <div ref={row} role="group" aria-label={`Condition ${index + 1}`} className={ROW}>
      {index === 1 ? (
        <Select
          size="sm"
          preset="border"
          aria-label="Match conditions with"
          options={JOIN_OPTIONS}
          value={join}
          onValueChange={(value) => onJoinChange(value as Join)}
          className="w-full"
        />
      ) : (
        <span className="typography-label-sm text-ws-static-subtle px-ws-7">
          {index === 0 ? 'Where' : join}
        </span>
      )}
      <Select
        size="sm"
        preset="border"
        aria-label="Field"
        options={FIELD_OPTIONS}
        value={field}
        onValueChange={(value) =>
          onChange({ ...blank(value as Condition['field']), id: condition.id })
        }
        className="w-full"
      />
      <Select
        size="sm"
        preset="border"
        aria-label={`${fieldLabel} test`}
        options={OPERATORS[FIELDS[field].kind]}
        value={operator}
        onValueChange={(value) => setOperator(value as Operator)}
        className="w-full"
      />
      <ConditionValue condition={condition} onChange={set} />
      <IconButton
        icon={RiCloseLine}
        variant="secondary"
        preset="ghost"
        size="sm"
        aria-label={`Remove the ${fieldLabel.toLowerCase()} condition`}
        onClick={onRemove}
      />
    </div>
  );
}
