import { RiSideBarLine } from '@remixicon/react';
import { Avatar, Breadcrumbs, cn, IconButton } from '@wideset/react';
import { useId, useState } from 'react';

import { ActivityTimeline } from './activity-timeline';
import { AssistantPanel } from './assistant-panel';
import { deal, maya, NOW, proposedCloseDate, proposedStep } from './data';
import { FactsList } from './facts-list';
import { formatDay, formatUsd } from './format';
import { KeyValue } from './key-value';
import { NextSteps } from './next-steps';
import { RecordHeader } from './record-header';
import { Section } from './section';
import { AssistantSidebar } from './sidebar';

/**
 * The record's column: the canonical one, but 60rem wide, not 80rem, since the 26rem assistant
 * already takes the rest of the card and a wider record would only stretch its lines.
 */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[60rem]';

/**
 * Assistant (Inset direction): the Halcyon Freight renewal deal on the raised page beside the
 * workspace sidebar, with Orbit's assistant in a 26rem panel beside it. The record is the
 * context, drawn plainly: its figures, key facts, next steps and activity. The assistant is the
 * subject: it answers with its sources and proposes changes, and applying one writes it to the
 * record on the left and logs it in the activity.
 */
export default function Assistant() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [record, setRecord] = useState(deal);

  const apply = () =>
    setRecord((current) => ({
      ...current,
      closeDate: proposedCloseDate,
      nextSteps: [...current.nextSteps, proposedStep],
      activity: [
        {
          id: 'assistant-change',
          kind: 'change',
          actor: maya,
          action: 'changed the close date and added a next step, from the assistant',
          at: NOW,
        },
        ...current.activity,
      ],
    }));

  return (
    <div className="bg-ws-static-background flex h-dvh">
      <AssistantSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
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
                <a href="#deals">Deals</a>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item>{record.name}</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The record scrolls on its own; the assistant beside it keeps its composer in reach. */}
        <div className="flex min-h-0 flex-1">
          <div className="min-w-0 flex-1 overflow-y-auto">
            <div className={cn(COLUMN, 'gap-ws-14 pt-ws-14 pb-ws-16 flex flex-col')}>
              <RecordHeader />

              <dl className="gap-ws-9 grid grid-cols-4">
                <KeyValue label="Stage">{record.stage}</KeyValue>
                <KeyValue label="Amount">{formatUsd(record.amount)}</KeyValue>
                <KeyValue label="Close date">{formatDay(record.closeDate)}</KeyValue>
                <KeyValue label="Owner">
                  <span className="gap-ws-5 flex items-center">
                    <Avatar size="xs" initials={record.owner.initials} color={record.owner.color} />
                    {record.owner.name}
                  </span>
                </KeyValue>
              </dl>

              <Section title="Key facts">
                <FactsList facts={record.facts} />
              </Section>

              <Section title="Next steps">
                <NextSteps steps={record.nextSteps} />
              </Section>

              <Section title="Activity">
                <ActivityTimeline items={record.activity} />
              </Section>
            </div>
          </div>

          <AssistantPanel onApply={apply} />
        </div>
      </main>
    </div>
  );
}
