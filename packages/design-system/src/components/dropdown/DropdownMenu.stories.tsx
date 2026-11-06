import {
  RiArrowDownSLine,
  RiBugLine,
  RiDownloadLine,
  RiFolderLine,
  RiInformationFill,
  RiLogoutBoxRLine,
  RiStarFill,
  RiTimeLine,
} from '@remixicon/react';
import type { ArgTypes, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useArgs } from 'storybook/preview-api';

import { exampleStory } from '../../stories/example';
import { Avatar } from '../avatar/Avatar';
import { Button } from '../button/Button';
import { IconButton } from '../button/IconButton';
import { ListItem } from '../list-item/ListItem';
import { Switch } from '../switch/Switch';
import { DropdownMenu } from './DropdownMenu';
import type { DropdownMenuContentProps, DropdownMenuProps } from './DropdownMenu.types';
import StatesExample from './examples/dropdown-menu/states';
import statesSource from './examples/dropdown-menu/states?raw';
import VariantsExample from './examples/dropdown-menu/variants';
import variantsSource from './examples/dropdown-menu/variants?raw';

type DropdownMenuStoryArgs = DropdownMenuProps &
  Pick<
    DropdownMenuContentProps,
    'side' | 'align' | 'sideOffset' | 'alignOffset' | 'avoidCollisions'
  >;

const argTypes = {
  onOpenChange: {
    description: 'Called with the next open state when the menu is opened or dismissed.',
    control: false,
    table: { category: 'Events', type: { summary: '(open: boolean) => void' } },
  },
  // Root props (Radix dropdown primitive)
  open: {
    description: 'Controlled open state.',
    control: 'boolean',
    table: {
      type: { summary: 'boolean' },
      category: 'Behavior',
    },
  },
  defaultOpen: {
    description: 'Uncontrolled default open state when component mounts.',
    control: 'boolean',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' },
      category: 'Behavior',
    },
  },
  modal: {
    description:
      'When true, focus is trapped and scrolling outside is prevented. When false, focus moves with the user (e.g. to the trigger on close).',
    control: 'boolean',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'true' },
      category: 'Behavior',
    },
  },
  // Content (Radix DropdownMenu.Content)
  side: {
    description: 'Preferred side of the trigger to render against when open.',
    control: 'radio',
    options: ['top', 'right', 'bottom', 'left'] satisfies DropdownMenuContentProps['side'][],
    table: {
      type: { summary: 'top | right | bottom | left' },
      defaultValue: { summary: 'bottom' },
      category: 'Appearance',
    },
  },
  align: {
    description: 'Alignment of the content relative to the trigger.',
    control: 'radio',
    options: ['start', 'center', 'end'] satisfies DropdownMenuContentProps['align'][],
    table: {
      type: { summary: 'start | center | end' },
      defaultValue: { summary: 'center' },
      category: 'Appearance',
    },
  },
  sideOffset: {
    description: 'Distance in pixels between the trigger and the content. Defaults to `4`.',
    control: { type: 'number', min: 0 },
    table: {
      type: { summary: 'number' },
      defaultValue: { summary: '4' },
      category: 'Appearance',
    },
  },
  alignOffset: {
    description: 'Offset in pixels from the alignment edge. Defaults to `0`.',
    control: { type: 'number' },
    table: {
      type: { summary: 'number' },
      defaultValue: { summary: '0' },
      category: 'Appearance',
    },
  },
  avoidCollisions: {
    description:
      'Allows the content to flip and shift to stay within the viewport. Defaults to `true`.',
    control: 'boolean',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'true' },
      category: 'Appearance',
    },
  },
} satisfies ArgTypes<DropdownMenuStoryArgs>;

