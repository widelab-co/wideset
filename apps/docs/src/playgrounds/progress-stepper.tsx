import { ProgressStepper } from '@wideset/react';

import { playground, type Values } from '../lib/playground-kit';

const steps = (v: Values) =>
  [
    { title: 'Account', caption: 'Your details' },
    { title: 'Billing', caption: 'Plan and card', error: Boolean(v.error) },
    { title: 'Review', caption: 'Confirm and pay' },
  ].map(({ title, caption, error }) => ({
    title,
    ...(v.captions ? { caption } : {}),
    ...(error ? { status: 'error' as const } : {}),
  }));

/** Orientation, `allStepsClickable` and `disabled` come from `ProgressStepperProps`. */
export default playground({
  from: 'ProgressStepperProps',
  labels: { allStepsClickable: 'All steps clickable' },
  group: { allStepsClickable: 'Behavior' },
  content: [
    { key: 'captions', label: 'Captions', type: 'switch', default: true },
    {
      key: 'activeStep',
      label: 'Active step',
      type: 'select',
      options: [
        { label: 'Account', value: '0' },
        { label: 'Billing', value: '1' },
        { label: 'Review', value: '2' },
        { label: 'All completed', value: '3' },
      ],
      default: '1',
      group: 'State',
    },
    { key: 'error', label: 'Billing failed', type: 'switch', default: false, group: 'State' },
  ],
  render: (v, { props }) => (
    // Horizontal steps take their own width: squeezed, a step's line runs into the next circle.
    <div className={v.orientation === 'vertical' ? 'w-[16rem]' : 'w-max max-w-full'}>
      <ProgressStepper {...props()} steps={steps(v)} activeStep={Number(v.activeStep)} />
    </div>
  ),
  code: (v, { attrs }) => {
    const lines = steps(v).map(
      (step) =>
        `    { ${Object.entries(step)
          .map(([key, value]) => `${key}: '${value}'`)
          .join(', ')} },`,
    );
    const rest = [`activeStep={${v.activeStep}}`, ...attrs().trim().split(' ')].filter(Boolean);
    return `<ProgressStepper\n  steps={[\n${lines.join('\n')}\n  ]}\n${rest
      .map((line) => `  ${line}`)
      .join('\n')}\n/>`;
  },
  // The stage's checkout at its own width: narrower, the steps squeeze and a line overlaps.
  anatomy: () => (
    <div className="w-max">
      <ProgressStepper
        steps={[
          { title: 'Account', caption: 'Your details' },
          { title: 'Billing', caption: 'Plan and card' },
          { title: 'Review', caption: 'Confirm and pay' },
        ]}
        activeStep={1}
      />
    </div>
  ),
});
