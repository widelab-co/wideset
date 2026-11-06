import type { Person, TaskDetail } from './task-sidepanel';

const alexandar: Person = { name: 'Alexandar Wright', initials: 'AW', color: 'orange' };
const esther: Person = { name: 'Esther Howard', initials: 'EH', color: 'blue' };
const kathryn: Person = { name: 'Kathryn Murphy', initials: 'KM', color: 'yellow' };
const jenny: Person = { name: 'Jenny Wilson', initials: 'JW', color: 'green' };
const robert: Person = { name: 'Robert Fox', initials: 'RF', color: 'pink' };

/** The task the panel opens on. */
export const task: TaskDetail = {
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
