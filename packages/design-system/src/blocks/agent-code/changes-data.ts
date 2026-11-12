import type { AvatarColor } from '@wideset/react';

import { type Anchor, countChanges, type Hunk, parsePatch } from './changes-diff';

/** The moment the screen shows: the afternoon of 10 November 2026. */
export const NOW = new Date('2026-11-10T16:30:00');

export type Person = { name: string; initials: string; color: AvatarColor };

export const ME: Person = { name: 'Ines Navarro', initials: 'IN', color: 'teal' };
const TOM: Person = { name: 'Tom Becker', initials: 'TB', color: 'orange' };

/** A file the session changed: its path from the repository root and its diff. */
export type ChangedFile = {
  path: string;
  /** The file did not exist on `main`. */
  isNew: boolean;
  hunks: Hunk[];
  added: number;
  removed: number;
};

/*
  The session's changes on feature/bookings-csv-export, as `git diff main` prints them (without
  the file headers), in git's order. The counts on screen are counted from these lines.
*/

const BOOKINGS_TABLE = String.raw`
@@ -1,12 +1,16 @@
 import { DataTable } from '@lumen/ui';
-import { useMemo, useState } from 'react';
+import { useCallback, useMemo, useState } from 'react';
+
+import { downloadFile } from '@/lib/download';
+import { formatTimestamp } from '@/lib/format-date';

 import { BookingsToolbar } from './bookings-toolbar';
 import { COLUMNS } from './columns';
+import { exportBookingsCsv } from './export-csv';
 import { applyFilters, NO_FILTERS } from './filters';
 import { useBookings } from './use-bookings';

-/** Every room's bookings, with search and filters. */
+/** Every room's bookings, with search, filters and CSV export. */
 export function BookingsTable() {
   const { bookings, loading } = useBookings();
   const [filters, setFilters] = useState(NO_FILTERS);
@@ -16,11 +20,21 @@ export function BookingsTable() {
     [bookings, filters],
   );

+  const handleExport = useCallback(() => {
+    const csv = exportBookingsCsv(rows);
+    const day = formatTimestamp(new Date()).slice(0, 10);
+    downloadFile('bookings-' + day + '.csv', csv, 'text/csv');
+  }, [rows]);
+
   return (
     <section aria-labelledby="bookings-title">
       <h1 id="bookings-title">Bookings</h1>
-      {/* TODO: CSV export for the finance team */}
-      <BookingsToolbar filters={filters} onChange={setFilters} />
+      <BookingsToolbar
+        filters={filters}
+        onChange={setFilters}
+        onExport={handleExport}
+        exportDisabled={rows.length === 0}
+      />
       <DataTable columns={COLUMNS} rows={rows} loading={loading} />
     </section>
   );
`;

const BOOKINGS_TOOLBAR = String.raw`
@@ -6,10 +6,18 @@ import { RoomFilter } from './room-filter';
 type Props = {
   filters: BookingFilters;
   onChange: (filters: BookingFilters) => void;
+  onExport: () => void;
+  /** True when there is nothing to export. */
+  exportDisabled?: boolean;
 };

 /** Search and filters over the bookings table. */
-export function BookingsToolbar({ filters, onChange }: Props) {
+export function BookingsToolbar({
+  filters,
+  onChange,
+  onExport,
+  exportDisabled,
+}: Props) {
   return (
     <div className="flex items-center gap-3">
       <SearchField
@@ -24,6 +32,9 @@ export function BookingsToolbar({ filters, onChange }: Props) {
       <Button variant="ghost" onClick={() => onChange(NO_FILTERS)}>
         Clear filters
       </Button>
+      <Button disabled={exportDisabled} onClick={onExport}>
+        Export CSV
+      </Button>
     </div>
   );
 }
`;

