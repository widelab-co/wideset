import { RiCloseLine } from '@remixicon/react';
import { Button, IconButton, StatusModal, type StatusModalStatus } from '@wideset/react';

import { playground, type Values } from '../lib/playground-kit';

const CONTENT: Record<string, { trigger: string; title: string; body: string; confirm: string }> = {
  neutral: {
    trigger: 'Delete workspace',
    title: 'Delete workspace',
    body: 'This workspace and all its contents will be permanently deleted.',
    confirm: 'Delete',
  },
  positive: {
    trigger: 'Complete payment',
    title: 'Payment successful',
    body: 'Your subscription is active. You now have access to every premium feature.',
    confirm: 'Get started',
  },
  notice: {
    trigger: 'Check session',
    title: 'Session expiring',
    body: 'Your session expires in 5 minutes. Save your work to avoid losing changes.',
    confirm: 'Stay signed in',
  },
  information: {
    trigger: 'What’s new',
    title: 'New components available',
    body: 'Version 2.4 adds DataGrid, Timeline and updated form controls.',
    confirm: 'View changelog',
  },
  error: {
    trigger: 'Save changes',
    title: 'Failed to save',
    body: 'Your changes could not be saved. Check your connection and try again.',
    confirm: 'Retry',
  },
};

const content = (v: Values) => CONTENT[String(v.status)];

/**
 * The status tint StatusModal.Content paints with `before:`, spelled out so the docs build
 * generates the classes. Only the inline drawings below need it.
 */
const TINT: Record<string, string> = {
  neutral: '',
  positive: 'before:from-ws-semantic-positive',
  notice: 'before:from-ws-semantic-notice',
  information: 'before:from-ws-semantic-info',
  error: 'before:from-ws-semantic-negative',
};

/**
 * The open dialog drawn in place: StatusModal.Content always portals to the body, so the
 * gallery card and the anatomy copy its frame and keep the real Title, Body, Footer and
 * Close inside it; those mark themselves with `data-slot`. `slots` marks the stand-in frame
 * as the content for the anatomy.
 */
const OpenStatusModal = ({
  status,
  orientation,
  slots = false,
}: {
  status: StatusModalStatus;
  orientation: 'horizontal' | 'vertical';
  slots?: boolean;
}) => {
  const c = CONTENT[status];
  return (
    <StatusModal status={status} orientation={orientation}>
      <div
        {...(slots ? { 'data-slot': 'status-modal-content' } : {})}
        className={`relative isolate flex ${slots ? 'w-full' : 'w-[600px]'} max-w-full flex-col overflow-hidden rounded-ws-container-lg bg-ws-static-overlay shadow-ws-high before:absolute before:inset-0 before:z-ws-deep before:block before:bg-inherit before:bg-linear-to-b before:content-[""] ${orientation === 'vertical' ? 'text-center' : 'text-left'} ${TINT[status]}`}
      >
        <StatusModal.Title>{c.title}</StatusModal.Title>
        <StatusModal.Body>{c.body}</StatusModal.Body>
        <StatusModal.Footer>
          <Button size="sm" variant="secondary" preset="border">
            Cancel
          </Button>
          <Button size="sm" preset="border">
            {c.confirm}
          </Button>
        </StatusModal.Footer>
        <StatusModal.Close asChild>
          <IconButton
            aria-label="Close status modal"
            icon={RiCloseLine}
            preset="border"
            variant="secondary"
            size="sm"
            className="absolute top-ws-11 right-ws-11 size-ws-forms-sm p-0"
          />
        </StatusModal.Close>
      </div>
    </StatusModal>
  );
};

/**
 * Status, orientation and the close button come from `StatusModalProps`; the status order
 * follows Figma rather than the union. The dialog portals to the body, so the stage shows
 * the closed trigger: click it to open the modal with the picked status and layout.
 */
export default playground({
  from: 'StatusModalProps',
  order: { status: ['neutral', 'positive', 'notice', 'information', 'error'] },
  labels: { showCloseButton: 'Close button' },
  group: { showCloseButton: 'Content' },
  render: (v, { props }) => {
    const c = content(v);
    return (
      <StatusModal {...props()}>
        <StatusModal.Trigger asChild>
          <Button>{c.trigger}</Button>
        </StatusModal.Trigger>
        <StatusModal.Content>
          <StatusModal.Title>{c.title}</StatusModal.Title>
          <StatusModal.Body>{c.body}</StatusModal.Body>
          <StatusModal.Footer>
            <StatusModal.Close asChild>
              <Button size="sm" variant="secondary" preset="border">
                Cancel
              </Button>
            </StatusModal.Close>
            <StatusModal.Close asChild>
              <Button size="sm" preset="border">
                {c.confirm}
              </Button>
            </StatusModal.Close>
          </StatusModal.Footer>
        </StatusModal.Content>
      </StatusModal>
    );
  },
  code: (v, { attrs }) => {
    const c = content(v);
    return `<StatusModal${attrs()}>
  <StatusModal.Trigger asChild>
    <Button>${c.trigger}</Button>
  </StatusModal.Trigger>
  <StatusModal.Content>
    <StatusModal.Title>${c.title}</StatusModal.Title>
    <StatusModal.Body>${c.body}</StatusModal.Body>
    <StatusModal.Footer>
      <StatusModal.Close asChild>
        <Button size="sm" variant="secondary" preset="border">
          Cancel
        </Button>
      </StatusModal.Close>
      <StatusModal.Close asChild>
        <Button size="sm" preset="border">
          ${c.confirm}
        </Button>
      </StatusModal.Close>
    </StatusModal.Footer>
  </StatusModal.Content>
</StatusModal>`;
  },
  preview: () => <OpenStatusModal status="positive" orientation="horizontal" />,
  // The trigger, then the dialog it opens drawn in place: StatusModal.Content portals to the
  // body and renders the overlay beside it, so the stand-ins keep that order, the overlay behind.
  anatomy: () => (
    <div className="flex w-[20rem] flex-col items-start gap-ws-9">
      <StatusModal>
        <StatusModal.Trigger asChild>
          <Button variant="secondary" preset="border">
            Check session
          </Button>
        </StatusModal.Trigger>
      </StatusModal>
      <div className="relative w-full p-ws-9">
        <div
          data-slot="status-modal-overlay"
          className="absolute inset-0 rounded-ws-container-md bg-ws-static-scrim-base"
        />
        <OpenStatusModal status="notice" orientation="horizontal" slots />
      </div>
    </div>
  ),
});
