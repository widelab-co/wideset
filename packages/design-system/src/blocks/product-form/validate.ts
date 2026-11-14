import { type ProductDraft, variantFields, variantNames } from './data';
import { parseAmount } from './format';

/** The fields a save can stop at, in the order they sit on the page. */
export type ErrorField = 'name' | 'photos' | 'price';
export type Errors = Partial<Record<ErrorField, string>>;

/** What each missing thing is called in the summary at the top. */
export const MISSING: Record<ErrorField, string> = {
  name: 'a name',
  photos: 'a photo',
  price: 'a price',
};

/**
 * What stops a save. A draft only needs a name, so it can be found in the catalogue again;
 * publishing also needs a price (on every variant, when there are options) and a photo for the
 * cover, since that is what a customer sees first.
 */
export function validate(draft: ProductDraft, publishing: boolean): Errors {
  const errors: Errors = {};
  if (!draft.name.trim()) errors.name = 'Enter the product’s name.';
  if (!publishing) return errors;

  if (draft.photos.length === 0) errors.photos = 'Add at least one photo for the cover.';

  const prices = draft.hasOptions
    ? variantNames(draft.options).map((name) => variantFields(draft, name).price)
    : [draft.price];
  if (!(parseAmount(draft.price) > 0)) errors.price = 'Enter a price above $0.00.';
  else if (prices.some((price) => !(parseAmount(price) > 0)))
    errors.price = 'Give every variant a price above $0.00, under Options.';
  return errors;
}
