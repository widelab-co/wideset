# ProgressBar

## When to use

- An upload, import or long task the user is watching, with a known percentage.
- A compact percentage in a table row, file list or sidebar (`type="circle"`).
- A quantity against a limit: seats, storage, API calls (`variant="neutral"`, `warning` near the
  limit).

## When not to use

- Progress through discrete steps without titles → `ProgressTracker`.
- Steps with titles the user moves through → `ProgressStepper`.
- A file row that is still uploading, without a percentage → `FileItem` with `isLoading`.

## Do / Don't

```tsx
// Do: switch variant when the task ends
<ProgressBar variant="success" value={100} label="Uploading assets" description="All 18 files uploaded" />

// Do: a usage meter in neutral, not the brand colour
<ProgressBar variant="neutral" value={24} max={40} label="Seats" description="24 of 40 seats assigned" />

// Don't: a page of usage meters in the default brand fill
<ProgressBar value={64} label="Storage" />   // → variant="neutral"

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
