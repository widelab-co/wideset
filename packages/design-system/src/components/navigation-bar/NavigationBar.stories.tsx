import {
  RiBarChartLine,
  RiBox3Line,
  RiHome5Line,
  RiMenuLine,
  RiNotification3Line,
  RiSettings3Line,
} from '@remixicon/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link, MemoryRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import { exampleStory } from '../../stories/example';
import { IconButton } from '../button/IconButton';
import BreadcrumbsExample from './examples/navigation-bar/breadcrumbs';
import breadcrumbsSource from './examples/navigation-bar/breadcrumbs?raw';
import DividerExample from './examples/navigation-bar/divider';
import dividerSource from './examples/navigation-bar/divider?raw';
import MinimalExample from './examples/navigation-bar/minimal';
import minimalSource from './examples/navigation-bar/minimal?raw';
import NavigationExample from './examples/navigation-bar/navigation';
import navigationSource from './examples/navigation-bar/navigation?raw';
import StatesExample from './examples/navigation-bar/states';
import statesSource from './examples/navigation-bar/states?raw';
import { NavigationBar } from './NavigationBar';
import { NavigationBarIcon } from './NavigationBarIcon';
import { NavigationBarItem } from './NavigationBarItem';

const meta = {
  title: 'Components/NavigationBar',
  tags: ['autodocs'],
  component: NavigationBar,
  subcomponents: {
    'NavigationBar.Item': NavigationBarItem,
    'NavigationBar.Icon': NavigationBarIcon,
  },
  parameters: {
    docs: {
      description: {
        component: `NavigationBar is the app's top bar: the menu button and logo, the page links or the path to the current page, and the tools that apply on every page.
Use it as the primary navigation of a product with a handful of top-level areas, and on nested pages with \`Breadcrumbs\` in place of the links.

Use Sidebar when the product has more areas than fit in one row, Tabs to switch between sections of one page, and a plain page header for the title and actions of a single page.

**Composition:**
\`\`\`
<NavigationBar>                   — header, 64px high; the line under it is \`divider\`
  <NavigationBar.Start>           — menu button, logo
  <NavigationBar.Nav>             — nav landmark, "Main" by default
    <NavigationBar.Item href="/" active>  — a page link; \`asChild\` for a router Link
      <NavigationBar.Icon icon={…} />    — optional leading icon
      <NavigationBar.Label>…</NavigationBar.Label>
      <Tag>New</Tag>                     — optional, after the label
    </NavigationBar.Item>
  </NavigationBar.Nav>            — or <Breadcrumbs> on a nested page
  <NavigationBar.End>             — pushed to the end: search, segmented control
    <NavigationBar.Actions>       — icon buttons, kept close together
      <IconButton … />
    </NavigationBar.Actions>
  </NavigationBar.End>
</NavigationBar>
\`\`\``,
      },
    },
  },
  argTypes: {
    divider: {
      control: 'boolean',
      table: {
        category: 'Appearance',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    children: {
      description: 'The bar content, composed from Start, Nav (or Breadcrumbs), End and Actions.',
      control: false,
      table: { category: 'Content', type: { summary: 'ReactNode' } },
    },
    className: {
      description: 'Layout overrides for the header element, such as a background or a width.',
      control: false,
      table: { category: 'Appearance', type: { summary: 'string' } },
    },
  },
} satisfies Meta<typeof NavigationBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A bar with the menu button, a logo, three page links and two actions. Toggle `divider` in the Controls panel.',
      },
    },
  },
  render: (args) => (
    <NavigationBar {...args}>
      <NavigationBar.Start>
        <IconButton
          variant="secondary"
          preset="ghost"
          size="sm"
          icon={RiMenuLine}
          aria-label="Open menu"
        />
      </NavigationBar.Start>
      <NavigationBar.Nav>
        <NavigationBar.Item href="#" active>
          <NavigationBar.Icon icon={RiHome5Line} />
          <NavigationBar.Label>Dashboard</NavigationBar.Label>
        </NavigationBar.Item>
        <NavigationBar.Item href="#">
          <NavigationBar.Icon icon={RiBarChartLine} />
          <NavigationBar.Label>Analytics</NavigationBar.Label>
        </NavigationBar.Item>
        <NavigationBar.Item href="#">
          <NavigationBar.Icon icon={RiBox3Line} />
          <NavigationBar.Label>Products</NavigationBar.Label>
        </NavigationBar.Item>
      </NavigationBar.Nav>
      <NavigationBar.End>
        <NavigationBar.Actions>
          <IconButton
            variant="secondary"
            preset="ghost"
            size="sm"
            icon={RiSettings3Line}
            aria-label="Settings"
          />
          <IconButton
            variant="secondary"
            preset="ghost"
            size="sm"
            icon={RiNotification3Line}
            aria-label="Notifications"
          />
        </NavigationBar.Actions>
      </NavigationBar.End>
    </NavigationBar>
  ),
  args: {
    divider: true,
  },
};

export const Divider: Story = exampleStory(DividerExample, dividerSource);

export const States: Story = exampleStory(StatesExample, statesSource);

export const Navigation: Story = exampleStory(NavigationExample, navigationSource);

export const Breadcrumbs: Story = exampleStory(BreadcrumbsExample, breadcrumbsSource);

export const Minimal: Story = exampleStory(MinimalExample, minimalSource);

const PAGES = [
  { to: '/', label: 'Dashboard', icon: RiHome5Line },
  { to: '/analytics', label: 'Analytics', icon: RiBarChartLine },
  { to: '/products', label: 'Products', icon: RiBox3Line },
];

const RoutingBar = () => {
  const { pathname } = useLocation();

  return (
    <>
      <NavigationBar>
        <NavigationBar.Nav>
          {PAGES.map(({ to, label, icon }) => (
            <NavigationBar.Item key={to} asChild active={pathname === to}>
              <Link to={to}>
                <NavigationBar.Icon icon={icon} />
                <NavigationBar.Label>{label}</NavigationBar.Label>
              </Link>
            </NavigationBar.Item>
          ))}
        </NavigationBar.Nav>
      </NavigationBar>
      <Routes>
        {PAGES.map(({ to, label }) => (
          <Route
            key={to}
            path={to}
            element={<p className="p-ws-12 typography-body-md text-ws-static-subtle">{label}</p>}
          />
        ))}
      </Routes>
    </>
  );
};

export const Routing: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`asChild` renders each item as your router\'s `Link`, which holds the icon and the label; `active` comes from the current path, so `aria-current="page"` follows the route.',
      },
      source: {
        code: `import { Link, useLocation } from 'react-router-dom';

const PAGES = [
  { to: '/', label: 'Dashboard', icon: RiHome5Line },
  { to: '/analytics', label: 'Analytics', icon: RiBarChartLine },
  { to: '/products', label: 'Products', icon: RiBox3Line },
];

export function TopBar() {
  const { pathname } = useLocation();

  return (
    <NavigationBar>
      <NavigationBar.Nav>
        {PAGES.map(({ to, label, icon }) => (
          <NavigationBar.Item key={to} asChild active={pathname === to}>
            <Link to={to}>
              <NavigationBar.Icon icon={icon} />
              <NavigationBar.Label>{label}</NavigationBar.Label>
            </Link>
          </NavigationBar.Item>
        ))}
      </NavigationBar.Nav>
    </NavigationBar>
  );
}`,
        language: 'tsx',
        type: 'code',
      },
    },
  },
  render: () => (
    <Router initialEntries={['/analytics']}>
      <RoutingBar />
    </Router>
  ),
};
