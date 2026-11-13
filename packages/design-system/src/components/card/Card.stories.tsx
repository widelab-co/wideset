import { RiDownloadLine } from '@remixicon/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { exampleStory } from '../../stories/example';
import { Button } from '../button/Button';
import { IconButton } from '../button/IconButton';
import { Checkbox } from '../checkbox/Checkbox';
import { FormField } from '../form-field/FormField';
import { StatusBadge } from '../status-badge/StatusBadge';
import { Tag } from '../tag/Tag';
import { TextInput } from '../text-input/TextInput';
import { Card } from './Card';
import type { CardProps } from './Card.types';
import DividerExample from './examples/card/divider';
import dividerSource from './examples/card/divider?raw';
import MediaExample from './examples/card/media';
import mediaSource from './examples/card/media?raw';
import VariantsExample from './examples/card/variants';
import variantsSource from './examples/card/variants?raw';
import WithTableExample from './examples/card/with-table';
import withTableSource from './examples/card/with-table?raw';

const variants: NonNullable<CardProps['variant']>[] = ['bordered', 'flat'];

const mediaRatios = ['21/9', '16/9', '1/1', 2.5] as const;

const meta = {
  title: 'Components/Card',
  tags: ['autodocs'],
  component: Card,
  subcomponents: {
    'Card.Content': Card.Content,
    'Card.Media': Card.Media,
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `Card is a flexible surface for grouping related content, media, and actions into one container.
Use it for previews, summaries, and modular dashboard sections where content benefits from a clear shared boundary.
Do not use it as a general page-layout wrapper or for flows that need modal-style focus and dismissal behavior.

**Composition:**
\`\`\`
<Card>                 — root, controls the visual variant
  <Card.Media>         — optional media area with configurable aspect ratio
  <Card.Header>        — groups the title, description, and optional actions
    <Card.Title>       — primary heading
    <Card.Description> — supporting text below the title
    <Card.Action>      — optional action area for buttons, tags, or badges
  <Card.Content>       — body content; becomes scrollable when height is constrained
  <Card.Footer>        — supporting or primary actions
</Card>
\`\`\``,
      },
    },
  },
  argTypes: {
    variant: {
      description:
        'The visual style of the card. Use `bordered` for a stronger container surface and `flat` when the surrounding layout already provides structure.',
      control: 'radio',
      options: variants,
      table: {
        category: 'Appearance',
        type: { summary: "'bordered' | 'flat'" },
        defaultValue: { summary: 'bordered' },
      },
    },
    divider: {
      control: 'boolean',
      table: {
        category: 'Appearance',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      control: 'text',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
      },
    },
    children: {
      control: false,
      table: {
        category: 'Content',
        type: { summary: 'ReactNode' },
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A login form that mirrors the Figma Card example: a header with a title, description, and a `StatusBadge` in `Card.Action`, a body built from `FormField`, `TextInput`, and `Checkbox`, and a footer with a ghost link-style button on the left and the Cancel / Login actions on the right. The submit button lives in `Card.Footer` and targets the form through the `form` attribute, so the footer can stay outside the form element. Controls for the root variant and layout classes are active.',
      },
    },
  },
  render: (args) => (
    <Card {...args}>
      <Card.Header>
        <div className="gap-ws-9 flex items-start justify-between">
          <div className="flex min-w-0 flex-1 flex-col">
            <Card.Title>Sign in</Card.Title>
            <Card.Description>Use your work email to access the workspace.</Card.Description>
          </div>
          <Card.Action>
            <StatusBadge color="negative" size="lg">
              High Priority
            </StatusBadge>
          </Card.Action>
        </div>
      </Card.Header>
      <Card.Content>
        <form
          id="card-login-form"
          className="gap-ws-11 flex flex-col"
          onSubmit={(event) => event.preventDefault()}
        >
          <FormField label="Email address" htmlFor="card-login-email">
            <TextInput
              id="card-login-email"
              type="email"
              placeholder="e.g. hello@wideset.co"
              autoComplete="email"
            />
          </FormField>
          <FormField label="Password" htmlFor="card-login-password">
            <TextInput
              id="card-login-password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </FormField>
          <Checkbox>
            <Checkbox.Label>
              I agree to the Wideset{' '}
              <a
                href="https://wideset.co/terms"
                target="_blank"
                rel="noreferrer"
                className="text-ws-dynamic-primary-default hover:text-ws-dynamic-primary-hover active:text-ws-dynamic-primary-pressed"
              >
                Terms &amp; Conditions
              </a>
            </Checkbox.Label>
          </Checkbox>
        </form>
      </Card.Content>
      <Card.Footer className="gap-ws-5 items-center justify-between">
        <Button variant="primary" preset="ghost">
          Forgot your password?
        </Button>
        <div className="gap-ws-5 flex">
          <Button variant="secondary" preset="border">
            Cancel
          </Button>
          <Button preset="filled" type="submit" form="card-login-form">
            Login
          </Button>
        </div>
      </Card.Footer>
    </Card>
  ),
  args: {
    variant: 'bordered',
    divider: false,
    className: 'w-100',
  },
};

