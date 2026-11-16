import { RiMoreLine } from '@remixicon/react';
import { Toast } from '@wideset/react';

import { playground } from '../lib/playground-kit';

const COPY: Record<string, { message: string; description: string; action: string }> = {
  neutral: {
    message: 'Changes saved',
    description: 'Your edits are visible to everyone on the project.',
    action: 'View',
  },
  info: {
    message: 'A new version is available',
    description: 'Reload to get the latest fixes and features.',
    action: 'Reload',
  },
  success: {
    message: 'Workspace synced',
    description: '24 files were updated from the shared drive.',
    action: 'Open',
  },
  error: {
    message: 'Unable to publish changes',
    description: 'The server did not respond. Your draft is safe.',
    action: 'Retry',
  },
};
/** Copy for a status the table above does not know yet, so a new status still renders. */
const FALLBACK = COPY.neutral;

/**
 * Status and variant come from `ToastProps`. The toast body renders inline, so the stage
 * shows the toast itself rather than a button that queues one through `ToastProvider` and
 * `useToast()`.
 */
export default playground({
  from: 'ToastProps',
  defaults: { status: 'success' },
  content: [
    { key: 'action', label: 'Action', type: 'switch', default: true },
    { key: 'dismissible', label: 'Dismiss button', type: 'switch', default: true },
  ],
  render: (v, { props }) => {
    const copy = COPY[String(v.status)] ?? FALLBACK;
    const expanded = v.variant === 'expanded';
    return (
      <div className="w-[25rem] max-w-full">
        <Toast {...props()} onDismiss={v.dismissible ? () => {} : undefined}>
          <Toast.Message>{copy.message}</Toast.Message>
          {expanded && <Toast.Description>{copy.description}</Toast.Description>}
          {v.action && (
            <Toast.Action variant={expanded ? 'secondary' : undefined}>{copy.action}</Toast.Action>
          )}
        </Toast>
      </div>
    );
  },
  code: (v, { attrs }) => {
    const copy = COPY[String(v.status)] ?? FALLBACK;
    const expanded = v.variant === 'expanded';
    const children = [
      `  <Toast.Message>${copy.message}</Toast.Message>`,
      expanded ? `  <Toast.Description>${copy.description}</Toast.Description>` : '',
      v.action
        ? `  <Toast.Action${expanded ? ' variant="secondary"' : ''}>${copy.action}</Toast.Action>`
        : '',
    ].filter(Boolean);
    const dismiss = v.dismissible ? ' onDismiss={() => dismiss()}' : '';
    return `<Toast${attrs()}${dismiss}>\n${children.join('\n')}\n</Toast>`;
  },
  /*
   * The expanded toast is the one with every part. `Toast.Message` renders no element of its
   * own; Toast marks the line it draws the message in as `toast-message`.
   */
  anatomy: () => (
    <div className="w-[20rem]">
      <Toast variant="expanded" status="info" onDismiss={() => {}}>
        <Toast.Message>A new version is available</Toast.Message>
        <Toast.Description>Reload to get the latest fixes.</Toast.Description>
        <Toast.IconAction icon={RiMoreLine} aria-label="More" />
        <Toast.Action variant="secondary">Reload</Toast.Action>
      </Toast>
    </div>
  ),
});