const EXPORT_CSV_TEST = String.raw`
@@ -0,0 +1,48 @@
+import { describe, expect, it } from 'vitest';
+
+import { escapeField, exportBookingsCsv } from './export-csv';
+import type { Booking } from './types';
+
+const booking: Booking = {
+  id: 'BK-2041',
+  room: { name: 'Atlas', floor: 3 },
+  host: { name: 'Priya Raman', email: 'priya@lumenstudio.co' },
+  startsAt: new Date('2026-11-10T09:00:00Z'),
+  endsAt: new Date('2026-11-10T09:45:00Z'),
+  attendees: ['jonas@lumenstudio.co', 'elena@lumenstudio.co'],
+  repeats: false,
+  status: 'confirmed',
+  note: 'Hub 2 demo, bring the adapter',
+};
+
+describe('exportBookingsCsv', () => {
+  it('writes a header line and a line for each booking', () => {
+    const lines = exportBookingsCsv([booking]).split('\r\n');
+    expect(lines).toHaveLength(3);
+    expect(lines[0]).toContain('Booking,Room,Floor,Host,Email');
+    expect(lines[1]).toContain('BK-2041,Atlas,3,Priya Raman');
+  });
+
+  it('writes start times as UTC ISO strings', () => {
+    const [head, row] = exportBookingsCsv([booking]).split('\r\n');
+    const col = head.split(',').indexOf('Starts');
+    const cells = row.split(',');
+    // 10:00 at the office, an hour ahead of UTC.
+    expect(cells[col]).toBe('2026-11-10T09:00:00Z');
+  });
+});
+
+describe('escapeField', () => {
+  it('quotes a field with a comma', () => {
+    expect(escapeField('Demo, Hub 2')).toBe('"Demo, Hub 2"');
+  });
+
+  it('doubles the quotes inside a quoted field', () => {
+    expect(escapeField('a "big" room')).toBe('"a ""big"" room"');
+  });
+
+  it('keeps a formula from running', () => {
+    expect(escapeField('=SUM(A1:A9)')).toBe("'=SUM(A1:A9)");
+    expect(escapeField('-2 seats')).toBe("'-2 seats");
+  });
+});
`;

const EXPORT_CSV = String.raw`
@@ -0,0 +1,64 @@
+import { formatTimestamp } from '@/lib/format-date';
+
+import type { Booking } from './types';
+
+/** A column: its header and what a booking puts under it. */
+type Column = {
+  header: string;
+  value: (booking: Booking) => string | number;
+};
+
+/** The columns, in the order the finance team reads them. */
+const COLUMNS: Column[] = [
+  { header: 'Booking', value: (b) => b.id },
+  { header: 'Room', value: (b) => b.room.name },
+  { header: 'Floor', value: (b) => b.room.floor },
+  { header: 'Host', value: (b) => b.host.name },
+  { header: 'Email', value: (b) => b.host.email },
+  { header: 'Starts', value: (b) => formatTimestamp(b.startsAt) },
+  { header: 'Ends', value: (b) => formatTimestamp(b.endsAt) },
+  { header: 'Attendees', value: (b) => b.attendees.length },
+  { header: 'Repeats', value: (b) => (b.repeats ? 'Yes' : 'No') },
+  { header: 'Status', value: (b) => b.status },
+  { header: 'Note', value: (b) => b.note ?? '' },
+];
+
+/** Without this mark Excel misreads UTF-8 names. */
+const BOM = '\uFEFF';
+
+/** RFC 4180 ends every line with CRLF. */
+const LINE_BREAK = '\r\n';
+
+/** Text that starts like this runs as a formula in Excel. */
+const FORMULA = /^[=+\-@]/;
+
+/**
+ * One value as a CSV field. Text that could run as a formula
+ * gets a leading apostrophe. A field with a comma or a quote
+ * is quoted, and the quotes inside it are doubled.
+ */
+export function escapeField(value: string | number): string {
+  if (typeof value === 'number') return String(value);
+  const text = FORMULA.test(value) ? "'" + value : value;
+  const needsQuotes = text.includes(',') || text.includes('"');
+  if (!needsQuotes) return text;
+  return '"' + text.replaceAll('"', '""') + '"';
+}
+
+/** One line of the file: its fields, escaped and joined. */
+function toLine(fields: (string | number)[]): string {
+  return fields.map(escapeField).join(',');
+}
+
+/**
+ * The bookings as CSV text: a header line, then a line for each
+ * booking, in the order given. Dates are UTC ISO strings, so the
+ * file reads the same in every time zone.
+ */
+export function exportBookingsCsv(bookings: Booking[]): string {
+  const header = toLine(COLUMNS.map((column) => column.header));
+  const lines = bookings.map((booking) =>
+    toLine(COLUMNS.map((column) => column.value(booking))),
+  );
+  return BOM + [header, ...lines].join(LINE_BREAK) + LINE_BREAK;
+}
`;

