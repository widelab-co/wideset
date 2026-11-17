# Feedback

Components that tell the user what happened, what is wrong or how far a task has got, without
being the task itself. Pick by scope (one section, the whole product, or a passing reaction to
an action) and by whether the user has to act. Status names differ per component; check each
spec before setting `status`.

## Pick the right one

- [InlineAlert](./inline-alert.md) — persistent message attached to the section or workflow it
  is about.
- [SystemAlert](./system-alert.md) — full-width, product-wide banner at the top of the page.
- [Toast](./toast.md) — brief, floating, auto-dismissing reaction to an action; shown with
  `useToast()`.
- [Illustration](./illustration.md) — a line drawing for an empty state, a first run or an
  announcement; decorative beside its text.
- [ProgressBar](./progress-bar.md) — percentage progress of one task, as a bar or a compact
  ring.
- [ProgressTracker](./progress-tracker.md) — compact row of step segments for a short ordered
  flow, step names in tooltips.
