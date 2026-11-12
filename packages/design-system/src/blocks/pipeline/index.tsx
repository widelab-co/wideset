import { RiSideBarLine } from '@remixicon/react';
import { Breadcrumbs, cn, IconButton, ToastProvider, useToast } from '@wideset/react';
import { useId, useState } from 'react';

import { closeWindow, type Deal, initialDeals, type StageId, STAGES } from './data';
import { formatCount, formatUsd } from './format';
import { NewDealDialog } from './new-deal-dialog';
import { PageHeader } from './page-header';
import { PipelineBoard } from './pipeline-board';
import { type Filters, PipelineToolbar } from './pipeline-toolbar';
import { PipelineSidebar } from './sidebar';

/** One column of the page: the header, the toolbar and the board share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';

const NO_FILTERS: Filters = { query: '', owners: [], close: [] };

/**
 * The page inside the card, under the toasts. It holds the deals and the filters; the board
 * fills the rest of the card's height, and its columns scroll on their own.
 */
function PipelinePage() {
  const { showToast } = useToast();
  const [deals, setDeals] = useState(initialDeals);
  const [filters, setFilters] = useState(NO_FILTERS);
  const [adding, setAdding] = useState<{ stage: StageId; open: boolean }>({
    stage: 'qualified',
    open: false,
  });

  const query = filters.query.trim().toLowerCase();
  const visible = deals.filter(
    (deal) =>
      (!query || `${deal.customer} ${deal.name}`.toLowerCase().includes(query)) &&
      (!filters.owners.length || filters.owners.includes(deal.ownerId)) &&
      (!filters.close.length || filters.close.includes(closeWindow(deal.close))),
  );
  const filtered = visible.length !== deals.length;
  const total = visible.reduce((sum, deal) => sum + deal.amount, 0);
  const summary = `${formatUsd(total)} open across ${formatCount(visible.length)} ${
    filtered ? `of ${formatCount(deals.length)} deals` : 'deals'
  }`;

  /** Within a stage the board keeps the array's order, so a move is a splice. */
  const move = (id: string, stage: StageId, beforeId: string | null) =>
    setDeals((current) => {
      const deal = { ...current.find((item) => item.id === id)!, stage };
      const rest = current.filter((item) => item.id !== id);
      const at = beforeId ? rest.findIndex((item) => item.id === beforeId) : rest.length;
      return [...rest.slice(0, at), deal, ...rest.slice(at)];
    });

  const create = (deal: Omit<Deal, 'id'>) => {
    // A new deal goes first in its stage, where it is seen.
    setDeals((current) => [{ ...deal, id: `deal-${current.length + 1}` }, ...current]);
    const stage = STAGES.find(({ id }) => id === deal.stage)!.label;
    showToast({ status: 'success', content: `${deal.customer}, ${deal.name} added to ${stage}` });
  };

  return (
    <div className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-12 flex min-h-0 flex-1 flex-col')}>
      <PageHeader
        summary={summary}
        quiet={adding.open}
        onNewDeal={() => setAdding({ stage: 'qualified', open: true })}
      />
      <div className="gap-ws-11 flex min-h-0 flex-1 flex-col">
        <PipelineToolbar
          filters={filters}
          onFiltersChange={setFilters}
          onListView={() =>
            showToast({ content: 'List view is not ready yet. The board shows every deal.' })
          }
        />
        <PipelineBoard
          deals={visible}
          onMove={move}
          onAddDeal={(stage) => setAdding({ stage, open: true })}
        />
      </div>
      <NewDealDialog
        stage={adding.stage}
        open={adding.open}
        onOpenChange={(open) => setAdding({ ...adding, open })}
        onCreate={create}
      />
    </div>
  );
}

/**
 * Pipeline (Inset direction): Lumen Studio's open deals as a board on the raised page beside the
 * workspace sidebar, with Deals open. The header gives the open total and New deal, the page's
 * one filled button; under it search, owner and close date filters and the view switch, then the
 * five stages as columns of deal cards with each stage's total. Cards are dragged between and
 * within columns, or moved from the keyboard, and the totals follow.
 */
export default function Pipeline() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ToastProvider>
      <div className="bg-ws-static-background flex h-dvh">
        <PipelineSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
        <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
            {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is
                pulled left so its glyph, not its box, sits 20px from the edge; the crumbs follow
                it. */}
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
                <Breadcrumbs.Item asChild>
                  <a href="#deals">Deals</a>
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>Pipeline</Breadcrumbs.Item>
              </Breadcrumbs>
            </div>
          </div>

          {/* The board fills the card under the bar; only its columns scroll. */}
          <PipelinePage />
        </main>
      </div>
    </ToastProvider>
  );
}
