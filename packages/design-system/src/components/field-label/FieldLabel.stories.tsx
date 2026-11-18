import type { Meta, StoryObj } from '@storybook/react-vite';

import { LinkButton } from '../button/LinkButton';
import { FieldLabel } from './FieldLabel';

const meta = {
  title: 'Helper Components/FieldLabel',
  tags: ['autodocs'],
  component: FieldLabel,
  subcomponents: {
    'FieldLabel.RequiredIndicator': FieldLabel.RequiredIndicator,
    'FieldLabel.Suffix': FieldLabel.Suffix,
    'FieldLabel.Tooltip': FieldLabel.Tooltip,
    'FieldLabel.Aside': FieldLabel.Aside,
  },
  parameters: {
    docs: {
      description: {
        component:
          'FieldLabel is the `<label>` of a form control, the building block FormField renders above the control. The asterisk and suffix text go inside it (`FieldLabel.RequiredIndicator`, which shows only when the label is `required`, and `FieldLabel.Suffix`); the info button and aside are siblings (`FieldLabel.Tooltip`, `FieldLabel.Aside`) laid out by the parent, since a label must not contain a button. Internal: not exported from the package.',
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      table: { category: 'Content', type: { summary: 'ReactNode' } },
    },
    required: {
      control: 'boolean',
      table: {
        category: 'Appearance',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    htmlFor: {
      control: 'text',
      description: "ID of the labeled control. Match this to the control's id.",
      table: { category: 'Behavior', type: { summary: 'string' } },
    },
    className: { control: 'text', table: { category: 'Appearance' } },
  },
} satisfies Meta<typeof FieldLabel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Field Label',
  },
};

export const Required: Story = {
  args: { required: true },
  render: (args) => (
    <FieldLabel {...args}>
      Required Field
      <FieldLabel.RequiredIndicator />
    </FieldLabel>
  ),
};

export const WithSuffix: Story = {
  render: () => (
    <FieldLabel>
      Field Label <FieldLabel.Suffix>(optional)</FieldLabel.Suffix>
    </FieldLabel>
  ),
};

export const WithTooltip: Story = {
  render: () => (
    <div className="gap-ws-3 flex items-start">
      <FieldLabel>Field Label</FieldLabel>
      <FieldLabel.Tooltip>
        This is a helpful tooltip that provides additional information about the field.
      </FieldLabel.Tooltip>
    </div>
  ),
};

export const WithAside: Story = {
  render: () => (
    <div className="gap-ws-8 flex w-[20rem] flex-col">
      <div className="gap-ws-3 flex flex-wrap items-center">
        <FieldLabel>Field Label</FieldLabel>
        <FieldLabel.Aside>0/100</FieldLabel.Aside>
      </div>
      <div className="gap-ws-3 flex flex-wrap items-center">
        <FieldLabel>Field Label</FieldLabel>
        <FieldLabel.Aside>
          <LinkButton href="#">Link</LinkButton>
          <span>Other text</span>
        </FieldLabel.Aside>
      </div>
    </div>
  ),
};
