import { RiBugLine, RiCalendarLine } from '@remixicon/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link, MemoryRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import { exampleStory } from '../../stories/example';
import IconsExample from './examples/tabs/icons';
import iconsSource from './examples/tabs/icons?raw';
import SizesExample from './examples/tabs/sizes';
import sizesSource from './examples/tabs/sizes?raw';
import StatesExample from './examples/tabs/states';
import statesSource from './examples/tabs/states?raw';
import TypesExample from './examples/tabs/types';
import typesSource from './examples/tabs/types?raw';
import { Tabs } from './Tabs';
import { TabsItem } from './TabsItem';

const meta = {
  title: 'Components/Tabs',
  tags: ['autodocs'],
  component: Tabs,
  subcomponents: {
    'Tabs.Item': TabsItem,
  },
  parameters: {
    docs: {
      description: {
        component: `Tabs organise content into named sections that the user can switch between without leaving the page.
Use them when content can be cleanly grouped and users benefit from comparing or switching between groups.
Prefer \`regular\` or \`fullWidth\` for content navigation; use \`pills\` for compact filter-style switching, or \`ghost\` for a quieter switcher inside cards and toolbars.

**Composition:**
\`\`\`
<Tabs>                        — root; controls active tab, size, type, and disabled state
  <Tabs.List>                 — tab bar containing trigger buttons
    <Tabs.Item value="…">     — individual tab trigger
      <Tabs.Icon icon={…} />  — optional leading icon
      <Tabs.Label>…</Tabs.Label>  — tab label text
      <Tabs.Count>…</Tabs.Count>  — optional count (a Count)
    </Tabs.Item>
  </Tabs.List>
  <Tabs.Content value="…">    — panel shown when the matching tab is active
    …
  </Tabs.Content>
</Tabs>
\`\`\``,
      },
    },
  },
  argTypes: {
    defaultMotion: { table: { category: 'Behavior', type: { summary: 'boolean' } } },
    type: {
      control: 'radio',
      options: ['regular', 'fullWidth', 'pills', 'ghost'],
      table: {
        category: 'Appearance',
        type: { summary: "'regular' | 'fullWidth' | 'pills' | 'ghost'" },
        defaultValue: { summary: "'regular'" },
      },
    },
    size: {
      control: 'radio',
      options: ['sm', 'lg'],
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'lg'" },
        defaultValue: { summary: "'sm'" },
      },
    },
    divider: {
      control: 'boolean',
      table: {
        category: 'Appearance',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    disabled: {
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    value: {
      description: 'Controlled active tab value.',
      control: 'text',
      table: {
        category: 'Behavior',
        type: { summary: 'string' },
      },
    },
    defaultValue: {
      description: 'Initial active tab value for uncontrolled usage.',
      control: 'text',
      table: {
        category: 'Behavior',
        type: { summary: 'string' },
      },
    },
    onValueChange: {
      description: 'Fired when the active tab changes.',
      table: {
        category: 'Events',
        type: { summary: '(value: string) => void' },
      },
    },
    children: {
      description: 'Compose Tabs.List and Tabs.Content for the available sections.',
      control: false,
      table: { category: 'Content', type: { summary: 'ReactNode' } },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground — use the Controls panel to change `type`, `size`, `divider`, and `disabled`.',
      },
    },
  },
  render: (args) => (
    <Tabs {...args} defaultValue="tab1">
      <Tabs.List>
        <Tabs.Item value="tab1">
          <Tabs.Icon icon={RiCalendarLine} />
          <Tabs.Label>Tab 1</Tabs.Label>
          <Tabs.Count>2</Tabs.Count>
        </Tabs.Item>
        <Tabs.Item value="tab2">
          <Tabs.Icon icon={RiBugLine} />
          <Tabs.Label>Tab 2</Tabs.Label>
        </Tabs.Item>
        <Tabs.Item value="tab3">
          <Tabs.Label>Tab 3</Tabs.Label>
          <Tabs.Count>9</Tabs.Count>
        </Tabs.Item>
      </Tabs.List>
      <Tabs.Content value="tab1" className="py-ws-8">
        Content of tab 1
      </Tabs.Content>
      <Tabs.Content value="tab2" className="py-ws-8">
        Content of tab 2
      </Tabs.Content>
      <Tabs.Content value="tab3" className="py-ws-8">
        Content of tab 3
      </Tabs.Content>
    </Tabs>
  ),
  args: {
    type: 'regular',
    size: 'lg',
    divider: true,
    disabled: false,
  },
};

export const Types: Story = exampleStory(TypesExample, typesSource);

export const Sizes: Story = exampleStory(SizesExample, sizesSource);

export const Icons: Story = exampleStory(IconsExample, iconsSource);

export const Routing: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `asChild` to render each `Tabs.Item` as a router `<Link>`. Pass `active` to force the active visual state based on the current URL instead of Radix internal state, and `tabIndex={-1}` on the link so focus goes to the trigger, not the anchor.',
      },
      source: {
        code: `import { Link, MemoryRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const RoutingTabs = () => {
  const location = useLocation();
  const currentTab = location.pathname.slice(1) || 'tab2';

  return (
    <>
      <Tabs type="pills" value={currentTab}>
        <Tabs.List>
          <Tabs.Item value="tab1" active={location.pathname === '/tab1'} asChild>
            <Link to="/tab1" tabIndex={-1}>
              <Tabs.Label>Link 1</Tabs.Label>
            </Link>
          </Tabs.Item>
          <Tabs.Item value="tab2" active={location.pathname === '/tab2'} asChild>
            <Link to="/tab2" tabIndex={-1}>
              <Tabs.Label>Link 2</Tabs.Label>
            </Link>
          </Tabs.Item>
          <Tabs.Item value="tab3" active={location.pathname === '/tab3'} asChild>
            <Link to="/tab3" tabIndex={-1}>
              <Tabs.Label>Link 3</Tabs.Label>
            </Link>
          </Tabs.Item>
        </Tabs.List>
      </Tabs>

      <Routes>
        <Route path="/tab1" element={<div className="py-ws-8">Content of Tab 1</div>} />
        <Route path="/tab2" element={<div className="py-ws-8">Content of Tab 2</div>} />
        <Route path="/tab3" element={<div className="py-ws-8">Content of Tab 3</div>} />
      </Routes>
    </>
  );
};

export const Routing = () => (
  <Router initialEntries={['/tab2']}>
    <RoutingTabs />
  </Router>
);`,
        language: 'tsx',
        type: 'code',
      },
    },
  },
  render: function Render() {
    const RoutingTabs = () => {
      const location = useLocation();
      const currentTab = location.pathname.slice(1) || 'tab2';

      return (
        <>
          <Tabs type="pills" value={currentTab}>
            <Tabs.List>
              <Tabs.Item value="tab1" active={location.pathname === '/tab1'} asChild>
                <Link to="/tab1" tabIndex={-1}>
                  <Tabs.Label>Link 1</Tabs.Label>
                </Link>
              </Tabs.Item>
              <Tabs.Item value="tab2" active={location.pathname === '/tab2'} asChild>
                <Link to="/tab2" tabIndex={-1}>
                  <Tabs.Label>Link 2</Tabs.Label>
                </Link>
              </Tabs.Item>
              <Tabs.Item value="tab3" active={location.pathname === '/tab3'} asChild>
                <Link to="/tab3" tabIndex={-1}>
                  <Tabs.Label>Link 3</Tabs.Label>
                </Link>
              </Tabs.Item>
            </Tabs.List>
          </Tabs>

          <Routes>
            <Route path="/tab1" element={<div className="py-ws-8">Content of Tab 1</div>} />
            <Route path="/tab2" element={<div className="py-ws-8">Content of Tab 2</div>} />
            <Route path="/tab3" element={<div className="py-ws-8">Content of Tab 3</div>} />
          </Routes>
        </>
      );
    };
    return (
      <Router initialEntries={['/tab2']}>
        <RoutingTabs />
      </Router>
    );
  },
};

