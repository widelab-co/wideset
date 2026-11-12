---
name: ProgressStepper
import: import { ProgressStepper } from '@wideset/react'
group: navigation
status: stable
parts: [ProgressStepper, ProgressStepperStep, ProgressStepperIcon]
related: [ProgressTracker, ProgressBar, Tabs]
docs: https://wideset.co/components/progress-stepper
storybook: components-progressstepper--default
---

# ProgressStepper

> Show which named step of an ordered workflow the user is on, and let them go back to one.

## When to use

- Multi-step flows done in order: checkout, onboarding, a wizard inside a `Modal` or page.
- When each step needs a visible title (and optionally a caption).

## When not to use

- Compact progress without step titles → `ProgressTracker`.
- Progress of a single task or upload → `ProgressBar`.
- Sections the user may visit in any order → `Tabs`.

## Anatomy

Array-driven (preferred): statuses are computed from `activeStep`.

```tsx
<ProgressStepper
  steps={[
    { title: 'Account', caption: 'Your details' },
    { title: 'Billing', caption: 'Plan and card' },
    { title: 'Review', caption: 'Confirm and pay' },
  ]}
  activeStep={step}
  onStepChange={setStep}
/>
```

Composed, when you need full control; you then set every step's props yourself:

```tsx
<ProgressStepper activeStep={step} onStepChange={setStep}>
  <ProgressStepper.Step step={0} title="Account" orientation="horizontal" status="completed" />
  <ProgressStepper.Step step={1} title="Billing" orientation="horizontal" status="active" />
  <ProgressStepper.Step step={2} title="Review" orientation="horizontal" status="incomplete" />
</ProgressStepper>
```

## Choosing props

| Prop                | Value                                 | Use for                                                                                  |
| ------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------- |
| `orientation`       | `horizontal` (default)                | Above a full-width form; three to five short titles.                                     |
|                     | `vertical`                            | A side column next to the form; more steps or longer captions.                           |
| `activeStep`        | 0-based index                         | Earlier steps become `completed`, later `incomplete`. `steps.length` marks all complete. |
| `status` (per step) | `error`                               | Flag a step the user must go back and fix; overrides the computed status.                |
|                     | `completed` / `active` / `incomplete` | Manual override; normally leave it to `activeStep`.                                      |
| `allStepsClickable` | boolean                               | Allow jumping ahead to future steps (default: only past and active).                     |
| `disabled`          | boolean                               | Read-only stepper; no step can be clicked.                                               |

## States

- Step status: `completed`, `active`, `incomplete`, `error`.
- Clickable steps (past, active, or all with `allStepsClickable`) report through `onStepChange`.
- Disabled: whole stepper via `disabled`, or future steps by default.

## Content

- Titles are short nouns for the step ("Billing"), sentence case, unique within the stepper.
- Captions are optional, one short line; use the same pattern on every step or none.
- Horizontal: keep to about five steps; beyond that go vertical.

## Accessibility

- Renders an ordered list, so the step count is announced; the active step has
  `aria-current="step"`.
- An `error` status is visual; say what failed in the form itself.

## Do / Don't

- Do keep `activeStep` in your state and change it in `onStepChange` and on Next / Back.
- Do validate before moving forward; the stepper does not block navigation.
- Don't use it as primary navigation between unrelated pages.
- Don't mix `steps` and children; children win and `steps` is ignored.

## Gotchas

- `activeStep` is 0-based; the first step is `0`.
- In composed mode the root does not compute status or pass `orientation`: every
  `ProgressStepper.Step` needs `step`, `title`, `orientation` and usually `status`. The root only
  sets the connecting lines, the active marker and `onStepChange`. Root `disabled` and
  `allStepsClickable` do not reach composed steps; pass `disabled` per step.
- `onStepChange` only reports a click; nothing moves until you update `activeStep`.
- `ProgressStepper.Icon` is the numbered dot; you rarely need it outside a custom step.

## API

Full props: `https://wideset.co/components/progress-stepper.md` · Types:
`packages/design-system/src/components/progress-stepper/ProgressStepper.types.ts`
