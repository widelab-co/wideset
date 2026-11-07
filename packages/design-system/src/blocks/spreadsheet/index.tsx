import { ClientSheet } from './client-sheet';
import { StatusBar } from './status-bar';
import { Toolbar } from './toolbar';
import { TopBar } from './top-bar';

/**
 * Spreadsheet, Flat direction under a top bar: the Clients table with its view tools, the grid as
 * a canvas that fills the window, and a status bar. Top bar and toolbar stay full-bleed.
 */
export default function SpreadsheetBlock() {
  return (
    <div className="bg-ws-static-foreground flex h-dvh flex-col">
      <TopBar />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Toolbar />
        <ClientSheet className="min-h-0 flex-1" />
        <StatusBar />
      </main>
    </div>
  );
}
