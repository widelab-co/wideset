export type Coin = 'BTC' | 'ETH' | 'XRP';

export const NAV = [
  { label: 'Overview', href: '#overview' },
  { label: 'Transactions', href: '#transactions' },
  { label: 'Fees', href: '#fees' },
  { label: 'Charts', href: '#charts' },
];

export const ACCOUNT = { name: 'Andrew Tang', initials: 'AT' };

/** Spot prices in USD; the swap form converts with them. */
export const PRICES: Record<Coin, number> = { BTC: 105_253.9, ETH: 3_401.365, XRP: 2.24 };

export const COINS: { coin: Coin; name: string }[] = [
  { coin: 'BTC', name: 'Bitcoin' },
  { coin: 'ETH', name: 'Ethereum' },
  { coin: 'XRP', name: 'XRP' },
];

export const QUOTE = {
  sell: { coin: 'BTC' as Coin, amount: '0.39' },
  buy: { coin: 'ETH' as Coin, amount: '12' },
  summary: [
    { label: 'Estimate fee', value: 0.005, unit: 'percent' },
    { label: 'You will receive', value: 3_402.8, unit: 'USD' },
    { label: 'Spread', value: 0.002, unit: 'percent' },
    { label: 'Gas fee', value: 0.00045, unit: 'ETH' },
  ],
  advanced: [
    { label: 'Price impact', value: 0.0004, unit: 'percent' },
    { label: 'Minimum received', value: 11.94, unit: 'ETH' },
  ],
} as const;

/** Wallet value at the end of each month, in USD. */
export const MONTHLY_BALANCE = [
  { month: 'Jan', usd: 24_700 },
  { month: 'Feb', usd: 52_000 },
  { month: 'Mar', usd: 21_000 },
  { month: 'Apr', usd: 46_300 },
  { month: 'May', usd: 59_300 },
  { month: 'Jun', usd: 40_000 },
  { month: 'Jul', usd: 24_700 },
  { month: 'Aug', usd: 36_000 },
];

export const TRANSACTIONS: {
  id: string;
  amount: number;
  coin: Coin;
  direction: 'sent' | 'received';
  address: string;
  at: string;
}[] = [
  {
    id: 'tx-1',
    amount: 0.0020009,
    coin: 'BTC',
    direction: 'sent',
    address: 'dk2de',
    at: '2026-11-06T16:50',
  },
  {
    id: 'tx-2',
    amount: 0.03,
    coin: 'ETH',
    direction: 'sent',
    address: 'r224s1',
    at: '2026-11-06T14:30',
  },
  {
    id: 'tx-3',
    amount: 0.0020009,
    coin: 'BTC',
    direction: 'sent',
    address: 'y8349',
    at: '2026-11-06T12:22',
  },
  {
    id: 'tx-4',
    amount: 0.0020009,
    coin: 'BTC',
    direction: 'sent',
    address: 'y8349',
    at: '2026-11-06T12:22',
  },
];

/** Holdings by asset; `color` picks the chart colour in Distribution. */
export const DISTRIBUTION = [
  { name: 'Bitcoin', usd: 6_074.72, share: 0.41, color: 'violet' },
  { name: 'Ethereum', usd: 4_741.24, share: 0.32, color: 'pink' },
  { name: 'XRP', usd: 2_370.62, share: 0.16, color: 'pinkSubtle' },
  { name: 'Other', usd: 1_629.8, share: 0.11, color: 'neutral' },
] as const;