const FORMAT_DATE = String.raw`
@@ -18,9 +18,13 @@ export function formatDay(date: Date): string {
   return format(date, 'MMM d, yyyy');
 }

-/** A moment for a file name or an export. */
+/**
+ * A moment for a file name or an export: UTC to the second, as
+ * 2026-11-10T09:00:00Z, wherever the file is written.
+ */
 export function formatTimestamp(date: Date): string {
-  return format(date, "yyyy-MM-dd'T'HH:mm:ssxxx");
+  if (Number.isNaN(date.getTime())) return '';
+  return date.toISOString().slice(0, 19) + 'Z';
 }

 /** Whether two moments fall on the same calendar day. */
`;

const file = (path: string, patch: string): ChangedFile => {
  const hunks = parsePatch(patch);
  return { path, isNew: hunks[0].header.startsWith('@@ -0,0'), hunks, ...countChanges(hunks) };
};

export const FILES: ChangedFile[] = [
  file('src/features/bookings/bookings-table.tsx', BOOKINGS_TABLE),
  file('src/features/bookings/bookings-toolbar.tsx', BOOKINGS_TOOLBAR),
  file('src/features/bookings/export-csv.test.ts', EXPORT_CSV_TEST),
  file('src/features/bookings/export-csv.ts', EXPORT_CSV),
  file('src/lib/format-date.ts', FORMAT_DATE),
];

/** Ines has read the test already, so it opens folded. */
export const VIEWED = ['src/features/bookings/export-csv.test.ts'];

export type Comment = { id: string; author: Person; postedAt: string; text: string };

/** A conversation on one line of a file: the first comment and the replies to it. */
export type Thread = {
  id: string;
  path: string;
  anchor: Anchor;
  comments: Comment[];
  resolved: boolean;
  /** Handed to the session for Tandem to fix. */
  sent: boolean;
};

/** Tom Becker's review of the draft: two comments, neither resolved yet. */
export const THREADS: Thread[] = [
  {
    id: 't1',
    path: 'src/features/bookings/bookings-table.tsx',
    anchor: { side: 'new', line: 25 },
    comments: [
      {
        id: 't1-c1',
        author: TOM,
        postedAt: '2026-11-10T14:12:00',
        text: 'This is the UTC day, so in the first hour after midnight in Berlin the file is named for yesterday. Use the local date for the name.',
      },
    ],
    resolved: false,
    sent: false,
  },
  {
    id: 't2',
    path: 'src/features/bookings/export-csv.ts',
    anchor: { side: 'new', line: 43 },
    comments: [
      {
        id: 't2-c1',
        author: TOM,
        postedAt: '2026-11-10T14:20:00',
        text: 'This misses a value with a line break in it. A two-line note will split the row once the file is opened in a spreadsheet.',
      },
    ],
    resolved: false,
    sent: false,
  },
];

/** A path as the folder it sits in and its own name: the name is what the eye looks for. */
export function splitPath(path: string) {
  const at = path.lastIndexOf('/') + 1;
  return { folder: path.slice(0, at), name: path.slice(at) };
}
