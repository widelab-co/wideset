import type { RemixiconComponentType } from '@remixicon/react';
import {
  RiArrowDownSLine,
  RiArrowLeftRightLine,
  RiBarChartLine,
  RiBox3Line,
  RiDashboardFill,
  RiFileCopyLine,
  RiSecurePaymentLine,
  RiUser3Line,
  RiWalletLine,
} from '@remixicon/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { exampleStory } from '../../stories/example';
import { Avatar } from '../avatar/Avatar';
import { IconButton } from '../button/IconButton';
import { ProgressBar } from '../progress-bar/ProgressBar';
import CollapsedExample from './examples/sidebar/collapsed';
import collapsedSource from './examples/sidebar/collapsed?raw';
import GroupsExample from './examples/sidebar/groups';
import groupsSource from './examples/sidebar/groups?raw';
import StatesExample from './examples/sidebar/states';
import statesSource from './examples/sidebar/states?raw';
import SuffixesExample from './examples/sidebar/suffixes';
import suffixesSource from './examples/sidebar/suffixes?raw';
import { Sidebar } from './Sidebar';
import { SidebarItem } from './SidebarItem';
import { SidebarSection } from './SidebarSection';
import { SidebarSectionHeader } from './SidebarSectionHeader';
import { SidebarTrigger } from './SidebarTrigger';

type NavEntry = {
  icon?: RemixiconComponentType;
  label?: string;
  active?: boolean;
  group?: string;
};

const mainNav: NavEntry[] = [
  { icon: RiDashboardFill, label: 'Dashboard', active: true },
  { icon: RiWalletLine, label: 'Balances' },
  { icon: RiUser3Line, label: 'Customers' },
];

const fullNav: NavEntry[] = [
  { icon: RiDashboardFill, label: 'Dashboard', active: true },
  { icon: RiWalletLine, label: 'Balances' },
  { icon: RiArrowLeftRightLine, label: 'Transactions' },
  { icon: RiUser3Line, label: 'Customers' },
  { icon: RiBox3Line, label: 'Products' },
  { group: 'Products' },
  { icon: RiSecurePaymentLine, label: 'Payments' },
  { icon: RiFileCopyLine, label: 'Billing' },
  { icon: RiBarChartLine, label: 'Reporting' },
];