export const Variants: Story = exampleStory(VariantsExample, variantsSource);

export const Divider: Story = exampleStory(DividerExample, dividerSource);

export const WithTable: Story = exampleStory(WithTableExample, withTableSource);

export const Media: Story = exampleStory(MediaExample, mediaSource);

export const MediaRatio: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `Card.Media` to introduce an image or illustration while keeping the card layout stable. The `ratio` prop accepts both CSS aspect-ratio strings such as `16/9` and numeric values.',
      },
    },
  },
  render: (args) => (
    <div className="gap-ws-8 grid sm:grid-cols-2">
      {mediaRatios.map((ratio) => (
        <Card key={ratio.toString()} {...args}>
          <Card.Media ratio={ratio}>
            <img
              src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
              alt="Lifestyle product preview"
              width="200"
              className="min-h-full min-w-full object-cover"
            />
          </Card.Media>
          <Card.Header>
            <Card.Title>Ratio {ratio.toString()}</Card.Title>
            <Card.Description>Stable media layout using Card.Media.</Card.Description>
          </Card.Header>
        </Card>
      ))}
    </div>
  ),
  args: {
    ...Default.args,
    className: 'w-75',
  },
};

export const ScrollableContent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When the card height is constrained, `Card.Content` becomes scrollable through the built-in `ScrollArea`. Use `contentClassName` to adjust inner padding separately from the scroll container.',
      },
    },
  },
  render: (args) => (
    <div className="gap-ws-8 flex flex-row">
      <Card {...args}>
        <Card.Header>
          <Card.Title>Default content padding</Card.Title>
          <Card.Description>Content scrolls when it exceeds the card height.</Card.Description>
        </Card.Header>
        <Card.Content>
          {Array.from({ length: 8 }, (_, index) => (
            <p key={index} className="mb-ws-4 last:mb-0">
              Paragraph {index + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          ))}
        </Card.Content>
      </Card>
      <Card {...args}>
        <Card.Header>
          <Card.Title>Custom inner padding</Card.Title>
          <Card.Description>
            `contentClassName` adjusts the inner wrapper without changing the scroll area.
          </Card.Description>
        </Card.Header>
        <Card.Content contentClassName="p-ws-4">
          {Array.from({ length: 8 }, (_, index) => (
            <p key={index} className="mb-ws-4 last:mb-0">
              Paragraph {index + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          ))}
        </Card.Content>
      </Card>
    </div>
  ),
  args: {
    ...Default.args,
    className: 'max-h-80 w-87.5',
  },
};

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A richer card can combine media, a header action area, scrollable content, and footer actions while still using the same compound API.',
      },
    },
  },
  render: (args) => (
    <Card {...args}>
      <Card.Media ratio="16/9">
        <img
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=640&h=360&dpr=2&q=80"
          alt="Editorial preview"
          className="min-h-full min-w-full object-cover"
        />
      </Card.Media>
      <Card.Header>
        <div className="gap-ws-5 flex items-start justify-between">
          <div>
            <Card.Title>Release summary</Card.Title>
            <Card.Description>Latest design system updates for this sprint.</Card.Description>
          </div>
          <Card.Action className="gap-ws-6 items-center">
            <Tag color="red" preset="filled" size="lg">
              important
            </Tag>
            <IconButton
              aria-label="Download release summary"
              icon={RiDownloadLine}
              preset="ghost"
              size="sm"
              variant="secondary"
            />
          </Card.Action>
        </div>
      </Card.Header>
      <Card.Content>
        <p className="mb-ws-4">
          Review token updates, documentation changes, and component fixes before publishing the
          next package release.
        </p>
        <p>
          This layout keeps related information and actions grouped while preserving a clear visual
          hierarchy.
        </p>
      </Card.Content>
      <Card.Footer className="gap-ws-5 justify-end">
        <Button variant="secondary" preset="border">
          Dismiss
        </Button>
        <Button preset="filled">Open changelog</Button>
      </Card.Footer>
    </Card>
  ),
  args: Default.args,
};
