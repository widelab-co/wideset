import { RiAddLine, RiBuilding2Line } from '@remixicon/react';
import { Breadcrumbs, Button, IconButton, Tabs } from '@wideset/react';
import { type ReactNode, useId, useState } from 'react';

import { ActivityTimeline } from './activity-timeline';
import { ContactsList } from './contacts-list';
import { activity, customer, deals, openDeals } from './data';
import { DealsTable } from './deals-table';
import { FactsList } from './facts-list';
import { KeyFigures } from './key-figures';
import { RecordHeader } from './record-header';
import { CustomerSidebar } from './sidebar';

const notes = activity.filter(({ kind }) => kind === 'note');

const TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'deals', label: 'Deals', count: deals.length },
  { value: 'activity', label: 'Activity' },
  { value: 'notes', label: 'Notes', count: notes.length },
];

/** One column of the page: the bar, the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';

/** A titled part of the page; its one action (xs, in the heading row) is optional. */
function Section({
  title,
  action,
  children,
}: {
  title: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="gap-ws-9 flex flex-col">
      <div className="gap-ws-5 flex items-center justify-between">
        <h2 id={id} className="typography-label-strong-md text-ws-static-strong">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/**
 * Customer detail (Inset direction): one customer's record on the raised page beside the
 * workspace sidebar. The header says who they are and what to do next; the tabs hold the work,
 * the side column the facts and the people, the same on every tab.
 */
export default function CustomerDetail() {
  const [tab, setTab] = useState('overview');

  return (
    <div className="bg-ws-static-background flex h-dvh">
      <CustomerSidebar />
      <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
          <div className={COLUMN}>
            <Breadcrumbs separator="arrow">
              <Breadcrumbs.Item asChild>
                <a href="#customers">
                  <RiBuilding2Line aria-hidden="true" className="size-ws-9" />
                  Customers
                </a>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item>{customer.name}</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The page scrolls inside the card, so the card's corners stay put. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className={`${COLUMN} gap-ws-12 pt-ws-14 pb-ws-16 flex flex-col`}>
            <RecordHeader />

            <Tabs value={tab} onValueChange={setTab}>
              <Tabs.List aria-label="Customer sections" className="w-full">
                {TABS.map(({ value, label, count }) => (
                  <Tabs.Item key={value} value={value}>
                    <Tabs.Label>{label}</Tabs.Label>
                    {count ? <Tabs.Count>{count}</Tabs.Count> : null}
                  </Tabs.Item>
                ))}
              </Tabs.List>

              <div className="gap-ws-16 pt-ws-12 grid grid-cols-1 items-start lg:grid-cols-[minmax(0,1fr)_18rem]">
                <div className="min-w-0">
                  <Tabs.Content value="overview" className="gap-ws-16 flex flex-col">
                    <KeyFigures />
                    <Section title="Open deals">
                      <DealsTable deals={openDeals} label="Open deals" />
                    </Section>
                    <Section
                      title="Recent activity"
                      action={
                        <Button
                          variant="secondary"
                          preset="ghost"
                          size="xs"
                          onClick={() => setTab('activity')}
                        >
                          View all
                        </Button>
                      }
                    >
                      <ActivityTimeline items={activity.slice(0, 5)} />
                    </Section>
                  </Tabs.Content>
                  <Tabs.Content value="deals">
                    <DealsTable deals={deals} label="All deals" />
                  </Tabs.Content>
                  <Tabs.Content value="activity">
                    <ActivityTimeline items={activity} />
                  </Tabs.Content>
                  <Tabs.Content value="notes">
                    <ActivityTimeline items={notes} />
                  </Tabs.Content>
                </div>

                <aside aria-label="About the customer" className="gap-ws-16 flex flex-col">
                  <Section title="Details">
                    <FactsList />
                  </Section>
                  <Section
                    title="Contacts"
                    action={
                      <IconButton
                        icon={RiAddLine}
                        variant="secondary"
                        preset="ghost"
                        size="xs"
                        aria-label="Add contact"
                      />
                    }
                  >
                    <ContactsList contacts={customer.contacts} />
                  </Section>
                </aside>
              </div>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
