/*
  The model every agent block is written in: threads (chats or sessions) in groups, and each
  thread's turns. A block's `data.ts` fills these types; the transcript kit draws them, the same
  way in Chat and in Code.
*/

/** The two halves of the app: writing, research and analysis, or work in a repository. */
export type Mode = 'chat' | 'code';

/** How much of the agent's work the transcript shows. */
export type TranscriptView = 'normal' | 'thinking' | 'verbose';

/**
 * Text in an answer or a document. Inside a string, `code` goes in backticks and **strong** in
 * asterisks.
 */
export type Prose =
  | { kind: 'title'; text: string }
  | { kind: 'heading'; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'code'; language: string; lines: string[] };

export type StepStatus = 'running' | 'done' | 'failed' | 'waiting' | 'skipped';

/** What a step opens to. A diff line starts with `+`, `-` or a space. */
export type StepDetail =
  | { kind: 'output'; lines: string[]; errors?: number[] }
  | { kind: 'diff'; lines: string[] }
  | { kind: 'results'; items: { title: string; source: string }[] };

export type ApprovalAnswer = 'once' | 'always' | 'denied';

/** The permission a step waits for: what it wants to do, on what, and why. */
export type Approval = {
  title: string;
  /** The command or path, shown in monospace. */
  command: string;
  reason: string;
  /** Where "always" holds: "this project", "this repository". */
  scope: string;
  answer?: ApprovalAnswer;
};

/** One tool call. `label` is the verb and its object: "Read `bookings-table.tsx`". */
export type Step = {
  id: string;
  label: string;
  /** The label while it runs: "Reading `bookings-table.tsx`". */
  active?: string;
  /** What came of it, shown quietly at the end: "14 passed · 3.2s", "+18 −4". */
  result?: string;
  status: StepStatus;
  detail?: StepDetail;
  approval?: Approval;
  /** How long it runs when the turn plays, in milliseconds. */
  ms?: number;
  /** While it runs: how far it is, from 0 to 1. */
  progress?: number;
};

export type Block =
  | { kind: 'reasoning'; id: string; seconds: number; text: string; running?: boolean }
  | ({ kind: 'step' } & Step)
  /** Steps in a row, folded to one line in the Normal view: "Read 4 files". */
  | { kind: 'steps'; id: string; label: string; steps: Step[] }
  | { kind: 'text'; id: string; prose: Prose[]; streaming?: boolean }
  /** Something of the block's own (a document, a pull request), drawn by the block. */
  | { kind: 'card'; id: string; card: string };

export type UserTurn = { id: string; role: 'user'; text: string; queued?: boolean };

export type AgentTurn = {
  id: string;
  role: 'agent';
  blocks: Block[];
  /** Stopped this far into its run, in milliseconds: the rest was never written. */
  stoppedAt?: number;
  stopped?: boolean;
  rating?: 'up' | 'down';
};

/** Turn = what you said, or what the agent did about it: its blocks, in the order they happened. */
export type Turn = UserTurn | AgentTurn;

export type ThreadState = 'working' | 'needs-you' | 'unread' | 'failed';

/** A chat or a session in the sidebar. */
export type Thread = {
  id: string;
  title: string;
  state?: ThreadState;
  /** Its open pull request and the review comments not yet resolved (Code). */
  pullRequest?: { number: number; comments: number };
  /** A fork or a subagent of the thread above it: indented under it. */
  child?: boolean;
  turns: Turn[];
};

/** A project or a repository and its threads; `fixed` for Recents, which takes no new ones. */
export type ThreadGroup = { id: string; label: string; fixed?: boolean; threads: Thread[] };
