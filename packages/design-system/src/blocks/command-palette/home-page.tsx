import { cn } from '@wideset/react';

import { account, deals, meetings, TODAY } from './data';
import { DealsTable } from './deals-table';
import { formatLongDay } from './format';
import { UpcomingMeetings } from './upcoming-meetings';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';

/**
 * Home, drawn quietly: the page the overlay opens over. The greeting, the deals to move this week
 * and what is coming up, so the screen behind is real without competing with what is open on it.
 */
export function HomePage() {
  return (
    // The page scrolls inside the card, so the card's corners stay put.
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-16 flex flex-col')}>
        <header className="gap-ws-2 flex flex-col">
          <h1 className="typography-subtitle-md text-ws-static-strong">
            Good afternoon, {account.firstName}
          </h1>
          <p className="typography-body-md text-ws-static-subtle">
            {formatLongDay(TODAY)}. Your deals and meetings for the week.
          </p>
        </header>

        <div className="gap-ws-12 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <DealsTable deals={deals} />
          <UpcomingMeetings meetings={meetings} today={TODAY} />
        </div>
      </div>
    </div>
  );
}