const meta = {
  title: 'Components/DropdownMenu',
  tags: ['autodocs'],
  component: DropdownMenu,
  subcomponents: {
    'DropdownMenu.Content': DropdownMenu.Content,
    'DropdownMenu.Item': DropdownMenu.Item,
    'DropdownMenu.Label': DropdownMenu.Label,
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-100 w-full items-center justify-center">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `DropdownMenu is a floating menu anchored to a trigger that presents a short list of contextual actions or commands.
Use it for action menus attached to a specific element (user avatar, "more" buttons, row actions, filter pickers) where each item executes an action immediately on select.

Do not use it for selecting form values (use \`Select\`, \`MultiSelect\`, or \`ComboBox\`), for primary navigation (use \`Sidebar\` or \`Tabs\`), or for long, searchable lists.

**Composition:**
\`\`\`
<DropdownMenu>                — root, owns open/closed state
  <DropdownMenu.Trigger>      — clickable anchor; pass \`asChild\` to wrap a custom button
  <DropdownMenu.Content>      — floating panel; controls placement (side, align, sideOffset)
    <DropdownMenu.Label>      — optional non-interactive section heading
    <DropdownMenu.Item>       — selectable row; compose with ListItem.Prefix/Content/Suffix
    <DropdownMenu.Separator>  — divider between groups of items
</DropdownMenu>
\`\`\``,
      },
    },
  },
  argTypes,
  render: (args: DropdownMenuStoryArgs) => (
    <DropdownMenu open={args.open} onOpenChange={args.onOpenChange} />
  ),
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Minimal dropdown menu with a trigger button and three items. Use the Controls below to experiment with positioning (`side`, `align`, `sideOffset`, `alignOffset`, `avoidCollisions`) and open-state behavior (`modal`).',
      },
      source: {
        code: `<DropdownMenu>
  <DropdownMenu.Trigger asChild>
    <IconButton icon={RiArrowDownSLine} preset="border" variant="secondary" />
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item>
      <ListItem.Prefix>
        <RiDownloadLine className="size-ws-9" />
      </ListItem.Prefix>
      <ListItem.Content>
        <ListItem.Label>Download</ListItem.Label>
      </ListItem.Content>
    </DropdownMenu.Item>
    <DropdownMenu.Item>
      <ListItem.Prefix>
        <RiBugLine className="size-ws-9" />
      </ListItem.Prefix>
      <ListItem.Content>
        <ListItem.Label>Bugs</ListItem.Label>
      </ListItem.Content>
    </DropdownMenu.Item>
    <DropdownMenu.Item>
      <ListItem.Prefix>
        <RiInformationFill className="size-ws-9" />
      </ListItem.Prefix>
      <ListItem.Content>
        <ListItem.Label>More Info</ListItem.Label>
      </ListItem.Content>
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu>`,
      },
    },
  },
  render: function Render(args: DropdownMenuStoryArgs) {
    const [, updateArgs] = useArgs<DropdownMenuStoryArgs>();
    const rootProps: DropdownMenuProps = {
      open: args.open ?? false,
      defaultOpen: args.defaultOpen,
      modal: args.modal,
      onOpenChange: (open: boolean) => {
        updateArgs({ open });
        args.onOpenChange?.(open);
      },
    };

    const contentProps: Pick<
      DropdownMenuContentProps,
      'side' | 'align' | 'sideOffset' | 'alignOffset' | 'avoidCollisions'
    > = {
      side: args.side,
      align: args.align,
      sideOffset: args.sideOffset,
      alignOffset: args.alignOffset,
      avoidCollisions: args.avoidCollisions,
    };

    return (
      <DropdownMenu {...rootProps}>
        <DropdownMenu.Trigger asChild>
          <IconButton icon={RiArrowDownSLine} preset="border" variant="secondary" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content {...contentProps}>
          <DropdownMenu.Item>
            <ListItem.Prefix>
              <RiDownloadLine className="size-ws-9" />
            </ListItem.Prefix>
            <ListItem.Content>
              <ListItem.Label>Download</ListItem.Label>
            </ListItem.Content>
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <ListItem.Prefix>
              <RiBugLine className="size-ws-9" />
            </ListItem.Prefix>
            <ListItem.Content>
              <ListItem.Label>Bugs</ListItem.Label>
            </ListItem.Content>
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <ListItem.Prefix>
              <RiInformationFill className="size-ws-9" />
            </ListItem.Prefix>
            <ListItem.Content>
              <ListItem.Label>More Info</ListItem.Label>
            </ListItem.Content>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  },
  args: {
    side: 'bottom',
    align: 'center',
    sideOffset: 4,
    alignOffset: 0,
    avoidCollisions: true,
    modal: true,
  },
};

export const Variants: Story = exampleStory(VariantsExample, variantsSource);