const meta = {
  title: 'Components/Sidebar',
  tags: ['autodocs'],
  component: Sidebar,
  subcomponents: {
    'Sidebar.Section': SidebarSection,
    'Sidebar.SectionHeader': SidebarSectionHeader,
    'Sidebar.Item': SidebarItem,
    'Sidebar.Trigger': SidebarTrigger,
  },
  parameters: {
    docs: {
      description: {
        component: `Sidebar is a collapsible vertical navigation panel. Use it as the primary app navigation shell when the layout needs to support both an expanded label view and a compact icon-only view.

Use Tabs to switch sections within a page and Breadcrumbs to show hierarchy.

**Composition:**
\`\`\`
<Sidebar>                          — root container; controls collapsed state
  <Sidebar.Header>                 — sidebar title/branding row; never scrolls
    <Sidebar.Expanded>             — what exists only when expanded: logo + name
    <Sidebar.Trigger />            — default icon button that toggles collapse
  </Sidebar.Header>
  <Sidebar.Section>                — layout wrapper for a section (root owns the 12px gap)
  <Sidebar.Section scrollable>     — fills remaining height, scrolls overflow in a ScrollArea
    <Sidebar.SectionHeader>        — title of a group of items; cut short ("P…") when collapsed
    <Sidebar.Item href="/" icon={Icon} label="Label" active />
  </Sidebar.Section>
  <Sidebar.Collapsed>              — what exists only when collapsed
  <Sidebar.Trigger asChild>        — merge toggle behaviour onto a custom element
    <button>Custom</button>
  </Sidebar.Trigger>
</Sidebar>
\`\`\``,
      },
    },
  },
  argTypes: {
    defaultMotion: { table: { category: 'Behavior', type: { summary: 'boolean' } } },
    defaultCollapsed: {
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    collapsed: {
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
      },
    },
    surface: {
      control: 'radio',
      options: ['page', 'tinted', 'frame'],
      table: {
        category: 'Appearance',
        type: { summary: "'page' | 'tinted' | 'frame'" },
        defaultValue: { summary: "the AppShell direction's surface, 'page' outside one" },
      },
    },
    onCollapsedChange: {
      control: false,
      table: {
        category: 'Events',
        type: { summary: '(collapsed: boolean) => void' },
      },
    },
    children: {
      description: 'Sidebar content, composed from its header, sections, items, and trigger.',
      control: false,
      table: { category: 'Content', type: { summary: 'React.ReactNode' } },
    },
    className: {
      description: 'Additional CSS classes merged with the sidebar root element.',
      control: false,
      table: { category: 'Appearance', type: { summary: 'string' } },
    },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden focusable="false">
    <path
      className="fill-(--ws-non-semantic-fill-brand-strong)"
      d="M0 16C0 8.45753 0 4.68629 2.34315 2.34315C4.68629 0 8.45753 0 16 0C23.5425 0 27.3137 0 29.6569 2.34315C32 4.68629 32 8.45753 32 16C32 23.5425 32 27.3137 29.6569 29.6569C27.3137 32 23.5425 32 16 32C8.45753 32 4.68629 32 2.34315 29.6569C0 27.3137 0 23.5425 0 16Z"
    />
    <path
      className="fill-ws-non-semantic-brand-on-strong"
      d="M21.6907 12C21.6907 12 19.618 17.322 19.5381 17.5183C19.4954 17.4215 17.1775 12 17.1775 12H15.0877C15.0877 12 12.7755 17.5183 12.7413 17.5916C12.7042 17.5157 10.2409 12 10.2409 12H8L11.7434 20H13.8047L16.1483 14.3403H16.1853C16.211 14.3953 18.5802 20 18.5802 20H20.7042C20.7042 20 23.9772 12.0707 24 12.0052L21.6935 12H21.6907Z"
    />
  </svg>
);

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Minimal working sidebar — click the trigger to toggle. Use `defaultCollapsed` in the controls panel to set the initial state.',
      },
    },
  },
  render: (args) => (
    <div className="bg-ws-static-background border-ws-dynamic-secondary-default flex h-screen w-full border">
      <Sidebar {...args}>
        <Sidebar.Header>
          <div className="gap-ws-7 py-ws-3 flex items-center">
            <Sidebar.Expanded>
              <div className="gap-ws-7 pl-ws-5 flex min-w-0 flex-1 items-center">
                <Logo />
                <span className="typography-label-strong-sm text-ws-dynamic-secondary-default">
                  Wideset
                </span>
              </div>
            </Sidebar.Expanded>
            <Sidebar.Trigger />
          </div>
        </Sidebar.Header>
        <Sidebar.Section>
          <nav className="gap-ws-2 flex flex-col">
            {mainNav.map(({ icon, label, active }) => (
              <Sidebar.Item key={label} href="#" icon={icon} label={label} active={active} />
            ))}
          </nav>
        </Sidebar.Section>
      </Sidebar>
    </div>
  ),
  args: {
    defaultCollapsed: false,
  },
};

export const Collapsed: Story = exampleStory(CollapsedExample, collapsedSource);

export const Groups: Story = exampleStory(GroupsExample, groupsSource);

export const States: Story = exampleStory(StatesExample, statesSource);

