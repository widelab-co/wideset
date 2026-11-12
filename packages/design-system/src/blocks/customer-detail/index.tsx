// TODO(custom): local Section heading (title + one xs action) and a titled Card panel composed by hand.
import { RiAddLine, RiBuilding2Line } from '@remixicon/react';
import { Breadcrumbs, Button, Card, IconButton, Tabs } from '@wideset/react';
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
  { value: 'deals', label: 'Deals' },
  { value: 'activity', label: 'Activity' },
  { value: 'notes', label: 'Notes' },
];

/** One column of the page: the header and the body share its edges. */
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
 * A part of the page to work with, in a bordered card: its title and one optional action in the
 * header. Without a title (on a tab, which names it already) the card has no header. A `flush`
 * card holds a table, which runs edge to edge and pads its own cells.
 */
function Panel({
  title,
  label,
  action,
  flush,
  children,
}: {
  title?: ReactNode;
  /** The region's name when the card has no title. */
  label?: string;
  action?: ReactNode;
  flush?: boolean;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <Card
      role="region"
      aria-labelledby={title ? id : undefined}
      aria-label={title ? undefined : label}
    >
      {title ? (
        <Card.Header>
          <div className="gap-ws-5 flex items-center justify-between">
            <h2 id={id} className="typography-label-strong-md text-ws-static-strong">
              {title}
            </h2>
            {action}
          </div>
        </Card.Header>
      ) : null}
      {/* A table goes straight in the card: Card.Content's scrollbar gutter would stop its lines
          short. Anything else keeps the content's padding, with the gutter given back. */}
      {flush ? children : <Card.Content contentClassName="pr-ws-6">{children}</Card.Content>}
    </Card>
  );
}

/**
 * Customer detail (Inset direction): one customer's record on the raised page beside the
 * workspace sidebar. The header says who they are and what to do next; the tabs hold the work,
 * each part of it in a card (the key figures, the open deals, the recent activity), and the side
 * column the facts and the people, quieter on the white without a box, the same on every tab.
 */
export default function CustomerDetail() {
  const [tab, setTab] = useState('overview');

  return (
    <div className="bg-ws-static-background flex h-dvh">
      <CustomerSidebar />
      <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* The bar belongs to the surround: it runs edge to edge, the crumbs 20px from its edge. */}
        <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
          <div className="px-ws-11 w-full">
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
                {TABS.map(({ value, label }) => (
                  <Tabs.Item key={value} value={value}>
                    <Tabs.Label>{label}</Tabs.Label>
                  </Tabs.Item>
                ))}
              </Tabs.List>

              <div className="gap-ws-16 pt-ws-12 grid grid-cols-1 items-start lg:grid-cols-[minmax(0,1fr)_18rem]">
                <div className="min-w-0">
                  <Tabs.Content value="overview" className="gap-ws-12 flex flex-col">
                    <KeyFigures />
                    <Panel title="Open deals" flush>
                      <DealsTable deals={openDeals} label="Open deals" />
                    </Panel>
                    <Panel
                      title="Recent activity"
                      action={
                        <Button
                          variant="secondary"
                          preset="ghost"
                          size="xs"
                          onClick={() => setTab('activity')}
                          // The button is taller than the title's line: it keeps the header as
                          // tall as the other cards'.
                          className="-my-ws-2"
                        >
                          View all
                        </Button>
                      }
                    >
                      <ActivityTimeline items={activity.slice(0, 5)} />
                    </Panel>
                  </Tabs.Content>
                  <Tabs.Content value="deals">
                    <Panel label="All deals" flush>
                      <DealsTable deals={deals} label="All deals" />
                    </Panel>
                  </Tabs.Content>
                  <Tabs.Content value="activity">
                    <Panel label="All activity">
                      <ActivityTimeline items={activity} />
                    </Panel>
                  </Tabs.Content>
                  <Tabs.Content value="notes">
                    <Panel label="Notes">
                      <ActivityTimeline items={notes} />
                    </Panel>
                  </Tabs.Content>
                </div>

                {/* Its first title stands on the line of the first text in the cards beside it. */}
                <aside
                  aria-label="About the customer"
                  className="gap-ws-16 lg:pt-ws-11 flex flex-col"
                >
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
