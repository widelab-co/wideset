import type { Meta, StoryObj } from '@storybook/react-vite';

import { exampleStory } from '../../stories/example';
import EmphasisExample from './examples/shortcut/emphasis';
import emphasisSource from './examples/shortcut/emphasis?raw';
import KeysExample from './examples/shortcut/keys';
import keysSource from './examples/shortcut/keys?raw';
import MenuExample from './examples/shortcut/menu';
import menuSource from './examples/shortcut/menu?raw';
import { Shortcut } from './Shortcut';

const meta = {
  title: 'Components/Shortcut',
  tags: ['autodocs'],
  component: Shortcut,
  parameters: {
    docs: {
      description: {
        component: `Shortcut shows the keyboard shortcut for an action: its keys, in the order they are pressed.
Put it at the end of a menu or sidebar row, or in a sentence that teaches the shortcut. It only displays the keys; your app listens for them.

Use Tag or StatusBadge for a label that is not a key.

**Composition:**
\`\`\`
<Shortcut>        — root, controls emphasis
  <Shortcut.Key>  — one key: a letter, a named key (Esc) or a modifier glyph (⌘ ⇧ ⌥ ⌃)
</Shortcut>
\`\`\``,
      },
    },
  },
  argTypes: {
    emphasis: {
      control: 'radio',
      options: ['strong', 'weak'],
      table: {
        category: 'Appearance',
        type: { summary: "'strong' | 'weak'" },
        defaultValue: { summary: 'strong' },
      },
    },
    children: {
      control: false,
      table: {
        category: 'Content',
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      control: 'text',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Shortcut>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The shortcut that opens search, in the default strong emphasis.',
      },
    },
  },
  args: {
    emphasis: 'strong',
  },
  render: (args) => (
    <Shortcut {...args}>
      <Shortcut.Key>⌘</Shortcut.Key>
      <Shortcut.Key>K</Shortcut.Key>
    </Shortcut>
  ),
};

export const Emphasis: Story = exampleStory(EmphasisExample, emphasisSource);

export const Keys: Story = exampleStory(KeysExample, keysSource);

export const Menu: Story = exampleStory(MenuExample, menuSource);

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A keyboard shortcuts sheet: each action next to its keys, in a description list. The shortcuts line up at the end of the rows whatever their length.',
      },
    },
  },
  argTypes: {
    children: { table: { disable: true } },
  },
  render: (args) => (
    <dl className="gap-ws-5 typography-body-md text-ws-static-strong flex w-[18rem] max-w-full flex-col">
      <div className="flex items-center justify-between">
        <dt>Search</dt>
        <dd>
          <Shortcut {...args}>
            <Shortcut.Key>⌘</Shortcut.Key>
            <Shortcut.Key>K</Shortcut.Key>
          </Shortcut>
        </dd>
      </div>
      <div className="flex items-center justify-between">
        <dt>New invoice</dt>
        <dd>
          <Shortcut {...args}>
            <Shortcut.Key>N</Shortcut.Key>
          </Shortcut>
        </dd>
      </div>
      <div className="flex items-center justify-between">
        <dt>Send invoice</dt>
        <dd>
          <Shortcut {...args}>
            <Shortcut.Key>⌘</Shortcut.Key>
            <Shortcut.Key>Enter</Shortcut.Key>
          </Shortcut>
        </dd>
      </div>
      <div className="flex items-center justify-between">
        <dt>Close panel</dt>
        <dd>
          <Shortcut {...args}>
            <Shortcut.Key>Esc</Shortcut.Key>
          </Shortcut>
        </dd>
      </div>
    </dl>
  ),
  args: Default.args,
};