export const Suffixes: Story = exampleStory(SuffixesExample, suffixesSource);

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Full application sidebar with a branded header, account switcher, primary navigation, secondary navigation, onboarding progress, and user profile section. The navigation is one tree for both modes; `Sidebar.Expanded` and `Sidebar.Collapsed` wrap only what differs between them.',
      },
    },
  },
  render: (args) => (
    <div className="bg-ws-static-background border-ws-dynamic-secondary-default flex h-screen w-full border">
      <Sidebar {...args}>
        <Sidebar.Header>
          <div className="gap-ws-7 py-ws-3 flex items-center">
            <Sidebar.Expanded>
              <div className="gap-ws-7 pl-ws-5 flex min-w-0 flex-1 items-center">
                <Logo />
                <span className="typography-label-strong-sm text-ws-dynamic-secondary-default">
                  Wideset
                </span>
              </div>
            </Sidebar.Expanded>
            <Sidebar.Trigger />
          </div>
        </Sidebar.Header>
        <Sidebar.Section>
          <Sidebar.Expanded>
            <div className="rounded-ws-control-lg border-ws-dynamic-secondary-default bg-ws-static-highlight-base shadow-ws-forms-base px-ws-7 py-ws-5 flex items-center border">
              <div className="flex flex-1 flex-col">
                <span className="typography-label-strong-sm text-ws-dynamic-secondary-default">
                  Widelab
                </span>
                <span className="typography-label-sm text-ws-static-subtle">31 seats</span>
              </div>
              <IconButton
                icon={RiArrowDownSLine}
                variant="secondary"
                preset="ghost"
                size="sm"
                iconClassName="text-ws-static-strong size-ws-9"
                aria-label="Switch workspace"
              />
            </div>
          </Sidebar.Expanded>
          <Sidebar.Collapsed>
            <div className="flex justify-center">
              <IconButton
                icon={RiArrowDownSLine}
                variant="secondary"
                preset="ghost"
                size="sm"
                iconClassName="text-ws-static-strong size-ws-9"
                className="border-ws-dynamic-secondary-default bg-ws-static-highlight-base shadow-ws-forms-base size-ws-15 border"
                aria-label="Switch workspace"
              />
            </div>
          </Sidebar.Collapsed>
        </Sidebar.Section>
        <Sidebar.Section scrollable>
          <nav className="gap-ws-2 flex flex-col">
            {fullNav.map(({ icon, label, active, group }) =>
              group ? (
                <Sidebar.SectionHeader key={group}>{group}</Sidebar.SectionHeader>
              ) : (
                <Sidebar.Item key={label} href="#" icon={icon} label={label} active={active} />
              ),
            )}
          </nav>
        </Sidebar.Section>
        <Sidebar.Section>
          <Sidebar.Expanded>
            <div className="rounded-ws-container-md border-ws-static-base bg-ws-static-container p-ws-9 flex items-center border">
              <div className="gap-ws-5 flex flex-1 flex-col">
                <div className="text-ws-dynamic-secondary-default typography-label-strong-sm flex items-center justify-between">
                  <span>Onboarding</span>
                  <span>3/5</span>
                </div>
                <ProgressBar value={60} />
                <span className="typography-label-sm text-ws-static-subtle">
                  Fulfill personal information
                </span>
              </div>
            </div>
          </Sidebar.Expanded>
        </Sidebar.Section>
        <Sidebar.Section>
          <Sidebar.Expanded>
            <div className="rounded-ws-control-lg gap-ws-5 px-ws-5 py-ws-3 flex items-center">
              <Avatar initials="AS" status="online" />
              <div className="flex flex-1 flex-col">
                <span className="typography-label-strong-sm text-ws-static-base">Adam Smith</span>
                <span className="typography-label-sm text-ws-static-subtle">hello@wideset.co</span>
              </div>
              <IconButton
                icon={RiArrowDownSLine}
                variant="secondary"
                preset="ghost"
                size="sm"
                className="outline-current"
                iconClassName="text-ws-static-strong size-ws-9"
                aria-label="Open profile menu"
              />
            </div>
          </Sidebar.Expanded>
          <Sidebar.Collapsed>
            <div className="py-ws-3">
              <Avatar initials="AS" status="online" />
            </div>
          </Sidebar.Collapsed>
        </Sidebar.Section>
      </Sidebar>
    </div>
  ),
  args: {
    ...Default.args,
  },
};
