// TODO(custom): takeover top bar (back, title); no NavigationBar / TopBar in Wideset.
import { RiArrowLeftLine } from '@remixicon/react';
import { IconButton } from '@wideset/react';

/**
 * The takeover's top bar, as in Gantt: back to where the user came from, then where they are.
 * Full-bleed, a line below it.
 */
export function TopBar() {
  return (
    <header className="border-ws-static-base h-ws-19 gap-ws-7 px-ws-11 flex shrink-0 items-center border-b">
      <IconButton
        variant="secondary"
        preset="ghost"
        size="sm"
        icon={RiArrowLeftLine}
        aria-label="Back to billing"
      />
      <h1 className="typography-label-strong-md text-ws-static-strong">Choose a plan</h1>
    </header>
  );
}
