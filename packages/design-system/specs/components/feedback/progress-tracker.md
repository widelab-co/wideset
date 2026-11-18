---
name: ProgressTracker
import: import { ProgressTracker } from '@wideset/react'
group: feedback
status: stable
parts: [ProgressTracker, ProgressTrackerStep]
related: [ProgressStepper, ProgressBar, Tooltip]
docs: https://wideset.co/components/progress-tracker
storybook: components-progresstracker--default
---

# ProgressTracker

> A compact row of status segments: where the user is in a multi-step flow, without step titles.

## When to use

- A short, ordered flow where a glance is enough: checkout (Cart, Shipping, Payment, Review,
  Confirmation), onboarding, a wizard header.
- Space is tight and step names can live in tooltips.

## When not to use

- Each step needs a visible title or caption → `ProgressStepper`.
- Progress is a percentage, not steps → `ProgressBar`.

## Anatomy

```tsx
// Array-driven (default)
<ProgressTracker
  aria-label="Checkout progress"
  activeStep={2}
  steps={[
    { tooltip: { children: 'Cart' } },
    { tooltip: { children: 'Shipping' } },
    { tooltip: { children: 'Payment' } },
    { status: 'error', tooltip: { children: 'Review' } },
  ]}
/>

// Composed
<ProgressTracker activeStep={1} interactive onStepClick={setStep} aria-label="Checkout steps">
  <ProgressTracker.Step tooltip={{ children: 'Cart' }} />
  <ProgressTracker.Step tooltip={{ children: 'Shipping' }} />
  <ProgressTracker.Step tooltip={{ children: 'Payment' }} />
</ProgressTracker>
```

Use `steps` or `ProgressTracker.Step` children; children win when both are given. `tooltip`
takes `Tooltip.Content` props.

## Choosing props

| Prop            | Value                                 | Use for                                                    |
| --------------- | ------------------------------------- | ---------------------------------------------------------- |
| `activeStep`    | index, `0` default                    | Before it: completed; it: active; after: incomplete.       |
|                 | step count                            | Every step completed.                                      |
| step `status`   | `error`                               | Flag one step the user has to go back and fix.             |
|                 | `completed` / `active` / `incomplete` | Override the computed status of one step.                  |
| `interactive`   | `true`                                | Steps become buttons; the user can jump to a step.         |
| `onStepClick`   | `(stepIndex) => void`                 | With `interactive`; zero-based. Update `activeStep` in it. |
| `stepAriaLabel` | `(stepIndex) => string`               | Names interactive steps; default "Step 1", "Step 2", …     |

## States

- Statuses are computed from `activeStep` unless a step sets `status`.
- Interactive steps have hover and press states; the active one gets `aria-current="step"`.

## Content

- Name every step in its tooltip; the segments themselves carry no text.

## Accessibility

- Non-interactive: `role="progressbar"` with value `activeStep` out of the step count. Keep
  `activeStep` pointing at the real step even when you override statuses.
- Interactive: a `group` of buttons; set `stepAriaLabel` to real step names
  (`(i) => names[i]`).
- Give the tracker an `aria-label`; it has no name by default.

## Do / Don't

```tsx
// Do: real names for interactive steps
<ProgressTracker interactive stepAriaLabel={(i) => stepNames[i]} … />

// Don't: status only, no activeStep (screen readers hear 0)
<ProgressTracker steps={[{ status: 'completed' }, { status: 'active' }, {}]} />

// Don't: onStepClick without interactive (steps are not buttons, never fires)
<ProgressTracker onStepClick={setStep} steps={steps} />
```

## Gotchas

- `onStepClick` only fires with `interactive`.
- `activeStep` is clamped to `[0, step count]`; it is controlled only, there is no internal state.
- Do not set `stepIndex` on `ProgressTracker.Step`; the parent injects it.
- `ProgressTracker.Step` throws outside `ProgressTracker`.

## API

Full props: `https://wideset.co/components/progress-tracker.md` · Types:
`packages/design-system/src/components/progress-tracker/ProgressTracker.types.ts`
