import { RiSearchLine } from '@remixicon/react';
import { SegmentedControl, TextInput } from '@wideset/react';
import type { Ref } from 'react';

import { ConversationRow } from './conversation-row';
import type { Conversation } from './data';
import { EmptyState } from './empty-state';

export type Filter = 'all' | 'unread' | 'starred';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'starred', label: 'Starred' },
];

/** What the list says when the filter leaves nothing. */
const EMPTY: Record<Filter, { title: string; description: string }> = {
  all: {
    title: 'Your inbox is empty',
    description: 'New mail from your customers shows up here.',
  },
  unread: {
    title: 'No unread conversations',
    description: 'You have read everything in your inbox.',
  },
  starred: {
    title: 'No starred conversations',
    description: 'Star a conversation to find it here.',
  },
};

type ConversationListProps = {
  /** The conversations the search and the filter leave, newest first. */
  conversations: Conversation[];
  query: string;
  onQueryChange: (query: string) => void;
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** The scrolling list, so the screen can tell when the arrow keys belong to it. */
  listRef: Ref<HTMLDivElement>;
  /** Where the rows register themselves, so focus can move with the selection. */
  rowRef: (id: string) => (row: HTMLButtonElement | null) => void;
};

/**
 * The inbox column: a search, a filter with no counts, and the conversations under them. The
 * column keeps its width and scrolls on its own, so the open conversation never moves.
 */
export function ConversationList({
  conversations,
  query,
  onQueryChange,
  filter,
  onFilterChange,
  selectedId,
  onSelect,
  listRef,
  rowRef,
}: ConversationListProps) {
  return (
    <section
      aria-label="Conversations"
      className="border-ws-static-subtle flex w-[24rem] shrink-0 flex-col border-r"
    >
      <div className="gap-ws-5 px-ws-11 pt-ws-9 pb-ws-5 flex shrink-0 flex-col">
        <TextInput size="sm" value={query} onChange={(event) => onQueryChange(event.target.value)}>
          <TextInput.Prefix inner>
            <TextInput.Icon icon={RiSearchLine} />
          </TextInput.Prefix>
          <TextInput.Input type="search" placeholder="Search mail" aria-label="Search mail" />
          <TextInput.Suffix inner>
            <TextInput.ClearButton onClear={() => onQueryChange('')} />
          </TextInput.Suffix>
        </TextInput>
        <SegmentedControl
          size="sm"
          variant="fullWidth"
          value={filter}
          onValueChange={(value) => onFilterChange(value as Filter)}
          aria-label="Show"
        >
          {FILTERS.map(({ value, label }) => (
            <SegmentedControl.Item key={value} value={value}>
              {label}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl>
      </div>

      <div ref={listRef} className="px-ws-5 pb-ws-5 min-h-0 flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="px-ws-7 pt-ws-16">
            <EmptyState
              title={query ? 'No conversations found' : EMPTY[filter].title}
              description={
                query ? `Nothing in your mail matches “${query}”.` : EMPTY[filter].description
              }
            />
          </div>
        ) : (
          <ul className="flex flex-col">
            {conversations.map((conversation) => (
              <li key={conversation.id}>
                <ConversationRow
                  ref={rowRef(conversation.id)}
                  conversation={conversation}
                  selected={conversation.id === selectedId}
                  onSelect={() => onSelect(conversation.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
