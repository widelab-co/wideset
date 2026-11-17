import type { AvatarColor } from '@wideset/react';

import type { Person, TaskDetail } from './task-sidepanel';

/** A week on the timeline, in px. Figma's grid gives every month five weeks: 205px. */
export const WEEK = 41;
export const WEEKS_PER_MONTH = 5;
/** The day each week column starts on, the same in every month of the grid. */
export const WEEK_STARTS = [1, 8, 15, 22, 29];
export const MONTHS = [
  'January ’24',
  'February ’24',
  'March ’24',
  'April ’24',
  'May ’24',
  'June ’24',
  'July ’24',
  'August ’24',
  'September ’24',
  'October ’24',
  'November ’24',
  'December ’24',
];

/** A stretch of the timeline, in weeks from the first day of the first month. */
type Span = { start: number; length: number };

/** What a row draws on the timeline. */
export type Mark =
  /** Grey for the whole span, brand for the part done (`progress`, 0–1). */
  | (Span & { kind: 'bar'; progress: number })
  /** The task's title on grey; `done` adds a check, `highlighted` outlines the task in focus. */
  | (Span & { kind: 'chip'; done?: boolean; highlighted?: boolean })
  /** A pause, hatched. */
  | (Span & { kind: 'break' });

export type Task = { id: string; title: string; marks: Mark[] };

export type Member = {
  id: string;
  name: string;
  /** Without initials the avatar shows the default person icon, as Figma does. */
  initials?: string;
  color?: AvatarColor;
  /** Share of their work done, 0–100. */
  progress: number;
  marks: Mark[];
  tasks: Task[];
};

export const members: Member[] = [
  {
    id: 'adam',
    name: 'Adam Smith',
    initials: 'AS',
    color: 'blue',
    progress: 44,
    marks: [{ kind: 'bar', start: 0.39, length: 17.29, progress: 0.3 }],
    tasks: [],
  },
  {
    id: 'tom',
    name: 'Tom Ford',
    initials: 'TF',
    color: 'green',
    progress: 32,
    marks: [
      { kind: 'bar', start: 2.49, length: 6.41, progress: 0.28 },
      { kind: 'break', start: 9, length: 1.59 },
    ],
    tasks: [
      {
        id: 'market-research',
        title: 'Market Research',
        marks: [{ kind: 'chip', start: 2.49, length: 3.9, done: true }],
      },
      { id: 'goals', title: 'Goals and KPIs', marks: [] },
      {
        id: 'content-strategy',
        title: 'Content Strategy',
        marks: [
          { kind: 'chip', start: 2.44, length: 6.22, highlighted: true },
          { kind: 'break', start: 8.76, length: 1.59 },
        ],
      },
      {
        id: 'photo-shoots',
        title: 'Photo shoots',
        marks: [{ kind: 'chip', start: 1.8, length: 1 }],
      },
      {
        id: 'optimization',
        title: 'Optimization',
        marks: [{ kind: 'chip', start: 4.71, length: 9.78 }],
      },
      {
        id: 'approvals',
        title: 'Approvals',
        marks: [{ kind: 'chip', start: 15.34, length: 3.76 }],
      },
      {
        id: 'post-launch',
        title: 'Post launch posts',
        marks: [{ kind: 'bar', start: 2.73, length: 5.66, progress: 1 }],
      },
    ],
  },
  {
    id: 'cameron',
    name: 'Cameron Williamson',
    progress: 0,
    marks: [
      { kind: 'bar', start: 0.8, length: 3.12, progress: 1 },
      { kind: 'bar', start: 10.39, length: 3, progress: 0 },
    ],
    tasks: [],
  },
  {
    id: 'albert',
    name: 'Albert Flores',
    progress: 30,
    marks: [{ kind: 'bar', start: 8.1, length: 2.46, progress: 0 }],
    tasks: [],
  },
  { id: 'courtney', name: 'Courtney Henry', progress: 0, marks: [], tasks: [] },
  {
    id: 'jacob',
    name: 'Jacob Jones',
    progress: 0,
    marks: [{ kind: 'bar', start: 11.95, length: 3.61, progress: 0 }],
    tasks: [],
  },
  {
    id: 'guy',
    name: 'Guy Hawkins',
    progress: 0,
    marks: [{ kind: 'bar', start: 15.41, length: 3.32, progress: 0 }],
    tasks: [],
  },
];

/** Who else is on the project, beside the title. */
export const viewers = [
  { name: 'Adam Smith', initials: 'AS', color: 'blue' },
  { name: 'Tom Ford', initials: 'TF', color: 'green' },
] satisfies { name: string; initials: string; color: AvatarColor }[];

const alexandar: Person = { name: 'Alexandar Wright', initials: 'AW', color: 'orange' };
const esther: Person = { name: 'Esther Howard', initials: 'EH', color: 'blue' };
const kathryn: Person = { name: 'Kathryn Murphy', initials: 'KM', color: 'yellow' };
const jenny: Person = { name: 'Jenny Wilson', initials: 'JW', color: 'green' };
const robert: Person = { name: 'Robert Fox', initials: 'RF', color: 'pink' };

/** The task the side panel opens on; a task picked on the chart shows its title over the same detail. */
export const campaign: TaskDetail = {
  title: 'Launch social media campaign',
  due: 'Due date 14/04/2025',
  private: false,
  people: [alexandar, esther, kathryn, jenny, robert],
  status: { label: 'Completed', color: 'lime' },
  labels: [{ label: 'Discover', color: 'purple' }],
  assignee: alexandar,
  dueDate: 'December 5, 2023',
  subtasks: [
    { id: 'content-plan', title: 'Create campaign content plan', done: true },
    { id: 'graphics', title: 'Design promotional graphics', done: false, progress: 44 },
  ],
  activity: [
    {
      id: 'completed',
      text: 'Subtask has been completed',
      date: '15/09/2024',
      subtask: {
        title: 'Create campaign content plan',
        reviewers: 2,
        doneBy: 'Esther',
        comments: 3,
      },
    },
    {
      id: 'subtasks-added',
      text: 'Subtasks added by',
      person: { ...esther, name: 'Esther' },
      date: '13/09/2024',
    },
    {
      id: 'created',
      text: 'Task created by',
      person: { ...kathryn, name: 'Kathryn' },
      date: '13/09/2024',
    },
  ],
};
