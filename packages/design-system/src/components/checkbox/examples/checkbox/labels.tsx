/** A checkbox always has a visible label, except where a column header or a row already says what it selects; then it needs an `aria-label`. The description is not part of the name: screen readers read it after the label, as the description. */
import { Checkbox } from '@wideset/react';

export default function CheckboxLabels() {
  return (
    <div className="gap-ws-11 flex flex-wrap items-start justify-center">
      <Checkbox aria-label="Select row" />
      <Checkbox label="Email me about product updates" />
      <Checkbox
        label="Email me about product updates"
        description="About once a month. Unsubscribe any time."
      />
    </div>
  );
}
