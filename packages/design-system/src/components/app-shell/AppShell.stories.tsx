import type { Meta, StoryObj } from '@storybook/react-vite';

import { exampleStory } from '../../stories/example';
import { AppShell } from './AppShell';
import DefaultExample from './examples/app-shell/default';
import DirectionsExample from './examples/app-shell/directions';
import directionsSource from './examples/app-shell/directions?raw';

const meta = {
  title: 'Components/AppShell',
  tags: ['autodocs'],
  component: AppShell,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `AppShell is the full-height frame a screen sits in: the Sidebar and the page, in the app's visual direction (flat, frame or inset) set by one prop.
Use it once, at the root of every screen, and pick the direction once for the whole app. A \`Sidebar\` inside takes the matching surface on its own.
Do not use it for screens without app navigation (sign in, a marketing page) or to frame a section inside a page: use \`Card\` for that.

**Composition:**
\`\`\`
<AppShell direction="inset">   — full-height row; the window background of the direction
  <Sidebar>…</Sidebar>          — navigation; its surface follows the direction
  <AppShell.Main>               — <main>, the page; the only scroll container
    …                           — page header and content
  </AppShell.Main>
</AppShell>
\`\`\``,
      },
    },
  },
  argTypes: {
    direction: {
      control: 'radio',
      options: ['flat', 'frame', 'inset'],
      table: {
        category: 'Appearance',
        type: { summary: "'flat' | 'frame' | 'inset'" },
        defaultValue: { summary: "'flat'" },
      },
    },
    children: {
      control: false,
      table: { category: 'Content', type: { summary: 'ReactNode' } },
    },
    className: {
      description: 'Additional CSS classes merged with the shell root, for layout only.',
      control: false,
      table: { category: 'Appearance', type: { summary: 'string' } },
    },
  },
} satisfies Meta<typeof AppShell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { direction: 'flat' },
  parameters: {
    docs: {
      description: {
        story:
          'A sidebar and a page in one shell. Switch `direction` in Controls: the window background, the sidebar surface and the page change together.',
      },
    },
  },
  render: (args) => <DefaultExample {...args} />,
};

export const Directions: Story = exampleStory(DirectionsExample, directionsSource);

export const FullScreen: Story = {
  args: { direction: 'inset' },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'The shell at the window size, as a screen uses it: `h-dvh`, the sidebar fixed, only the page scrolls.',
      },
    },
  },
  render: (args) => <DefaultExample {...args} className="h-dvh rounded-none border-0" />,
};
