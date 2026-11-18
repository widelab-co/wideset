import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';

import { exampleStory } from '../../stories/example';
import { Button } from '../button/Button';
import OrientationExample from './examples/progress-stepper/orientation';
import orientationSource from './examples/progress-stepper/orientation?raw';
import StatusesExample from './examples/progress-stepper/statuses';
import statusesSource from './examples/progress-stepper/statuses?raw';
import { ProgressStepper } from './ProgressStepper';
import type { ProgressStepperProps } from './ProgressStepper.types';
import { ProgressStepperStep } from './ProgressStepperStep';

const orientations: ProgressStepperProps['orientation'][] = ['horizontal', 'vertical'];

const meta = {
  title: 'Components/ProgressStepper',
  tags: ['autodocs'],
  component: ProgressStepper,
  subcomponents: { 'ProgressStepper.Step': ProgressStepperStep },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `ProgressStepper shows the current stage of a sequential workflow.

Steps are driven by the \`steps\` array and a controlled \`activeStep\`. Each step's status is computed automatically. Set the active step index as the length of the \`steps\` array to mark all steps complete.

By default only past and active steps are clickable. Set \`allStepsClickable\` to allow navigation to future steps.

Use ProgressTracker for compact status segments without step titles.

**Optional Composition:**
\`\`\`
<ProgressStepper activeStep={1} onStepChange={setStep}>
  <ProgressStepper.Step />
</ProgressStepper>
\`\`\``,
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'radio',
      options: orientations,
      table: {
        category: 'Appearance',
        type: { summary: '"horizontal" | "vertical"' },
        defaultValue: { summary: '"horizontal"' },
      },
    },
    className: {
      description: 'Additional classes merged with the step list.',
      control: 'text',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
      },
    },
    activeStep: {
      control: { type: 'number', min: 0, step: 1 },
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    allStepsClickable: {
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onStepChange: {
      table: {
        category: 'Events',
        type: { summary: '(step: number) => void' },
      },
    },
    steps: {
      control: false,
      table: {
        category: 'Content',
        type: {
          summary:
            'Array<{ title: string; caption?: string; status?: ProgressStepperIconProps["status"] }>',
        },
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
} satisfies Meta<typeof ProgressStepper>;

export default meta;

type Story = StoryObj<typeof meta>;

const baseSteps: NonNullable<ProgressStepperProps['steps']> = [
  { title: 'Title 1', caption: 'Caption' },
  { title: 'Title 2', caption: 'Caption' },
  { title: 'Title 3', caption: 'Caption' },
  { title: 'Title 4', caption: 'Caption' },
];

const errorSteps: NonNullable<ProgressStepperProps['steps']> = [
  { title: 'Title 1', caption: 'Caption', status: 'error' },
  { title: 'Title 2', caption: 'Caption' },
  { title: 'Title 3', caption: 'Caption' },
  { title: 'Title 4', caption: 'Caption', status: 'error' },
];

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Horizontal stepper with four steps. `activeStep={2}` means steps 0–1 are completed, step 2 is active, and step 3 is incomplete. Click a past step to navigate.',
      },
    },
  },
  render: function Render(args: ProgressStepperProps) {
    const [{ activeStep = 2 }, updateArgs] = useArgs<ProgressStepperProps>();
    const step = activeStep;
    const setStep = (nextStep: number) => {
      updateArgs({ activeStep: nextStep });
      args.onStepChange?.(nextStep);
    };

    return <ProgressStepper {...args} activeStep={step} onStepChange={setStep} />;
  },
  args: {
    steps: baseSteps,
    activeStep: 2,
  },
};

export const Orientation: Story = exampleStory(OrientationExample, orientationSource);

export const Statuses: Story = exampleStory(StatusesExample, statusesSource);

