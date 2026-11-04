# ProgressBar

## When to use

- An upload, import or long task the user is watching, with a known percentage.
- A compact percentage in a table row, file list or sidebar (`type="circle"`).

## When not to use

- Progress through discrete steps without titles → `ProgressTracker`.
- Steps with titles the user moves through → `ProgressStepper`.
- A file row that is still uploading, without a percentage → `FileItem` with `isLoading`.

## Do / Don't

```tsx
// Do: switch variant when the task ends; the description follows it
<ProgressBar variant="success" value={100}>
  <ProgressBar.Header>
    <ProgressBar.Label>Uploading assets</ProgressBar.Label>
    <ProgressBar.Value />
  </ProgressBar.Header>
  <ProgressBar.Track />
  <ProgressBar.Description>All 18 files uploaded</ProgressBar.Description>
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
