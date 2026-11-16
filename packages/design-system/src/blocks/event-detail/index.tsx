import { RiSideBarLine } from '@remixicon/react';
import { AppShell, Breadcrumbs, cn, IconButton, ToastProvider, useToast } from '@wideset/react';
import { useId, useState } from 'react';

import { AddToCalendarMenu } from './add-to-calendar-menu';
import { Agenda } from './agenda';
import { AttendeeList } from './attendee-list';
import { account, agenda, type Answer, event, going, hosts, me, practical, speakers } from './data';
import { EventHeader } from './event-header';
import { FactsList } from './facts-list';
import { HostList } from './host-list';
import { InviteColleague } from './invite-colleague';
import { RsvpControl } from './rsvp-control';
import { Section } from './section';
import { SharePopup } from './share-popup';
import { EventSidebar } from './sidebar';
import { SpeakerList } from './speaker-list';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';

const calendarEntry = {
  title: event.name,
  start: event.start,
  end: event.end,
  location: `${event.venue.name}, ${event.venue.address} ${event.venue.postcode}`,
  details: `${event.summary}\n\n${event.link}`,
};

/** The page: the event and the answer to it, then what happens there beside who will be there. */
function EventDetailPage() {
  const sidebarId = useId();
  const { showToast } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [answer, setAnswer] = useState<Answer | null>(null);

  const people = answer === 'going' ? [me, ...going] : going;

  return (
    <AppShell direction="inset">
      <EventSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <AppShell.Main>
        <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
          {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is pulled
              left so its glyph, not its box, sits 20px from the edge; the crumbs follow it. */}
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
                <a href="#events">Events</a>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item>{event.name}</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The page scrolls inside the card, so the card's corners stay put. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className={cn(COLUMN, 'gap-ws-14 pt-ws-14 pb-ws-16 flex flex-col')}>
            <EventHeader
              actions={
                <>
                  <AddToCalendarMenu entry={calendarEntry} />
                  <SharePopup
                    link={event.link}
                    onCopy={() => showToast({ content: 'Link copied' })}
                  />
                  <RsvpControl
                    answer={answer}
                    onAnswer={setAnswer}
                    email={account.email}
                    answerBy={event.answerBy}
                  />
                </>
              }
            />

            {/* Every part is a card: what happens on the left, who will be there on the right. */}
            <div className="gap-ws-12 grid grid-cols-1 items-start lg:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="gap-ws-12 flex min-w-0 flex-col">
                <Section title="About">
                  <div className="gap-ws-5 typography-body-md text-ws-static-base flex max-w-[44rem] flex-col">
                    {event.about.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </Section>
                <Section title="Agenda">
                  <Agenda sessions={agenda} />
                </Section>
                <Section title="Speakers">
                  <SpeakerList speakers={speakers} />
                </Section>
                <Section title="Practical information">
                  <FactsList facts={practical} />
                </Section>
              </div>

              <aside aria-label="People" className="gap-ws-12 flex flex-col">
                <Section title="Who is going">
                  <AttendeeList people={people} meId={me.id} />
                </Section>
                <Section title="Hosts">
                  <HostList hosts={hosts} />
                </Section>
                <Section title="Invite a colleague">
                  <InviteColleague
                    onInvite={(email) =>
                      showToast({ status: 'success', content: `Invitation sent to ${email}` })
                    }
                  />
                </Section>
              </aside>
            </div>
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}

/**
 * Event detail (Inset direction): one customer event on the raised page beside the workspace
 * sidebar. No hero and no banner: the header carries the date as a leaf over the name, the facts
 * in a quiet row, and the answer to the invitation as the one filled control. Below, in bordered
 * cards, what happens (about, the agenda as a timeline, the speakers, the practical facts) beside
 * who will be there (who is going, the hosts, inviting a colleague).
 */
export default function EventDetail() {
  return (
    <ToastProvider position="bottom-center">
      <EventDetailPage />
    </ToastProvider>
  );
}
