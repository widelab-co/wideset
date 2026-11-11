import type { AvatarColor } from '@wideset/react';

/** The page the dev server opens on: the route the session is changing. */
export const HOME = 'localhost:3000/bookings';

export type Viewport = 'desktop' | 'tablet' | 'phone';

export type BookingStatus = 'checked-in' | 'confirmed' | 'pending' | 'no-show' | 'cancelled';

/** A state in words and in its meaning's colour: arrived, scheduled, waiting, missed, called off. */
export const STATUS = {
  'checked-in': { label: 'Checked in', color: 'positive' },
  confirmed: { label: 'Confirmed', color: 'info' },
  pending: { label: 'Pending', color: 'notice' },
  'no-show': { label: 'No-show', color: 'negative' },
  cancelled: { label: 'Cancelled', color: 'neutral' },
} as const satisfies Record<BookingStatus, { label: string; color: string }>;

export type Person = { name: string; initials: string; color: AvatarColor };

const PRIYA: Person = { name: 'Priya Raman', initials: 'PR', color: 'purple' };
const TOM: Person = { name: 'Tom Becker', initials: 'TB', color: 'blue' };
const ELENA: Person = { name: 'Elena Silva', initials: 'ES', color: 'teal' };
const JONAS: Person = { name: 'Jonas Weber', initials: 'JW', color: 'lime' };
/** Signed in to the preview, as to Tandem. */
export const INES: Person = { name: 'Ines Navarro', initials: 'IN', color: 'orange' };

export type Booking = {
  id: string;
  room: string;
  by: Person;
  /** UTC, as the API returns them and as the export writes them. */
  start: string;
  end: string;
  status: BookingStatus;
};

const at = (time: string) => `2026-11-10T${time}:00Z`;

/** Today's bookings at Lumen Studio. The first starts at 09:00 UTC: 10:00 on the page. */
export const BOOKINGS: Booking[] = [
  {
    id: 'b1',
    room: 'Atlas',
    by: PRIYA,
    start: at('09:00'),
    end: at('09:30'),
    status: 'checked-in',
  },
  { id: 'b2', room: 'Cedar', by: TOM, start: at('09:30'), end: at('10:30'), status: 'checked-in' },
  { id: 'b3', room: 'Fjord', by: ELENA, start: at('09:45'), end: at('10:45'), status: 'no-show' },
  {
    id: 'b4',
    room: 'Atlas',
    by: JONAS,
    start: at('12:00'),
    end: at('13:00'),
    status: 'checked-in',
  },
  { id: 'b5', room: 'Dune', by: INES, start: at('13:00'), end: at('13:45'), status: 'confirmed' },
  { id: 'b6', room: 'Cedar', by: PRIYA, start: at('14:00'), end: at('15:00'), status: 'pending' },
  { id: 'b7', room: 'Ember', by: TOM, start: at('14:30'), end: at('15:00'), status: 'cancelled' },
  { id: 'b8', room: 'Fjord', by: ELENA, start: at('15:30'), end: at('16:30'), status: 'confirmed' },
];

/** The file the export names: the day it covers. */
export const EXPORT_FILE = 'bookings-2026-11-10.csv';

export type ConsoleMessage = {
  id: string;
  level: 'log' | 'warning' | 'error';
  text: string;
  /** The file and line that logged it. */
  source?: string;
};

/** Logged whenever the bookings page loads. */
export const ZONE_WARNING: ConsoleMessage = {
  id: 'zone',
  level: 'warning',
  text: 'Workspace time zone is not set: times are shown in the browser zone',
  source: 'format-date.ts:14',
};

/** What the export logs when it has written the file. */
export const exportLog = (id: string, rows: number): ConsoleMessage => ({
  id,
  level: 'log',
  text: `[export] ${EXPORT_FILE}: ${rows} ${rows === 1 ? 'row' : 'rows'}, times as UTC`,
  source: 'export-csv.ts:52',
});

/** What the browser logs for an address the app has no page for. */
export const notFoundError = (address: string): ConsoleMessage => ({
  id: 'not-found',
  level: 'error',
  text: `GET http://${address} 404 (Not Found)`,
});

/** The console as the session left it: the page loaded, and the agent tried the export once. */
export const MESSAGES: ConsoleMessage[] = [ZONE_WARNING, exportLog('export-0', BOOKINGS.length)];
