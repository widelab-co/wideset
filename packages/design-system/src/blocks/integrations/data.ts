import {
  type RemixiconComponentType,
  RiDropboxFill,
  RiGoogleFill,
  RiLinkedinFill,
  RiMicrosoftFill,
  RiNotionFill,
  RiSlackFill,
  RiWebhookFill,
  RiWhatsappFill,
} from '@remixicon/react';
import type { AvatarColor } from '@wideset/react';

/** The product is Orbit; the workspace connecting apps to it is Lumen Studio. */
export const WORKSPACE = { name: 'Lumen Studio' };
export const ACCOUNT = { name: 'Maya Okafor', initials: 'MO' };

export const NAV = [
  { label: 'Home', href: '#home' },
  { label: 'Customers', href: '#customers' },
  { label: 'Deals', href: '#deals' },
  { label: 'Revenue', href: '#revenue' },
  { label: 'Reports', href: '#reports' },
  { label: 'Integrations', href: '#integrations' },
];

/** The moment the screen shows; every sync time below is relative to it. */
export const NOW = '2026-11-10T14:30:00Z';

export type Category = 'crm' | 'communication' | 'data' | 'finance' | 'productivity';

export const CATEGORIES: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'crm', label: 'CRM' },
  { value: 'communication', label: 'Communication' },
  { value: 'data', label: 'Data' },
  { value: 'finance', label: 'Finance' },
  { value: 'productivity', label: 'Productivity' },
];

/** What Orbit may do with one kind of data in the app. */
export type Scope = { data: string; access: 'Read' | 'Write' | 'Read and write' };

/**
 * The logo is the app's Remix brand icon where Remix has one, otherwise its initials in a colour
 * close to the brand's.
 */
export type AppLogo = { icon: RemixiconComponentType } | { initials: string; color: AvatarColor };

export type App = {
  id: string;
  name: string;
  category: Category;
  logo: AppLogo;
  /** One line on the tile: what connecting it does. */
  summary: string;
  /** The panel's paragraph: what flows where. */
  about: string;
  scopes: Scope[];
};

export type ConnectionStatus = 'active' | 'paused' | 'expired';

/** A connected app: what it syncs, how it is doing and who connected it. */
export type Connection = {
  appId: string;
  /** What flows between the app and Orbit, in a few words. */
  syncs: string;
  status: ConnectionStatus;
  /** The last sync that went through. */
  lastSync: string;
  connectedBy: string;
  connectedOn: string;
};

