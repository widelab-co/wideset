import { RiCloseLine } from '@remixicon/react';
import { Button, IconButton, Sidepanel } from '@wideset/react';

import { playground } from '../lib/playground-kit';

const SUMMARY = 'Placed on 12 October. Two items, paid by card, shipping to Warsaw.';
const CLOSE_CLASS = 'size-ws-forms-sm p-0';

/** The panel surface drawn in place: the real one portals, covers the page and traps focus. */
const SURFACE =
  'relative flex h-[22rem] max-w-full flex-col overflow-hidden rounded-ws-container-lg bg-ws-static-container shadow-ws-high';

/**
 * The inside of the panel, open, for the gallery card and the Anatomy section. The parts mark
 * themselves; the stand-in surface gets its `data-slot` and a narrower width only for the
 * Anatomy drawing.
 */
const openPanel = (marked: boolean) => (
  <div
    className={`${SURFACE} ${marked ? 'w-full' : 'w-[26rem]'}`}
    {...(marked ? { 'data-slot': 'sidepanel-panel' } : {})}
  >
    <Sidepanel.Actions>
      <Sidepanel.Close asChild>
        <IconButton
          aria-label="Close"
          icon={RiCloseLine}
          preset="border"
          variant="secondary"
          size="sm"
          className={CLOSE_CLASS}
        />
      </Sidepanel.Close>
    </Sidepanel.Actions>
    <Sidepanel.Header>
      <Sidepanel.Title>Order #4821</Sidepanel.Title>
      <Sidepanel.Description>Awaiting shipment</Sidepanel.Description>
    </Sidepanel.Header>
    <Sidepanel.Content>
      <p className="typography-body-md text-ws-static-base">{SUMMARY}</p>
    </Sidepanel.Content>
    <Sidepanel.Footer>
      <Button>Mark as shipped</Button>
      <Button variant="secondary" preset="border">
        Cancel
      </Button>
    </Sidepanel.Footer>
  </div>
);

/**
 * Side and size come from `SidepanelPanelProps`, the two dividers from the header's and the
 * footer's props. The panel always portals and covers the page, so the stage shows the
 * closed trigger; clicking it opens the panel with the controls' side and size.
 */
export default playground({
  from: ['SidepanelPanelProps', 'SidepanelHeaderProps', 'SidepanelFooterProps'],
  rename: {
    'SidepanelHeaderProps.divider': 'headerDivider',
    'SidepanelFooterProps.divider': 'footerDivider',
  },
  labels: { headerDivider: 'Header divider', footerDivider: 'Footer divider' },
  group: { headerDivider: 'Content', footerDivider: 'Content' },
  content: [{ key: 'footer', label: 'Footer', type: 'switch', default: true }],
  render: (v, { props }) => (
    <Sidepanel>
      <Sidepanel.Trigger asChild>
        <Button variant="secondary" preset="border">
          View order details
        </Button>
      </Sidepanel.Trigger>
      <Sidepanel.Panel {...props()}>
        <Sidepanel.Actions>
          <Sidepanel.Close asChild>
            <IconButton
              aria-label="Close"
              icon={RiCloseLine}
              preset="border"
              variant="secondary"
              size="sm"
              className={CLOSE_CLASS}
            />
          </Sidepanel.Close>
        </Sidepanel.Actions>
        <Sidepanel.Header {...props('SidepanelHeaderProps')}>
          <Sidepanel.Title>Order #4821</Sidepanel.Title>
          <Sidepanel.Description>Awaiting shipment</Sidepanel.Description>
        </Sidepanel.Header>
        <Sidepanel.Content>
          <p className="typography-body-md text-ws-static-base">{SUMMARY}</p>
        </Sidepanel.Content>
        {v.footer && (
          <Sidepanel.Footer {...props('SidepanelFooterProps')}>
            <Button>Mark as shipped</Button>
            <Sidepanel.Close asChild>
              <Button variant="secondary" preset="border">
                Cancel
              </Button>
            </Sidepanel.Close>
          </Sidepanel.Footer>
        )}
      </Sidepanel.Panel>
    </Sidepanel>
  ),
  code: (v, { attrs }) => {
    const footer = v.footer
      ? `
    <Sidepanel.Footer${attrs('SidepanelFooterProps')}>
      <Button>Mark as shipped</Button>
      <Sidepanel.Close asChild>
        <Button variant="secondary" preset="border">Cancel</Button>
      </Sidepanel.Close>
    </Sidepanel.Footer>`
      : '';
    return `<Sidepanel>
  <Sidepanel.Trigger asChild>
    <Button variant="secondary" preset="border">View order details</Button>
  </Sidepanel.Trigger>
  <Sidepanel.Panel${attrs()}>
    <Sidepanel.Actions>
      <Sidepanel.Close asChild>
        <IconButton
          aria-label="Close"
          icon={RiCloseLine}
          preset="border"
          variant="secondary"
          size="sm"
          className="${CLOSE_CLASS}"
        />
      </Sidepanel.Close>
    </Sidepanel.Actions>
    <Sidepanel.Header${attrs('SidepanelHeaderProps')}>
      <Sidepanel.Title>Order #4821</Sidepanel.Title>
      <Sidepanel.Description>Awaiting shipment</Sidepanel.Description>
    </Sidepanel.Header>
    <Sidepanel.Content>
      <p className="typography-body-md text-ws-static-base">${SUMMARY}</p>
    </Sidepanel.Content>${footer}
  </Sidepanel.Panel>
</Sidepanel>`;
  },
  preview: () => <Sidepanel>{openPanel(false)}</Sidepanel>,
  // The trigger, then the panel it opens drawn in place: a div stands in for
  // `Sidepanel.Panel`, which only renders in a portal while open.
  anatomy: () => (
    <Sidepanel>
      <div className="flex w-[20rem] flex-col items-start gap-ws-9">
        <Sidepanel.Trigger asChild>
          <Button variant="secondary" preset="border">
            View order details
          </Button>
        </Sidepanel.Trigger>
        {openPanel(true)}
      </div>
    </Sidepanel>
  ),
});
