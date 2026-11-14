// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';

const usd = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'USD' });
const decimal = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const percent = new Intl.NumberFormat(LOCALE, { style: 'percent', maximumFractionDigits: 1 });
const count = new Intl.NumberFormat(LOCALE);

/** Money is kept in whole cents: 14900 → $149.00. */
export const formatUsd = (cents: number) => usd.format(cents / 100);
/** The same without the sign, for a field that shows `$` beside it: 14900 → 149.00. */
export const formatAmount = (cents: number) => decimal.format(cents / 100);
/** What was typed into such a field, in cents: `1,299.5` → 129950. Empty or not a number: NaN. */
export const parseAmount = (text: string) =>
  text.trim() ? Math.round(Number(text.replace(/,/g, '')) * 100) : NaN;
/** 0.584 → 58.4%. */
export const formatPercent = (rate: number) => percent.format(rate);
/** 1000 → 1,000. */
export const formatCount = (value: number) => count.format(value);

/** "a name", "a name and a price", "a name, a price and a photo". */
export const listSentence = (items: string[]) =>
  items.length < 2
    ? (items[0] ?? '')
    : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
