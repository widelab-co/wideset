const price = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const date = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

const list = new Intl.ListFormat('en-US', { type: 'conjunction' });

/** A list price in whole dollars: "$573". */
export const formatPrice = (dollars: number) => price.format(dollars);

/** The day a source was published, from its ISO date: "Oct 14, 2026". */
export const formatDate = (iso: string) => date.format(new Date(iso));

/** Things in a sentence: "the comparison and finding 2". */
export const formatList = (items: string[]) => list.format(items);
