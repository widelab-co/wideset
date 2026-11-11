// TODO(custom): page header (title, a line of description, the primary action); no PageHeader in Wideset.
import { RiAddLine } from '@remixicon/react';
import { Button } from '@wideset/react';

/**
 * The page's title, one line with the open pipeline's total, and New deal, the screen's one
 * filled button.
 */
export function PageHeader({ summary, onNewDeal }: { summary: string; onNewDeal: () => void }) {
  return (
    <header className="gap-ws-12 flex flex-wrap items-center justify-between">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <h1 className="typography-subtitle-md text-ws-static-strong">Pipeline</h1>
        <p className="typography-body-md text-ws-static-subtle tabular-nums">{summary}</p>
      </div>
      <Button size="sm" onClick={onNewDeal}>
        <Button.Icon icon={RiAddLine} />
        New deal
      </Button>
    </header>
  );
}