export const AllStepsClickable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'With `allStepsClickable={true}`, future steps become clickable. Useful for non-linear workflows where users can jump ahead freely.',
      },
    },
  },
  render: function Render(args: ProgressStepperProps) {
    const [{ activeStep = 0 }, updateArgs] = useArgs<ProgressStepperProps>();
    const step = activeStep;
    const setStep = (nextStep: number) => {
      updateArgs({ activeStep: nextStep });
      args.onStepChange?.(nextStep);
    };

    return <ProgressStepper {...args} activeStep={step} onStepChange={setStep} />;
  },
  args: {
    ...Default.args,
    allStepsClickable: true,
    activeStep: 0,
  },
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates controlled usage with external Prev/Next buttons driving `activeStep`. Wire `onStepChange` to your state setter to keep the stepper in sync.',
      },
    },
  },
  render: function Render(args: ProgressStepperProps) {
    const [{ activeStep = 1 }, updateArgs] = useArgs<ProgressStepperProps>();
    const step = activeStep;
    // Storybook args hold the step, so this takes a value, not an updater.
    const goToStep = (nextStep: number) => {
      updateArgs({ activeStep: nextStep });
      args.onStepChange?.(nextStep);
    };

    return (
      <div>
        <ProgressStepper {...args} activeStep={step} onStepChange={goToStep} />
        <div className="mt-ws-10 flex justify-between">
          <Button disabled={step === 0} onClick={() => goToStep(step - 1)}>
            Prev step
          </Button>
          <Button disabled={step === baseSteps.length} onClick={() => goToStep(step + 1)}>
            Next step
          </Button>
        </div>
      </div>
    );
  },
  args: {
    ...Default.args,
    activeStep: 1,
  },
};

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Compare the normal progress states with a failed step. Set `status: "error"` on a step definition to mark it as failed.',
      },
    },
  },
  render: function Render(args: ProgressStepperProps) {
    const [{ activeStep = 2 }, updateArgs] = useArgs<ProgressStepperProps>();
    const step = activeStep;
    const setStep = (nextStep: number) => {
      updateArgs({ activeStep: nextStep });
      args.onStepChange?.(nextStep);
    };

    return (
      <div className="gap-ws-8 flex flex-col">
        <section className="gap-ws-4 flex flex-col">
          <p>Completed, active, and incomplete steps</p>
          <ProgressStepper {...args} steps={baseSteps} activeStep={step} onStepChange={setStep} />
        </section>
        <section className="gap-ws-4 flex flex-col">
          <p>Error state</p>
          <ProgressStepper {...args} activeStep={step} onStepChange={setStep} />
        </section>
      </div>
    );
  },
  args: {
    steps: errorSteps,
    activeStep: 2,
  },
};

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `ProgressStepper.Step` children for full manual control over each step's `status` and `orientation`. `onStepChange` is forwarded to each step automatically — click any step to navigate.",
      },
    },
  },
  argTypes: {
    steps: { table: { disable: true } },
  },
  render: function Render(args: ProgressStepperProps) {
    const getComposedStatus = (
      index: number,
      activeStep: number,
    ): 'completed' | 'active' | 'incomplete' => {
      if (index < activeStep) return 'completed';
      if (index === activeStep) return 'active';
      return 'incomplete';
    };

    const [{ activeStep = 1 }, updateArgs] = useArgs<ProgressStepperProps>();
    const step = activeStep;
    const setStep = (nextStep: number) => {
      updateArgs({ activeStep: nextStep });
      args.onStepChange?.(nextStep);
    };
    return (
      <ProgressStepper {...args} activeStep={step} onStepChange={setStep} allStepsClickable>
        <ProgressStepper.Step
          step={0}
          title="Title 1"
          orientation="horizontal"
          status={getComposedStatus(0, step)}
        />
        <ProgressStepper.Step
          step={1}
          title="Title 2"
          orientation="horizontal"
          status={getComposedStatus(1, step)}
        />
        <ProgressStepper.Step
          step={2}
          title="Title 3"
          orientation="horizontal"
          status={getComposedStatus(2, step)}
        />
        <ProgressStepper.Step step={3} title="Title 4" orientation="horizontal" status="error" />
      </ProgressStepper>
    );
  },
  args: {},
};
