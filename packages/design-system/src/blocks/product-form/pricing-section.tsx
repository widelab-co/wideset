import { FormField, Select } from '@wideset/react';

import { type ProductDraft, taxClasses } from './data';
import { FormSection } from './form-section';
import { formatPercent, formatUsd, parseAmount } from './format';
import { MoneyInput } from './money-input';
import type { Errors } from './validate';

type PricingSectionProps = {
  id: string;
  draft: ProductDraft;
  errors: Errors;
  onChange: (patch: Partial<ProductDraft>) => void;
};

/** What the margin line says: the profit and the margin while both figures are in, a hint until. */
function marginLine(priceText: string, costText: string) {
  const price = parseAmount(priceText);
  const cost = parseAmount(costText);
  if (!(price > 0) || !(cost >= 0)) return 'Add a price and a cost to see the margin.';
  const profit = price - cost;
  return `${formatUsd(profit)} profit on each sale, a ${formatPercent(profit / price)} margin.`;
}

/**
 * What it sells for and what it costs: the price with an optional earlier price to show a
 * discount, the cost customers never see, and the tax a sale carries. The margin follows the
 * price and the cost as they are typed, in one quiet line.
 */
export function PricingSection({ id, draft, errors, onChange }: PricingSectionProps) {
  return (
    <FormSection
      title="Pricing"
      description="What customers pay, and what each sale leaves Lumen Studio."
    >
      <div className="gap-x-ws-9 gap-y-ws-11 grid grid-cols-2 items-start">
        <FormField label="Price" htmlFor={`${id}-price`} required errorText={errors.price}>
          <MoneyInput
            id={`${id}-price`}
            name="price"
            required
            invalid={Boolean(errors.price)}
            value={draft.price}
            onChange={(price) => onChange({ price })}
          />
        </FormField>
        <FormField
          label="Compare-at price"
          htmlFor={`${id}-compare-at`}
          helperText="The price before a discount, shown struck through."
        >
          <MoneyInput
            id={`${id}-compare-at`}
            name="compareAt"
            value={draft.compareAt}
            onChange={(compareAt) => onChange({ compareAt })}
          />
        </FormField>
        <FormField
          label="Cost per item"
          htmlFor={`${id}-cost`}
          helperText="Lumen Studio’s cost. Customers don’t see it."
        >
          <MoneyInput
            id={`${id}-cost`}
            name="cost"
            value={draft.cost}
            onChange={(cost) => onChange({ cost })}
          />
        </FormField>
        <FormField label="Tax class" htmlFor={`${id}-tax`}>
          <Select
            id={`${id}-tax`}
            name="taxClass"
            size="sm"
            preset="border"
            className="w-full"
            options={taxClasses}
            value={draft.taxClass}
            onValueChange={(taxClass) => onChange({ taxClass })}
          />
        </FormField>
      </div>
      <p aria-live="polite" className="typography-body-md text-ws-static-base tabular-nums">
        {marginLine(draft.price, draft.cost)}
      </p>
    </FormSection>
  );
}
