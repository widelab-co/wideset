import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiContactsBook3Line,
  RiFlashlightFill,
  RiFlashlightLine,
  RiGitBranchLine,
  RiHandCoinLine,
  RiHome5Line,
  RiHourglass2Line,
  RiInbox2Line,
  RiKey2Line,
  RiLineChartLine,
  RiMailLine,
  RiPieChart2Line,
  RiPlugLine,
  RiQuestionLine,
  RiSettings3Line,
  RiSlackLine,
  RiTaskLine,
  RiTeamLine,
} from '@remixicon/react';

/*
  One automation in Orbit, still a draft: when a deal moves to Negotiation, a condition on the
  amount splits it. Deals of $25,000 or more message the owner's manager in Slack and give the
  manager a review task; smaller ones give the owner a task and e-mail the manager a summary, whose
  template nobody has picked yet. That one missing field keeps the workflow from being turned on.
*/

/** The product is Orbit; the workspace is Lumen Studio. */
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
  { id: 'revenue', label: 'Revenue', icon: RiLineChartLine },
  { id: 'reports', label: 'Reports', icon: RiPieChart2Line },
  {
    id: 'automations',
    label: 'Automations',
    icon: RiFlashlightLine,
    activeIcon: RiFlashlightFill,
  },
];

export const settingsLinks: NavLink[] = [
  { id: 'general', label: 'General', icon: RiSettings3Line },
  { id: 'members', label: 'Members', icon: RiTeamLine },
  { id: 'billing', label: 'Billing', icon: RiBankCardLine },
  { id: 'integrations', label: 'Integrations', icon: RiPlugLine },
  { id: 'api-keys', label: 'API keys', icon: RiKey2Line },
];

export const helpLink: NavLink = { id: 'help', label: 'Help and support', icon: RiQuestionLine };

export type StepKind = 'trigger' | 'condition' | 'email' | 'slack' | 'task' | 'wait';

/** A step of the workflow. A condition ends its sequence: what follows sits on its branches. */
export type Step = {
  id: string;
  kind: StepKind;
  /** The step's settings, by field name; an empty string is a field not filled in yet. */
  fields: Record<string, string>;
  /** A condition's branches: the steps when it holds, and when it does not. */
  yes?: Step[];
  no?: Step[];
};

type Option = { value: string; label: string };

export type Field = {
  name: string;
  label: string;
  control: 'select' | 'text' | 'textarea';
  options?: Option[];
  placeholder?: string;
  helperText?: string;
  /** Says how to fill the field in; set on the fields a step cannot run without. */
  missing?: string;
};

export type StepType = {
  /** What the step does, as the insert menu and the node name it. */
  label: string;
  /** One line under the panel's title: what the step is for. */
  description: string;
  icon: RemixiconComponentType;
  fields: Field[];
  /** The settings a new step starts with. */
  defaults: Record<string, string>;
  /** The node's line: what this step does with its settings. */
  summary: (fields: Record<string, string>) => string;
};

export const STAGES: Option[] = [
  { value: 'qualified', label: 'Qualified' },
  { value: 'discovery', label: 'Discovery' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'commit', label: 'Commit' },
  { value: 'won', label: 'Closed won' },
  { value: 'lost', label: 'Closed lost' },
];

const PEOPLE: Option[] = [
  { value: 'owner', label: 'Deal owner' },
  { value: 'manager', label: 'Owner’s manager' },
];

/** The same people inside a sentence on a node. */
const WHO: Record<string, string> = {
  owner: 'the deal owner',
  manager: 'the owner’s manager',
  contact: 'the customer contact',
  'deal-desk': '#deal-desk',
};

const RULES: Option[] = [
  { value: 'gte', label: 'Is at least' },
  { value: 'lt', label: 'Is less than' },
];

const DURATIONS: Option[] = [
  { value: '1h', label: '1 hour' },
  { value: '1d', label: '1 day' },
  { value: '2d', label: '2 days' },
  { value: '1w', label: '1 week' },
];

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** The amount a condition compares with, from what was typed ("25,000", "$25000"). */
export const parseAmount = (text: string) => Number(text.replace(/[^0-9.]/g, '')) || 0;

const labelOf = (options: Option[], value: string) =>
  options.find((option) => option.value === value)?.label ?? '';

