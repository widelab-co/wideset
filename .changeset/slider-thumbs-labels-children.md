---
'@wideset/react': minor
---

Slider: the thumb no longer gets a made-up "Slider thumb" name, `children` render inside the slider (after the thumbs) instead of being dropped, and the slider draws one thumb per value, so `defaultValue={[20, 80]}` is a range on its own. `type` and `labels` still work but are deprecated: the value's length replaces `type`, and `Slider.Label` composed next to the slider replaces the four `labels` layouts.

**Breaking:** a slider with no `aria-label`, `aria-labelledby` or `thumbAriaLabels` now has an unnamed thumb; tests that looked it up with `getByRole('slider', { name: 'Slider thumb' })` need a real name. `type="range"` with a one-item `value` or `defaultValue` draws one thumb, not two. Move off the deprecated props:

```tsx
// before
<Slider type="range" labels="side" defaultValue={[20, 80]} />

// after
<div className="gap-ws-9 flex items-center">
  <Slider.Label>0</Slider.Label>
  <Slider className="min-w-0 flex-1" aria-label="Price" defaultValue={[20, 80]} />
  <Slider.Label>100</Slider.Label>
</div>
```
