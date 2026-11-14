import { RiCheckLine, RiFunctionFill, RiListUnordered, RiSearchLine } from '@remixicon/react';
import { Avatar, Chip, cn, SegmentedControl, TextInput } from '@wideset/react';
import { useState } from 'react';

import { type Chat, chats, type Person } from './data';

/** A 3px dot between a name and a time. */
export const Dot = () => (
  <span
    aria-hidden="true"
    className="bg-ws-static-alpha-strong rounded-ws-control-full size-[3px] shrink-0"
  />
);

/** An avatar for a person; one without initials shows the default user icon. */
export function PersonAvatar({
  person,
  size,
  label = person.name,
}: {
  person: Person;
  size: 'xs' | 'sm' | 'md' | 'lg' | '2xl';
  label?: string;
}) {
  const common = { size, status: person.status, 'aria-label': label };
  return person.initials ? (
    <Avatar {...common} initials={person.initials} color={person.color} />
  ) : (
    <Avatar {...common} />
  );
}

/** One avatar, or two overlapping for a group chat. */
function ChatAvatar({ people }: { people: Person[] }) {
  if (people.length === 1) return <PersonAvatar person={people[0]} size="lg" />;
  return (
    <span className="size-ws-16 relative flex shrink-0">
      <span className="top-ws-0 left-ws-0 absolute flex">
        <PersonAvatar person={people[0]} size="sm" />
      </span>
      <span className="right-ws-0 bottom-ws-0 absolute flex">
        <PersonAvatar person={people[1]} size="sm" />
      </span>
    </span>
  );
}

function ChatRow({
  chat,
  selected,
  onSelect,
}: {
  chat: Chat;
  selected: boolean;
  onSelect: () => void;
}) {
  const PreviewIcon = chat.previewIcon;
  return (
    <button
      type="button"
      aria-current={selected || undefined}
      onClick={onSelect}
      className="gap-ws-7 px-ws-8 py-ws-5 rounded-ws-control-lg hover:bg-ws-dynamic-tertiary-alpha-strong-default aria-[current=true]:bg-ws-dynamic-primary-alpha-strong-default focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex w-full items-center text-left"
    >
      <ChatAvatar people={chat.people} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="gap-ws-3 flex items-center">
          <span className="typography-label-strong-sm text-ws-static-strong truncate">
            {chat.title}
          </span>
          <Dot />
          <span className="typography-body-sm text-ws-static-subtle shrink-0">{chat.time}</span>
        </span>
        <span className="gap-ws-5 flex items-center">
          <span
            className={cn(
              'typography-body-md gap-ws-3 flex min-w-0 items-center',
              chat.missed ? 'text-ws-semantic-negative' : 'text-ws-static-subtle',
            )}
          >
            {PreviewIcon && <PreviewIcon aria-hidden="true" className="size-ws-9 shrink-0" />}
            <span className="truncate">{chat.preview}</span>
          </span>
          {chat.unread && (
            <span className="bg-ws-non-semantic-indigo-strong rounded-ws-control-full size-ws-4 mr-ws-3 ml-auto shrink-0">
              <span className="sr-only">Unread</span>
            </span>
          )}
          {chat.seenBy && (
            <span className="ml-auto flex shrink-0">
              <PersonAvatar person={chat.seenBy} label={`Seen by ${chat.seenBy.name}`} size="xs" />
            </span>
          )}
        </span>
      </span>
    </button>
  );
}

/** The chat list panel: filter, search, conversations and a list/grid switch. */
export function ChatList() {
  const [filter, setFilter] = useState<'open' | 'archive'>('open');
  const [selected, setSelected] = useState('business');
  const [layout, setLayout] = useState('list');

  return (
    <section
      aria-labelledby="chats-title"
      className="border-ws-static-subtle flex w-[20.6875rem] shrink-0 flex-col border-r"
    >
      <header className="gap-ws-9 px-ws-11 h-ws-19 border-ws-static-base flex shrink-0 items-center border-b">
        <h2 id="chats-title" className="typography-label-strong-md text-ws-static-strong">
          Chats
        </h2>
        <div className="gap-ws-3 flex">
          {(['open', 'archive'] as const).map((value) => (
            <Chip
              key={value}
              variant="secondary"
              style={filter === value ? 'filled' : 'border'}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {filter === value && <Chip.Icon icon={RiCheckLine} />}
              {value === 'open' ? 'Open' : 'Archive'}
            </Chip>
          ))}
        </div>
      </header>

      <div className="gap-ws-5 px-ws-3 pt-ws-8 flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="px-ws-8">
          <TextInput size="sm">
            <TextInput.Prefix inner>
              <TextInput.Icon icon={RiSearchLine} />
            </TextInput.Prefix>
            <TextInput.Input type="search" placeholder="Search" aria-label="Search chats" />
          </TextInput>
        </div>
        <ul className="flex flex-col">
          {chats.map((chat) => (
            <li key={chat.id}>
              <ChatRow
                chat={chat}
                selected={selected === chat.id}
                onSelect={() => setSelected(chat.id)}
              />
            </li>
          ))}
          {/* More chats loading. */}
          {[1, 2, 3].map((row) => (
            <li key={row} aria-hidden="true" className="gap-ws-7 px-ws-8 py-ws-5 flex items-center">
              <span className="size-ws-16 bg-ws-static-alpha-base rounded-ws-control-full shrink-0" />
              <span className="gap-ws-4 flex flex-col">
                <span className="h-ws-5 bg-ws-static-alpha-base rounded-ws-control-lg w-[4.8125rem]" />
                <span className="h-ws-5 bg-ws-static-alpha-base rounded-ws-control-lg w-[10.125rem]" />
              </span>
            </li>
          ))}
        </ul>
        <p role="status" className="sr-only">
          Loading more chats
        </p>
      </div>

      <footer className="p-ws-5 shrink-0">
        <SegmentedControl size="sm" value={layout} onValueChange={setLayout} aria-label="Layout">
          <SegmentedControl.Item value="list" icon={RiListUnordered} aria-label="List" />
          <SegmentedControl.Item value="grid" icon={RiFunctionFill} aria-label="Grid" />
        </SegmentedControl>
      </footer>
    </section>
  );
}
