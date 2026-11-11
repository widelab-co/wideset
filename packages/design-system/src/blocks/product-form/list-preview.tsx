import { RiImageAddLine, RiImageLine } from '@remixicon/react';
import { Card } from '@wideset/react';

import { type ProductDraft, variantFields, variantNames } from './data';
import { FormSection } from './form-section';
import { formatUsd, parseAmount } from './format';

/** The price a list shows: one figure, or the lowest with "From" when the variants differ. */
function priceOf(draft: ProductDraft) {
  const names = draft.hasOptions ? variantNames(draft.options) : [];
  const prices = (
    names.length > 0 ? names.map((name) => variantFields(draft, name).price) : [draft.price]
  )
    .map(parseAmount)
    .filter((cents) => cents > 0);
  if (prices.length === 0) return null;
  const low = Math.min(...prices);
  return {
    label: low === Math.max(...prices) ? formatUsd(low) : `From ${formatUsd(low)}`,
    low,
  };
}

/**
 * The product as the catalogue will list it: the cover, the name, the line under it and the
 * price, redrawn on every keystroke. Blocks ship no images, so the cover is the same neutral
 * tile as in Media; with no photo it says so.
 */
export function ListPreview({ draft }: { draft: ProductDraft }) {
  const price = priceOf(draft);
  const compareAt = parseAmount(draft.compareAt);
  const name = draft.name.trim();
  const cover = draft.photos[0];

  return (
    <FormSection title="Preview" description="How it shows in the catalogue.">
      <Card>
        <Card.Media
          ratio="16/9"
          className="bg-ws-static-alpha-subtle gap-ws-3 flex flex-col items-center justify-center"
        >
          {cover ? (
            <RiImageLine
              role="img"
              aria-label={`Cover: ${cover.name}`}
              className="size-ws-12 text-ws-static-subtle"
            />
          ) : (
            <>
              <RiImageAddLine aria-hidden="true" className="size-ws-12 text-ws-static-subtle" />
              <span className="typography-caption-md text-ws-static-subtle">No cover yet</span>
            </>
          )}
        </Card.Media>
        <Card.Content contentClassName="pr-ws-6">
          <div className="gap-ws-5 flex flex-col">
            <div className="gap-ws-2 flex flex-col">
              <p
                className={
                  name
                    ? 'typography-label-strong-md text-ws-static-strong'
                    : 'typography-label-strong-md text-ws-static-subtle'
                }
              >
                {name || 'Product name'}
              </p>
              {draft.summary.trim() && (
                <p className="typography-body-sm text-ws-static-subtle line-clamp-2">
                  {draft.summary}
                </p>
              )}
            </div>
            <p className="gap-ws-3 flex items-baseline tabular-nums">
              {price ? (
                <span className="typography-label-strong-md text-ws-static-strong">
                  {price.label}
                </span>
              ) : (
                <span className="typography-label-md text-ws-static-subtle">No price yet</span>
              )}
              {price && compareAt > price.low && (
                <s className="typography-label-sm text-ws-static-subtle">{formatUsd(compareAt)}</s>
              )}
            </p>
          </div>
        </Card.Content>
      </Card>
    </FormSection>
  );
}
