---
name: ProgressBar
import: import { ProgressBar } from '@wideset/react'
group: feedback
status: stable
parts: [ProgressBar]
related: [ProgressTracker, ProgressStepper, FileItem]
docs: https://wideset.co/components/progress-bar
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
// Bar: label + percentage above, helper text below
<ProgressBar value={65} label="Uploading assets" description="12 of 18 files uploaded" />

// Circle: percentage + ring, no visible label
<ProgressBar type="circle" value={50} aria-label="Uploading assets" />
```

One component, no parts.

## Choosing props

| Prop          | Value           | Use for                                                          |
| ------------- | --------------- | ---------------------------------------------------------------- |
| `type`        | `bar` (default) | Full width of its container, with label and description.         |
|               | `circle`        | Compact inline percentage where a bar does not fit.              |
| `variant`     | `default`       | Still running.                                                   |
|               | `success`       | Finished. Circle shows a check icon; description gets one too.   |
|               | `error`         | Failed. Circle shows an error icon; say what to do next.         |
| `value`       | `0`–`max`       | Clamped into range; `max` defaults to `100`.                     |
| `label`       | string          | Bar: visible label that names it. Circle: the accessible name.   |
| `description` | string          | Bar only: what is happening or what went wrong.                  |
| `fixedWidth`  | `true`          | Circle in a list or table: stops the percentage shifting layout. |

## States

- Running → `variant="default"`; done → `success`; failed → `error`. Change `variant` yourself;
  reaching `100` does not switch it.

## Content

- Label: the task, as a noun phrase: "Uploading assets".
- Description: the count or the outcome: "12 of 18 files uploaded", "Upload stopped: 9 files
  failed. Try again."

## Accessibility

- Both types render `role="progressbar"` with the value.
- Name it: `label` on a bar; `aria-label` (or `label`) on a circle. Without either, the name falls
  back to "Progress".
- Success and error add an icon, so colour is not the only signal.

## Do / Don't

```tsx
// Do: switch variant when the task ends
<ProgressBar variant="success" value={100} label="Uploading assets" description="All 18 files uploaded" />

// Don't: description on a circle (not rendered)
<ProgressBar type="circle" value={40} description="4 of 10" />

// Don't: a step indicator built from a bar
<ProgressBar value={(step / 5) * 100} />   // → ProgressTracker activeStep={step}
```

## Gotchas

- There is no indeterminate mode; a missing `value` renders 0%.
- On `type="bar"`, `className` and `ref` go to the track, not to the wrapper with label and
  description.
- `description` and the visible label exist only on `type="bar"`.
- The bar fills its container's width; constrain the container, not the bar.

## API

Full props: `https://wideset.co/components/progress-bar.md` · Types:
`packages/design-system/src/components/progress-bar/ProgressBar.types.ts`
