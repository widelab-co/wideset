// TODO(custom): page header (title, a line of description, the primary action); no PageHeader in Wideset.
import { RiAddLine } from '@remixicon/react';
import { Button } from '@wideset/react';

/**
 * The page's title, one line with the open pipeline's total, and New deal, the screen's one
 * filled button. While the New deal dialog holds the filled button, New deal steps back to a
 * bordered one (`quiet`), so the screen keeps one.
 */
export function PageHeader({
  summary,
  onNewDeal,
  quiet,
}: {
  summary: string;
  onNewDeal: () => void;
  quiet?: boolean;
}) {
  return (
    <header className="gap-ws-12 flex flex-wrap items-center justify-between">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <h1 className="typography-subtitle-md text-ws-static-strong">Pipeline</h1>
        <p className="typography-body-md text-ws-static-subtle tabular-nums">{summary}</p>
      </div>
      <Button
        size="sm"
        variant={quiet ? 'secondary' : 'primary'}
        preset={quiet ? 'border' : 'filled'}
        onClick={onNewDeal}
      >
        <Button.Icon icon={RiAddLine} />
        New deal
      </Button>
    </header>
  );
}
