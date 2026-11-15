import { RiSearchLine } from '@remixicon/react';
import { TextInput } from '@wideset/react';

import { playground } from '../lib/playground-kit';

const PLACEHOLDER: Record<string, string> = {
  none: 'Project name',
  icon: 'Search projects',
  text: 'your-company',
};

/**
 * Variant, style and size come from `TextInputProps`; this file decides the affix, the
 * placeholder that goes with it, and `disabled`, which the field inherits from `<input>`.
 */
export default playground({
  from: 'TextInputProps',
  content: [
    {
      key: 'affix',
      label: 'Affix',
      type: 'select',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Icon inside', value: 'icon' },
        { label: 'Text outside', value: 'text' },
      ],
      default: 'icon',
    },
    { key: 'disabled', label: 'Disabled', type: 'switch', default: false, group: 'State' },
  ],
  render: (v, { props }) => (
    <div className="w-[20rem] max-w-full">
      <TextInput {...props()} disabled={Boolean(v.disabled)}>
        {v.affix === 'icon' && (
          <TextInput.Prefix inner>
            <TextInput.Icon icon={RiSearchLine} />
          </TextInput.Prefix>
        )}
        {v.affix === 'text' && <TextInput.Prefix>https://</TextInput.Prefix>}
        <TextInput.Input placeholder={PLACEHOLDER[String(v.affix)]} />
        {v.affix === 'text' && <TextInput.Suffix>.com</TextInput.Suffix>}
      </TextInput>
    </div>
  ),
  code: (v, { attrs }) => {
    const open = `<TextInput${attrs()}${v.disabled ? ' disabled' : ''}>`;
    const input = `  <TextInput.Input placeholder="${PLACEHOLDER[String(v.affix)]}" />`;
    if (v.affix === 'icon')
      return `${open}
  <TextInput.Prefix inner>
    <TextInput.Icon icon={RiSearchLine} />
  </TextInput.Prefix>
${input}
</TextInput>`;
    if (v.affix === 'text')
      return `${open}
  <TextInput.Prefix>https://</TextInput.Prefix>
${input}
  <TextInput.Suffix>.com</TextInput.Suffix>
</TextInput>`;
    return `${open}\n${input}\n</TextInput>`;
  },
});
