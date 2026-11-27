import {
  type RemixiconComponentType,
  RiCalendarLine,
  RiDashboardFill,
  RiInformationLine,
  RiMapPin2Line,
  RiMoreFill,
  RiProgress2Line,
  RiProgress4Line,
  RiProgress6Line,
  RiStarLine,
  RiTimer2Line,
} from '@remixicon/react';
import type { AvatarColor, FilterButtonProps, StatusBadgeProps, TagProps } from '@wideset/react';

export type Person = {
  name: string;
  initials: string;
  /** Pins the avatar's hue; left out, it follows from the initials. */
  color?: AvatarColor;
  online?: boolean;
};

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
  /** The card's header row. `null` is a task nobody has picked up yet. */
  assignee?: Person | null;
  date?: string;
  /** Icon rows under a line: where, when, what else. */
  details?: { icon: RemixiconComponentType; label: string }[];
  title?: string;
  badges?: Badge[];
  comments?: number;
  attachments?: number;
  link?: string;
  /** Draws the card on the brand tint, for the task in focus. */
  highlighted?: boolean;
};

/** Several tasks of one person, stacked under their name. */
export type TaskGroup = {
  id: string;
  assignee: Person;
  /** How long the oldest task has waited, e.g. `6d`. */
  age?: string;
  tasks: Task[];
  /** Tasks left out of the stack, shown as "View +N". */
  hidden?: number;
};

export type Column = {
  id: string;
  title: string;
  icon?: RemixiconComponentType;
  color: TagProps['color'];
  /** Tasks in the column, including those not loaded yet. */
  count: number;
  items: (Task | TaskGroup)[];
};

export type SpaceColor = 'purple' | 'indigo' | 'blue' | 'cyan' | 'teal' | 'green';

export const workspace = { name: 'Widelab', seats: 31 };

export const account: Person & { email: string } = {
  name: 'Adam Smith',
  initials: 'AS',
  email: 'hello@wideset.co',
  online: true,
};

export const navigation = [
  { id: 'explore', label: 'Explore', icon: RiDashboardFill },
  { id: 'recent', label: 'Recent', icon: RiTimer2Line },
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

export const views = [
  { value: 'board', label: 'Board' },
  { value: 'list', label: 'List' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'table', label: 'Table' },
  { value: 'gantt', label: 'Gantt' },
];

export const teamOptions: FilterButtonProps['options'] = [
  { value: 'design', label: 'Design' },
  { value: 'development', label: 'Development' },
  { value: 'strategy', label: 'Strategy' },
];

const andrew: Person = { name: 'Andrew Tang', initials: 'AT', online: true };
const ryan: Person = { name: 'Ryan Gosling', initials: 'RG', online: true };
const jake: Person = { name: 'Jake Gyllenhaal', initials: 'JG', color: 'brand', online: true };
const michael: Person = { name: 'Michael Corleone', initials: 'MC', color: 'brand', online: true };

export const assigneeOptions: FilterButtonProps['options'] = [andrew, ryan, jake, michael].map(
  ({ name }) => ({ value: name, label: name }),
);

export const sortOptions = [
  { value: 'newest', label: 'Sort by newest' },
  { value: 'oldest', label: 'Sort by oldest' },
  { value: 'priority', label: 'Sort by priority' },
];

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
        details: [
          { icon: RiMapPin2Line, label: 'California, USA' },
          { icon: RiCalendarLine, label: '21/01/2025' },
          { icon: RiMoreFill, label: 'More information' },
        ],
        badges: [{ kind: 'status', label: 'Medium' }],
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
    color: 'blue',
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
  {
    id: 'started',
    title: 'Started',
    icon: RiProgress2Line,
    color: 'indigo',
    count: 3,
    items: [
      {
        id: 'health-homepage',
        assignee: michael,
        date: '21/01/2025',
        title: 'Redesign the homepage of a health-tech app',
        highlighted: true,
      },
      {
        id: 'andrew-started',
        assignee: { ...andrew, online: false },
        tasks: [
          {
            id: 'workflow-review',
            date: '21/01/2025',
            title: 'Optimize team workflow to improve efficiency and reduce bottlenecks.',
            link: 'Figma Link',
          },
          {
            id: 'saas-layouts',
            title: 'Map out responsive layouts for a SaaS dashboard',
            badges: [{ kind: 'tag', label: 'Client Approved', color: 'lime' }],
          },
        ],
      },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    color: 'red',
    count: 13,
    items: [
      {
        id: 'health-conversion',
        assignee: { ...michael, online: false },
        date: '21/01/2025',
        title:
          'Redesign the homepage of a health-tech app with a focus on increasing conversion rates (target: 10%).',
      },
    ],
  },
];
