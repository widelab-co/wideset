import { SystemAlert } from '@wideset/react';

import { playground } from '../lib/playground-kit';

const COPY: Record<string, { message: string; action: string }> = {
  positive: { message: 'Your workspace is back online', action: 'View status' },
  negative: { message: 'Payment failed for your plan', action: 'Update card' },
  notice: { message: 'Scheduled maintenance tonight at 22:00', action: 'Details' },
  info: { message: 'A new version is ready to install', action: 'Update' },
  neutral: { message: 'You are viewing a shared copy', action: 'Make a copy' },
};

/**
 * Status, emphasis and dismissible come from `SystemAlertProps`. `dismissed` is the
 * controlled state, not a look.
 */
export default playground({
  from: 'SystemAlertProps',
  hide: ['dismissed'],
  group: { dismissible: 'Content' },
  content: [{ key: 'action', label: 'Action', type: 'switch', default: true }],
  render: (v, { props }) => {
    const copy = COPY[String(v.status)];
    return (
      <div className="w-[26rem] max-w-full">
        {/* Remount on every change, so a dismissed alert comes back when a knob turns. */}
        <SystemAlert key={JSON.stringify(v)} {...props()} message={copy.message}>
          {v.action && <SystemAlert.Action>{copy.action}</SystemAlert.Action>}
        </SystemAlert>
      </div>
    );
  },
  code: (v, { attrs }) => {
    const copy = COPY[String(v.status)];
    const props = `${attrs()} message="${copy.message}"`;
    if (!v.action) return `<SystemAlert${props} />`;
    return `<SystemAlert${props}>
  <SystemAlert.Action>${copy.action}</SystemAlert.Action>
</SystemAlert>`;
  },
  // `SystemAlert.Message` renders no element of its own: the alert marks the span it places
  // the text in.
  anatomy: () => (
    <div className="w-[20rem] max-w-full">
      <SystemAlert status="info">
        <SystemAlert.Message>A new version is ready to install</SystemAlert.Message>
        <SystemAlert.Action>Update</SystemAlert.Action>
      </SystemAlert>
    </div>
  ),
});
