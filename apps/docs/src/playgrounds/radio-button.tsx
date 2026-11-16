import { RadioButton } from '@wideset/react';

import { playground } from '../lib/playground-kit';

/** A radio always lives in a group, which owns the selection; two options make that legible. */
const OPTIONS = [
  { value: 'monthly', label: 'Monthly billing', description: 'Pay as you go, cancel anytime' },
  { value: 'annual', label: 'Annual billing', description: 'Two months free every year' },
];

/**
 * Variant, size and disabled come from `RadioButtonProps`; this file adds the description
 * and wraps the radios in the group that owns the selection.
 */
export default playground({
  from: 'RadioButtonProps',
  // `required` only matters to form validation; nothing changes on the stage.
  hide: ['required'],
  content: [{ key: 'description', label: 'Description', type: 'switch', default: true }],
  render: (v, { props }) => (
    <RadioButton.Group defaultValue="annual">
      {OPTIONS.map(({ value, label, description }) => (
        <RadioButton
          key={value}
          value={value}
          label={label}
          description={v.description ? description : undefined}
          {...props()}
        />
      ))}
    </RadioButton.Group>
  ),
  code: (v, { attrs }) => {
    const radios = OPTIONS.map(({ value, label, description }) => {
      const text = v.description ? ` description="${description}"` : '';
      return `  <RadioButton value="${value}" label="${label}"${text}${attrs()} />`;
    });
    return `<RadioButton.Group defaultValue="annual">\n${radios.join('\n')}\n</RadioButton.Group>`;
  },
  // The composed form, so the label and description are parts of their own.
  anatomy: () => (
    <RadioButton.Group defaultValue="annual">
      <RadioButton value="annual">
        <RadioButton.Label>Annual billing</RadioButton.Label>
        <RadioButton.Description>Two months free every year</RadioButton.Description>
      </RadioButton>
    </RadioButton.Group>
  ),
});