/** Every kind of step: its name, icon, settings and how its node reads. */
export const STEP_TYPES: Record<StepKind, StepType> = {
  trigger: {
    label: 'Trigger',
    description: 'Starts the workflow when a deal changes stage.',
    icon: RiFlashlightLine,
    fields: [
      { name: 'stage', label: 'Deal moves to', control: 'select', options: STAGES },
      {
        name: 'pipeline',
        label: 'Pipeline',
        control: 'select',
        options: [
          { value: 'new-business', label: 'New business' },
          { value: 'renewals', label: 'Renewals' },
          { value: 'any', label: 'Any pipeline' },
        ],
      },
    ],
    defaults: { stage: 'negotiation', pipeline: 'new-business' },
    summary: (fields) => `Deal moves to ${labelOf(STAGES, fields.stage)}`,
  },
  condition: {
    label: 'Condition',
    description: 'Splits the workflow in two by the deal’s amount.',
    icon: RiGitBranchLine,
    fields: [
      { name: 'rule', label: 'Deal amount', control: 'select', options: RULES },
      {
        name: 'amount',
        label: 'Amount',
        control: 'text',
        placeholder: '25,000',
        helperText: 'In US dollars, before discounts.',
        missing: 'Enter an amount, like 25,000.',
      },
    ],
    defaults: { rule: 'gte', amount: '' },
    summary: (fields) =>
      parseAmount(fields.amount)
        ? `Amount ${labelOf(RULES, fields.rule).toLowerCase()} ${usd.format(parseAmount(fields.amount))}`
        : 'Amount not set',
  },
  email: {
    label: 'Send e-mail',
    description: 'Sends an e-mail from Orbit in the owner’s name.',
    icon: RiMailLine,
    fields: [
      {
        name: 'to',
        label: 'To',
        control: 'select',
        options: [...PEOPLE, { value: 'contact', label: 'Customer contact' }],
      },
      {
        name: 'template',
        label: 'Template',
        control: 'select',
        placeholder: 'Choose a template',
        options: [
          { value: 'summary', label: 'Deal summary' },
          { value: 'handover', label: 'Handover to the manager' },
          { value: 'pricing', label: 'Pricing approval request' },
        ],
        missing: 'Choose the template to send.',
      },
    ],
    defaults: { to: 'manager', template: '' },
    summary: (fields) => `E-mail ${WHO[fields.to]}`,
  },
  slack: {
    label: 'Notify in Slack',
    description: 'Posts a message in Slack, to a person or a channel.',
    icon: RiSlackLine,
    fields: [
      {
        name: 'to',
        label: 'Send to',
        control: 'select',
        options: [...PEOPLE, { value: 'deal-desk', label: '#deal-desk' }],
      },
      {
        name: 'message',
        label: 'Message',
        control: 'textarea',
        placeholder: 'What should they know?',
        missing: 'Write the message to send.',
      },
    ],
    defaults: { to: 'manager', message: '' },
    summary: (fields) => `Message ${WHO[fields.to]}`,
  },
  task: {
    label: 'Create task',
    description: 'Adds a task to someone’s list in Orbit.',
    icon: RiTaskLine,
    fields: [
      {
        name: 'title',
        label: 'Task',
        control: 'text',
        placeholder: 'Call the customer',
        missing: 'Name the task.',
      },
      { name: 'assignee', label: 'Assign to', control: 'select', options: PEOPLE },
      {
        name: 'due',
        label: 'Due',
        control: 'select',
        options: [
          { value: '1', label: 'In 1 day' },
          { value: '2', label: 'In 2 days' },
          { value: '7', label: 'In a week' },
        ],
      },
    ],
    defaults: { title: '', assignee: 'owner', due: '2' },
    summary: (fields) => fields.title.trim() || 'Untitled task',
  },
  wait: {
    label: 'Wait',
    description: 'Pauses before the next step.',
    icon: RiHourglass2Line,
    fields: [
      {
        name: 'duration',
        label: 'Wait for',
        control: 'select',
        options: DURATIONS,
      },
    ],
    defaults: { duration: '1d' },
    summary: (fields) => `Wait ${labelOf(DURATIONS, fields.duration)}`,
  },
};

/** The steps the "+" on a line can insert, in the menu's order. */
export const INSERTABLE: StepKind[] = ['email', 'slack', 'task', 'wait', 'condition'];

export const initialName = 'Negotiation handover';

/** The workflow as the page opens. */
export const initialFlow: Step[] = [
  { id: 'trigger', kind: 'trigger', fields: { stage: 'negotiation', pipeline: 'new-business' } },
  {
    id: 'deal-size',
    kind: 'condition',
    fields: { rule: 'gte', amount: '25,000' },
    yes: [
      {
        id: 'notify-manager',
        kind: 'slack',
        fields: {
          to: 'manager',
          message:
            'A deal you oversee moved to Negotiation. Review the terms before the next call.',
        },
      },
      {
        id: 'review-terms',
        kind: 'task',
        fields: { title: 'Review the terms', assignee: 'manager', due: '2' },
      },
    ],
    no: [
      {
        id: 'order-form',
        kind: 'task',
        fields: { title: 'Send the order form', assignee: 'owner', due: '1' },
      },
      { id: 'summary-email', kind: 'email', fields: { to: 'manager', template: '' } },
    ],
  },
];

/** The deal a test run uses: under $25,000, so it takes the No branch. */
export const sampleDeal = { name: 'Halcyon Freight renewal', amount: 24_000 };
