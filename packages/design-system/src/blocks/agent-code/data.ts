import { codeGroups as sessions, withThread } from './canon';
import { csvExport } from './session-data';

/*
  This block opens in Code, on the canon's session "CSV export for bookings" in `lumen-app`: its
  turns in full are in `session-data.ts`. Everything else (the account, the models, the chats and
  the other sessions) is the canon's.
*/

/** The session that opens with the block, and whose work the pane shows. */
export const OPEN_SESSION = 'csv-export';

/**
 * The canon's sessions, with this block's session in full in its place. It waits for Ines, so it
 * says so; the mark gives way to the pull request once she has answered.
 */
export const codeGroups = withThread(sessions, OPEN_SESSION, (thread) => ({
  ...thread,
  state: 'needs-you',
  turns: csvExport,
}));
