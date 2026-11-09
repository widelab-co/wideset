import { RiCloseLine, RiSearchLine } from '@remixicon/react';
import type { ArgTypes, Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentPropsWithoutRef } from 'react';
import { useArgs } from 'storybook/preview-api';

import { exampleStory } from '../../stories/example';
import { Button } from '../button/Button';
import { IconButton } from '../button/IconButton';
import SideExample from './examples/sidepanel/side';
import sideSource from './examples/sidepanel/side?raw';
import SizesExample from './examples/sidepanel/sizes';
import sizesSource from './examples/sidepanel/sizes?raw';
import { Sidepanel } from './Sidepanel';
import type { SidepanelPanelProps } from './Sidepanel.types';
import { SidepanelContent } from './SidepanelContent';
import { SidepanelPanel } from './SidepanelPanel';

const sizes: NonNullable<SidepanelPanelProps['size']>[] = ['sm', 'md', 'lg'];

const sides: NonNullable<SidepanelPanelProps['side']>[] = ['right', 'left'];

type SidepanelStoryArgs = ComponentPropsWithoutRef<typeof Sidepanel> &
  Pick<SidepanelPanelProps, 'size' | 'side'>;

const argTypes = {
  open: {
    description: 'Controlled open state. Pair with onOpenChange to update it.',
    control: 'boolean',
    table: { category: 'Behavior', type: { summary: 'boolean' } },
  },
  onOpenChange: {
    description:
      'Called with the next open state when the trigger or a dismiss action is activated.',
    control: false,
    table: { category: 'Events', type: { summary: '(open: boolean) => void' } },
  },
  size: {
    description: 'The size of the panel, controlling its maximum width. Defaults to md.',
    control: 'radio',
    options: sizes,
    table: {
      category: 'Appearance',
      type: { summary: "'sm' | 'md' | 'lg'" },
      defaultValue: { summary: "'md'" },
    },
  },
  side: {
    description: 'The edge the panel slides in from. Defaults to right.',
    control: 'radio',
    options: sides,
    table: {
      category: 'Appearance',
      type: { summary: "'left' | 'right'" },
      defaultValue: { summary: "'right'" },
    },
  },
} satisfies ArgTypes<SidepanelStoryArgs>;

const meta = {
  title: 'Components/Sidepanel',
  tags: ['autodocs'],
  component: Sidepanel,
  subcomponents: {
    'Sidepanel.Header': Sidepanel.Header,
    'Sidepanel.Footer': Sidepanel.Footer,
    'Sidepanel.Panel': SidepanelPanel,
    'Sidepanel.Content': SidepanelContent,
  },
  parameters: {
    docs: {
      description: {
        component: `Sidepanel is an overlay panel that slides in from the left or right edge of the viewport.
Use it for contextual detail views, settings, or secondary flows that don't require full navigation.

Use Modal for a focused confirmation and Popup for lightweight content anchored to a trigger.

**Composition:**
\`\`\`
<Sidepanel>                      — root, controls open state
  <Sidepanel.Trigger />          — opens the panel
  <Sidepanel.Panel>              — panel surface; controls side and size
    <Sidepanel.Actions>          — top-right action bar (close, search, etc.)
      <Sidepanel.Close />        — closes the panel when triggered
    </Sidepanel.Actions>
    <Sidepanel.Header divider>   — top section with title and description
      <Sidepanel.Title />        — accessible dialog title
      <Sidepanel.Description />  — optional supporting text
    </Sidepanel.Header>
    <Sidepanel.Content />        — scrollable body
    <Sidepanel.Footer divider>   — action area
      <Sidepanel.Close />        — closes the panel when triggered
    </Sidepanel.Footer>
  </Sidepanel.Panel>
</Sidepanel>
\`\`\``,
      },
    },
  },
  argTypes,
  render: function Render({ size, side, onOpenChange, ...rootArgs }: SidepanelStoryArgs) {
    const [{ open }, updateArgs] = useArgs<SidepanelStoryArgs>();
    return (
      <Sidepanel
        {...rootArgs}
        open={open}
        onOpenChange={(nextOpen) => {
          updateArgs({ open: nextOpen });
          onOpenChange?.(nextOpen);
        }}
      >
        <Sidepanel.Trigger asChild>
          <Button size="md">Open sidepanel</Button>
        </Sidepanel.Trigger>
        <Sidepanel.Panel side={side} size={size}>
          <Sidepanel.Header>
            <Sidepanel.Title>Sidepanel Title</Sidepanel.Title>
            <Sidepanel.Description>Sidepanel Description</Sidepanel.Description>
          </Sidepanel.Header>
          <Sidepanel.Content>Content here</Sidepanel.Content>
          <Sidepanel.Footer>
            <Sidepanel.Close asChild>
              <Button variant="secondary" preset="border">
                Cancel
              </Button>
            </Sidepanel.Close>
          </Sidepanel.Footer>
        </Sidepanel.Panel>
      </Sidepanel>
    );
  },
} satisfies Meta<typeof Sidepanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground — click Open sidepanel, then use the controls panel to change size and side.',
      },
    },
  },
  args: {
    size: 'md',
    side: 'right',
    open: false,
  },
};

export const Side: Story = exampleStory(SideExample, sideSource);

export const Sizes: Story = exampleStory(SizesExample, sizesSource);

