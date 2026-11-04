---
'@wideset/react': minor
---

ProgressBar gets a compound API (`ProgressBar.Header`, `.Label`, `.Value`, `.Track`, `.Description`) with `formatValue`, `aria-describedby` and a Radix root for the circle; `label`, `description`, `fixedWidth` and `getValueLabel` are deprecated and will be removed in the next release.

`className` on the root now styles the wrapper instead of the track, so a consumer that styled the track moves that class to `ProgressBar.Track` (Toast is updated):

```tsx
// before
<ProgressBar value={40} className="bg-gray-200" />

// after
<ProgressBar value={40}>
  <ProgressBar.Track className="bg-gray-200" />
</ProgressBar>
```

ProgressBar no longer sets `aria-valuetext` by default (Radix filled it with the rounded percentage), so VoiceOver announces the percentage once instead of twice. Pass `aria-valuetext` on the root for custom text such as "32 of 40 files".

`ProgressBarProps` is now a union, as in Checkbox, so `label` and `description` cannot be combined with `children`. With `asChild`, the root renders onto your single child element and the parts go inside it, for both the bar and the circle.
