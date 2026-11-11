import { RiDeleteBinLine } from '@remixicon/react';
import { Button, FormField, Select, Textarea, TextInput } from '@wideset/react';
import { useId } from 'react';

import { type Field, type Step, STEP_TYPES } from './data';

/** One setting: a select, a line of text or a message, with what it still needs under it. */
function StepField({
  id,
  field,
  value,
  onChange,
}: {
  id: string;
  field: Field;
  value: string;
  onChange: (value: string) => void;
}) {
  // The step is saved as it is, so a field it cannot run without says so at once, like its node.
  const error = field.missing && !value.trim() ? field.missing : undefined;
  const variant = error ? 'danger' : 'primary';

  return (
    <FormField label={field.label} htmlFor={id} helperText={field.helperText} errorText={error}>
      {field.control === 'select' ? (
        <Select
          id={id}
          size="sm"
          className="w-full"
          variant={variant}
          options={field.options ?? []}
          placeholder={field.placeholder}
          value={value}
          onValueChange={onChange}
        />
      ) : field.control === 'textarea' ? (
        <Textarea
          id={id}
          size="sm"
          rows={4}
          resize="vertical"
          variant={variant}
          placeholder={field.placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <TextInput
          id={id}
          size="sm"
          variant={variant}
          placeholder={field.placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </FormField>
  );
}

/**
 * The selected step's settings, 22rem beside the canvas and split from it by a line: what kind of
 * step it is and what it does, its fields (saved as they change), and Delete step at the foot. The
 * trigger has no Delete: a workflow always starts with one.
 */
export function StepPanel({
  step,
  onFieldsChange,
  onDelete,
}: {
  step: Step;
  onFieldsChange: (fields: Record<string, string>) => void;
  onDelete: () => void;
}) {
  const id = useId();
  const { label, description, icon: Icon, fields } = STEP_TYPES[step.kind];

  return (
    <aside
      aria-labelledby={`${id}-title`}
      className="border-ws-static-subtle flex w-[22rem] shrink-0 flex-col border-l"
    >
      <div className="gap-ws-7 px-ws-11 pt-ws-11 pb-ws-9 flex items-start">
        <span className="size-ws-14 rounded-ws-control-lg bg-ws-static-alpha-subtle flex shrink-0 items-center justify-center">
          <Icon aria-hidden="true" className="size-ws-9 text-ws-static-base" />
        </span>
        <div className="gap-ws-2 flex min-w-0 flex-col">
          <h2 id={`${id}-title`} className="typography-label-strong-md text-ws-static-strong">
            {label}
          </h2>
          <p className="typography-body-sm text-ws-static-subtle">{description}</p>
        </div>
      </div>

      {/* Keyed by step, so a field never shows the last step's value while the panel swaps. */}
      <div
        key={step.id}
        className="gap-ws-11 px-ws-11 pb-ws-11 pt-ws-5 flex min-h-0 flex-1 flex-col overflow-y-auto"
      >
        {fields.map((field) => (
          <StepField
            key={field.name}
            id={`${id}-${field.name}`}
            field={field}
            value={step.fields[field.name] ?? ''}
            onChange={(value) => onFieldsChange({ ...step.fields, [field.name]: value })}
          />
        ))}
      </div>

      <div className="border-ws-static-subtle px-ws-11 py-ws-9 shrink-0 border-t">
        {step.kind === 'trigger' ? (
          <p className="typography-body-sm text-ws-static-subtle">
            Every workflow starts with a trigger. Change what starts it instead of deleting it.
          </p>
        ) : (
          <Button variant="secondary" preset="border" size="sm" onClick={onDelete}>
            <Button.Icon icon={RiDeleteBinLine} />
            Delete step
          </Button>
        )}
      </div>
    </aside>
  );
}
