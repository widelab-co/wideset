import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';

import { exampleStory } from '../../stories/example';
import TypesExample from './examples/progress-bar/types';
import typesSource from './examples/progress-bar/types?raw';
import UsageMetersExample from './examples/progress-bar/usage-meters';
import usageMetersSource from './examples/progress-bar/usage-meters?raw';
import VariantsExample from './examples/progress-bar/variants';
import variantsSource from './examples/progress-bar/variants?raw';
import { ProgressBar } from './ProgressBar';
import type { ProgressBarProps } from './ProgressBar.types';

const variants: ProgressBarProps['variant'][] = [
  'default',
  'neutral',
  'warning',
  'success',
  'error',
];
const types: NonNullable<ProgressBarProps['type']>[] = ['bar', 'circle'];

const meta = {
  title: 'Components/ProgressBar',
  tags: ['autodocs'],
  component: ProgressBar,
  parameters: {
    docs: {
      description: {
        component: `
ProgressBar communicates the progress of a task or loading operation.
Two display types are available:
- \`bar\` — a horizontal progress track with optional label, percentage, and helper text
- \`circle\` — a compact inline circular indicator; replaces the ring with an icon on success / error

Use \`neutral\` for a quantity against a limit (seats, storage, API calls) so a page of meters does not fill with the brand colour, and \`warning\` when it nears the limit.
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
        type: { summary: "'default' | 'neutral' | 'warning' | 'success' | 'error'" },
        defaultValue: { summary: 'default' },
      },
    },
    label: {
      control: 'text',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
      if: { arg: 'type', eq: 'bar' },
    },
    description: {
      control: 'text',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
      if: { arg: 'type', eq: 'bar' },
    },
    fixedWidth: {
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
      if: { arg: 'type', eq: 'circle' },
    },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Bar progress indicator with label, percentage, and helper text using the default variant.',
      },
    },
  },
  render: (args) => (
    <div className="max-w-80">
      <ProgressBar {...args} />
    </div>
  ),
  args: {
    type: 'bar',
    variant: 'default',
    value: 33,
    label: 'Label',
    description: 'Description',
    fixedWidth: false,
  },
};

export const Types: Story = exampleStory(TypesExample, typesSource);

export const Variants: Story = exampleStory(VariantsExample, variantsSource);

export const UsageMeters: Story = exampleStory(UsageMetersExample, usageMetersSource);

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

return <ProgressBar type="bar" label="Label" description="Description" value={value} />;`,
      },
    },
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState(0);
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
      <div className="max-w-80">
        <ProgressBar {...args} value={value} />
      </div>
    );
  },
  args: {
    ...Default.args,
    label: 'Label',
    description: 'Description',
  },
};

export const CircleVariant: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Circle indicators for every variant: `default`, `neutral` and `warning` show a progress ring in their colour, `success` replaces it with a check icon, `error` replaces it with an error icon.',
      },
    },
  },
  argTypes: {
    type: { table: { disable: true } },
    variant: { table: { disable: true } },
    label: { table: { disable: true } },
    description: { table: { disable: true } },
  },
  render: (args) => (
    <div className="gap-ws-8 flex flex-col">
      {variants.map((variant) => (
        <ProgressBar key={variant} {...args} type="circle" variant={variant} />
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
          'Use `fixedWidth` when the circle indicator is part of a list or table to prevent the percentage label from causing layout shift.',
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

return <ProgressBar type="circle" fixedWidth value={value} />;`,
      },
    },
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState(0);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const steps = [0, 30, 40, 70, 100];
      let index = 0;
      const interval = setInterval(() => {
        index = (index + 1) % steps.length;
        setValue(steps[index]);
      }, 1000);

      return () => clearInterval(interval);
    }, []);

    return <ProgressBar {...args} value={value} />;
  },
  args: {
    ...Default.args,
    type: 'circle',
    fixedWidth: true,
    label: undefined,
    description: undefined,
  },
};
