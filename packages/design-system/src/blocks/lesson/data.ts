import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiContactsBook3Line,
  RiGraduationCapFill,
  RiGraduationCapLine,
  RiHandCoinLine,
  RiHome5Line,
  RiInbox2Line,
  RiKey2Line,
  RiLineChartLine,
  RiPieChart2Line,
  RiPlugLine,
  RiQuestionLine,
  RiSettings3Line,
  RiTeamLine,
} from '@remixicon/react';

/*
  One lesson of Lumen Studio's onboarding course for new sales people, taught in Orbit's Academy:
  "Preparing for a discovery call", the first lesson of the Discovery module. Four lessons of the
  twelve are done; the video stands at 3:12 of 9:40, paused, where the learner left it.
*/

/** The product is Orbit; the workspace using it is Lumen Studio. */
export const product = { name: 'Orbit' };
export const workspace = { name: 'Lumen Studio', initials: 'LS' };
export const account = { name: 'Maya Okafor', email: 'maya@lumenstudio.co', initials: 'MO' };

export type NavLink = {
  id: string;
  label: string;
  icon: RemixiconComponentType;
  /** The icon while the page is open (a line icon swaps for its fill). */
  activeIcon?: RemixiconComponentType;
};

export const mainLinks: NavLink[] = [
  { id: 'home', label: 'Home', icon: RiHome5Line },
  { id: 'inbox', label: 'Inbox', icon: RiInbox2Line },
  { id: 'customers', label: 'Customers', icon: RiContactsBook3Line },
  { id: 'deals', label: 'Deals', icon: RiHandCoinLine },
  { id: 'revenue', label: 'Revenue', icon: RiLineChartLine },
  { id: 'reports', label: 'Reports', icon: RiPieChart2Line },
  { id: 'academy', label: 'Academy', icon: RiGraduationCapLine, activeIcon: RiGraduationCapFill },
];

export const settingsLinks: NavLink[] = [
  { id: 'general', label: 'General', icon: RiSettings3Line },
  { id: 'members', label: 'Members', icon: RiTeamLine },
  { id: 'billing', label: 'Billing', icon: RiBankCardLine },
  { id: 'integrations', label: 'Integrations', icon: RiPlugLine },
  { id: 'api-keys', label: 'API keys', icon: RiKey2Line },
];

export const helpLink: NavLink = { id: 'help', label: 'Help and support', icon: RiQuestionLine };

/** Where a lesson stands for the learner. */
export type LessonState = 'done' | 'current' | 'not-started' | 'locked';

export type OutlineLesson = {
  id: string;
  title: string;
  minutes: number;
  state: LessonState;
};

export type CourseModule = { id: string; title: string; lessons: OutlineLesson[] };

const modules: CourseModule[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    lessons: [
      { id: 'welcome-to-the-team', title: 'Welcome to the team', minutes: 3, state: 'done' },
      { id: 'how-we-sell', title: 'How we sell', minutes: 8, state: 'done' },
      { id: 'our-customers', title: 'Our customers', minutes: 6, state: 'done' },
      { id: 'working-in-orbit', title: 'Working in Orbit', minutes: 7, state: 'done' },
    ],
  },
  {
    id: 'discovery',
    title: 'Discovery',
    lessons: [
      {
        id: 'preparing-for-a-discovery-call',
        title: 'Preparing for a discovery call',
        minutes: 10,
        state: 'current',
      },
      {
        id: 'asking-good-questions',
        title: 'Asking good questions',
        minutes: 11,
        state: 'not-started',
      },
      { id: 'qualifying-a-deal', title: 'Qualifying a deal', minutes: 8, state: 'not-started' },
      {
        id: 'writing-the-call-summary',
        title: 'Writing the call summary',
        minutes: 5,
        state: 'not-started',
      },
    ],
  },
  {
    id: 'closing',
    title: 'Closing',
    lessons: [
      { id: 'pricing-and-plans', title: 'Pricing and plans', minutes: 7, state: 'locked' },
      { id: 'handling-objections', title: 'Handling objections', minutes: 10, state: 'locked' },
      {
        id: 'proposals-and-contracts',
        title: 'Proposals and contracts',
        minutes: 9,
        state: 'locked',
      },
      {
        id: 'handing-over-to-success',
        title: 'Handing over to success',
        minutes: 6,
        state: 'locked',
      },
    ],
  },
];

export const course = { title: 'Sales onboarding', modules };

export const allLessons = modules.flatMap((module) => module.lessons);

/** The lesson after this one, which "Next lesson" opens. */
export const nextLesson = allLessons[allLessons.findIndex((item) => item.state === 'current') + 1];

