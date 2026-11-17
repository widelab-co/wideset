import type { AvatarColor } from '@wideset/react';

export type Person = { name: string; initials: string; color: AvatarColor };

export type Subtask = {
  id: string;
  title: string;
  /** The line under the title. */
  description: string;
  done: boolean;
  /** How far a subtask under way is (0–100): a ring beside it until it is done. */
  progress?: number;
};

/** One entry in the task's history. */
export type Activity = {
  id: string;
  /** What happened, e.g. "Task created by"; `person` follows it when there is one. */
  text: string;
  person?: Person;
  date: string;
  /** The subtask the entry is about, drawn as a card under the date. */
  subtask?: { title: string; reviewers: number; doneBy: string; comments: number };
};

export type TaskDetail = {
  title: string;
  /** The line under the title. */
  due: string;
  private: boolean;
  assignee: Person;
  priority: string;
  subtasks: Subtask[];
  /** Newest first. */
  activity: Activity[];
  notes: string;
};

const priya: Person = { name: 'Priya Raman', initials: 'PR', color: 'blue' };
const maya: Person = { name: 'Maya Okafor', initials: 'MO', color: 'orange' };

/** The task the modal opens on. */
export const task: TaskDetail = {
  title: 'Launch social media campaign',
  due: 'Due Nov 14, 2026',
  private: false,
  assignee: priya,
  priority: 'High priority',
  subtasks: [
    {
      id: 'content-plan',
      title: 'Create campaign content plan',
      description: 'Channels, formats and posting dates',
      done: true,
    },
    {
      id: 'graphics',
      title: 'Design promotional graphics',
      description: 'Banners and story templates',
      done: false,
      progress: 44,
    },
  ],
  activity: [
    {
      id: 'completed',
      text: 'Subtask has been completed',
      date: 'Nov 9, 2026',
      subtask: {
        title: 'Create campaign content plan',
        reviewers: 2,
        doneBy: 'Priya',
        comments: 3,
      },
    },
    {
      id: 'subtasks-added',
      text: 'Subtasks added by',
      person: priya,
      date: 'Nov 6, 2026',
    },
    {
      id: 'created',
      text: 'Task created by',
      person: maya,
      date: 'Nov 6, 2026',
    },
  ],
  notes:
    'Lead with the product film on launch day and keep the first week to one post a day. Paid promotion starts once the graphics are signed off.',
};
