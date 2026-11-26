import { ProgressBar } from '@wideset/react';

import { playground, type Values } from '../lib/playground-kit';

const LABEL = 'Uploading assets';

const DESCRIPTIONS: Record<string, string> = {
  default: '12 of 18 files uploaded',
  success: 'All files uploaded',
  error: '3 files could not be uploaded',
};

/** The header and description only exist on the bar; the circle composes its percentage. */
const composed = (v: Values) => v.type === 'bar' && Boolean(v.label);
const circleValue = (v: Values) => v.type === 'circle' && Boolean(v.label);

/** Type and status come from `ProgressBarProps`; this file adds the value and the parts. */
export default playground({
  from: 'ProgressBarProps',
  content: [
    {
      key: 'value',
      label: 'Value',
      type: 'select',
      options: ['10', '35', '65', '100'].map((value) => ({ label: `${value}%`, value })),
      default: '65',
    },
    { key: 'label', label: 'Text', type: 'switch', default: true },
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
          <ProgressBar.Description>{DESCRIPTIONS[String(v.status)]}</ProgressBar.Description>
        </ProgressBar>
      ) : circleValue(v) ? (
        <ProgressBar {...props()} value={Number(v.value)} aria-label={LABEL}>
          <ProgressBar.Value />
          <ProgressBar.Track />
        </ProgressBar>
      ) : (
        <ProgressBar {...props()} value={Number(v.value)} aria-label={LABEL} />
      )}
    </div>
  ),
  code: (v, { attrs }) => {
    const props = [...attrs().trim().split(' '), `value={${v.value}}`].filter(Boolean);
    const open = `<ProgressBar ${[...props, `aria-label="${LABEL}"`].join(' ')}`;
    if (circleValue(v)) {
      return [
        `${open}>`,
        '  <ProgressBar.Value />',
        '  <ProgressBar.Track />',
        '</ProgressBar>',
      ].join('\n');
    }
    if (!composed(v)) return `${open} />`;
    return [
      `<ProgressBar ${props.join(' ')}>`,
      '  <ProgressBar.Header>',
      `    <ProgressBar.Label>${LABEL}</ProgressBar.Label>`,
      '    <ProgressBar.Value />',
      '  </ProgressBar.Header>',
      '  <ProgressBar.Track />',
      `  <ProgressBar.Description>${DESCRIPTIONS[String(v.status)]}</ProgressBar.Description>`,
      '</ProgressBar>',
    ].join('\n');
  },
});
