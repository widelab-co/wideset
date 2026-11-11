import { RiAddLine } from '@remixicon/react';
import { Button, Checkbox } from '@wideset/react';

import { OPTION_LIMIT, type ProductDraft, variantNames } from './data';
import { FormSection } from './form-section';
import { OPTION_GRID, OptionRow } from './option-row';
import { VariantsTable } from './variants-table';

type OptionsSectionProps = {
  id: string;
  draft: ProductDraft;
  onChange: (patch: Partial<ProductDraft>) => void;
};

/** A quiet label over a column of the option rows; the fields carry their own names. */
const COLUMN_LABEL = 'typography-label-strong-sm text-ws-static-strong';

/**
 * Sizes, colours and other choices. The checkbox reveals them; each option is a row of values, and
 * the variants they make follow underneath, each with its price and stock. Up to three options,
 * as most catalogues allow.
 */
export function OptionsSection({ id, draft, onChange }: OptionsSectionProps) {
  const names = variantNames(draft.options);
  const nameId = (optionId: string) => `${id}-option-${optionId}`;

  const addOption = () => {
    const option = { id: String(Date.now()), name: '', values: [] };
    onChange({ options: [...draft.options, option] });
    // The row renders on the next frame; start in its name.
    requestAnimationFrame(() => document.getElementById(nameId(option.id))?.focus());
  };

  return (
    <FormSection
      title="Options"
      description="Sizes, colours or other choices a customer picks from."
    >
      <Checkbox
        size="sm"
        label="This product has options"
        description="Each combination of values becomes a variant with its own price and stock."
        checked={draft.hasOptions}
        onCheckedChange={(on) => {
          const hasOptions = on === true;
          onChange(
            hasOptions && draft.options.length === 0
              ? { hasOptions, options: [{ id: 'size', name: 'Size', values: [] }] }
              : { hasOptions },
          );
        }}
      />

      {draft.hasOptions && (
        <>
          <div className="gap-ws-7 flex flex-col">
            <div aria-hidden="true" className={OPTION_GRID}>
              <span className={COLUMN_LABEL}>Option</span>
              <span className={COLUMN_LABEL}>Values</span>
            </div>
            {draft.options.map((option) => (
              <OptionRow
                key={option.id}
                nameId={nameId(option.id)}
                option={option}
                onChange={(next) =>
                  onChange({ options: draft.options.map((o) => (o.id === next.id ? next : o)) })
                }
                onRemove={() =>
                  onChange({ options: draft.options.filter((o) => o.id !== option.id) })
                }
              />
            ))}
            {draft.options.length < OPTION_LIMIT && (
              <div>
                <Button size="sm" variant="secondary" preset="border" onClick={addOption}>
                  <Button.Icon icon={RiAddLine} />
                  Add another option
                </Button>
              </div>
            )}
          </div>

          {names.length > 0 && (
            <VariantsTable
              draft={draft}
              names={names}
              onChange={(name, fields) =>
                onChange({ variants: { ...draft.variants, [name]: fields } })
              }
            />
          )}
        </>
      )}
    </FormSection>
  );
}
