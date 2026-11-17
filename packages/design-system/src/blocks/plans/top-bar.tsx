// TODO(custom): takeover top bar (back, title); no NavigationBar / TopBar in Wideset.
import { RiArrowLeftLine } from '@remixicon/react';
import { IconButton } from '@wideset/react';

/**
 * The takeover's top bar: back to where the user came from, then where they are, a line below
 * it. It shares the page's column, so the title stands on the content's left edge; from 1408px,
 * where the gutter has room, the back button hangs left of it.
 */
export function TopBar() {
  return (
    <header className="border-ws-static-base px-ws-12 shrink-0 border-b">
      <div className="h-ws-19 gap-ws-7 mx-auto flex w-full max-w-[80rem] items-center">
        <IconButton
          variant="secondary"
          preset="ghost"
          size="sm"
          icon={RiArrowLeftLine}
          aria-label="Back to billing"
          className="min-[88rem]:-ml-[2.75rem]"
        />
        <h1 className="typography-label-strong-md text-ws-static-strong">Choose a plan</h1>
      </div>
    </header>
  );
}
