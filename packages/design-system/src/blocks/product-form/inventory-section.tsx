import { Checkbox, FormField, TextInput } from '@wideset/react';

import type { ProductDraft } from './data';
import { FormSection } from './form-section';

type InventorySectionProps = {
  id: string;
  draft: ProductDraft;
  onChange: (patch: Partial<ProductDraft>) => void;
};

/**
 * How the product is counted: its stock number for packing slips, how many are on the shelf and
 * whether Orbit counts them at all. With options, stock is kept per variant, so the field here
 * steps back and says where it went.
 */
export function InventorySection({ id, draft, onChange }: InventorySectionProps) {
  const stockHelp = !draft.trackStock
    ? 'Turn on Track stock to count it.'
    : draft.hasOptions
      ? 'Kept per variant, under Options.'
      : undefined;

  return (
    <FormSection title="Inventory" description="How Orbit keeps count of what is on the shelf.">
      <div className="gap-x-ws-9 grid grid-cols-2 items-start">
        <FormField
          label="SKU"
          htmlFor={`${id}-sku`}
          helperText="The stock number on packing slips and invoices."
        >
          <TextInput
            id={`${id}-sku`}
            name="sku"
            size="sm"
            autoComplete="off"
            value={draft.sku}
            onChange={(event) => onChange({ sku: event.target.value.toUpperCase() })}
          />
        </FormField>
        <FormField label="Stock" htmlFor={`${id}-stock`} helperText={stockHelp}>
          <TextInput
            id={`${id}-stock`}
            name="stock"
            size="sm"
            inputMode="numeric"
            autoComplete="off"
            placeholder="0"
            disabled={Boolean(stockHelp)}
            value={stockHelp ? '' : draft.stock}
            onChange={(event) => onChange({ stock: event.target.value.replace(/\D/g, '') })}
          >
            <TextInput.Input className="tabular-nums" />
          </TextInput>
        </FormField>
      </div>
      {/* Sent with the form, so a checkbox: a switch would promise it applies at once. */}
      <Checkbox
        size="sm"
        label="Track stock"
        description="Orbit stops selling a variant once none are left."
        checked={draft.trackStock}
        onCheckedChange={(on) => onChange({ trackStock: on === true })}
      />
    </FormSection>
  );
}
