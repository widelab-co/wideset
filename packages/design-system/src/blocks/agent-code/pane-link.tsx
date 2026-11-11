import { RiLayoutRightLine } from '@remixicon/react';
import { Button } from '@wideset/react';

type PaneLinkProps = {
  /** Where it leads: "Open in Terminal". */
  label: string;
  /** Its pane is the one showing. */
  open: boolean;
  paneId: string;
  onToggle: () => void;
};

/**
 * The way from a line of the transcript to the pane that holds the whole of it (a test run's
 * output in the Terminal, the plan's progress in Tasks): the smallest quiet button, with the
 * pane's own sign. A card is kept for what a turn made; this only points.
 */
export function PaneLink({ label, open, paneId, onToggle }: PaneLinkProps) {
  return (
    <Button
      variant="secondary"
      preset="ghost"
      size="xs"
      aria-expanded={open}
      aria-controls={paneId}
      onClick={onToggle}
    >
      <Button.Icon icon={RiLayoutRightLine} />
      {label}
    </Button>
  );
}
