import {
  type RemixiconComponentType,
  RiBarChart2Line,
  RiCalendarLine,
  RiInformationLine,
  RiMapPin2Line,
  RiMoreFill,
  RiProgress4Line,
  RiProgress6Line,
  RiStarLine,
  RiTimeLine,
} from '@remixicon/react';
import type { AvatarColor, StatusBadgeProps, TagProps } from '@wideset/react';

/** Where the screen leads: replace with your routes. */
export const ROUTES = {
  /** After a successful sign-in. */
  app: '#app',
  signUp: '#sign-up',
  magicLink: '#magic-link',
  resetPassword: '#reset-password',
};

// The product in the card beside the form: the Kanban board as Figma's sign-in shows it. Replace
// the whole card with a picture of your own product.

export type Person = { name: string; initials: string; color?: AvatarColor; online?: boolean };
export type SpaceColor = 'purple' | 'indigo' | 'blue' | 'cyan' | 'teal' | 'green';

/** A status (`StatusBadge`) or a category (`Tag`) on a card. */
export type Badge =
  | {
      kind: 'status';
      label: string;
      color?: StatusBadgeProps['color'];
      icon?: RemixiconComponentType;
    }
  | { kind: 'tag'; label: string; color: TagProps['color'] };

export type Task = {
  id: string;
  /** The card's header row; `null` is a task nobody has picked up yet. */
  assignee?: Person | null;
  /** The header row's name when nobody is assigned. */
  placeholder?: string;
  date?: string;
  details?: { icon: RemixiconComponentType; label: string }[];
  title?: string;
  badges?: Badge[];
  comments?: number;
  attachments?: number;
};

/** Several tasks of one person, stacked under their name. */
export type TaskGroup = {
  id: string;
  assignee: Person;
  age: string;
  tasks: Task[];
  hidden: number;
};

export type Column = {
  id: string;
  title: string;
  icon: RemixiconComponentType;
  color: TagProps['color'];
  count: number;
  items: (Task | TaskGroup)[];
};

export const account: Person & { email: string } = {
  name: 'Adam Smith',
  initials: 'AS',
  email: 'hello@wideset.co',
  online: true,
};

export const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: RiBarChart2Line },
  { id: 'recent', label: 'Recent', icon: RiTimeLine },
  { id: 'starred', label: 'Starred', icon: RiStarLine },
];

export const spaceGroups: {
  id: string;
  label: string;
  spaces: { id: string; label: string; color: SpaceColor }[];
}[] = [
  {
    id: 'pinned-spaces',
    label: 'Pinned Spaces',
    spaces: [
      { id: 'kick-off', label: 'Project Kick-off', color: 'purple' },
      { id: 'research', label: 'Research & Discovery', color: 'indigo' },
      { id: 'ideas', label: 'Ideas & Concepts', color: 'blue' },
    ],
  },
  {
    id: 'spaces',
    label: 'Spaces',
    spaces: [
      { id: 'design', label: 'Design', color: 'cyan' },
      { id: 'handoff', label: 'Development Handoff', color: 'teal' },
      { id: 'feedback', label: 'Feedback & Iteration', color: 'green' },
    ],
  },
];

export const breadcrumbs = ['Teams', 'Projects', 'Design Analysis 2024'];

export const views = ['Board', 'List', 'Calendar', 'Table', 'Gantt'];

const andrew: Person = { name: 'Andrew Tang', initials: 'AT', online: true };
const ryan: Person = { name: 'Ryan Gosling', initials: 'RG', online: true };
const jake: Person = { name: 'Jake Gyllenhaal', initials: 'JG', color: 'brand', online: true };

/** The two columns that show beside the form; the board's right edge runs out of the card. */
export const columns: Column[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    icon: RiProgress6Line,
    color: 'teal',
    count: 3,
    items: [
      {
        id: 'site-visit',
        assignee: null,
        placeholder: 'Godly',
        details: [
          { icon: RiMapPin2Line, label: 'California, USA' },
          { icon: RiCalendarLine, label: '21/01/2025' },
          { icon: RiMoreFill, label: 'More information' },
        ],
        badges: [{ kind: 'status', label: 'Medium', color: 'info' }],
      },
      {
        id: 'andrew-backlog',
        assignee: andrew,
        age: '6d',
        hidden: 4,
        tasks: [
          {
            id: 'workflow',
            title: 'Optimize team workflow to improve efficiency and reduce bottlenecks.',
            badges: [
              { kind: 'status', label: '254', icon: RiInformationLine },
              { kind: 'status', label: 'Medium' },
            ],
            comments: 254,
          },
          {
            id: 'satisfaction',
            title: 'Enhance client satisfaction',
            badges: [{ kind: 'tag', label: 'Requires Creative Input', color: 'purple' }],
          },
        ],
      },
    ],
  },
  {
    id: 'partial',
    title: 'Partial support',
    icon: RiProgress4Line,
    color: 'cyan',
    count: 2,
    items: [
      {
        id: 'menu-redesign',
        assignee: ryan,
        date: '21/01/2025',
        title: 'Incorporate client feedback on a multi-location restaurant menu redesign',
      },
      {
        id: 'scheduling-prototype',
        assignee: jake,
        title: 'Build a click-through prototype of a scheduling tool for usability testing',
        badges: [{ kind: 'status', label: 'High Priority', color: 'negative' }],
        attachments: 4,
      },
    ],
  },
];
