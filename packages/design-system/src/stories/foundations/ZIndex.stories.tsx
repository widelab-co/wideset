import { RiDeleteBinLine, RiDownloadLine, RiShareLine } from '@remixicon/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type React from 'react';

import { ActionBar } from '../../components/action-bar/ActionBar';
import { Button } from '../../components/button/Button';
import { DropdownMenu } from '../../components/dropdown/DropdownMenu';
import { ListItem } from '../../components/list-item/ListItem';
import { Modal } from '../../components/modal/Modal';
import { Popup } from '../../components/popup/Popup';
import { Select } from '../../components/select/Select';
import { Sidepanel } from '../../components/sidepanel/Sidepanel';
import { Table } from '../../components/table/Table';
import { ToastProvider, useToast } from '../../components/toast/Toast.context';
import { Tooltip } from '../../components/tooltip/Tooltip';

const MONO = 'ui-monospace, "SFMono-Regular", monospace';

const Code = ({ children }: { children: React.ReactNode }) => (
  <code style={{ fontFamily: MONO, fontSize: 12, color: 'var(--ws-static-text-base)' }}>
    {children}
  </code>
);

// ── Data ────────────────────────────────────────────────────────────────────

const BANDS: { name: string; value: number; usage: string; components: string }[] = [
  {
    name: 'deep',
    value: -100,
    usage: 'Elements that need to appear behind all other elements.',
    components: '—',
  },
  {
    name: 'base',
    value: 1,
    usage: 'A base z-index inside a local stacking context. Only as needed, never by default.',
    components: 'Avatar status, SplitButton focus ring, Calendar range',
  },
  {
    name: 'masked',
    value: 100,
    usage: 'Elements that are covered by other elements.',
    components: '—',
  },
  {
    name: 'mask',
    value: 200,
    usage: 'Elements that need to appear above other page elements.',
    components: 'Table frozen column',
  },
  {
    name: 'sticky',
    value: 300,
    usage: 'Sticky elements that stay on top of page content.',
    components: 'Table sticky header, ActionBar',
  },
  {
    name: 'drawer',
    value: 700,
    usage: 'Drawer components that cover most of the page.',
    components: 'Sidepanel',
  },
  {
    name: 'modal',
    value: 800,
    usage: 'Modal components that cover most of the page.',
    components: 'Modal, StatusModal',
  },
  {
    name: 'popout',
    value: 900,
    usage: 'Popouts: tooltips, dropdowns, context menus, select lists.',
    components: 'Popup, Dropdown, Select, Tooltip, FilterButton',
  },
  {
    name: 'notification',
    value: 1000,
    usage: 'Notifications that appear on top of all content.',
    components: 'Toast',
  },
];

// ── Page ────────────────────────────────────────────────────────────────────

const cell: React.CSSProperties = {
  padding: '10px 12px',
  borderBottom: '1px solid var(--ws-static-stroke-base)',
  fontSize: 13,
  color: 'var(--ws-static-text-base)',
  verticalAlign: 'top',
  textAlign: 'left',
};

const head: React.CSSProperties = {
  ...cell,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--ws-static-text-subtle)',
  fontFamily: MONO,
};

