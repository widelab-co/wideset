// TODO(custom): page header (title, a line of description, the action on the right); no PageHeader in Wideset.
import { RiAddLine } from '@remixicon/react';
import { Button } from '@wideset/react';

type PageHeaderProps = {
  /** What the goals cover, in words: the quarter, its days and what is left of it. */
  summary: string;
  onNewGoal: () => void;
};

/** The page's title, the quarter its goals cover, and the screen's one filled button. */
export function PageHeader({ summary, onNewGoal }: PageHeaderProps) {
  return (
    <header className="gap-ws-12 flex flex-wrap items-center justify-between">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <h1 className="typography-subtitle-md text-ws-static-strong">Goals</h1>
        <p className="typography-body-md text-ws-static-subtle tabular-nums">{summary}</p>
      </div>
      <Button size="sm" onClick={onNewGoal}>
        <Button.Icon icon={RiAddLine} />
        New goal
      </Button>
    </header>
  );
}
