import {
  type RemixiconComponentType,
  RiBuilding2Line,
  RiFileChartLine,
  RiHandCoinLine,
  RiHome5Line,
  RiInboxLine,
  RiLineChartLine,
  RiSettings3Line,
} from '@remixicon/react';
import type { AvatarColor } from '@wideset/react';

/** The workspace these settings belong to, and what deleting it would take with it. */
export const workspace = {
  initials: 'LS',
  color: 'teal' as AvatarColor,
  members: 12,
  customers: 1284,
  deals: 312,
  invoices: 2140,
};

/** The signed-in user. */
export const account = {
  name: 'Sanne de Vries',
  initials: 'SV',
  color: 'orange' as AvatarColor,
  role: 'Owner',
};

export const navigation: {
  id: string;
  label: string;
  icon: RemixiconComponentType;
  count?: number;
}[] = [
  { id: 'home', label: 'Home', icon: RiHome5Line },
  { id: 'inbox', label: 'Inbox', icon: RiInboxLine, count: 8 },
  { id: 'customers', label: 'Customers', icon: RiBuilding2Line },
  { id: 'deals', label: 'Deals', icon: RiHandCoinLine },
  { id: 'revenue', label: 'Revenue', icon: RiLineChartLine },
  { id: 'reports', label: 'Reports', icon: RiFileChartLine },
  { id: 'settings', label: 'Settings', icon: RiSettings3Line },
];

export type SectionId =
  'general' | 'members' | 'billing' | 'notifications' | 'security' | 'integrations' | 'api';

/** The settings section list, in order; the description is the line under the page title. */
export const sections: { id: SectionId; label: string; description: string }[] = [
  {
    id: 'general',
    label: 'General',
    description: 'The workspace details apply to all 12 members; your profile is yours alone.',
  },
  { id: 'members', label: 'Members', description: 'Who can join the workspace, and how.' },
  { id: 'billing', label: 'Billing', description: 'Your plan, the payment method and invoices.' },
  { id: 'notifications', label: 'Notifications', description: 'What Orbit e-mails you about.' },
  { id: 'security', label: 'Security', description: 'How members sign in to the workspace.' },
  {
    id: 'integrations',
    label: 'Integrations',
    description: 'Tools that bring customers, payments and messages into Orbit.',
  },
  { id: 'api', label: 'API', description: 'Keys and webhooks for connecting your own systems.' },
];

/** The values the General form saves, as the server holds them. */
export type GeneralValues = {
  /** An uploaded image's object URL; `null` shows the initials. */
  logo: string | null;
  name: string;
  /** The workspace address after `orbit.app/`. */
  slug: string;
  currency: string;
  timeZone: string;
  fullName: string;
  email: string;
};

/** A message per field that is wrong; every field's control has the id `settings-<field>`. */
export type FieldErrors = Partial<Record<keyof GeneralValues, string>>;

export const general: GeneralValues = {
  logo: null,
  name: 'Lumen Studio',
  slug: 'lumen-studio',
  currency: 'EUR',
  timeZone: 'Europe/Amsterdam',
  fullName: 'Sanne de Vries',
  email: 'sanne@lumen.studio',
};

export const currencies = [
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'USD', label: 'US dollar (USD)' },
  { value: 'GBP', label: 'British pound (GBP)' },
  { value: 'CHF', label: 'Swiss franc (CHF)' },
  { value: 'SEK', label: 'Swedish krona (SEK)' },
  { value: 'DKK', label: 'Danish krone (DKK)' },
  { value: 'NOK', label: 'Norwegian krone (NOK)' },
  { value: 'PLN', label: 'Polish złoty (PLN)' },
  { value: 'CAD', label: 'Canadian dollar (CAD)' },
  { value: 'AUD', label: 'Australian dollar (AUD)' },
];

export const timeZones = [
  { value: 'America/Los_Angeles', label: '(GMT−08:00) Los Angeles' },
  { value: 'America/New_York', label: '(GMT−05:00) New York' },
  { value: 'Europe/London', label: '(GMT+00:00) London' },
  { value: 'Europe/Amsterdam', label: '(GMT+01:00) Amsterdam' },
  { value: 'Europe/Berlin', label: '(GMT+01:00) Berlin' },
  { value: 'Europe/Warsaw', label: '(GMT+01:00) Warsaw' },
  { value: 'Europe/Helsinki', label: '(GMT+02:00) Helsinki' },
  { value: 'Asia/Dubai', label: '(GMT+04:00) Dubai' },
  { value: 'Asia/Kolkata', label: '(GMT+05:30) Mumbai' },
  { value: 'Asia/Singapore', label: '(GMT+08:00) Singapore' },
  { value: 'Asia/Tokyo', label: '(GMT+09:00) Tokyo' },
  { value: 'Australia/Sydney', label: '(GMT+11:00) Sydney' },
];

