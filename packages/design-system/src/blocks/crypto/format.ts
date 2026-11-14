// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';

const usd = new Intl.NumberFormat(LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const coin = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 8 });
const rate = new Intl.NumberFormat(LOCALE, { maximumSignificantDigits: 4 });
const compact = new Intl.NumberFormat(LOCALE, { notation: 'compact' });
const percent = new Intl.NumberFormat(LOCALE, { style: 'percent', maximumFractionDigits: 2 });
const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' });

export const formatUsd = (value: number) => `${usd.format(value)} USD`;
export const formatCompactUsd = (value: number) => `${compact.format(value)} USD`;
export const formatCoin = (value: number, unit: string) => `${coin.format(value)} ${unit}`;
export const formatRate = (value: number) => rate.format(value);
export const formatPercent = (value: number) => percent.format(value);
export const formatTime = (iso: string) => time.format(new Date(iso));

export const formatValue = (value: number, unit: string) =>
  unit === 'percent'
    ? formatPercent(value)
    : unit === 'USD'
      ? formatUsd(value)
      : formatCoin(value, unit);
