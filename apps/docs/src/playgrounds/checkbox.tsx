import { Checkbox } from '@wideset/react';

import { options, playground, type Values } from '../lib/playground-kit';

const LABEL = 'Email me about product updates';
const DESCRIPTION = 'About once a month. Unsubscribe any time.';

const checked = (v: Values) =>
  v.checked === 'indeterminate' ? ('indeterminate' as const) : v.checked === 'checked';

/**
 * Variant and size come from `CheckboxProps`. The checked state and `disabled` belong to
 * the Radix primitive, so they are written here with the label and description.
 */
export default playground({
  from: 'CheckboxProps',
  content: [
    { key: 'label', label: 'Label', type: 'switch', default: true },
    { key: 'description', label: 'Description', type: 'switch', default: true },
    {
      key: 'checked',
      label: 'Checked',
      type: 'select',
      options: options('unchecked', 'checked', 'indeterminate'),
      default: 'checked',
      group: 'State',
    },
    { key: 'disabled', label: 'Disabled', type: 'switch', default: false, group: 'State' },
  ],
  render: (v, { props }) => {
    const common = {
      ...props(),
      defaultChecked: checked(v),
      disabled: Boolean(v.disabled),
    };
    if (!v.label) return <Checkbox key={String(v.checked)} {...common} aria-label={LABEL} />;
    return (
      <Checkbox
        key={String(v.checked)}
        {...common}
        label={LABEL}
        description={v.description ? DESCRIPTION : undefined}
      />
    );
  },
  code: (v, { attrs }) => {
    const props = [
      v.label ? `label="${LABEL}"` : `aria-label="${LABEL}"`,
      v.label && v.description && `description="${DESCRIPTION}"`,
      v.checked === 'checked' && 'defaultChecked',
      v.checked === 'indeterminate' && 'defaultChecked="indeterminate"',
      ...attrs().split(' '),
      v.disabled && 'disabled',
    ].filter(Boolean);
    return props.length > 2
      ? `<Checkbox\n${props.map((prop) => `  ${prop}`).join('\n')}\n/>`
      : `<Checkbox ${props.join(' ')} />`;
  },
  // Composed from Label and Description: the `label` prop draws a plain label, not the parts.
  anatomy: () => (
    <Checkbox defaultChecked>
      <Checkbox.Label>{LABEL}</Checkbox.Label>
      <Checkbox.Description>{DESCRIPTION}</Checkbox.Description>
    </Checkbox>
  ),
});
