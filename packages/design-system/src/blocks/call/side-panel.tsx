import { RiHandCoinLine } from '@remixicon/react';
import { LinkButton, Tabs } from '@wideset/react';

import { CallChat } from './call-chat';
import type { PanelTab } from './control-bar';
import { call, type ChatMessage, type Participant } from './data';
import { MeetingNotes } from './meeting-notes';
import { PeopleList } from './people-list';

type SidePanelProps = {
  tab: PanelTab;
  onTabChange: (tab: PanelTab) => void;
  notes: string[];
  onNotesChange: (notes: string[]) => void;
  messages: ChatMessage[];
  onSend: (text: string) => void;
  people: Participant[];
  onMute: (id: string) => void;
  onMuteAll: () => void;
};

/**
 * The panel beside the stage, 22rem, split from it by a line: the notes (under the deal they are
 * saved to), the call's chat and the people on it, one at a time. Its tabs carry no counts; the
 * bar's panel buttons open and close it on the same tab.
 */
export function SidePanel({
  tab,
  onTabChange,
  notes,
  onNotesChange,
  messages,
  onSend,
  people,
  onMute,
  onMuteAll,
}: SidePanelProps) {
  return (
    <aside
      aria-label="Call panel"
      className="border-ws-static-subtle flex w-[22rem] shrink-0 flex-col border-l"
    >
      <Tabs
        value={tab}
        onValueChange={(value) => onTabChange(value as PanelTab)}
        className="flex min-h-0 flex-1 flex-col"
      >
        <Tabs.List className="px-ws-9 pt-ws-5 shrink-0">
          <Tabs.Item value="notes">
            <Tabs.Label>Notes</Tabs.Label>
          </Tabs.Item>
          <Tabs.Item value="chat">
            <Tabs.Label>Chat</Tabs.Label>
          </Tabs.Item>
          <Tabs.Item value="people">
            <Tabs.Label>People</Tabs.Label>
          </Tabs.Item>
        </Tabs.List>

        <Tabs.Content value="notes" className="min-h-0 flex-1 overflow-y-auto">
          <div className="gap-ws-7 p-ws-9 flex flex-col">
            {/* Pulled left by the link's own padding, so its icon starts on the notes' edge. */}
            <LinkButton
              variant="secondary"
              href={`#${call.deal.id}`}
              className="-ml-ws-6 gap-ws-3 self-start"
            >
              <RiHandCoinLine aria-hidden className="size-ws-9" />
              {call.deal.name}
            </LinkButton>
            <MeetingNotes lines={notes} onLinesChange={onNotesChange} />
          </div>
        </Tabs.Content>
        <Tabs.Content value="chat" className="min-h-0 flex-1">
          <CallChat messages={messages} people={people} onSend={onSend} />
        </Tabs.Content>
        <Tabs.Content value="people" className="min-h-0 flex-1 overflow-y-auto">
          <PeopleList people={people} onMute={onMute} onMuteAll={onMuteAll} />
        </Tabs.Content>
      </Tabs>
    </aside>
  );
}