function BandsTable() {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th style={head}>Class</th>
          <th style={head}>CSS variable</th>
          <th style={head}>Value</th>
          <th style={head}>Use for</th>
          <th style={head}>Default on</th>
        </tr>
      </thead>
      <tbody>
        {BANDS.map((band) => (
          <tr key={band.name}>
            <td style={cell}>
              <Code>z-ws-{band.name}</Code>
            </td>
            <td style={cell}>
              <Code>--ws-z-index-{band.name}</Code>
            </td>
            <td style={{ ...cell, fontFamily: MONO }}>{band.value}</td>
            <td style={cell}>{band.usage}</td>
            <td style={{ ...cell, color: 'var(--ws-static-text-subtle)' }}>{band.components}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Every band rendered as an overlapping card, so the order is visible without reading numbers. */
function Stack() {
  const visible = BANDS.filter((band) => band.value > 1);
  return (
    <div
      style={{
        position: 'relative',
        height: 56 + visible.length * 34,
        isolation: 'isolate',
      }}
    >
      {visible.map((band, index) => (
        <div
          key={band.name}
          style={{
            position: 'absolute',
            top: index * 34,
            left: index * 40,
            width: 320,
            height: 72,
            zIndex: `var(--ws-z-index-${band.name})` as unknown as number,
            padding: '10px 14px',
            borderRadius: 'var(--radius-ws-container-sm)',
            background: 'var(--ws-static-fill-overlay)',
            border: '1px solid var(--ws-static-stroke-base)',
            boxShadow: 'var(--ws-elevation-medium)',
            fontFamily: MONO,
            fontSize: 12,
            color: 'var(--ws-static-text-base)',
          }}
        >
          <div style={{ fontWeight: 600 }}>z-ws-{band.name}</div>
          <div style={{ color: 'var(--ws-static-text-subtle)' }}>{band.value}</div>
        </div>
      ))}
    </div>
  );
}

function ZIndexPage() {
  return (
    <div className="gap-ws-9 flex max-w-[60rem] flex-col">
      <section>
        <h2 className="typography-subtitle-lg text-ws-static-strong">Bands</h2>
        <p className="typography-body-sm text-ws-static-subtle">
          Each token is a range, not an exact step. A one-off element can sit inside a band with an
          arbitrary value (<Code>z-[calc(var(--ws-z-index-sticky)+1)]</Code>) as long as it stays
          below the next band. Components already carry the band they belong to; reach for these
          classes for page layout only. Tailwind&apos;s own <Code>z-10</Code> / <Code>z-50</Code>{' '}
          are not part of the scale.
        </p>
      </section>
      <BandsTable />
      <section>
        <h2 className="typography-subtitle-lg text-ws-static-strong">Stacking order</h2>
        <p className="typography-body-sm text-ws-static-subtle mb-ws-6">
          Later bands paint over earlier ones regardless of DOM order. Override a band for a whole
          app in <Code>:root</Code> (<Code>{'--ws-z-index-sticky: 400;'}</Code>), and keep it below
          the next band: a modal raised past <Code>z-ws-popout</Code> would cover its own dropdowns
          and tooltips.
        </p>
        <Stack />
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundation/Z-Index',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Named z-index bands (`z-ws-deep` … `z-ws-notification`) that keep overlays, drawers, popouts and notifications in a predictable order. Every overlay component ships on its band by default; use the classes yourself only for page layout (sticky headers, decorative backgrounds).',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Bands: Story = { render: () => <ZIndexPage /> };

// ── Layers: every band at once ──────────────────────────────────────────────

const ROWS = ['Redesign website', 'Launch mobile app', 'Token audit', 'Storybook docs'];

const ShowToastButton = () => {
  const { showToast } = useToast();
  return (
    <Button
      preset="border"
      variant="secondary"
      onClick={() => showToast({ content: 'Toast — z-ws-notification (1000)', duration: 0 })}
    >
      Show toast
    </Button>
  );
};

/**
 * The real stacking scenario: page content, a Sidepanel over it, a Modal opened from the panel and
 * floating content opened from the Modal. No Portal wrappers anywhere: each component carries its
 * band and portals itself.
 */
function LayersPage() {
  return (
    <ToastProvider position="top-right">
      <div className="p-ws-12 gap-ws-9 flex flex-col">
        <p className="typography-body-sm text-ws-static-subtle max-w-[40rem]">
          Scroll the table: the sticky header (<Code>z-ws-sticky</Code>) paints over the frozen
          column (<Code>z-ws-mask</Code>). Open the Sidepanel, then the Modal from inside it, then
          the Select, Dropdown, Popup and Tooltip inside the Modal: each must appear above the Modal
          and its overlay, and the toast above everything.
        </p>

        <div className="h-[12rem] w-[28rem] overflow-auto">
          <Table stickyHeader stickyColumn className="w-[48rem]">
            <Table.Head>
              <Table.Row>
                <Table.Header>Project — z-ws-sticky</Table.Header>
                <Table.Header>Status</Table.Header>
                <Table.Header>Deadline</Table.Header>
                <Table.Header>Owner</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {[...ROWS, ...ROWS].map((row, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{row} — z-ws-mask</Table.Cell>
                  <Table.Cell>Ongoing</Table.Cell>
                  <Table.Cell>2026-10-30</Table.Cell>
                  <Table.Cell>Design team</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <div className="gap-ws-5 flex">
          <Sidepanel>
            <Sidepanel.Trigger asChild>
              <Button>Open sidepanel</Button>
            </Sidepanel.Trigger>
            <Sidepanel.Panel side="right" size="md">
              <Sidepanel.Header>
                <Sidepanel.Title>Sidepanel — z-ws-drawer (700)</Sidepanel.Title>
                <Sidepanel.Description>
                  Covers the page and the ActionBar. A Modal opened from here covers the panel.
                </Sidepanel.Description>
              </Sidepanel.Header>
              <Sidepanel.Content>
                <div className="gap-ws-5 flex flex-wrap">
                  <Tooltip>
                    <Tooltip.Trigger asChild>
                      <Button preset="border" variant="secondary">
                        Tooltip trigger
                      </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      <Tooltip.Label>Tooltip — z-ws-popout (900)</Tooltip.Label>
                    </Tooltip.Content>
                  </Tooltip>

                  <Modal>
                    <Modal.Trigger asChild>
                      <Button>Open modal</Button>
                    </Modal.Trigger>
                    <Modal.Content>
                      <Modal.Header>
                        <Modal.Title>Modal — z-ws-modal (800)</Modal.Title>
                        <Modal.Description>
                          Everything opened from here sits on z-ws-popout (900).
                        </Modal.Description>
                      </Modal.Header>
                      <Modal.Body>
                        <div className="gap-ws-5 flex flex-wrap items-center">
                          <Select
                            placeholder="Select list"
                            options={ROWS.map((row) => ({ label: row, value: row }))}
                          />

                          <DropdownMenu>
                            <DropdownMenu.Trigger asChild>
                              <Button preset="border" variant="secondary">
                                Dropdown
                              </Button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                              <DropdownMenu.Item>
                                <ListItem.Prefix>
                                  <RiDownloadLine className="text-ws-400" />
                                </ListItem.Prefix>
                                <ListItem.Content>
                                  <ListItem.Label>Download</ListItem.Label>
                                </ListItem.Content>
                              </DropdownMenu.Item>
                              <DropdownMenu.Item>
                                <ListItem.Prefix>
                                  <RiShareLine className="text-ws-400" />
                                </ListItem.Prefix>
                                <ListItem.Content>
                                  <ListItem.Label>Share</ListItem.Label>
                                </ListItem.Content>
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu>

                          <Popup>
                            <Popup.Trigger asChild>
                              <Button preset="border" variant="secondary">
                                Popup
                              </Button>
                            </Popup.Trigger>
                            <Popup.Container>
                              <Popup.Header>
                                <Popup.Title>Popup — z-ws-popout (900)</Popup.Title>
                              </Popup.Header>
                              <Popup.Content>
                                <Popup.Description>
                                  Not clipped by the Modal, not covered by its overlay.
                                </Popup.Description>
                              </Popup.Content>
                            </Popup.Container>
                          </Popup>

                          <Tooltip>
                            <Tooltip.Trigger asChild>
                              <Button preset="border" variant="secondary">
                                Tooltip
                              </Button>
                            </Tooltip.Trigger>
                            <Tooltip.Content>
                              <Tooltip.Label>Tooltip — z-ws-popout (900)</Tooltip.Label>
                            </Tooltip.Content>
                          </Tooltip>

                          <ShowToastButton />
                        </div>
                      </Modal.Body>
                    </Modal.Content>
                  </Modal>
                </div>
              </Sidepanel.Content>
            </Sidepanel.Panel>
          </Sidepanel>

          <ShowToastButton />
        </div>
      </div>

      <ActionBar isOpen>
        <ActionBar.Count>ActionBar — z-ws-sticky</ActionBar.Count>
        <ActionBar.Actions>
          <Button variant="secondary" size="sm">
            <Button.Icon icon={RiDownloadLine} />
            Download
          </Button>
          <Button preset="ghost" variant="danger" size="sm">
            <Button.Icon icon={RiDeleteBinLine} />
            Delete
          </Button>
        </ActionBar.Actions>
      </ActionBar>
    </ToastProvider>
  );
}

export const Layers: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Every band in one page: sticky table header over a frozen column, ActionBar, Sidepanel, a Modal opened from the Sidepanel, and Select, Dropdown, Popup, Tooltip and Toast opened from the Modal. None of them is wrapped in a Portal by hand.',
      },
    },
  },
  render: () => <LayersPage />,
};
