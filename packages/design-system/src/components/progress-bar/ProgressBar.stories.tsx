import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';

import { exampleStory } from '../../stories/example';
import CompositionExample from './examples/progress-bar/composition';
import compositionSource from './examples/progress-bar/composition?raw';
import TypesExample from './examples/progress-bar/types';
import typesSource from './examples/progress-bar/types?raw';
import VariantsExample from './examples/progress-bar/variants';
import variantsSource from './examples/progress-bar/variants?raw';
import { ProgressBar, ProgressBarValue } from './ProgressBar';
import type { ProgressBarProps } from './ProgressBar.types';

const variants: ProgressBarProps['variant'][] = ['default', 'success', 'error'];
const types: NonNullable<ProgressBarProps['type']>[] = ['bar', 'circle'];

const meta = {
  title: 'Components/ProgressBar',
  tags: ['autodocs'],
  component: ProgressBar,
  subcomponents: {
    'ProgressBar.Value': ProgressBarValue,
  },
  parameters: {
    docs: {
      description: {
        component: `
ProgressBar communicates the progress of a task or loading operation.
Two display types are available:
- \`bar\` — a horizontal progress track with optional label, percentage, and helper text
- \`circle\` — a compact inline circular indicator; replaces the ring with an icon on success / error

**Optional Composition:** with no children it renders the track alone. Compose \`ProgressBar.Header\`, \`.Label\`, \`.Value\`, \`.Track\` and \`.Description\` to lay it out; \`label\` and \`description\` remain as deprecated shorthands.
        `,
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100, step: 1 },
      description: 'Current progress value from 0 to 100.',
      table: {
        category: 'Content',
        type: { summary: 'number' },
      },
    },
    type: {
      control: 'radio',
      options: types,
      table: {
        category: 'Appearance',
        type: { summary: "'bar' | 'circle'" },
        defaultValue: { summary: 'bar' },
      },
    },
    variant: {
      control: 'radio',
      options: variants,
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'success' | 'error'" },
        defaultValue: { summary: 'default' },
      },
    },
    label: { control: false, table: { category: 'Content' } },
    description: { control: false, table: { category: 'Content' } },
    fixedWidth: { control: false, table: { category: 'Behavior' } },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Bar progress indicator composed of a label, the value, the track and a description. Change `type` to `circle` to see the compact form.',
      },
    },
  },
  render: ({ type, variant, value }) => (
    <div className="max-w-80">
      <ProgressBar type={type} variant={variant} value={value} aria-label="Label">
        {type === 'circle' ? (
          <>
            <ProgressBar.Value />
            <ProgressBar.Track />
          </>
        ) : (
          <>
            <ProgressBar.Header>
              <ProgressBar.Label>Label</ProgressBar.Label>
              <ProgressBar.Value />
            </ProgressBar.Header>
            <ProgressBar.Track />
            <ProgressBar.Description>Description</ProgressBar.Description>
          </>
        )}
      </ProgressBar>
    </div>
  ),
  args: {
    type: 'bar',
    variant: 'default',
    value: 33,
  },
};

export const Types: Story = exampleStory(TypesExample, typesSource);

export const Variants: Story = exampleStory(VariantsExample, variantsSource);

const steps = [0, 30, 40, 70, 100];

const useSteps = () => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % steps.length;
      setValue(steps[index]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return value;
};

export const Animated: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The bar transitions smoothly between values. Use this pattern for step-by-step processes.',
      },
      source: {
        code: `const [value, setValue] = useState(0);

useEffect(() => {
  const steps = [0, 30, 40, 70, 100];
  let index = 0;
  const interval = setInterval(() => {
    index = (index + 1) % steps.length;
    setValue(steps[index]);
  }, 1000);

  return () => clearInterval(interval);
}, []);

return (
  <ProgressBar value={value}>
    <ProgressBar.Header>
      <ProgressBar.Label>Label</ProgressBar.Label>
      <ProgressBar.Value />
    </ProgressBar.Header>
    <ProgressBar.Track />
    <ProgressBar.Description>Description</ProgressBar.Description>
  </ProgressBar>
);`,
      },
    },
  },
  render: function Render({ variant }) {
    const value = useSteps();

    return (
      <div className="max-w-80">
        <ProgressBar variant={variant} value={value}>
          <ProgressBar.Header>
            <ProgressBar.Label>Label</ProgressBar.Label>
            <ProgressBar.Value />
          </ProgressBar.Header>
          <ProgressBar.Track />
          <ProgressBar.Description>Description</ProgressBar.Description>
        </ProgressBar>
      </div>
    );
  },
  args: Default.args,
};

export const CircleVariant: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Circle indicators for all three variants: `default` shows a progress ring, `success` replaces it with a check icon, `error` replaces it with an error icon.',
      },
    },
  },
  argTypes: {
    type: { table: { disable: true } },
    variant: { table: { disable: true } },
  },
  render: ({ value }) => (
    <div className="gap-ws-8 flex flex-col">
      {variants.map((variant) => (
        <ProgressBar
          key={variant}
          type="circle"
          variant={variant}
          value={value}
          aria-label={`Sync progress, ${variant}`}
        >
          <ProgressBar.Value />
          <ProgressBar.Track />
        </ProgressBar>
      ))}
    </div>
  ),
  args: {
    ...Default.args,
    value: 75,
  },
};

export const CircleAnimated: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Give `ProgressBar.Value` a fixed width when the circle indicator is part of a list or table, so the changing percentage does not shift the layout.',
      },
      source: {
        code: `const [value, setValue] = useState(0);

useEffect(() => {
  const steps = [0, 30, 40, 70, 100];
  let index = 0;

  const interval = setInterval(() => {
    index = (index + 1) % steps.length;
    setValue(steps[index]);
  }, 1000);

  return () => clearInterval(interval);
}, []);

return (
  <ProgressBar type="circle" value={value} aria-label="Sync progress">
    <ProgressBar.Value className="w-ws-14 inline-block" />
    <ProgressBar.Track />
  </ProgressBar>
);`,
      },
    },
  },
  render: function Render({ variant }) {
    const value = useSteps();

    return (
      <ProgressBar type="circle" variant={variant} value={value} aria-label="Sync progress">
        <ProgressBar.Value className="w-ws-14 inline-block" />
        <ProgressBar.Track />
      </ProgressBar>
    );
  },
  args: {
    ...Default.args,
    type: 'circle',
  },
};

export const Composition: Story = exampleStory(CompositionExample, compositionSource);
