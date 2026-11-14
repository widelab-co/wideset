import {
  type RemixiconComponentType,
  RiAlignLeft,
  RiCalendarLine,
  RiFileLine,
  RiHashtag,
  RiPriceTag3Line,
  RiShieldKeyholeLine,
} from '@remixicon/react';
import type { AvatarColor, StatusBadgeProps, TagProps } from '@wideset/react';

export const TABLE = 'Clients';

/** The table's pages in the top bar. */
export const PAGES = [
  { label: 'Data', href: '#data' },
  { label: 'Forms', href: '#forms' },
  { label: 'Activity Log', href: '#activity' },
];

export const ACCOUNT: { name: string; initials: string; color: AvatarColor } = {
  name: 'Adam Smith',
  initials: 'AS',
  color: 'indigo',
};

export type Client = {
  id: number;
  name: string;
  customers?: number;
  country?: { label: string; color: TagProps['color'] };
  /** A calendar day, `2023-03-15`. */
  added?: string;
  employees?: number;
  market?: { label: string; color: StatusBadgeProps['color'] };
  website?: string;
  address?: string;
};

const ok = { label: 'No issues', color: 'positive' } as const;
const unchecked = { label: 'Unchecked', color: 'neutral' } as const;

const ROWS: Omit<Client, 'id'>[] = [
  {
    name: 'Tech Nova',
    customers: 23,
    country: { label: 'Brazil', color: 'pink' },
    added: '2023-03-15',
    employees: 58,
    market: ok,
    website: 'https://www.technova.com',
    address: '123 Elm St, Springfield, IL 62701',
  },
  {
    name: 'Eco Solutions',
    customers: 37,
    country: { label: 'Japan', color: 'indigo' },
    added: '2023-07-22',
    employees: 72,
    market: ok,
    website: 'https://www.ecosolutions.com',
    address: '456 Maple Ave, Denver, CO 80203',
  },
  {
    name: 'Skyline Innovations',
    customers: 15,
    country: { label: 'Nigeria', color: 'pink' },
    added: '2023-11-05',
    employees: 14,
    market: ok,
    website: 'https://www.skyline.com',
    address: '789 Oak Dr, Austin, TX 73301',
  },
  {
    name: 'Terra Firma',
    customers: 42,
    country: { label: 'Canada', color: 'yellow' },
    added: '2023-01-30',
    employees: 49,
    market: ok,
    website: 'https://www.terrafirma.com',
    address: '321 Pine Rd, Seattle, WA 98101',
  },
  {
    name: 'Quantum Leap',
    customers: 29,
    country: { label: 'Australia', color: 'orange' },
    added: '2023-09-12',
    employees: 27,
    market: ok,
    website: 'https://www.quantumleap.com',
    address: '654 Cedar Blvd, Miami, FL 33101',
  },
  {
    name: 'Pinnacle Tech',
    customers: 8,
    country: { label: 'India', color: 'cyan' },
    added: '2023-04-18',
    employees: 9,
    market: { label: '2 issues', color: 'negative' },
    website: 'https://www.pinnacletech.com',
    address: '987 Birch Ln, Portland, OR 97201',
  },
  {
    name: 'Future Vision',
    customers: 34,
    country: { label: 'Germany', color: 'pink' },
    added: '2023-06-25',
    employees: 100,
    market: { label: '4 issues', color: 'negative' },
    website: 'https://www.futurevision.com',
    address: '135 Spruce Ct, Boston, MA 02101',
  },
  {
    name: 'Aqua Vista',
    customers: 11,
    country: { label: 'Mexico', color: 'brand' },
    added: '2023-10-09',
    employees: 18,
    market: ok,
    website: 'https://www.aquavista.com',
  },
  {
    name: 'Summit Solutions',
    customers: 27,
    country: { label: 'France', color: 'violet' },
    added: '2023-02-14',
    employees: 25,
    market: ok,
    website: 'https://www.summitsolutions.com',
  },
  {
    name: 'Metro Dynamics',
    customers: 40,
    country: { label: 'Italy', color: 'lime' },
    added: '2023-08-01',
    employees: 46,
    market: ok,
    website: 'https://www.metrodynamics.com',
  },
  {
    name: 'Pure Air Tech',
    customers: 5,
    country: { label: 'South Korea', color: 'yellow' },
    added: '2023-05-27',
    employees: 6,
    market: { label: 'Risk found', color: 'notice' },
    website: 'https://www.pureairtech.com',
  },
  {
    name: 'Sunny Tech',
    customers: 21,
    country: { label: 'Argentina', color: 'orange' },
    added: '2023-12-03',
    employees: 22,
    market: unchecked,
    website: 'https://www.sunnytech.com',
    address: '852 Palm Blvd, Atlanta, GA 30301',
  },
  {
    name: 'New Horizons',
    customers: 44,
    country: { label: 'Spain', color: 'indigo' },
    added: '2023-03-29',
    employees: 50,
    market: ok,
    website: 'https://www.newhorizons.com',
    address: '951 Cypress Dr, Dallas, TX 75201',
  },
  {
    name: 'Vivid Life',
    customers: 19,
    country: { label: 'Egypt', color: 'violet' },
    added: '2023-11-11',
    employees: 20,
    market: ok,
    address: '258 Walnut St, Philadelphia, PA 19101',
  },
  {
    name: 'Synergy Works',
    customers: 32,
    employees: 35,
    market: ok,
    address: '369 Chestnut Ave, Phoenix, AZ 85001',
  },
  {
    name: 'Innovate Now',
    customers: 3,
    added: '2023-09-21',
    employees: 4,
    website: 'https://www.innovatenow.com',
    address: '147 Dogwood Ln, Orlando, FL 32801',
  },
  {
    name: 'Spark Creative',
    country: { label: 'Turkey', color: 'red' },
    added: '2023-10-30',
    market: unchecked,
    website: 'https://www.sparkcreative.com',
  },
  {
    name: 'Unity Group',
    customers: 36,
    added: '2023-02-05',
    employees: 39,
    market: unchecked,
    website: 'https://www.unitygroup.com',
    address: '369 Larch St, Minneapolis, MN 55401',
  },
  { name: 'Inspire Ideas', country: { label: 'Netherlands', color: 'green' } },
];

