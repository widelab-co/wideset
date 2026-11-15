import { InlineAlert } from '@wideset/react';

import { playground } from '../lib/playground-kit';

const COPY: Record<string, { title: string; message: string; action: string }> = {
  info: {
    title: 'New billing cycle',
    message: 'Invoices are now issued on the 1st.',
    action: 'Details',
  },
  success: { title: 'Changes saved', message: 'Your team can see them now.', action: 'View' },
  warning: {
    title: 'Storage almost full',
    message: 'You have used 92% of your plan.',
    action: 'Upgrade',
  },
  error: { title: 'Payment failed', message: 'Your card was declined.', action: 'Retry' },
};

export default playground({
  from: 'InlineAlertProps',
  // `dismissed` hides the alert: nothing left to compare on the stage.
  hide: ['dismissed'],
  order: { status: ['info', 'success', 'warning', 'error'] },
  group: { persistent: 'State' },
  content: [
    { key: 'title', label: 'Title', type: 'switch', default: true },
    { key: 'action', label: 'Action', type: 'switch', default: true },
  ],
  render: (v, { props }) => {
    const copy = COPY[String(v.status)];
    return (
      <InlineAlert
        // A dismissed alert comes back when a control changes.
        key={JSON.stringify(v)}
        className="w-[30rem] max-w-full"
        {...props()}
        title={v.title ? copy.title : undefined}
        message={copy.message}
      >
        {v.action && <InlineAlert.Action>{copy.action}</InlineAlert.Action>}
      </InlineAlert>
    );
  },
  code: (v, { attrs }) => {
    const copy = COPY[String(v.status)];
    const props = [
      ...attrs().split(' ').filter(Boolean),
      v.title && `title="${copy.title}"`,
      `message="${copy.message}"`,
    ].filter(Boolean);
    const open = `<InlineAlert\n${props.map((p) => `  ${p}`).join('\n')}\n`;
    if (!v.action) return `${open}/>`;
    return `${open}>\n  <InlineAlert.Action>${copy.action}</InlineAlert.Action>\n</InlineAlert>`;
  },
});
