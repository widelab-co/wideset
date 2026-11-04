---
name: ProgressBar
import: import { ProgressBar } from '@wideset/react'
group: feedback
status: stable
parts:
  [
    ProgressBar,
    ProgressBarHeader,
    ProgressBarLabel,
    ProgressBarValue,
    ProgressBarTrack,
    ProgressBarDescription,
  ]
related: [ProgressTracker, ProgressStepper, FileItem]
docs: https://wideset-docs.widelab.workers.dev/components/progress-bar
storybook: components-progressbar--default
---

# ProgressBar

> How far a task has got, as a percentage: a full-width bar or a compact ring.

## When to use

- An upload, import or long task the user is watching, with a known percentage.
- A compact percentage in a table row, file list or sidebar (`type="circle"`).

## When not to use

- Progress through discrete steps without titles → `ProgressTracker`.
- Steps with titles the user moves through → `ProgressStepper`.
- A file row that is still uploading, without a percentage → `FileItem` with `isLoading`.

## Anatomy

```tsx
// Bar: label and value above, track, helper text below
<ProgressBar value={32} max={40}>
  <ProgressBar.Header>
    <ProgressBar.Label>Uploading files</ProgressBar.Label>
    <ProgressBar.Value formatValue={(value, max) => `${value} / ${max}`} />
  </ProgressBar.Header>
  <ProgressBar.Track />
  <ProgressBar.Description>8 files remaining</ProgressBar.Description>
</ProgressBar>

// Circle: value + ring, no visible label
<ProgressBar type="circle" value={80} aria-label="Sync progress">
  <ProgressBar.Value />
  <ProgressBar.Track />
</ProgressBar>

// No children: the track alone
<ProgressBar value={60} />
```

`Label` names the root and `Description` describes it (`aria-labelledby`, `aria-describedby`).
`Description` takes its state and icon from the root `variant`. `Value` shows the rounded
percentage; `formatValue` or its children replace the text, but screen readers read the Radix
`aria-valuetext`, so set `aria-valuetext` on the root when the visible text differs.

## Choosing props

| Prop          | Value           | Use for                                                              |
| ------------- | --------------- | -------------------------------------------------------------------- |
| `type`        | `bar` (default) | Full width of its container, with label and description.             |
|               | `circle`        | Compact inline percentage where a bar does not fit.                  |
| `variant`     | `default`       | Still running.                                                       |
|               | `success`       | Finished. Circle shows a check icon; description gets one too.       |
|               | `error`         | Failed. Circle shows an error icon; say what to do next.             |
| `value`       | `0`–`max`       | Clamped into range; `max` defaults to `100`.                         |
| `label`       | string          | Deprecated shorthand for `ProgressBar.Label` (circle: `aria-label`). |
| `description` | string          | Deprecated shorthand for `ProgressBar.Description` (bar only).       |
| `fixedWidth`  | `true`          | Deprecated: give `ProgressBar.Value` a fixed width instead.          |

## States

- Running → `variant="default"`; done → `success`; failed → `error`. Change `variant` yourself;
  reaching `100` does not switch it.

## Content

- Label: the task, as a noun phrase: "Uploading assets".
- Description: the count or the outcome: "12 of 18 files uploaded", "Upload stopped: 9 files
  failed. Try again."

## Accessibility

- Both types render `role="progressbar"` with the value.
- Name it: `ProgressBar.Label` on a bar; `aria-label` on a circle. Without either, the name falls
  back to "Progress".
- Success and error add an icon, so colour is not the only signal.

## Do / Don't

```tsx
// Do: switch variant when the task ends
<ProgressBar variant="success" value={100}>
  <ProgressBar.Header>
    <ProgressBar.Label>Uploading assets</ProgressBar.Label>
    <ProgressBar.Value />
  </ProgressBar.Header>
  <ProgressBar.Track />
  <ProgressBar.Description>All 18 files uploaded</ProgressBar.Description>
</ProgressBar>

// Don't: a description on a circle (the circle has no room for it)
<ProgressBar type="circle" value={40} aria-label="Sync"><ProgressBar.Description>4 of 10</ProgressBar.Description></ProgressBar>

// Don't: a step indicator built from a bar
<ProgressBar value={(step / 5) * 100} />   // → ProgressTracker activeStep={step}
```

## Gotchas

- There is no indeterminate mode; a missing `value` renders 0%.
- `className` and `ref` go to the root. Style the bar fill area with `className` on
  `ProgressBar.Track` (it used to style the track).
- `ProgressBar.Header` is for the bar; `label` and `description` shorthands are deprecated.
- The bar fills its container's width; constrain the container, not the bar.

## API

Full props: `https://wideset-docs.widelab.workers.dev/components/progress-bar.md` · Types:
`packages/design-system/src/components/progress-bar/ProgressBar.types.ts`
