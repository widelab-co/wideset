import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';

import { exampleStory } from '../../stories/example';
import CompositionExample from './examples/progress-bar/composition';
import compositionSource from './examples/progress-bar/composition?raw';
import TypesExample from './examples/progress-bar/types';
import typesSource from './examples/progress-bar/types?raw';
import VariantsExample from './examples/progress-bar/variants';
import variantsSource from './examples/progress-bar/variants?raw';
import { ProgressBar } from './ProgressBar';
import type { ProgressBarType, ProgressBarVariant } from './ProgressBar.types';
import { ProgressBarValue } from './ProgressBarValue';

const variants: ProgressBarVariant[] = ['default', 'success', 'error'];
const types: ProgressBarType[] = ['bar', 'circle'];

const useSteppedValue = () => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const steps = [0, 30, 40, 70, 100];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % steps.length;
      setValue(steps[index]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return value;
};

const meta = {
  title: 'Components/ProgressBar',
  tags: ['autodocs'],
  component: ProgressBar,
  subcomponents: { 'ProgressBar.Value': ProgressBarValue },
  parameters: {
    docs: {
      description: {
        component: `ProgressBar communicates the progress of a task or loading operation.
Two display types are available:
- \`bar\` — a horizontal progress track with an optional label, value and helper text
- \`circle\` — a compact inline circular indicator; replaces the ring with an icon on success / error

Use ProgressTracker for progress through discrete steps.

**Optional Composition:**
\`\`\`
<ProgressBar value={32} max={40}>
  <ProgressBar.Header>
    <ProgressBar.Label />
    <ProgressBar.Value formatValue={fn} />
  </ProgressBar.Header>
  <ProgressBar.Track />
  <ProgressBar.Description />
</ProgressBar>
\`\`\``,
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100, step: 1 },
      table: {
        category: 'Content',
        type: { summary: 'number' },
      },
    },
    max: {
      control: { type: 'number', min: 1, step: 1 },
      table: {
        category: 'Content',
        type: { summary: 'number' },
        defaultValue: { summary: '100' },
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
    children: {
      control: false,
      table: { category: 'Content', type: { summary: 'ReactNode' } },
    },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // The playground controls the root; the parts are fixed here.
  render: ({ type, variant, value, max }) => (
    <div className="max-w-80">
      {type === 'circle' ? (
        <ProgressBar
          type="circle"
          variant={variant}
          value={value}
          max={max}
          aria-label="Uploading assets"
        >
          <ProgressBar.Value />
          <ProgressBar.Track />
        </ProgressBar>
      ) : (
        <ProgressBar type="bar" variant={variant} value={value} max={max}>
          <ProgressBar.Header>
            <ProgressBar.Label>Uploading assets</ProgressBar.Label>
            <ProgressBar.Value />
          </ProgressBar.Header>
          <ProgressBar.Track />
          <ProgressBar.Description>12 of 18 files uploaded</ProgressBar.Description>
        </ProgressBar>
      )}
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

export const Composition: Story = exampleStory(CompositionExample, compositionSource);

export const Animated: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The bar and the ring transition smoothly between values. The circle\'s percentage reserves room for "100%", so the ring does not move.',
      },
    },
    controls: { disable: true },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const value = useSteppedValue();

    return (
      <div className="gap-ws-12 flex max-w-80 flex-col">
        <ProgressBar value={value}>
          <ProgressBar.Header>
            <ProgressBar.Label>Uploading assets</ProgressBar.Label>
            <ProgressBar.Value />
          </ProgressBar.Header>
          <ProgressBar.Track />
        </ProgressBar>
        <ProgressBar type="circle" value={value} aria-label="Uploading assets">
          <ProgressBar.Value />
          <ProgressBar.Track />
        </ProgressBar>
      </div>
    );
  },
};

export const CircleVariants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Circle indicators for all three variants: `default` shows a progress ring, `success` replaces it with a check icon, `error` replaces it with an error icon. Without children the circle is the ring alone; compose `ProgressBar.Value` to show the percentage.',
      },
    },
    controls: { disable: true },
  },
  render: () => (
    <div className="gap-ws-8 flex flex-col">
      {variants.map((variant) => (
        <ProgressBar
          key={variant}
          type="circle"
          variant={variant}
          value={75}
          aria-label={`Upload, ${variant}`}
        />
      ))}
    </div>
  ),
};
