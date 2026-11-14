import { FormField, Select, Textarea, TextInput } from '@wideset/react';

import { categories, DESCRIPTION_LIMIT, type ProductDraft } from './data';
import { FormSection } from './form-section';
import { formatCount } from './format';
import type { Errors } from './validate';

type DetailsSectionProps = {
  /** Prefix for the field ids, so a failed save can focus one. */
  id: string;
  draft: ProductDraft;
  errors: Errors;
  onChange: (patch: Partial<ProductDraft>) => void;
};

/**
 * What the product is: its name, the line under it in lists, the longer description with a count
 * of what is left, and where it sits in the catalogue. The name is the one field a draft needs.
 */
export function DetailsSection({ id, draft, errors, onChange }: DetailsSectionProps) {
  return (
    <FormSection
      title="Details"
      description="What customers read about it, in lists and on its page."
    >
      <FormField label="Name" htmlFor={`${id}-name`} required errorText={errors.name}>
        <TextInput
          id={`${id}-name`}
          name="name"
          size="sm"
          required
          autoComplete="off"
          variant={errors.name ? 'danger' : 'primary'}
          value={draft.name}
          onChange={(event) => onChange({ name: event.target.value })}
        />
      </FormField>
      <FormField
        label="Short description"
        htmlFor={`${id}-summary`}
        helperText="One line under the name in lists and on quotes."
      >
        <TextInput
          id={`${id}-summary`}
          name="summary"
          size="sm"
          maxLength={120}
          autoComplete="off"
          value={draft.summary}
          onChange={(event) => onChange({ summary: event.target.value })}
        />
      </FormField>
      <FormField
        label="Description"
        htmlFor={`${id}-description`}
        aside={
          <span className="tabular-nums">
            {formatCount(draft.description.length)} / {formatCount(DESCRIPTION_LIMIT)}
          </span>
        }
      >
        <Textarea
          id={`${id}-description`}
          name="description"
          size="sm"
          rows={6}
          maxLength={DESCRIPTION_LIMIT}
          value={draft.description}
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </FormField>
      <div className="gap-ws-9 grid grid-cols-2">
        <FormField label="Category" htmlFor={`${id}-category`}>
          <Select
            id={`${id}-category`}
            name="category"
            size="sm"
            preset="border"
            className="w-full"
            placeholder="Choose a category"
            options={categories}
            value={draft.category}
            onValueChange={(category) => onChange({ category })}
          />
        </FormField>
      </div>
    </FormSection>
  );
}
