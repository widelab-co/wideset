import {
  type RemixiconComponentType,
  RiArrowRightUpLine,
  RiAttachment2,
  RiCalendarLine,
  RiChat1Line,
  RiContactsBook2Line,
  RiFirefoxLine,
  RiInboxFill,
  RiNotification3Line,
  RiSettings2Line,
} from '@remixicon/react';
import type { AvatarColor } from '@wideset/react';

export type Person = {
  name: string;
  /** Left out, the avatar shows the default user icon. */
  initials?: string;
  color?: AvatarColor;
  status?: 'online' | 'offline';
};

export const workspace = { name: 'Wideset', initials: 'W' };

const adam = { name: 'Adam Smith', initials: 'AS', color: 'indigo', status: 'online' } as const;
const diana = { name: 'Diana Ross', initials: 'DR', color: 'yellow', status: 'online' } as const;
const robert = { name: 'Robert Redford', initials: 'RR', color: 'blue', status: 'online' } as const;
const melania = { name: 'Melania Jackson', initials: 'MJ', color: 'orange' } as const;
const dana: Person = { name: 'Dana Right' };

/** The signed-in user. */
export const account = { ...adam, role: 'Admin', email: 'hello@wideset.co' };

export const navigation: {
  id: string;
  label: string;
  icon: RemixiconComponentType;
  count?: number;
}[] = [
  { id: 'inbox', label: 'Inbox', icon: RiInboxFill, count: 245 },
  { id: 'activity', label: 'Activity', icon: RiNotification3Line },
  { id: 'calendars', label: 'Calendars', icon: RiCalendarLine },
  { id: 'chats', label: 'Chats', icon: RiChat1Line },
  { id: 'contacts', label: 'Contacts', icon: RiContactsBook2Line },
  { id: 'settings', label: 'Settings', icon: RiSettings2Line },
];

export const spaces = [{ id: 'firefox', label: 'Firefox', icon: RiFirefoxLine }];

export type CategoryColor = 'indigo' | 'blue' | 'cyan';

export const categories: { id: string; label: string; color: CategoryColor; count: number }[] = [
  { id: 'social', label: 'Social', color: 'indigo', count: 18 },
  { id: 'advertisement', label: 'Advertisement', color: 'blue', count: 4 },
  { id: 'private', label: 'Private', color: 'cyan', count: 3 },
];

export type Chat = {
  id: string;
  title: string;
  /** One person, or two for a group (drawn overlapping). */
  people: Person[];
  time: string;
  preview: string;
  previewIcon?: RemixiconComponentType;
  /** A missed call reads in the negative colour. */
  missed?: boolean;
  unread?: boolean;
  /** Who has read the last message, shown at the row's end. */
  seenBy?: Person;
};

export const chats: Chat[] = [
  {
    id: 'adam',
    title: 'Adam Smith',
    people: [adam],
    time: '4:40 PM',
    preview: 'Thanks for using our services and for the kind words!',
    unread: true,
  },
  {
    id: 'business',
    title: 'Diana, Robert',
    people: [{ name: 'Guest', status: 'online' }, diana],
    time: '4:38 PM',
    preview: 'Hello Anna 💪 We’re proud of what the team shipped this week.',
  },
  {
    id: 'melania',
    title: 'Melania Jackson',
    people: [melania],
    time: '4:20 PM',
    preview: 'You called',
    previewIcon: RiArrowRightUpLine,
    seenBy: diana,
  },
  {
    id: 'melania-missed',
    title: 'Melania Jackson',
    people: [melania],
    time: 'Yesterday',
    preview: 'Missed call',
    missed: true,
  },
  {
    id: 'robert',
    title: 'Robert Redford',
    people: [{ ...robert, status: 'offline' }],
    time: 'Monday',
    preview: 'You called',
  },
  {
    id: 'adam-files',
    title: 'Adam Smith',
    people: [adam],
    time: 'Sunday',
    preview: '3 attachments',
    previewIcon: RiAttachment2,
  },
];

/** The chat open in the middle, and the contact shown on the right. */
export const conversation = { title: 'Business Chat', people: [diana, robert], contact: robert };

export type Message = { id: string; from?: Person; time: string } & (
  | { kind: 'text'; text: string }
  | { kind: 'audio'; duration: string; progress: number }
  | { kind: 'poll'; question: string; options: string[]; votes: number }
);

/** A message without `from` is one the signed-in user sent. */
export const messages: Message[] = [
  {
    id: '1',
    kind: 'text',
    from: adam,
    time: '2 min ago',
    text: 'Hey, did you get a chance to review the latest draft of the proposal? 😅',
  },
  {
    id: '2',
    kind: 'text',
    time: '2 min ago',
    text: 'Yeah, I finished it last night. Just cleaning up a few slides. 😊',
  },
  {
    id: '3',
    kind: 'text',
    from: adam,
    time: '2 min ago',
    text: 'Nice. I thought the structure worked well — especially the client timeline. 😎',
  },
  {
    id: '4',
    kind: 'text',
    from: dana,
    time: '2 min ago',
    text: 'Agreed. Maybe break it into two slides or add some visuals? 😏',
  },
  { id: '5', kind: 'audio', time: '2 min ago', duration: '2:45', progress: 50 },
  {
    id: '6',
    kind: 'poll',
    from: dana,
    time: '1 min ago',
    question: 'What do you want to eat?',
    options: ['🍕 Pizza', '🍔 Burger'],
    votes: 2,
  },
];

/** The plan usage shown in the account menu. */
export const usage = { label: 'Views', used: 8495, limit: 12000, resets: 'Usage resets: 14 days' };