export const Sides: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The panel anchors to the `right` (default) or the `left` edge. Both are full-height and take their width from `size`.',
      },
    },
  },
  render: ({ size }) => (
    <div className="gap-ws-6 flex flex-wrap">
      {sides.map((side) => (
        <Sidepanel key={side}>
          <Sidepanel.Trigger asChild>
            <Button size="md">Open {side}</Button>
          </Sidepanel.Trigger>
          <Sidepanel.Panel size={size} side={side}>
            <Sidepanel.Header>
              <Sidepanel.Title>{side}</Sidepanel.Title>
              <Sidepanel.Description>Sidepanel Description</Sidepanel.Description>
            </Sidepanel.Header>
            <Sidepanel.Content>Content here</Sidepanel.Content>
            <Sidepanel.Footer>
              <Sidepanel.Close asChild>
                <Button preset="filled">Close</Button>
              </Sidepanel.Close>
            </Sidepanel.Footer>
          </Sidepanel.Panel>
        </Sidepanel>
      ))}
    </div>
  ),
  args: Default.args,
};

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Compose the panel with header, scrollable content, action bar, and footer actions.',
      },
    },
  },
  args: Default.args,
  render: function Render({ size, side, onOpenChange, ...rootArgs }: SidepanelStoryArgs) {
    const [{ open }, updateArgs] = useArgs<SidepanelStoryArgs>();
    return (
      <Sidepanel
        {...rootArgs}
        open={open}
        onOpenChange={(nextOpen) => {
          updateArgs({ open: nextOpen });
          onOpenChange?.(nextOpen);
        }}
      >
        <Sidepanel.Trigger asChild>
          <Button size="md">Open sidepanel</Button>
        </Sidepanel.Trigger>
        <Sidepanel.Panel side={side} size={size}>
          <Sidepanel.Actions>
            <IconButton
              aria-label="Search"
              icon={RiSearchLine}
              preset="border"
              variant="secondary"
              size="sm"
              type="button"
              className="size-ws-forms-sm p-0"
            />
            <Sidepanel.Close asChild>
              <IconButton
                aria-label="Close sidepanel"
                icon={RiCloseLine}
                preset="border"
                variant="secondary"
                size="sm"
                type="button"
                className="size-ws-forms-sm p-0"
              />
            </Sidepanel.Close>
          </Sidepanel.Actions>
          <Sidepanel.Header>
            <Sidepanel.Title>Sidepanel Title</Sidepanel.Title>
            <Sidepanel.Description>Sidepanel Description</Sidepanel.Description>
          </Sidepanel.Header>
          <Sidepanel.Content>Content here</Sidepanel.Content>
          <Sidepanel.Footer>
            <Button preset="filled">Save</Button>
            <Sidepanel.Close asChild>
              <Button variant="secondary" preset="border">
                Cancel
              </Button>
            </Sidepanel.Close>
          </Sidepanel.Footer>
        </Sidepanel.Panel>
      </Sidepanel>
    );
  },
};

const INVOICE_FIELDS = [
  ['Customer', 'Acme Corp'],
  ['Issued', '2 October 2025'],
  ['Due', '16 October 2025'],
  ['Payment terms', 'Net 14'],
  ['Currency', 'EUR'],
  ['Purchase order', 'PO-88172'],
  ['Billing contact', 'Anna Kowalska'],
  ['Billing email', 'billing@acme.example'],
  ['Tax ID', 'PL5260001246'],
  ['Amount', '€12,410.00'],
];

const INVOICE_ACTIVITY = [
  ['Anna Kowalska approved the invoice', 'Today, 09:12'],
  ['Tomasz Nowak changed the due date', 'Yesterday, 16:40'],
  ['Reminder sent to billing@acme.example', 'Mon, 08:00'],
  ['Invoice created from PO-88172', '2 Oct, 11:05'],
];

export const LongContent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Content taller than the panel scrolls in a `ScrollArea` between the fixed header and footer; the bar floats in the content’s padding.',
      },
    },
  },
  args: { size: Default.args?.size, side: Default.args?.side },
  render: ({ size, side }) => (
    <Sidepanel>
      <Sidepanel.Trigger asChild>
        <Button size="md">Open invoice</Button>
      </Sidepanel.Trigger>
      <Sidepanel.Panel side={side} size={size}>
        <Sidepanel.Header>
          <Sidepanel.Title>Invoice INV-2041</Sidepanel.Title>
          <Sidepanel.Description>Acme Corp · due 16 October</Sidepanel.Description>
        </Sidepanel.Header>
        <Sidepanel.Content className="gap-ws-12 flex flex-col">
          <dl className="gap-ws-7 grid grid-cols-[10rem_1fr]">
            {INVOICE_FIELDS.map(([term, value]) => (
              <div key={term} className="contents">
                <dt className="typography-body-md text-ws-static-subtle">{term}</dt>
                <dd className="typography-body-md text-ws-static-strong">{value}</dd>
              </div>
            ))}
          </dl>
          <ul className="gap-ws-7 flex flex-col">
            {INVOICE_ACTIVITY.map(([event, time]) => (
              <li key={event} className="gap-ws-2 flex flex-col">
                <span className="typography-body-md text-ws-static-base">{event}</span>
                <span className="typography-caption-md text-ws-static-subtle">{time}</span>
              </li>
            ))}
          </ul>
        </Sidepanel.Content>
        <Sidepanel.Footer>
          <Button preset="filled">Mark as paid</Button>
          <Sidepanel.Close asChild>
            <Button variant="secondary" preset="border">
              Close
            </Button>
          </Sidepanel.Close>
        </Sidepanel.Footer>
      </Sidepanel.Panel>
    </Sidepanel>
  ),
};
