import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiContactsBook3Line,
  RiHandCoinLine,
  RiHome5Line,
  RiInbox2Line,
  RiKey2Line,
  RiLineChartLine,
  RiPieChart2Line,
  RiPlugLine,
  RiPriceTag3Fill,
  RiPriceTag3Line,
  RiQuestionLine,
  RiSettings3Line,
  RiTeamLine,
} from '@remixicon/react';

/*
  A product being added to Lumen Studio's catalogue: a wall mount for the Lumen Display and the
  Lumen Hub it already sells (see Orders), in three sizes. It is half way: the details, three
  photos and the prices are in, nothing is saved yet. Today is 10 November 2026. The fields hold
  what was typed, as text; money is read from them into whole cents when a figure is needed.
*/

/** The product is Orbit; the workspace selling through it is Lumen Studio. */
export const product = { name: 'Orbit' };
export const workspace = { name: 'Lumen Studio', initials: 'LS' };
export const account = { name: 'Maya Okafor', email: 'maya@lumenstudio.co', initials: 'MO' };

export type NavLink = {
  id: string;
  label: string;
  icon: RemixiconComponentType;
  /** The icon while the page is open (a line icon swaps for its fill). */
  activeIcon?: RemixiconComponentType;
};

export const mainLinks: NavLink[] = [
  { id: 'home', label: 'Home', icon: RiHome5Line },
  { id: 'inbox', label: 'Inbox', icon: RiInbox2Line },
  { id: 'customers', label: 'Customers', icon: RiContactsBook3Line },
  { id: 'deals', label: 'Deals', icon: RiHandCoinLine },
  { id: 'catalogue', label: 'Catalogue', icon: RiPriceTag3Line, activeIcon: RiPriceTag3Fill },
  { id: 'revenue', label: 'Revenue', icon: RiLineChartLine },
  { id: 'reports', label: 'Reports', icon: RiPieChart2Line },
];

export const settingsLinks: NavLink[] = [
  { id: 'general', label: 'General', icon: RiSettings3Line },
  { id: 'members', label: 'Members', icon: RiTeamLine },
  { id: 'billing', label: 'Billing', icon: RiBankCardLine },
  { id: 'integrations', label: 'Integrations', icon: RiPlugLine },
  { id: 'api-keys', label: 'API keys', icon: RiKey2Line },
];

export const helpLink: NavLink = { id: 'help', label: 'Help and support', icon: RiQuestionLine };

/** How the catalogue groups what Lumen Studio sells. */
export const categories = [
  { value: 'hardware', label: 'Hardware' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'licences', label: 'Licences' },
  { value: 'services', label: 'Services' },
];

/** Lumen Studio Ltd is a UK business: the VAT rate a sale carries. */
export const taxClasses = [
  { value: 'standard', label: 'Standard rate, 20%' },
  { value: 'reduced', label: 'Reduced rate, 5%' },
  { value: 'zero', label: 'Zero rate' },
  { value: 'exempt', label: 'Exempt' },
];

/** Where a published product can be bought. */
export const channels = [
  { id: 'store', label: 'Online store' },
  { id: 'quotes', label: 'Sales quotes' },
  { id: 'partners', label: 'Partner portal' },
];

/** The longest description the catalogue keeps. */
export const DESCRIPTION_LIMIT = 1000;
/** A product shows this many options at most, as most shops do. */
export const OPTION_LIMIT = 3;

export type Status = 'draft' | 'active';

/** A photo added to the product. Blocks ship no images, so it is known by its file name. */
export type Photo = { id: string; name: string };

/** A choice the buyer makes (Size) and the values it takes (S, M, L). */
export type ProductOption = { id: string; name: string; values: string[] };

/** What one variant sells for and how many are on the shelf, as typed. */
export type VariantFields = { price: string; stock: string };

export type ProductDraft = {
  name: string;
  /** One line under the name in lists. */
  summary: string;
  description: string;
  category: string;
  /** In order: the first is the cover. */
  photos: Photo[];
  price: string;
  compareAt: string;
  cost: string;
  taxClass: string;
  hasOptions: boolean;
  options: ProductOption[];
  /**
   * By variant key, the combination's values (`variantKey(['M', 'Black'])`), as typed: two
   * combinations never share an entry, even when their names read alike. See `variantFields` for
   * one not in here.
   */
  variants: Record<string, VariantFields>;
  sku: string;
  stock: string;
  trackStock: boolean;
  /** The ids of the channels it is sold in. */
  channels: string[];
};

export const initialDraft: ProductDraft = {
  name: 'Lumen Wall Mount',
  summary: 'Tilting wall mount for the Lumen Display and Lumen Hub.',
  description:
    'A steel mount that holds a Lumen Display or a Lumen Hub flat against the wall or tilted down by up to 15 degrees, so the camera above it sees the whole table. Cables run inside the arm and out of sight. Fixings for brick, concrete and plasterboard walls are in the box, with a paper template to drill by.\n\nS fits screens up to 32 inches, M up to 55 and L up to 75.',
  category: 'accessories',
  photos: [
    { id: 'front', name: 'mount-front.jpg' },
    { id: 'side', name: 'mount-side.jpg' },
    { id: 'room', name: 'mount-in-room.jpg' },
  ],
  price: '149.00',
  compareAt: '',
  cost: '62.00',
  taxClass: 'standard',
  hasOptions: true,
  options: [{ id: 'size', name: 'Size', values: ['S', 'M', 'L'] }],
  variants: {
    [variantKey(['S'])]: { price: '129.00', stock: '24' },
    [variantKey(['M'])]: { price: '149.00', stock: '40' },
    [variantKey(['L'])]: { price: '179.00', stock: '12' },
  },
  sku: 'LS-MNT-01',
  stock: '',
  trackStock: true,
  channels: ['store', 'quotes'],
};

/** A combination's identity: its values in option order, never its display name. */
export function variantKey(values: string[]) {
  return JSON.stringify(values);
}

/** One combination of option values: its key for the draft, its name for people. */
export type Variant = { key: string; name: string; values: string[] };

/**
 * The variants the options make: every combination of their values, in order ("S / Black",
 * "S / White", "M / Black"…). An option with no values yet adds nothing.
 */
export function variantsOf(options: ProductOption[]): Variant[] {
  return options
    .filter((option) => option.values.length > 0)
    .reduce<string[][]>(
      (combos, option) =>
        combos.length === 0
          ? option.values.map((value) => [value])
          : combos.flatMap((combo) => option.values.map((value) => [...combo, value])),
      [],
    )
    .map((values) => ({ key: variantKey(values), name: values.join(' / '), values }));
}

/**
 * A variant's price and stock: what was typed for it; else, for a new combination, the price of
 * the variant it grew from ("S / Black" from "S") or the product's, and no stock yet.
 */
export const variantFields = (draft: ProductDraft, variant: Variant): VariantFields =>
  draft.variants[variant.key] ?? {
    price: (draft.variants[variantKey(variant.values.slice(0, 1))] ?? draft).price,
    stock: '',
  };