/** A part of the video, marked on the scrubber. `start` in seconds. */
export type Chapter = { start: number; title: string };

/** A line of what is said, from `at` seconds: the captions and the transcript. */
export type TranscriptLine = { at: number; text: string };

export type Resource = { id: string; name: string; size: string };

export const lesson = {
  id: 'preparing-for-a-discovery-call',
  title: 'Preparing for a discovery call',
  summary: 'What to learn before the call, who will be on it, and how to open it.',
  /** Seconds. */
  duration: 580,
  /** Where the learner left off. */
  resumeAt: 192,
  chapters: [
    { start: 0, title: 'Why preparation matters' },
    { start: 85, title: 'Research the company' },
    { start: 230, title: 'Map the people' },
    { start: 340, title: 'Plan the agenda' },
    { start: 475, title: 'Open the call' },
  ] satisfies Chapter[],
  outcomes: [
    'Find what matters about a company in fifteen minutes.',
    'Know who will be on the call and what each of them is measured on.',
    'Send an agenda the buyer can add to.',
    'Open the call so the buyer does most of the talking.',
  ],
  transcript: [
    {
      at: 0,
      text: 'A discovery call is the first real conversation with a buyer. Most of what makes it go well happens before you join.',
    },
    {
      at: 24,
      text: 'In this lesson we prepare for one together, step by step, with the notes you would take.',
    },
    {
      at: 48,
      text: 'Preparation is not about knowing everything. It is about joining with three good questions.',
    },
    {
      at: 85,
      text: 'Start with the company. Spend fifteen minutes, not an hour: what they make, how they sell and what changed this year.',
    },
    {
      at: 120,
      text: 'Their website, their last two press releases and their job listings tell you more than any report.',
    },
    {
      at: 170,
      text: 'Write down one thing that surprised you. It often becomes your best opening question.',
    },
    {
      at: 230,
      text: 'Next, the people. Look up everyone on the invite and note what each of them is measured on.',
    },
    {
      at: 280,
      text: 'An operations lead cares about time saved. A finance lead cares about cost and risk. Plan a question for each.',
    },
    {
      at: 340,
      text: 'Now the agenda. Send it the day before, in three lines, and ask the buyer to add to it.',
    },
    {
      at: 400,
      text: 'A shared agenda turns the call into a working session, and tells you what they care about before you start.',
    },
    {
      at: 475,
      text: 'Finally, the first ten minutes. Thank them, confirm the time and the agenda, then ask your first question.',
    },
    {
      at: 530,
      text: 'From here the buyer should talk most of the time. Listen, take notes and ask the next good question.',
    },
  ] satisfies TranscriptLine[],
  resources: [
    { id: 'checklist', name: 'Discovery call checklist.pdf', size: '214 KB' },
    { id: 'agenda', name: 'Call agenda template.docx', size: '36 KB' },
  ] satisfies Resource[],
};

export type Question = {
  id: string;
  text: string;
  options: { value: string; label: string }[];
  /** The value of the right option. */
  answer: string;
  /** Why the right answer is right, shown after Check either way. */
  explanation: string;
};

/** Right answers needed to complete the lesson. */
export const PASS_MARK = 2;

export const quiz: Question[] = [
  {
    id: 'research',
    text: 'How long should you spend researching a company before a discovery call?',
    options: [
      { value: 'five', label: 'Five minutes' },
      { value: 'fifteen', label: 'About fifteen minutes' },
      { value: 'hour', label: 'An hour or more' },
    ],
    answer: 'fifteen',
    explanation:
      'Fifteen minutes covers what they make, how they sell and what changed this year. More rarely changes the call.',
  },
  {
    id: 'agenda',
    text: 'When should the agenda reach the buyer?',
    options: [
      { value: 'day-before', label: 'The day before, from you' },
      { value: 'on-the-call', label: 'At the start of the call' },
      { value: 'none', label: 'Never, discovery calls are informal' },
    ],
    answer: 'day-before',
    explanation:
      'Sent the day before, the agenda gives the buyer time to add what matters to them, and shows you prepared.',
  },
  {
    id: 'talking',
    text: 'After the first ten minutes, who should do most of the talking?',
    options: [
      { value: 'you', label: 'You, to present the product' },
      { value: 'buyer', label: 'The buyer' },
      { value: 'both', label: 'Both of you, equally' },
    ],
    answer: 'buyer',
    explanation:
      'Discovery is for learning about the buyer. Listen, take notes and save the product for the demo.',
  },
];
