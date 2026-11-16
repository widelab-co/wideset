import { AppShell } from '@wideset/react';

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
    <AppShell direction="flat">
      <AppShell.Main className="flex flex-col">
        <TopBar />
        <Toolbar />
        <ClientSheet className="min-h-0 flex-1" />
        <StatusBar />
      </AppShell.Main>
    </AppShell>
  );
}
