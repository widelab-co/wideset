---
'@wideset/react': minor
---

ProgressBar is composed from parts: `ProgressBar.Header`, `.Label`, `.Value` (with `formatValue`), `.Track` and `.Description`, also exported by name. The label names the progressbar and the description describes it (`aria-describedby`).

**Breaking:** `label`, `description`, `fixedWidth` and `getValueLabel` are removed. `className` and `ref` now reach the root, the column that holds the header, track and description, rather than the track; style the track through `ProgressBar.Track`. Without children both types render only their track: a `type="circle"` ProgressBar now shows the ring without its percentage, so compose `<ProgressBar.Value />` and `<ProgressBar.Track />` to keep it. The circle's percentage always reserves room for `100%`. For custom spoken text use `aria-valuetext`.

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
