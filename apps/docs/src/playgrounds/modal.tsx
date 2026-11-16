import { Button, Modal } from '@wideset/react';

import { options, playground } from '../lib/playground-kit';

/**
 * The stage shows the trigger, not the open dialog: a modal portals to the body and covers
 * the page. Clicking the trigger opens it with the settings from the rail. `persistent`
 * comes from `ModalContentProps`, the footer variant from `ModalFooterProps`.
 */
const BODY = 'Archived projects are read-only. You can restore them from Settings at any time.';

export default playground({
  from: ['ModalContentProps', 'ModalFooterProps'],
  rename: { 'ModalFooterProps.variant': 'footer' },
  // Focus on open changes nothing on the stage.
  hide: ['autoFocusOnOpen'],
  labels: { footer: 'Footer', showCloseButton: 'Close button' },
  group: { persistent: 'Behavior', showCloseButton: 'Content' },
  content: [
    {
      key: 'action',
      label: 'Action',
      type: 'select',
      options: options('primary', 'danger'),
      default: 'primary',
    },
  ],
  render: (v, { props }) => (
    <Modal>
      <Modal.Trigger asChild>
        <Button variant="secondary" preset="border">
          Archive project
        </Button>
      </Modal.Trigger>
      <Modal.Content {...props()}>
        <Modal.Header>
          <Modal.Title>Archive “Website redesign”?</Modal.Title>
          <Modal.Description>Your team will lose edit access.</Modal.Description>
        </Modal.Header>
        <Modal.Body>{BODY}</Modal.Body>
        <Modal.Footer {...props('ModalFooterProps')}>
          <Modal.Close asChild>
            <Button variant="secondary" preset="border">
              Cancel
            </Button>
          </Modal.Close>
          <Modal.Close asChild>
            <Button variant={v.action === 'danger' ? 'danger' : 'primary'}>Archive</Button>
          </Modal.Close>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  ),
  code: (v, { attrs }) =>
    [
      '<Modal>',
      '  <Modal.Trigger asChild>',
      '    <Button variant="secondary" preset="border">',
      '      Archive project',
      '    </Button>',
      '  </Modal.Trigger>',
      `  <Modal.Content${attrs()}>`,
      '    <Modal.Header>',
      '      <Modal.Title>Archive “Website redesign”?</Modal.Title>',
      '      <Modal.Description>Your team will lose edit access.</Modal.Description>',
      '    </Modal.Header>',
      '    <Modal.Body>',
      `      ${BODY}`,
      '    </Modal.Body>',
      `    <Modal.Footer${attrs('ModalFooterProps')}>`,
      '      <Modal.Close asChild>',
      '        <Button variant="secondary" preset="border">',
      '          Cancel',
      '        </Button>',
      '      </Modal.Close>',
      '      <Modal.Close asChild>',
      `        <Button${v.action === 'primary' ? '' : ` variant="${v.action}"`}>Archive</Button>`,
      '      </Modal.Close>',
      '    </Modal.Footer>',
      '  </Modal.Content>',
      '</Modal>',
    ].join('\n'),
  // The modal's own parts, drawn open in place: the real one portals over the page.
  preview: () => (
    <Modal>
      <div className="flex w-[600px] flex-col overflow-hidden rounded-ws-container-md border border-ws-dynamic-secondary-default bg-ws-static-overlay shadow-ws-high">
        <Modal.Header>
          <Modal.Title>Archive “Website redesign”?</Modal.Title>
          <Modal.Description>Your team will lose edit access.</Modal.Description>
        </Modal.Header>
        <Modal.Body>{BODY}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" preset="border">
            Cancel
          </Button>
          <Button>Archive</Button>
        </Modal.Footer>
      </div>
    </Modal>
  ),
  // The trigger, then the dialog it opens drawn in place: Modal.Content portals to the body and
  // renders the overlay beside it, so the stand-ins keep that order, the overlay behind.
  anatomy: () => (
    <Modal>
      <div className="flex w-[20rem] flex-col items-start gap-ws-9">
        <Modal.Trigger asChild>
          <Button variant="secondary" preset="border">
            Archive project
          </Button>
        </Modal.Trigger>
        <div className="relative w-full p-ws-9">
          <div
            data-slot="modal-overlay"
            className="absolute inset-0 rounded-ws-container-md bg-ws-static-scrim-base"
          />
          <div
            data-slot="modal-content"
            className="relative flex flex-col overflow-hidden rounded-ws-container-md border border-ws-dynamic-secondary-default bg-ws-static-overlay shadow-ws-high"
          >
            <Modal.Header>
              <Modal.Title>Archive “Website redesign”?</Modal.Title>
              <Modal.Description>Your team will lose edit access.</Modal.Description>
            </Modal.Header>
            <Modal.Body>{BODY}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" preset="border">
                Cancel
              </Button>
              <Button>Archive</Button>
            </Modal.Footer>
            <Modal.Close className="absolute top-ws-9 right-ws-11" />
          </div>
        </div>
      </div>
    </Modal>
  ),
});
