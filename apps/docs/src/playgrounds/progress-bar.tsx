import { ProgressBar } from '@wideset/react';

import { playground, type Values } from '../lib/playground-kit';

const LABEL = 'Uploading assets';

const DESCRIPTIONS: Record<string, string> = {
  default: '12 of 18 files uploaded',
  success: 'All files uploaded',
  error: '3 files could not be uploaded',
};

/** The header and description only exist on the bar; the circle shows the percentage alone. */
const composed = (v: Values) => v.type === 'bar' && Boolean(v.label);

/** Type and variant come from `ProgressBarProps`; this file adds the value and the parts. */
export default playground({
  from: 'ProgressBarProps',
  // Deprecated: the parts replace the string props, and the circle always reserves its width.
  hide: ['label', 'description', 'fixedWidth'],
  content: [
    {
      key: 'value',
      label: 'Value',
      type: 'select',
      options: ['10', '35', '65', '100'].map((value) => ({ label: `${value}%`, value })),
      default: '65',
    },
    { key: 'label', label: 'Label and description', type: 'switch', default: true },
  ],
  render: (v, { props }) => (
    <div className={v.type === 'bar' ? 'w-[20rem] max-w-full' : undefined}>
      {composed(v) ? (
        <ProgressBar {...props()} value={Number(v.value)}>
          <ProgressBar.Header>
            <ProgressBar.Label>{LABEL}</ProgressBar.Label>
            <ProgressBar.Value />
          </ProgressBar.Header>
          <ProgressBar.Track />
          <ProgressBar.Description>{DESCRIPTIONS[String(v.variant)]}</ProgressBar.Description>
        </ProgressBar>
      ) : (
        <ProgressBar {...props()} value={Number(v.value)} aria-label={LABEL} />
      )}
    </div>
  ),
  code: (v, { attrs }) => {
    const props = [...attrs().trim().split(' '), `value={${v.value}}`].filter(Boolean);
    if (!composed(v)) return `<ProgressBar ${[...props, `aria-label="${LABEL}"`].join(' ')} />`;
    return [
      `<ProgressBar ${props.join(' ')}>`,
      '  <ProgressBar.Header>',
      `    <ProgressBar.Label>${LABEL}</ProgressBar.Label>`,
      '    <ProgressBar.Value />',
      '  </ProgressBar.Header>',
      '  <ProgressBar.Track />',
      `  <ProgressBar.Description>${DESCRIPTIONS[String(v.variant)]}</ProgressBar.Description>`,
      '</ProgressBar>',
    ].join('\n');
  },
});
