import { RiCloseLine, RiShareLine } from '@remixicon/react';
import { Button, IconButton, Popup } from '@wideset/react';

import { attrs as pairs, options, playground } from '../lib/playground-kit';

const DESCRIPTION = 'Anyone with the link can view this report, but not edit it.';
const CLOSE_CLASS = 'size-ws-forms-sm shrink-0 p-0';
const SURFACE =
  'flex max-w-full flex-col rounded-ws-container-lg bg-ws-static-overlay shadow-ws-high';
const FRAME = `${SURFACE} w-[492px]`;

/**
 * The stage shows the closed trigger; clicking it opens the popup with the rail's side,
 * alignment and persistence. An open popup would float over the gallery cards. Only
 * `persistent` comes from `PopupContainerProps`: side and align are Radix props the types
 * table does not list, so they are written here with Popup's own defaults.
 */
export default playground({
  from: 'PopupContainerProps',
  group: { persistent: 'Behavior' },
  content: [
    {
      key: 'side',
      label: 'Side',
      type: 'select',
      options: options('bottom', 'top', 'right', 'left'),
      default: 'bottom',
      group: 'Appearance',
    },
    {
      key: 'align',
      label: 'Align',
      type: 'select',
      options: options('start', 'center', 'end'),
      default: 'start',
      group: 'Appearance',
    },
    { key: 'footer', label: 'Footer', type: 'switch', default: true },
  ],
  render: (v, { props }) => (
    <Popup>
      <Popup.Trigger asChild>
        <Button variant="secondary" preset="border">
          <Button.Icon icon={RiShareLine} />
          Share
        </Button>
      </Popup.Trigger>
      <Popup.Container
        {...props()}
        side={v.side as 'bottom' | 'top' | 'right' | 'left'}
        align={v.align as 'start' | 'center' | 'end'}
      >
        <Popup.Header>
          <div className="flex items-center justify-between gap-ws-5">
            <Popup.Title>Share this report</Popup.Title>
            <Popup.Close asChild>
              <IconButton
                aria-label="Close"
                icon={RiCloseLine}
                preset="border"
                variant="secondary"
                size="sm"
                className={CLOSE_CLASS}
              />
            </Popup.Close>
          </div>
        </Popup.Header>
        <Popup.Content>
          <Popup.Description>{DESCRIPTION}</Popup.Description>
        </Popup.Content>
        {v.footer && (
          <Popup.Footer>
            <Popup.Close asChild>
              <Button variant="secondary" preset="border" size="sm">
                Cancel
              </Button>
            </Popup.Close>
            <Popup.Close asChild>
              <Button size="sm">Copy link</Button>
            </Popup.Close>
          </Popup.Footer>
        )}
      </Popup.Container>
    </Popup>
  ),
  code: (v, { attrs }) => {
    // Side and align are not generated, so they are compared with Popup's own defaults here.
    const placement = pairs([
      ['side', v.side, 'bottom'],
      ['align', v.align, 'start'],
    ]);
    const container = `<Popup.Container${placement ? ` ${placement}` : ''}${attrs()}>`;
    const footer = v.footer
      ? `
    <Popup.Footer>
      <Popup.Close asChild>
        <Button variant="secondary" preset="border" size="sm">Cancel</Button>
      </Popup.Close>
      <Popup.Close asChild>
        <Button size="sm">Copy link</Button>
      </Popup.Close>
    </Popup.Footer>`
      : '';
    return `<Popup>
  <Popup.Trigger asChild>
    <Button variant="secondary" preset="border">
      <Button.Icon icon={RiShareLine} />
      Share
    </Button>
  </Popup.Trigger>
  ${container}
    <Popup.Header>
      <div className="flex items-center justify-between gap-ws-5">
        <Popup.Title>Share this report</Popup.Title>
        <Popup.Close asChild>
          <IconButton
            aria-label="Close"
            icon={RiCloseLine}
            preset="border"
            variant="secondary"
            size="sm"
            className="${CLOSE_CLASS}"
          />
        </Popup.Close>
      </div>
    </Popup.Header>
    <Popup.Content>
      <Popup.Description>${DESCRIPTION}</Popup.Description>
    </Popup.Content>${footer}
  </Popup.Container>
</Popup>`;
  },
  // The popup drawn open under its trigger, in place: the real one portals to the body.
  preview: () => (
    <Popup>
      <div className="flex flex-col items-start gap-ws-3">
        <Button variant="secondary" preset="border">
          <Button.Icon icon={RiShareLine} />
          Share
        </Button>
        <div className={FRAME}>
          <Popup.Header>
            <div className="flex items-center justify-between gap-ws-5">
              <Popup.Title>Share this report</Popup.Title>
              <IconButton
                aria-label="Close"
                icon={RiCloseLine}
                preset="border"
                variant="secondary"
                size="sm"
                className={CLOSE_CLASS}
              />
            </div>
          </Popup.Header>
          <Popup.Content>
            <Popup.Description>{DESCRIPTION}</Popup.Description>
          </Popup.Content>
          <Popup.Footer>
            <Button variant="secondary" preset="border" size="sm">
              Cancel
            </Button>
            <Button size="sm">Copy link</Button>
          </Popup.Footer>
        </div>
      </div>
    </Popup>
  ),
  // The trigger, then the popup it opens drawn in place: the box stands in for
  // Popup.Container, which portals to the body.
  anatomy: () => (
    <Popup>
      <div className="flex w-[20rem] flex-col items-start gap-ws-3">
        <Popup.Trigger asChild>
          <Button variant="secondary" preset="border">
            <Button.Icon icon={RiShareLine} />
            Share
          </Button>
        </Popup.Trigger>
        <div data-slot="popup-container" className={`${SURFACE} w-full`}>
          <Popup.Header>
            <div className="flex items-center justify-between gap-ws-5">
              <Popup.Title>Share this report</Popup.Title>
              <Popup.Close asChild>
                <IconButton
                  aria-label="Close"
                  icon={RiCloseLine}
                  preset="border"
                  variant="secondary"
                  size="sm"
                  className={CLOSE_CLASS}
                />
              </Popup.Close>
            </div>
          </Popup.Header>
          <Popup.Content>
            <Popup.Description>{DESCRIPTION}</Popup.Description>
          </Popup.Content>
          <Popup.Footer>
            <Button variant="secondary" preset="border" size="sm">
              Cancel
            </Button>
            <Button size="sm">Copy link</Button>
          </Popup.Footer>
        </div>
      </div>
    </Popup>
  ),
});
