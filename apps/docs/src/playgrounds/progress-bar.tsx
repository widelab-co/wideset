import { ProgressBar } from '@wideset/react';

import { playground, type Values } from '../lib/playground-kit';

const UPLOAD_LABEL = 'Uploading assets';
const DEFAULT_CONTENT = { label: UPLOAD_LABEL, description: '12 of 18 files uploaded' };

const STATUS_CONTENT: Record<string, { label: string; description: string }> = {
  neutral: { label: 'Storage', description: '100 GB included in your plan' },
  warning: { label: 'API calls', description: 'Calls stop when you reach your monthly limit' },
  success: { label: UPLOAD_LABEL, description: 'All files uploaded' },
  error: { label: UPLOAD_LABEL, description: '3 files could not be uploaded' },
};

const statusContent = (v: Values) => STATUS_CONTENT[String(v.status)] ?? DEFAULT_CONTENT;

const standaloneLabel = (v: Values, label: string, description: string) =>
  v.status === 'warning' ? `${label}. ${description}` : label;

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
  render: (v, { props }) => {
    const { label, description } = statusContent(v);
    return (
      <div className={v.type === 'bar' ? 'w-[20rem] max-w-full' : undefined}>
        {composed(v) ? (
          <ProgressBar {...props()} value={Number(v.value)}>
            <ProgressBar.Header>
              <ProgressBar.Label>{label}</ProgressBar.Label>
              <ProgressBar.Value />
            </ProgressBar.Header>
            <ProgressBar.Track />
            <ProgressBar.Description>{description}</ProgressBar.Description>
          </ProgressBar>
        ) : circleValue(v) ? (
          <ProgressBar
            {...props()}
            value={Number(v.value)}
            aria-label={standaloneLabel(v, label, description)}
          >
            <ProgressBar.Value />
            <ProgressBar.Track />
          </ProgressBar>
        ) : (
          <ProgressBar
            {...props()}
            value={Number(v.value)}
            aria-label={standaloneLabel(v, label, description)}
          />
        )}
      </div>
    );
  },
  code: (v, { attrs }) => {
    const { label, description } = statusContent(v);
    const props = [...attrs().trim().split(' '), `value={${v.value}}`].filter(Boolean);
    const open = `<ProgressBar ${[...props, `aria-label="${standaloneLabel(v, label, description)}"`].join(' ')}`;
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
      `    <ProgressBar.Label>${label}</ProgressBar.Label>`,
      '    <ProgressBar.Value />',
      '  </ProgressBar.Header>',
      '  <ProgressBar.Track />',
      `  <ProgressBar.Description>${description}</ProgressBar.Description>`,
      '</ProgressBar>',
    ].join('\n');
  },
});
