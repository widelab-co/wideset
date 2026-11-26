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
docs: https://wideset.co/components/progress-bar
storybook: components-progressbar--default
---

# ProgressBar

> Shows task progress or usage against a limit as a bar or a compact ring.

## When to use

- An upload, import or long task the user is watching, with a known percentage.
- Seats, storage or API calls as a share of a limit. Use `neutral` for normal usage and `warning`
  near the threshold chosen by the application.
- A compact percentage in a table row, file list or sidebar (`type="circle"`).

## When not to use

- Progress through discrete steps without titles → `ProgressTracker`.
- Steps with titles the user moves through → `ProgressStepper`.
- A file row that is still uploading, without a percentage → `FileItem` with `isLoading`.

## Anatomy

```tsx
// Bar: header (label + value) above, description below
<ProgressBar value={32} max={40}>
  <ProgressBar.Header>
    <ProgressBar.Label>Uploading files</ProgressBar.Label>
    <ProgressBar.Value>32 / 40</ProgressBar.Value>
  </ProgressBar.Header>
  <ProgressBar.Track />
  <ProgressBar.Description>8 files remaining</ProgressBar.Description>
</ProgressBar>

// Circle: percentage + ring, no visible label
<ProgressBar type="circle" value={80} aria-label="Syncing library">
  <ProgressBar.Value />
  <ProgressBar.Track />
</ProgressBar>

// No children: the track alone, no text (the bar, or the ring for type="circle")
<ProgressBar value={60} aria-label="Upload" />
```

The root carries `role="progressbar"`, the value, `ref`, `className` and `aria-*`. Parts read
`value`, `max`, `status` and `type` from it:

- `ProgressBar.Header`: the row holding Label and Value (bar).
- `ProgressBar.Label`: the visible label; names the progressbar (`aria-labelledby`).
- `ProgressBar.Value`: the percentage; `formatValue(value, max)` or children replace it.
- `ProgressBar.Track`: the bar and its fill, or the ring (an icon on success and error).
- `ProgressBar.Description`: helper text coloured by the root `status`; describes the progressbar.

## Choosing props

| Prop                | Value           | Use for                                                                  |
| ------------------- | --------------- | ------------------------------------------------------------------------ |
| `type`              | `bar` (default) | Full width of its container, with label and description.                 |
|                     | `circle`        | Compact inline ring where a bar does not fit.                            |
| `status`            | `default`       | A task in progress. Brand fill.                                          |
|                     | `neutral`       | Usage within a limit. Neutral fill.                                      |
|                     | `warning`       | Usage near a limit. Amber fill and a warning icon in the description.    |
|                     | `success`       | Finished. Circle shows a check icon; description gets one too.           |
|                     | `error`         | Failed or exceeded a limit. Circle shows an error icon.                  |
| `value`             | `0`–`max`       | Clamped into range; `max` defaults to `100`.                             |
| `Value.formatValue` | function        | A count from the clamped value: `(value, max) => \`${value} / ${max}\``. |
| `Value` children    | ReactNode       | Fixed text instead of the percentage; wins over `formatValue`.           |
| `aria-valuetext`    | string          | What a screen reader says for the value, when not a percentage.          |

## States

- Task progress uses `default` while running, `success` when complete and `error` on failure.
- Usage uses `neutral` within the limit, `warning` near it and `error` when it is exceeded. Set
  the threshold and update `status` in the application.

## Content

- Name the task or resource, such as "Uploading assets" or "API calls".
- Description: the count or the outcome: "12 of 18 files uploaded", "Upload stopped: 9 files
  failed. Try again."

## Accessibility

- Both types render `role="progressbar"` with the value on the root.
- Name it: `ProgressBar.Label` on a bar; `aria-label` on a circle. Without either, the name falls
  back to "Progress". `ProgressBar.Description` describes it.
- `ProgressBar.Value` text (`formatValue` or children) is visual only. Screen readers hear the percentage; set `aria-valuetext` on the
  root when the shown value means something else.
- Show the value and explain a warning in the description or nearby text. The description adds
  an icon for warning, success and error. For a compact circle, include any warning in its
  accessible name when there is no associated description.

## Do / Don't

```tsx
// Do: switch status when the task ends
<ProgressBar status="success" value={100}>
  <ProgressBar.Header>
    <ProgressBar.Label>Uploading assets</ProgressBar.Label>
    <ProgressBar.Value />
  </ProgressBar.Header>
  <ProgressBar.Track />
  <ProgressBar.Description>All 18 files uploaded</ProgressBar.Description>
</ProgressBar>

// Do: use neutral for normal usage and state the limit in the description
<ProgressBar status="neutral" value={24} max={40}>
  <ProgressBar.Header>
    <ProgressBar.Label>Seats</ProgressBar.Label>
    <ProgressBar.Value />
  </ProgressBar.Header>
  <ProgressBar.Track />
  <ProgressBar.Description>24 of 40 seats assigned</ProgressBar.Description>
</ProgressBar>

// Don't: a description on a circle (the circle composes Value and Track only)
<ProgressBar type="circle" value={40} aria-label="Upload">
  <ProgressBar.Description>4 of 10</ProgressBar.Description>
</ProgressBar>

// Don't: a step indicator built from a bar
<ProgressBar value={(step / 5) * 100} />   // → ProgressTracker activeStep={step}
```

## Gotchas

- There is no indeterminate mode; a missing `value` renders 0%.
- `className` and `ref` go to the root: the column holding header, track and description on a bar.
  Style the track through `ProgressBar.Track`.
- Header, Label and Description are for the bar; the circle composes Value and Track only.
- Without children both types render only the track, with no text. Compose `ProgressBar.Value`
  for the percentage, on a circle too.
- Children replace the default parts entirely: once you pass any, include `ProgressBar.Track`
  yourself, or the bar has no track.
- The bar fills its container's width; constrain the container, not the bar.

## API

Full props: `https://wideset.co/components/progress-bar.md` · Types:
`packages/design-system/src/components/progress-bar/ProgressBar.types.ts`
