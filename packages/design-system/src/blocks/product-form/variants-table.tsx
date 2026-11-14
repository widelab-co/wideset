import { Table, TextInput } from '@wideset/react';

import { type ProductDraft, type Variant, type VariantFields, variantFields } from './data';
import { MoneyInput } from './money-input';

type VariantsTableProps = {
  draft: ProductDraft;
  variants: Variant[];
  onChange: (variant: Variant, fields: VariantFields) => void;
};

/**
 * Every combination the options make, one row each, with its own price and, while stock is
 * tracked, its own count. A new variant starts at the product's price. The figures are fields
 * right-aligned in their column, so they read as numbers, not as a form.
 */
export function VariantsTable({ draft, variants, onChange }: VariantsTableProps) {
  return (
    <Table size="sm" aria-label="Variants" className="w-full">
      <Table.Head>
        <Table.Row>
          <Table.Header flushMargin className="w-full">
            Variant
          </Table.Header>
          <Table.Header align="right">Price</Table.Header>
          {draft.trackStock && (
            <Table.Header align="right" flushMargin>
              Stock
            </Table.Header>
          )}
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {variants.map((variant) => {
          const { name } = variant;
          const fields = variantFields(draft, variant);
          return (
            <Table.Row key={variant.key}>
              <Table.Cell flushMargin className="text-ws-static-strong">
                {name}
              </Table.Cell>
              <Table.Cell align="right" flushMargin={!draft.trackStock}>
                <MoneyInput
                  aria-label={`Price of ${name}`}
                  alignEnd
                  className="w-[8rem]"
                  value={fields.price}
                  onChange={(price) => onChange(variant, { ...fields, price })}
                />
              </Table.Cell>
              {draft.trackStock && (
                <Table.Cell align="right" flushMargin>
                  <TextInput
                    size="sm"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="0"
                    aria-label={`Stock of ${name}`}
                    className="w-[6rem]"
                    value={fields.stock}
                    onChange={(event) =>
                      onChange(variant, { ...fields, stock: event.target.value.replace(/\D/g, '') })
                    }
                  >
                    <TextInput.Input className="text-right tabular-nums" />
                  </TextInput>
                </Table.Cell>
              )}
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}
