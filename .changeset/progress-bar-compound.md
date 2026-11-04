---
'@wideset/react': minor
---

ProgressBar is composed from parts: `ProgressBar.Header`, `.Label`, `.Value` (the percentage, or your own text as children), `.Track` and `.Description`, also exported by name. The label names the progressbar and the description describes it (`aria-describedby`).

**Breaking:** `variant` is renamed to `status` (`'default' | 'success' | 'error'`, type `ProgressBarStatus`), matching InlineAlert, Toast and SystemAlert. `label`, `description`, `fixedWidth` and `getValueLabel` are removed. `className` and `ref` now reach the root, the column that holds the header, track and description, rather than the track; style the track through `ProgressBar.Track`. Without children both types render only their track: a `type="circle"` ProgressBar now shows the ring without its percentage, so compose `<ProgressBar.Value />` and `<ProgressBar.Track />` to keep it. The circle's percentage always reserves room for `100%`. For custom spoken text use `aria-valuetext`. An invalid `value` (`NaN`, `Infinity`) renders 0 and an invalid `max` (not a number greater than 0) falls back to 100; both warn in the console. Values outside `0…max` are clamped without a warning.

```tsx
// Before
<ProgressBar value={65} label="Uploading assets" description="12 of 18 files uploaded" />

// After
<ProgressBar value={65}>
  <ProgressBar.Header>
    <ProgressBar.Label>Uploading assets</ProgressBar.Label>
    <ProgressBar.Value />
  </ProgressBar.Header>
  <ProgressBar.Track />
  <ProgressBar.Description>12 of 18 files uploaded</ProgressBar.Description>
</ProgressBar>

// Circle: name it with aria-label, compose the percentage
<ProgressBar type="circle" value={50} aria-label="Uploading assets">
  <ProgressBar.Value />
  <ProgressBar.Track />
</ProgressBar>
```