export const States: Story = exampleStory(StatesExample, statesSource);

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Tab items can combine `Tabs.Icon`, `Tabs.Label`, and `Tabs.Count`. Use icons to reinforce meaning and counts to surface dynamic quantities such as unread items or pending tasks.',
      },
    },
  },
  render: (args) => (
    <Tabs {...args} defaultValue="tab1">
      <Tabs.List>
        <Tabs.Item value="tab1">
          <Tabs.Icon icon={RiCalendarLine} />
          <Tabs.Label>Calendar</Tabs.Label>
          <Tabs.Count>2</Tabs.Count>
        </Tabs.Item>
        <Tabs.Item value="tab2">
          <Tabs.Icon icon={RiBugLine} />
          <Tabs.Label>Issues</Tabs.Label>
          <Tabs.Count>14</Tabs.Count>
        </Tabs.Item>
        <Tabs.Item value="tab3">
          <Tabs.Label>Overview</Tabs.Label>
        </Tabs.Item>
      </Tabs.List>
      <Tabs.Content value="tab1" className="py-ws-8">
        Calendar content
      </Tabs.Content>
      <Tabs.Content value="tab2" className="py-ws-8">
        Issues content
      </Tabs.Content>
      <Tabs.Content value="tab3" className="py-ws-8">
        Overview content
      </Tabs.Content>
    </Tabs>
  ),
  args: {
    ...Default.args,
  },
};
