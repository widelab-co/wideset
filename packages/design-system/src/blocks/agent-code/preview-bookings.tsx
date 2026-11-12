import { RiDownloadLine, RiSearchLine } from '@remixicon/react';
import { Avatar, Button, StatusBadge, Table, TextInput, Toast } from '@wideset/react';
import { useEffect, useState } from 'react';

import { BOOKINGS, STATUS } from './preview-data';
import { formatTimeRange } from './preview-format';

/** How long the page's toast stays, in milliseconds. */
const TOAST = 4000;

/** Under this width of the page the table drops who booked, and keeps room, time and state. */
const WIDE = 'hidden @[34rem]:table-cell';

type PreviewBookingsProps = {
  /** The export ran: how many rows it wrote. */
  onExport: (rows: number) => void;
};

/**
 * The page the session is changing, as the dev server serves it: today's bookings in a table that
 * runs the page's width, a search over it and the new Export CSV button. The button is bordered:
 * this small app has no filled action of its own here. Export answers as the feature does, with a
 * toast at the foot of the page (and a line in the console, which the pane adds). The page lays
 * itself out by its own width, not the window's, so the viewport switch really reflows it.
 */
export function PreviewBookings({ onExport }: PreviewBookingsProps) {
  const [query, setQuery] = useState('');
  // An object, so a second export restarts the toast's time even with the same number of rows.
  const [exported, setExported] = useState<{ rows: number }>();

  useEffect(() => {
    if (!exported) return;
    const id = window.setTimeout(() => setExported(undefined), TOAST);
    return () => window.clearTimeout(id);
  }, [exported]);

  const needle = query.trim().toLowerCase();
  const rows = BOOKINGS.filter(({ room, by }) =>
    `${room} ${by.name}`.toLowerCase().includes(needle),
  );

  return (
    <>
      <div className="gap-ws-9 px-ws-11 pt-ws-12 pb-ws-9 flex flex-col">
        <div className="gap-ws-2 flex flex-col">
          <h3 className="typography-subtitle-md text-ws-static-strong">Bookings</h3>
          <p className="typography-body-md text-ws-static-subtle">
            Every room booked today, Tuesday, November 10
          </p>
        </div>
        <div className="gap-ws-5 flex items-center">
          <TextInput
            size="sm"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1"
          >
            <TextInput.Prefix inner>
              <TextInput.Icon icon={RiSearchLine} />
            </TextInput.Prefix>
            <TextInput.Input
              type="search"
              placeholder="Search rooms or people"
              aria-label="Search rooms or people"
            />
            <TextInput.Suffix inner>
              <TextInput.ClearButton />
            </TextInput.Suffix>
          </TextInput>
          <Button
            size="sm"
            variant="secondary"
            preset="border"
            disabled={rows.length === 0}
            onClick={() => {
              setExported({ rows: rows.length });
              onExport(rows.length);
            }}
          >
            <Button.Icon icon={RiDownloadLine} />
            Export CSV
          </Button>
        </div>
      </div>

      {/* The first and last cells give up their padding, so the rows' lines and text keep the
          page's gutter. */}
      <div className="px-ws-11 pb-ws-11">
        <Table className="table-fixed">
          <Table.Head>
            <Table.Row>
              <Table.Header flushMargin className="w-[24%]">
                Room
              </Table.Header>
              <Table.Header className={WIDE}>Booked by</Table.Header>
              <Table.Header>Time</Table.Header>
              <Table.Header flushMargin className="w-[6.5rem]">
                Status
              </Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {rows.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={4}>
                  <p className="text-ws-static-subtle py-ws-14 text-center">
                    No booking matches “{query.trim()}”
                  </p>
                </Table.Cell>
              </Table.Row>
            ) : (
              rows.map(({ id, room, by, start, end, status }) => (
                <Table.Row key={id}>
                  <Table.Cell flushMargin>
                    <span className="text-ws-static-strong">{room}</span>
                  </Table.Cell>
                  <Table.Cell className={WIDE}>
                    <div className="gap-ws-5 flex items-center">
                      <Avatar
                        size="sm"
                        initials={by.initials}
                        color={by.color}
                        aria-hidden="true"
                      />
                      <span className="truncate">{by.name}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="tabular-nums">
                    <time dateTime={start}>{formatTimeRange(start, end)}</time>
                  </Table.Cell>
                  <Table.Cell flushMargin>
                    <StatusBadge color={STATUS[status].color}>{STATUS[status].label}</StatusBadge>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </div>

      {exported && (
        // Laid over the foot of the page's viewport, not the pane: it is the page's own toast.
        <div className="inset-x-ws-11 bottom-ws-11 animate-in fade-in-0 slide-in-from-bottom-ws-5 absolute flex justify-center duration-(--ws-motion-duration-fast) ease-(--ws-motion-ease-smooth-out)">
          <Toast status="success" onDismiss={() => setExported(undefined)} className="w-auto">
            <Toast.Message>
              {`Exported ${exported.rows} ${exported.rows === 1 ? 'booking' : 'bookings'}`}
            </Toast.Message>
          </Toast>
        </div>
      )}
    </>
  );
}
