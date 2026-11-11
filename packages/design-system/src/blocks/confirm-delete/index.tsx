import { RiSideBarLine } from '@remixicon/react';
import { Breadcrumbs, cn, IconButton, Toast, ToastProvider, useToast } from '@wideset/react';
import { useId, useState } from 'react';

import { ENTRIES, type Entry, OPEN_ON_LOAD, TODAY } from './data';
import { DeleteFolderDialog } from './delete-folder-dialog';
import { formatReports } from './format';
import { PageHeader } from './page-header';
import { ReportsTable } from './reports-table';
import { ReportsSidebar } from './sidebar';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';

/**
 * The page inside the card, under the toasts. It holds the list, so both deletes change it in one
 * place: a report goes at once and its toast puts it back where it was; a folder goes only from
 * the dialog, and its toast has nothing to undo.
 */
function ReportsPage() {
  const sidebarId = useId();
  const { showToast, dismissToast } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [entries, setEntries] = useState(ENTRIES);
  const [folderId, setFolderId] = useState(OPEN_ON_LOAD);
  const [open, setOpen] = useState(true);

  const folder = entries.find((entry) => entry.id === folderId);

  /** One report: no question asked, Undo for as long as the toast stays. */
  const deleteReport = (report: Entry) => {
    const at = entries.indexOf(report);
    setEntries((all) => all.filter((entry) => entry.id !== report.id));
    const id = showToast({
      content: `Deleted “${report.name}”`,
      action: (
        <Toast.Action
          preset="ghost"
          onClick={() => {
            // Back in its place, without undoing anything deleted since.
            setEntries((all) => [...all.slice(0, at), report, ...all.slice(at)]);
            dismissToast(id);
          }}
        >
          Undo
        </Toast.Action>
      ),
    });
  };

  const deleteFolder = (deleted: Entry) => {
    setOpen(false);
    setEntries((all) => all.filter((entry) => entry.id !== deleted.id));
    showToast({
      content: `Deleted “${deleted.name}” and its ${formatReports(deleted.reports ?? 0)}`,
    });
  };

  return (
    <div className="bg-ws-static-background flex h-dvh">
      <ReportsSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
          {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is pulled
              left so its glyph, not its box, sits 20px from the edge; the crumbs follow it. */}
          <div className="gap-ws-5 px-ws-11 flex w-full items-center">
            <IconButton
              icon={RiSideBarLine}
              variant="secondary"
              preset="ghost"
              size="sm"
              iconClassName="text-ws-static-subtle size-ws-9"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!collapsed}
              aria-controls={sidebarId}
              onClick={() => setCollapsed(!collapsed)}
              className="-ml-ws-5"
            />
            <Breadcrumbs separator="arrow">
              <Breadcrumbs.Item>Reports</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The page scrolls inside the card, so the card's corners stay put. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-16 flex flex-col')}>
            <PageHeader />
            <ReportsTable
              entries={entries}
              today={TODAY}
              onDelete={(entry) => {
                if (entry.kind === 'report') return deleteReport(entry);
                setFolderId(entry.id);
                setOpen(true);
              }}
            />
          </div>
        </div>
      </main>

      <DeleteFolderDialog
        folder={folder}
        open={open}
        onOpenChange={setOpen}
        onConfirm={deleteFolder}
      />
    </div>
  );
}

/**
 * Confirm delete (panel over Reports, Inset direction): the two weights of deleting on one list.
 * A single report is small and easy to bring back, so it goes at once with a toast that has Undo.
 * A folder of fourteen reports shared with six people is large and final, so it asks first, in a
 * dialog open on load: what goes with it, who loses access, that it cannot be undone, and its
 * name typed to confirm. Each row's menu deletes again.
 */
export default function ConfirmDeleteBlock() {
  return (
    <ToastProvider position="bottom-center">
      <ReportsPage />
    </ToastProvider>
  );
}
