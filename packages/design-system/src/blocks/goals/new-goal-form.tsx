import { DatePicker, FormField, Select, TextInput } from '@wideset/react';
import { type FormEvent, useState } from 'react';

import { type Goal, type Measure, MEASURES, people, QUARTER, TODAY } from './data';
import { formatCount } from './format';
import { PersonAvatar } from './person-avatar';

const SAMPLE_TODAY = new Date(`${TODAY}T00:00`);

const MEASURE_OPTIONS = (Object.keys(MEASURES) as Measure[]).map((value) => ({
  value,
  label: MEASURES[value].label,
}));

const OWNER_OPTIONS = people.map((person) => ({
  value: person.id,
  label: person.name,
  prefix: (
    <PersonAvatar
      size="xs"
      name={person.name}
      initials={person.initials}
      color={person.color}
      aria-hidden
    />
  ),
}));

type Values = { name: string; measure: Measure; target: string; owner: string; due?: string };
type Field = Exclude<keyof Values, 'measure'>;

/** A typed target as a whole number: `300,000` → 300000. */
const parseTarget = (text: string) => Number(text.replace(/\D/g, '')) || 0;

type NewGoalFormProps = {
  /** The form's id: the submit button sits in the modal's footer and points at it with `form`. */
  id: string;
  /** Called with the new goal once every field holds something it can use. */
  onAdd: (goal: Omit<Goal, 'id'>) => void;
};

/**
 * A new goal in five fields: its name, what it counts, the target, who owns it and when it is
 * due. The target's unit follows the measure ($ for money, the count's noun otherwise) and
 * settles into thousands on leaving the field. Submitting names every empty field at the field
 * and moves focus to the first. A new goal starts counting today, so it opens on track.
 */
export function NewGoalForm({ id, onAdd }: NewGoalFormProps) {
  const [values, setValues] = useState<Values>({
    name: '',
    measure: 'revenue',
    target: '',
    owner: '',
    due: QUARTER.to,
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const { money, unit } = MEASURES[values.measure];

  const set = (patch: Partial<Values>) => {
    setValues((all) => ({ ...all, ...patch }));
    setErrors((all) => ({
      ...all,
      ...Object.fromEntries(Object.keys(patch).map((k) => [k, undefined])),
    }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = parseTarget(values.target);
    const owner = people.find((person) => person.id === values.owner);
    const found: Partial<Record<Field, string>> = {
      name: values.name.trim() ? undefined : 'Name the goal.',
      target: target > 0 ? undefined : 'Enter a target above zero.',
      owner: owner ? undefined : 'Choose who owns the goal.',
      due: values.due ? undefined : 'Pick a due date.',
    };
    setErrors(found);
    const first = (['name', 'target', 'owner', 'due'] as Field[]).find((field) => found[field]);
    if (first) document.getElementById(`${id}-${first}`)?.focus();
    else if (owner && values.due)
      onAdd({
        name: values.name.trim(),
        owner,
        measure: values.measure,
        target,
        counted: 0,
        keyResults: [],
        start: TODAY,
        due: values.due,
      });
  };

  return (
    <form id={id} noValidate onSubmit={submit} className="gap-ws-11 flex flex-col">
      <FormField label="Name" htmlFor={`${id}-name`} errorText={errors.name}>
        <TextInput
          id={`${id}-name`}
          name="name"
          required
          autoComplete="off"
          placeholder="e.g. Enterprise new business"
          value={values.name}
          onChange={(event) => set({ name: event.target.value })}
          variant={errors.name ? 'danger' : 'primary'}
        />
      </FormField>
      <div className="gap-ws-9 grid grid-cols-2 items-start">
        <FormField label="Measure" htmlFor={`${id}-measure`}>
          <Select
            id={`${id}-measure`}
            name="measure"
            className="w-full"
            options={MEASURE_OPTIONS}
            value={values.measure}
            onValueChange={(measure) => set({ measure: measure as Measure })}
          />
        </FormField>
        <FormField label="Target" htmlFor={`${id}-target`} errorText={errors.target}>
          <TextInput
            id={`${id}-target`}
            name="target"
            required
            inputMode="numeric"
            autoComplete="off"
            placeholder={money ? '100,000' : '20'}
            value={values.target}
            onChange={(event) => set({ target: event.target.value.replace(/[^\d,]/g, '') })}
            // Leaving the field settles what was typed: 300000 → 300,000.
            onBlur={() => {
              const target = parseTarget(values.target);
              if (target > 0) set({ target: formatCount(target) });
            }}
            variant={errors.target ? 'danger' : 'primary'}
          >
            {money && <TextInput.Prefix>$</TextInput.Prefix>}
            <TextInput.Input className="tabular-nums" />
            {unit && <TextInput.Suffix>{unit}</TextInput.Suffix>}
          </TextInput>
        </FormField>
      </div>
      <div className="gap-ws-9 grid grid-cols-2 items-start">
        <FormField label="Owner" htmlFor={`${id}-owner`} errorText={errors.owner}>
          <Select
            id={`${id}-owner`}
            name="owner"
            className="w-full"
            options={OWNER_OPTIONS}
            placeholder="Choose an owner"
            required
            value={values.owner}
            onValueChange={(owner) => set({ owner })}
            variant={errors.owner ? 'danger' : 'primary'}
          />
        </FormField>
        <FormField label="Due date" htmlFor={`${id}-due`} errorText={errors.due}>
          <DatePicker
            id={`${id}-due`}
            className="w-full"
            dateFormat="MMM d, yyyy"
            placeholder="Pick a due date"
            // The sample's own today, so the calendar agrees with the rest of the screen; drop
            // both to follow the clock.
            today={SAMPLE_TODAY}
            defaultMonth={SAMPLE_TODAY}
            disabledDates={{ before: SAMPLE_TODAY }}
            selected={values.due}
            onSelect={(due) => set({ due })}
            variant={errors.due ? 'danger' : 'primary'}
          />
        </FormField>
      </div>
    </form>
  );
}
