import type { Meta, StoryObj } from '@storybook/react-vite';

import { exampleStory } from '../../stories/example';
import InTextExample from './examples/text-link/in-text';
import inTextSource from './examples/text-link/in-text?raw';
import { TextLink } from './TextLink';

const meta = {
  title: 'Components/TextLink',
  tags: ['autodocs'],
  component: TextLink,
  parameters: {
    docs: {
      description: {
        component: `TextLink is a link inside running text: it keeps the size and weight of the sentence around it and adds the primary colour and an underline.

Use it in paragraphs, helper text and notes. A standalone route, such as the link under a form, is a LinkButton; an action that does not navigate is a Button.`,
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      table: { category: 'Content', type: { summary: 'ReactNode' } },
    },
    href: {
      control: 'text',
      table: { category: 'Behavior', type: { summary: 'string' } },
    },
    asChild: {
      control: false,
      table: {
        category: 'Behavior',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance', type: { summary: 'string' } },
    },
  },
} satisfies Meta<typeof TextLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'One link in a sentence, with editable controls.' } },
  },
  render: (args) => (
    <p className="typography-body-md text-ws-static-subtle w-[24rem] max-w-full">
      Trouble with signing in? Request a magic <TextLink {...args} /> or reset your password.
    </p>
  ),
  args: {
    children: 'sign-in link',
    href: '#magic-link',
  },
};

export const InText: Story = exampleStory(InTextExample, inTextSource);

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`asChild` puts the styling on your router's link element instead of rendering a second `<a>`. A link that opens a new tab says so in its text and sets `target` and `rel` itself; TextLink adds neither.",
      },
    },
  },
  argTypes: {
    children: { table: { disable: true } },
    href: { table: { disable: true } },
    asChild: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  render: () => (
    <p className="typography-body-md text-ws-static-subtle w-[26rem] max-w-full">
      By creating an account you agree to the{' '}
      <TextLink asChild>
        <a href="/terms" onClick={(event) => event.preventDefault()}>
          Terms of service
        </a>
      </TextLink>{' '}
      and the{' '}
      <TextLink href="https://example.com/privacy" target="_blank" rel="noreferrer">
        Privacy policy (opens in a new tab)
      </TextLink>
      .
    </p>
  ),
};
