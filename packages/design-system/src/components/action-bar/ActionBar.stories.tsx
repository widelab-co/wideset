import {
  RiDeleteBin6Line,
  RiRefreshLine,
  RiSendPlaneLine,
  RiShareForwardLine,
} from '@remixicon/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { exampleStory } from '../../stories/example';
import { Button } from '../button/Button';
import { IconButton } from '../button/IconButton';
import { Tooltip } from '../tooltip/Tooltip';
import { ActionBar } from './ActionBar';
import type { ActionBarProps } from './ActionBar.types';
import AlignmentsExample from './examples/action-bar/alignments';
import alignmentsSource from './examples/action-bar/alignments?raw';
import PositionsExample from './examples/action-bar/positions';
import positionsSource from './examples/action-bar/positions?raw';
import SelectionExample from './examples/action-bar/selection';
import selectionSource from './examples/action-bar/selection?raw';

const positions: NonNullable<ActionBarProps['position']>[] = ['bottom', 'top'];

const aligns: NonNullable<ActionBarProps['align']>[] = ['left', 'center', 'right'];

const meta = {
  title: 'Components/ActionBar',
  tags: ['autodocs'],
  component: ActionBar,
  subcomponents: { 'ActionBar.SelectAll': ActionBar.SelectAll },
  parameters: {
    docs: {
      description: {
        component: `ActionBar is a floating bar that appears while items are selected, with the selection count, Select all and the actions for the selection.
Use it for bulk actions on table rows, list items or files. Actions that need no selection belong in the page or table header as Buttons; confirm a finished bulk action with a Toast.

**Composition:**
\`\`\`
<ActionBar isOpen>         — the floating bar; keep it mounted and toggle isOpen
  <ActionBar.Count>        — the selection count, read out politely as it changes
  <ActionBar.Actions>      — the raised segment
    <ActionBar.SelectAll>  — selects every item, or clears them once all are selected
    <Button size="sm">     — the actions; icon-only ones get an aria-label and a Tooltip
  </ActionBar.Actions>
</ActionBar>
\`\`\``,
      },
    },
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      table: {
        category: 'Behavior',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    position: {
      description: 'Vertical placement of the bar on the screen.',
      control: 'radio',
      options: positions,
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'bottom' },
        type: { summary: "'bottom' | 'top'" },
      },
    },
    align: {
      description: 'Horizontal alignment of the bar on the screen.',
      control: 'radio',
      options: aligns,
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'center' },
        type: { summary: "'left' | 'center' | 'right'" },
      },
    },
    defaultMotion: { table: { category: 'Behavior', type: { summary: 'boolean' } } },
    children: {
      control: false,
      table: { category: 'Content', type: { summary: 'ReactNode' } },
    },
    className: {
      description: 'Additional CSS classes for layout overrides.',
      control: 'text',
      table: { category: 'Appearance', type: { summary: 'string' } },
    },
  },
} satisfies Meta<typeof ActionBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The bar for four selected rows. Toggle `isOpen` to see it animate in and out; the box contains the fixed bar so it stays in the preview.',
      },
    },
  },
  render: (args) => (
    <div className="relative h-[5.5rem] w-[34rem] max-w-full [transform:translateZ(0)]">
      <ActionBar {...args}>
        <ActionBar.Count>4 rows selected</ActionBar.Count>
        <ActionBar.Actions>
          <ActionBar.SelectAll checked="indeterminate" />
          <Button variant="secondary" size="sm">
            <Button.Icon icon={RiSendPlaneLine} />
            Publish
          </Button>
          <Tooltip size="sm" arrow={false}>
            <Tooltip.Trigger asChild>
              <IconButton
                variant="secondary"
                size="sm"
                icon={RiShareForwardLine}
                aria-label="Forward"
              />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Tooltip.Label>Forward</Tooltip.Label>
            </Tooltip.Content>
          </Tooltip>
          <Tooltip size="sm" arrow={false}>
            <Tooltip.Trigger asChild>
              <IconButton variant="secondary" size="sm" icon={RiRefreshLine} aria-label="Refresh" />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Tooltip.Label>Refresh</Tooltip.Label>
            </Tooltip.Content>
          </Tooltip>
          <Tooltip size="sm" arrow={false}>
            <Tooltip.Trigger asChild>
              <IconButton
                variant="danger"
                preset="ghost"
                size="sm"
                icon={RiDeleteBin6Line}
                aria-label="Delete"
              />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Tooltip.Label>Delete</Tooltip.Label>
            </Tooltip.Content>
          </Tooltip>
        </ActionBar.Actions>
      </ActionBar>
    </div>
  ),
  args: {
    isOpen: true,
    position: 'bottom',
    align: 'center',
  },
};

export const Selection: Story = exampleStory(SelectionExample, selectionSource);

export const Positions: Story = exampleStory(PositionsExample, positionsSource);

export const Alignments: Story = exampleStory(AlignmentsExample, alignmentsSource);