export const States: Story = exampleStory(StatesExample, statesSource);

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A realistic compound example: profile header, grouped actions with `Separator`, a toggle item with a `Switch` suffix, a disabled item, and a `danger` logout. Demonstrates how `DropdownMenu` composes with `Avatar`, `ListItem`, and `Switch`.',
      },
      source: {
        code: `function CompositionDropdownMenuExample() {
  const [enabled, setEnabled] = useState(true);

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger className="rounded-ws-control-md">
        <Avatar src="..." shape="square" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-60" side="right" align="end">
        <div className="flex items-center gap-ws-5 px-ws-3">
          <Avatar src="..." shape="square" />
          <div>
            <div className="text-dynamic-text-secondary-default typography-label-strong-sm">
              Sandra Marx
            </div>
            <div className="text-ws-static-subtle typography-label-sm">sandra@gmail.com</div>
          </div>
        </div>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onSelect={() => console.log('Integrations Clicked')}>
          <ListItem.Prefix>
            <RiFolderLine className="size-ws-9" />
          </ListItem.Prefix>
          <ListItem.Content>
            <ListItem.Label>Integrations</ListItem.Label>
          </ListItem.Content>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <ListItem.Prefix>
            <RiTimeLine className="size-ws-9" />
          </ListItem.Prefix>
          <ListItem.Content>
            <ListItem.Label>History</ListItem.Label>
          </ListItem.Content>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <ListItem.Prefix>
            <RiStarFill className="size-ws-9" />
          </ListItem.Prefix>
          <ListItem.Content>
            <ListItem.Label>Upgrade to Pro</ListItem.Label>
          </ListItem.Content>
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onSelect={(event) => {
            event.preventDefault();
            setEnabled((prev) => !prev);
          }}
        >
          <ListItem.Prefix>
            <RiInformationFill className="size-ws-9" />
          </ListItem.Prefix>
          <ListItem.Content>
            <ListItem.Label>Switch Option</ListItem.Label>
          </ListItem.Content>
          <ListItem.Suffix>
            <Switch checked={enabled} />
          </ListItem.Suffix>
        </DropdownMenu.Item>
        <DropdownMenu.Item disabled>
          <ListItem.Prefix>
            <RiBugLine className="size-ws-9" />
          </ListItem.Prefix>
          <ListItem.Content>
            <ListItem.Label>Disabled option</ListItem.Label>
          </ListItem.Content>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item variant="danger">
          <ListItem.Prefix>
            <RiLogoutBoxRLine className="size-ws-9" />
          </ListItem.Prefix>
          <ListItem.Content>
            <ListItem.Label>Logout</ListItem.Label>
          </ListItem.Content>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}`,
      },
    },
  },
  render: function Render() {
    const [enabled, setEnabled] = useState(true);

    return (
      <DropdownMenu>
        <DropdownMenu.Trigger className="rounded-ws-control-md">
          <Avatar
            src="https://images.unsplash.com/photo-1601578485193-074b446d451d?q=80&w=160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            shape="square"
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-60" side="right" align="end">
          <div className="gap-ws-5 px-ws-3 flex items-center">
            <Avatar
              src="https://images.unsplash.com/photo-1601578485193-074b446d451d?q=80&w=160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              shape="square"
            />
            <div>
              <div className="text-dynamic-text-secondary-default typography-label-strong-sm">
                Sandra Marx
              </div>
              <div className="text-ws-static-subtle typography-label-sm">sandra@gmail.com</div>
            </div>
          </div>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onSelect={() => console.log('Integrations Clicked')}>
            <ListItem.Prefix>
              <RiFolderLine className="size-ws-9" />
            </ListItem.Prefix>
            <ListItem.Content>
              <ListItem.Label>Integrations</ListItem.Label>
            </ListItem.Content>
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <ListItem.Prefix>
              <RiTimeLine className="size-ws-9" />
            </ListItem.Prefix>
            <ListItem.Content>
              <ListItem.Label>History</ListItem.Label>
            </ListItem.Content>
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <ListItem.Prefix>
              <RiStarFill className="size-ws-9" />
            </ListItem.Prefix>
            <ListItem.Content>
              <ListItem.Label>Upgrade to Pro</ListItem.Label>
            </ListItem.Content>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={(event) => {
              event.preventDefault();
              setEnabled((prev) => !prev);
            }}
          >
            <ListItem.Prefix>
              <RiInformationFill className="size-ws-9" />
            </ListItem.Prefix>
            <ListItem.Content>
              <ListItem.Label>Switch Option</ListItem.Label>
            </ListItem.Content>
            <ListItem.Suffix>
              <Switch checked={enabled} />
            </ListItem.Suffix>
          </DropdownMenu.Item>
          <DropdownMenu.Item disabled>
            <ListItem.Prefix>
              <RiBugLine className="size-ws-9" />
            </ListItem.Prefix>
            <ListItem.Content>
              <ListItem.Label>Disabled option</ListItem.Label>
            </ListItem.Content>
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item variant="danger">
            <ListItem.Prefix>
              <RiLogoutBoxRLine className="size-ws-9" />
            </ListItem.Prefix>
            <ListItem.Content>
              <ListItem.Label>Logout</ListItem.Label>
            </ListItem.Content>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  },
};

const folders = [
  'Inbox',
  'Archive',
  'Design',
  'Engineering',
  'Marketing',
  'Sales',
  'Support',
  'Finance',
  'Legal',
  'Hiring',
  'Onboarding',
  'Roadmap',
  'Research',
  'Releases',
  'Brand',
  'Website',
  'Mobile app',
  'Partners',
  'Events',
  'Q1 planning',
  'Q2 planning',
  'Q3 planning',
  'Q4 planning',
];

export const LongMenu: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A menu taller than the window: it stops 10px short of the window edge and scrolls the rest.',
      },
    },
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary" preset="border">
          Move to
          <Button.Icon icon={RiArrowDownSLine} />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start">
        {folders.map((folder) => (
          <DropdownMenu.Item key={folder}>
            <ListItem.Prefix>
              <RiFolderLine className="size-ws-9" />
            </ListItem.Prefix>
            <ListItem.Label>{folder}</ListItem.Label>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};
