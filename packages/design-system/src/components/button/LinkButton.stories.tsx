import type { Meta, StoryObj } from '@storybook/react-vite';

import { exampleStory } from '../../stories/example';
import SizesExample from './examples/link-button/sizes';
import sizesSource from './examples/link-button/sizes?raw';
import StatesExample from './examples/link-button/states';
import statesSource from './examples/link-button/states?raw';
import UnderlinedExample from './examples/link-button/underlined';
import underlinedSource from './examples/link-button/underlined?raw';
import VariantsExample from './examples/link-button/variants';
import variantsSource from './examples/link-button/variants?raw';
import { LinkButton } from './LinkButton';
import type { LinkButtonProps } from './LinkButton.types';

const variants: LinkButtonProps['variant'][] = [
  'primary',
  'secondary',
  'danger',
  'success',
  'inverse',
];

const sizes: LinkButtonProps['size'][] = ['sm', 'lg'];

const meta = {
  title: 'Components/Button/LinkButton',
  tags: ['autodocs'],
  component: LinkButton,
  parameters: {
    docs: {
      description: {
        component: `LinkButton preserves link semantics while applying button-like styling for navigation actions that need stronger visual emphasis.

Use Button for actions and form submission.`,
      },
    },
  },
  argTypes: {
    defaultMotion: {
      description:
        "Turns the component's built-in animations on or off. When omitted, inherits the value from the nearest `MotionProvider`.",
      control: 'boolean',
      table: { category: 'Behavior', type: { summary: 'boolean' } },
    },
    variant: {
      description: 'Visual variant that controls the semantic color treatment of the button.',
      options: variants,
      control: 'radio',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'primary' },
        type: { summary: "'primary' | 'secondary' | 'danger' | 'success' | 'inverse'" },
      },
    },
    children: {
      description: 'Link label or custom content rendered inside the root.',
      control: 'text',
      table: {
        category: 'Content',
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      description: 'Additional CSS classes merged with the link button root.',
      control: 'text',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
      },
    },
    disabled: {
      description:
        'Disabled state that prevents interaction and marks the control as aria-disabled.',
      control: 'boolean',
      table: {
        category: 'Behavior',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    asChild: {
      description:
        'Whether to render the link button styling onto its child element via Radix Slot.',
      control: false,
      table: {
        category: 'Behavior',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    size: {
      description: 'Size of the link button affecting typography only.',
      options: sizes,
      control: 'radio',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'sm' },
        type: { summary: "'sm' | 'lg'" },
      },
    },
    href: {
      description: 'Destination URL used when rendering a native anchor.',
      control: 'text',
      table: {
        category: 'Behavior',
        type: { summary: 'string' },
      },
    },
    underlined: {
      description: 'Renders the label with an underline. Off by default.',
      control: 'boolean',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    onClick: {
      description: 'Called when the user activates the link button.',
      table: {
        category: 'Events',
        type: { summary: '(event: MouseEvent<HTMLAnchorElement>) => void' },
      },
    },
  },
} satisfies Meta<typeof LinkButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Minimal working example for a navigation-style control with the default `primary` variant and `sm` size.',
      },
    },
  },
  render: ({ children, ...args }) => <LinkButton {...args}>{children}</LinkButton>,
  args: {
    children: 'Open details',
    variant: 'primary',
    size: 'sm',
    disabled: false,
    asChild: false,
    underlined: false,
  },
};

export const Variants: Story = exampleStory(VariantsExample, variantsSource);

export const Sizes: Story = exampleStory(SizesExample, sizesSource);

export const Underlined: Story = exampleStory(UnderlinedExample, underlinedSource);

export const States: Story = exampleStory(StatesExample, statesSource);

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Two common composition patterns: use `LinkButton.TruncatedText` when the destination label must fit a narrow layout, and use `asChild` when you need button styling on a custom link implementation while preserving link semantics.',
      },
    },
  },
  argTypes: {
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    asChild: { table: { disable: true } },
    href: { table: { disable: true } },
  },
  render: (args) => (
    <div className="gap-ws-12 flex flex-col">
      <LinkButton {...args} className="w-80">
        <LinkButton.TruncatedText>
          Open the release notes for the current design system iteration
        </LinkButton.TruncatedText>
      </LinkButton>
      <LinkButton {...args} asChild>
        <a href="https://example.com" onClick={(event) => event.preventDefault()}>
          Open details
        </a>
      </LinkButton>
    </div>
  ),
  args: {
    ...Default.args,
    variant: 'secondary',
  },
};