export const APPS: App[] = [
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'crm',
    logo: { initials: 'HS', color: 'orange' },
    summary: 'Sync contacts, companies and marketing lists',
    about:
      'Orbit reads contacts, companies and list membership from HubSpot and writes lifecycle stages back, so marketing sees which leads became customers.',
    scopes: [
      { data: 'Contacts and companies', access: 'Read and write' },
      { data: 'Lists', access: 'Read' },
      { data: 'Lifecycle stages', access: 'Write' },
    ],
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'crm',
    logo: { initials: 'SF', color: 'blue' },
    summary: 'Sync accounts, contacts and deals',
    about:
      'Orbit reads accounts, contacts and opportunities from Salesforce and writes deal stages back, so both stay in step. Changes sync every 15 minutes.',
    scopes: [
      { data: 'Accounts and contacts', access: 'Read and write' },
      { data: 'Opportunities', access: 'Read and write' },
      { data: 'Users and owners', access: 'Read' },
      { data: 'Tasks and events', access: 'Write' },
    ],
  },
  {
    id: 'pipedrive',
    name: 'Pipedrive',
    category: 'crm',
    logo: { initials: 'PD', color: 'green' },
    summary: 'Import deals, stages and owners',
    about:
      'Orbit imports your Pipedrive deals with their stages and owners, then keeps new deals and stage changes in sync.',
    scopes: [
      { data: 'Deals and stages', access: 'Read' },
      { data: 'People and organizations', access: 'Read' },
      { data: 'Users', access: 'Read' },
    ],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Sales Navigator',
    category: 'crm',
    logo: { icon: RiLinkedinFill },
    summary: 'Save leads and see InMail history',
    about:
      'Leads you save in Sales Navigator appear in Orbit with their company, role and InMail history.',
    scopes: [
      { data: 'Saved leads and accounts', access: 'Read' },
      { data: 'InMail history', access: 'Read' },
    ],
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'communication',
    logo: { icon: RiSlackFill },
    summary: 'Post deal updates and alerts to channels',
    about:
      'Orbit posts won deals, renewals and churn alerts to the channels you choose, and lets people look up a customer with /orbit.',
    scopes: [
      { data: 'Public channels', access: 'Read' },
      { data: 'Messages in chosen channels', access: 'Write' },
      { data: 'Slash commands', access: 'Write' },
    ],
  },
  {
    id: 'google',
    name: 'Google Workspace',
    category: 'communication',
    logo: { icon: RiGoogleFill },
    summary: 'Log Gmail threads and Calendar meetings',
    about:
      'Orbit logs Gmail threads and Calendar meetings with your customers on their timelines. It never reads mail from people outside your customer list.',
    scopes: [
      { data: 'Gmail message headers', access: 'Read' },
      { data: 'Calendar events', access: 'Read' },
      { data: 'Contacts', access: 'Read' },
    ],
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    category: 'communication',
    logo: { icon: RiMicrosoftFill },
    summary: 'Post deal updates to a team channel',
    about: 'Orbit posts won deals, renewals and churn alerts to the Teams channels you choose.',
    scopes: [
      { data: 'Teams and channels', access: 'Read' },
      { data: 'Channel messages', access: 'Write' },
    ],
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    category: 'communication',
    logo: { icon: RiWhatsappFill },
    summary: 'Message customers from their record',
    about:
      'Send and receive WhatsApp messages from a customer’s record in Orbit; every conversation lands on their timeline.',
    scopes: [
      { data: 'Business profile', access: 'Read' },
      { data: 'Messages', access: 'Read and write' },
    ],
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    category: 'data',
    logo: { initials: 'SN', color: 'cyan' },
    summary: 'Load customer tables every night',
    about:
      'Orbit writes customers, deals, subscriptions and invoices to a Snowflake schema every night, ready for your own models.',
    scopes: [
      { data: 'One schema you choose', access: 'Write' },
      { data: 'Warehouse usage', access: 'Read' },
    ],
  },
  {
    id: 'segment',
    name: 'Segment',
    category: 'data',
    logo: { initials: 'SG', color: 'teal' },
    summary: 'Show product events on timelines',
    about:
      'Product events from Segment show on each customer’s timeline and can start an automation, such as a trial that stalls.',
    scopes: [
      { data: 'Track and identify events', access: 'Read' },
      { data: 'Traits', access: 'Read' },
    ],
  },
  {
    id: 'webhooks',
    name: 'Webhooks',
    category: 'data',
    logo: { icon: RiWebhookFill },
    summary: 'Send Orbit events to any URL',
    about:
      'Orbit sends a signed request to your URL when a customer, deal or invoice changes. Built by Orbit.',
    scopes: [{ data: 'Customer, deal and invoice events', access: 'Write' }],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'finance',
    logo: { initials: 'ST', color: 'indigo' },
    summary: 'Sync payments, subscriptions and invoices',
    about:
      'Orbit reads payments, subscriptions and invoices from Stripe to work out revenue, churn and expansion for each customer.',
    scopes: [
      { data: 'Customers', access: 'Read' },
      { data: 'Subscriptions and invoices', access: 'Read' },
      { data: 'Payments and refunds', access: 'Read' },
    ],
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    category: 'finance',
    logo: { initials: 'QB', color: 'green' },
    summary: 'Sync invoices and payments',
    about:
      'Invoices raised in Orbit are created in QuickBooks, and payments recorded there mark them paid in Orbit.',
    scopes: [
      { data: 'Customers', access: 'Read and write' },
      { data: 'Invoices', access: 'Read and write' },
      { data: 'Payments', access: 'Read' },
    ],
  },
  {
    id: 'xero',
    name: 'Xero',
    category: 'finance',
    logo: { initials: 'XE', color: 'blue' },
    summary: 'Reconcile invoices with bank payments',
    about:
      'Invoices raised in Orbit are created in Xero, and payments reconciled there mark them paid in Orbit.',
    scopes: [
      { data: 'Contacts', access: 'Read and write' },
      { data: 'Invoices', access: 'Read and write' },
      { data: 'Bank transactions', access: 'Read' },
    ],
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'productivity',
    logo: { icon: RiNotionFill },
    summary: 'Turn account notes into shared pages',
    about:
      'Account plans and call notes written in Orbit can be published to a Notion page your team shares.',
    scopes: [
      { data: 'Pages you share with Orbit', access: 'Read and write' },
      { data: 'Workspace members', access: 'Read' },
    ],
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    category: 'productivity',
    logo: { icon: RiDropboxFill },
    summary: 'Attach contracts to deals',
    about:
      'Pick a contract or proposal from Dropbox to attach it to a deal; Orbit links to the file, so it is never copied.',
    scopes: [
      { data: 'Files you pick', access: 'Read' },
      { data: 'Shared links', access: 'Write' },
    ],
  },
];

/** What Lumen Studio has connected. */
export const CONNECTIONS: Connection[] = [
  {
    appId: 'slack',
    syncs: 'Deal alerts to #revenue',
    status: 'active',
    lastSync: '2026-11-10T14:28:00Z',
    connectedBy: 'Maya Okafor',
    connectedOn: '2026-03-04',
  },
  {
    appId: 'stripe',
    syncs: 'Payments and subscriptions',
    status: 'active',
    lastSync: '2026-11-10T14:26:00Z',
    connectedBy: 'Daniel Reyes',
    connectedOn: '2025-11-18',
  },
  {
    appId: 'google',
    syncs: 'Gmail and Calendar activity',
    status: 'paused',
    lastSync: '2026-11-03T09:12:00Z',
    connectedBy: 'Maya Okafor',
    connectedOn: '2026-01-12',
  },
  {
    appId: 'hubspot',
    syncs: 'Contacts and companies',
    status: 'expired',
    lastSync: '2026-11-09T22:45:00Z',
    connectedBy: 'Priya Shah',
    connectedOn: '2026-06-23',
  },
];

/** What a newly connected app syncs, until someone changes it. */
export const DEFAULT_SYNCS: Record<Category, string> = {
  crm: 'Contacts and deals, both ways',
  communication: 'Messages and meetings',
  data: 'Customer and revenue data',
  finance: 'Invoices and payments',
  productivity: 'Notes and files',
};