/** The first rows of the table, in its saved order; an empty field is an empty cell. */
export const CLIENTS: Client[] = ROWS.map((client, id) => ({ id, ...client }));

/**
 * What a column holds across the whole table, drawn under its header: the type, a small chart
 * and a caption. `unique`: a 1px bar per value that repeats, then the share of unique values.
 * `histogram`: bar heights out of the 24px chart. `categories`: the most common values, widest
 * first, in px (a segment without a width takes the rest), then the empty values.
 */
export type ColumnSummary = {
  type: 'string' | 'number' | 'status';
  chart:
    | { kind: 'unique'; repeated: number }
    | { kind: 'histogram'; bins: number[] }
    | { kind: 'categories'; segments: { width?: number; count?: number }[] };
  /** A count, or the lowest and the highest value. */
  caption: string | [string, string];
};

export type ColumnKey = Exclude<keyof Client, 'id'>;

export type Column = {
  key: ColumnKey;
  label: string;
  /** The type icon before the label. */
  icon: RemixiconComponentType;
  summary: ColumnSummary;
};

export const COLUMNS: Column[] = [
  {
    key: 'name',
    label: 'Client name',
    icon: RiFileLine,
    summary: { type: 'string', chart: { kind: 'unique', repeated: 11 }, caption: '137 values' },
  },
  {
    key: 'customers',
    label: 'Customers',
    icon: RiHashtag,
    summary: {
      type: 'number',
      chart: {
        kind: 'histogram',
        bins: [1, 2, 4, 2, 7, 18, 12, 19, 24, 11, 21, 19, 11, 13, 17, 21, 11, 7, 18, 9, 6, 2, 4, 2],
      },
      caption: ['0', '45'],
    },
  },
  {
    key: 'country',
    label: 'Country',
    icon: RiPriceTag3Line,
    summary: {
      type: 'string',
      chart: {
        kind: 'categories',
        segments: [
          { width: 29, count: 31 },
          { width: 19, count: 13 },
          { width: 13, count: 8 },
          { width: 11 },
          { width: 10 },
          { width: 9 },
          { width: 7 },
          { width: 6 },
          { width: 4 },
          { width: 2 },
        ],
      },
      caption: '6 unique values',
    },
  },
  {
    key: 'added',
    label: 'Date added',
    icon: RiCalendarLine,
    summary: { type: 'string', chart: { kind: 'unique', repeated: 52 }, caption: '137 clients' },
  },
  {
    key: 'employees',
    label: 'Employees',
    icon: RiHashtag,
    summary: {
      type: 'number',
      chart: {
        kind: 'histogram',
        bins: [1, 2, 4, 2, 2, 6, 4, 6, 8, 4, 7, 19, 4, 4, 6, 7, 4, 2, 6, 3, 6, 2, 4, 2],
      },
      caption: ['0', '101'],
    },
  },
  {
    key: 'market',
    label: 'Market',
    icon: RiShieldKeyholeLine,
    summary: {
      type: 'status',
      chart: {
        kind: 'categories',
        segments: [{ width: 74, count: 106 }, { width: 22, count: 25 }, { count: 6 }],
      },
      caption: '2 unique values',
    },
  },
  {
    key: 'website',
    label: 'Website',
    icon: RiAlignLeft,
    summary: { type: 'string', chart: { kind: 'unique', repeated: 0 }, caption: '76 values' },
  },
  {
    key: 'address',
    label: 'Address',
    icon: RiAlignLeft,
    summary: { type: 'string', chart: { kind: 'unique', repeated: 5 }, caption: '123 values' },
  },
];

/** The status bar: figures for the whole table, of which the grid shows the first rows. */
export const TOTALS = [
  { label: 'Total clients', value: '18' },
  { label: 'Total clients', value: '1,534' },
  { label: 'Size', value: '831.3MB' },
  { label: 'Rows', value: '32.3K' },
  { label: 'Columns', value: '21' },
];

export const LATEST_DATA = 'September 30, Saturday, 18:00 AM PST';