/** E-mail notifications: each switch applies the moment it flips. */
export const notifications: {
  id: string;
  label: string;
  description: string;
  on: boolean;
}[] = [
  {
    id: 'digest',
    label: 'Weekly revenue digest',
    description: 'New revenue, churn and pipeline changes, every Monday at 9:00.',
    on: true,
  },
  {
    id: 'deals-won',
    label: 'Deals won',
    description: 'When a deal you own closes, with its value and the next step.',
    on: true,
  },
  {
    id: 'failed-payments',
    label: 'Failed payments',
    description: 'When a card is declined or an invoice is seven days overdue.',
    on: true,
  },
  {
    id: 'mentions',
    label: 'Mentions',
    description: 'When someone mentions you in a note or on a deal.',
    on: false,
  },
  {
    id: 'product',
    label: 'Product updates',
    description: 'New Orbit features, about once a month.',
    on: false,
  },
];

/** A setting on the other sections' pages: a switch that applies at once, or an action. */
export type SettingRowData =
  | { kind: 'switch'; id: string; label: string; description: string; on: boolean }
  | { kind: 'action'; id: string; label: string; description: string; action: string };

export const sectionRows: Record<
  Exclude<SectionId, 'general' | 'notifications'>,
  SettingRowData[]
> = {
  members: [
    {
      kind: 'switch',
      id: 'domain-join',
      label: 'Join with a lumen.studio e-mail',
      description: 'People who sign up with a lumen.studio address join without an invitation.',
      on: true,
    },
    {
      kind: 'switch',
      id: 'invite-link',
      label: 'Invite link',
      description: 'Anyone with the link joins as a member. It expires after seven days.',
      on: false,
    },
    {
      kind: 'action',
      id: 'members',
      label: 'Members and invitations',
      description: '12 members, 2 invitations waiting for an answer.',
      action: 'Manage members',
    },
  ],
  billing: [
    {
      kind: 'action',
      id: 'plan',
      label: 'Growth plan',
      description: '12 seats, €588 a month. Renews on 1 December 2026.',
      action: 'Change plan',
    },
    {
      kind: 'action',
      id: 'payment-method',
      label: 'Payment method',
      description: 'Visa ending in 4242, expires 08/2028.',
      action: 'Update',
    },
    {
      kind: 'action',
      id: 'invoices',
      label: 'Invoices',
      description: '23 invoices since March 2025, sent to finance@lumen.studio.',
      action: 'View invoices',
    },
  ],
  security: [
    {
      kind: 'switch',
      id: 'two-factor',
      label: 'Require two-factor authentication',
      description: 'Members without it set it up the next time they sign in.',
      on: false,
    },
    {
      kind: 'switch',
      id: 'google-only',
      label: 'Sign in with Google only',
      description: 'Turns off passwords for everyone in the workspace.',
      on: false,
    },
    {
      kind: 'action',
      id: 'sessions',
      label: 'Your sessions',
      description: 'Signed in on 3 devices, most recently today at 08:42 in Amsterdam.',
      action: 'Review sessions',
    },
  ],
  integrations: [
    {
      kind: 'action',
      id: 'stripe',
      label: 'Stripe',
      description: 'Connected. Payments and invoices sync every 15 minutes.',
      action: 'Manage',
    },
    {
      kind: 'action',
      id: 'slack',
      label: 'Slack',
      description: 'Connected to #revenue. Won deals and failed payments are posted there.',
      action: 'Manage',
    },
    {
      kind: 'action',
      id: 'hubspot',
      label: 'HubSpot',
      description: 'Bring in contacts, companies and open deals.',
      action: 'Connect',
    },
    {
      kind: 'action',
      id: 'gmail',
      label: 'Gmail',
      description: 'Log e-mails with customers on their timeline.',
      action: 'Connect',
    },
  ],
  api: [
    {
      kind: 'action',
      id: 'live-key',
      label: 'Production key',
      description: 'orb_live_…3f9a, created 2 September 2026, last used 2 hours ago.',
      action: 'Revoke',
    },
    {
      kind: 'action',
      id: 'test-key',
      label: 'Test key',
      description: 'orb_test_…81c2, created 14 July 2026, never used.',
      action: 'Revoke',
    },
    {
      kind: 'action',
      id: 'webhooks',
      label: 'Webhooks',
      description: 'Send customer, deal and invoice events to your own systems.',
      action: 'Add endpoint',
    },
  ],
};
