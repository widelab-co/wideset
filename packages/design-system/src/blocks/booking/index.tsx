import { RiSideBarLine } from '@remixicon/react';
import { Breadcrumbs, Card, cn, IconButton } from '@wideset/react';
import { useId, useState } from 'react';

import { BookingConfirmation } from './booking-confirmation';
import { BookingSummary } from './booking-summary';
import {
  contact,
  customer,
  guests,
  meetingTypes,
  nextDayWithTime,
  places,
  sharedDays,
  slotsFor,
} from './data';
import { DayCalendar } from './day-calendar';
import { type Details, DetailsForm } from './details-form';
import { formatLongDate, formatTimeRange, fromDay } from './format';
import { MeetingPane } from './meeting-pane';
import { PageHeader } from './page-header';
import { BookingSidebar } from './sidebar';
import { TimeSlots } from './time-slots';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';

/** The sample's today, Tuesday 10 November 2026, as the calendar's local midnight. */
const TODAY = new Date(2026, 10, 10);
const MY_ZONE = 'Europe/London';
const firstName = contact.name.split(' ')[0];

const firstDayFor = (minutes: number) =>
  sharedDays.find((day) => slotsFor(day, minutes).length > 0) ?? sharedDays[0];

type Step = 'pick' | 'details' | 'booked';

/**
 * Booking (Inset direction): booking a meeting with a customer contact from inside the app, out of
 * the free time they shared, on the raised page beside the workspace sidebar. One bordered card
 * holds the three choices side by side in reading order (the meeting, the day, the time), then the
 * details in place of them, then the confirmation. The brand colour marks only the chosen day and
 * the chosen time; Confirm, then Book meeting, is the one filled button.
 */
export default function Booking() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [step, setStep] = useState<Step>('pick');
  const [typeId, setTypeId] = useState('renewal');
  const [place, setPlace] = useState('video');
  const [day, setDay] = useState(() => firstDayFor(45));
  const [month, setMonth] = useState(() => fromDay(day));
  const [slot, setSlot] = useState<string>();
  const [timeZone, setTimeZone] = useState(MY_ZONE);
  const [details, setDetails] = useState<Details>();

  const type = meetingTypes.find(({ id }) => id === typeId) ?? meetingTypes[0];
  const slots = slotsFor(day, type.minutes);
  const where = places.find(({ value }) => value === place) ?? places[0];
  const end = slot ? new Date(Date.parse(slot) + type.minutes * 60_000).toISOString() : '';

  const showDay = (next: string) => {
    setDay(next);
    setMonth(fromDay(next));
    setSlot(undefined);
  };

  const when = slot ? (
    <>
      {formatLongDate(slot, MY_ZONE)}
      <br />
      {formatTimeRange(slot, end, MY_ZONE)} in London
      <br />
      <span className="text-ws-static-subtle">
        {formatTimeRange(slot, end, contact.timeZone)} in {customer.city}, {firstName}’s time
      </span>
    </>
  ) : null;

  const invited = [contact.name, ...(details?.guests ?? []).map((id) => guestName(id))];

  return (
    <div className="bg-ws-static-background flex h-dvh">
      <BookingSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
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
                <a href="#customers">Customers</a>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item asChild>
                <a href="#customers/halcyon-freight">{customer.name}</a>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item>Book a meeting</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The page scrolls inside the card, so the card's corners stay put. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-16 flex flex-col')}>
            <PageHeader />

            {step === 'pick' ? (
              <Card className="grid grid-cols-1 overflow-hidden lg:grid-cols-[20rem_minmax(0,1fr)_20rem]">
                <section aria-label="Meeting" className="p-ws-12">
                  <MeetingPane
                    typeId={typeId}
                    onTypeChange={(id) => {
                      setTypeId(id);
                      setSlot(undefined);
                    }}
                    place={place}
                    onPlaceChange={setPlace}
                  />
                </section>
                <section
                  aria-label="Day"
                  className="border-ws-static-base p-ws-9 flex justify-center border-t lg:border-t-0 lg:border-l"
                >
                  <DayCalendar
                    day={day}
                    onDayChange={showDay}
                    month={month}
                    onMonthChange={setMonth}
                    minutes={type.minutes}
                    today={TODAY}
                  />
                </section>
                <section
                  aria-label="Time"
                  className="border-ws-static-base p-ws-12 border-t lg:border-t-0 lg:border-l"
                >
                  <TimeSlots
                    day={day}
                    slots={slots}
                    meeting={`${type.minutes} min ${type.name.toLowerCase()}`}
                    timeZone={timeZone}
                    onTimeZoneChange={setTimeZone}
                    selected={slot}
                    onSelect={setSlot}
                    onConfirm={() => setStep('details')}
                    nextDay={nextDayWithTime(day, type.minutes)}
                    onShowDay={showDay}
                  />
                </section>
              </Card>
            ) : null}

            {step === 'details' && slot ? (
              <Card className="grid grid-cols-1 overflow-hidden lg:grid-cols-[20rem_minmax(0,1fr)]">
                <section aria-label="Your choice" className="p-ws-12">
                  <BookingSummary
                    choices={[
                      {
                        label: 'Meeting',
                        value: `${type.name}, ${type.minutes} min`,
                        onChange: () => setStep('pick'),
                      },
                      { label: 'When', value: when, onChange: () => setStep('pick') },
                      { label: 'Where', value: where.label, onChange: () => setStep('pick') },
                      { label: 'With', value: `${contact.name}, ${customer.name}` },
                    ]}
                  />
                </section>
                <section
                  aria-label="Details"
                  className="border-ws-static-base p-ws-12 border-t lg:border-t-0 lg:border-l"
                >
                  <div className="max-w-[36rem]">
                    <DetailsForm
                      initial={details}
                      onBack={() => setStep('pick')}
                      onBook={(value) => {
                        setDetails(value);
                        setStep('booked');
                      }}
                    />
                  </div>
                </section>
              </Card>
            ) : null}

            {step === 'booked' && slot ? (
              <Card className="p-ws-14">
                <div className="max-w-[36rem]">
                  <BookingConfirmation
                    title={`${type.name} booked`}
                    sentence={`Orbit sent the invitation to ${listOf(invited)}.`}
                    facts={[
                      { label: 'Meeting', value: `${type.name}, ${type.minutes} min` },
                      { label: 'When', value: when },
                      { label: 'Where', value: `${where.label}. ${where.detail}` },
                    ]}
                    entry={{
                      title: `${type.name}: ${customer.name} and Lumen Studio`,
                      start: slot,
                      end,
                      location: where.label,
                      details: details?.agenda ?? '',
                    }}
                    onBookAnother={() => {
                      setSlot(undefined);
                      setDetails(undefined);
                      setStep('pick');
                    }}
                  />
                </div>
              </Card>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}

/** "Jonas Weber, Lumen Studio" → "Jonas Weber". */
function guestName(id: string) {
  return (guests.find(({ value }) => value === id)?.label ?? id).split(',')[0];
}

/** Ingrid Solberg, Jonas Weber and Samir Khan. */
function listOf(names: string[]) {
  return new Intl.ListFormat('en-US', { type: 'conjunction' }).format(names);
}
