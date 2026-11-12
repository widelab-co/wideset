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
  /** The label while it waits to be allowed: "Run `pnpm test:e2e`", where `label` says "Ran". */
  pending?: string;
  /** What came of it, shown quietly at the end: "14 passed · 3.2s", "+18 −4". */
  result?: string;
  status: StepStatus;
  detail?: StepDetail;
  approval?: Approval;
  /**
   * Something of the block's own under the step, drawn through `card`: what to do about it
   * (Fix it, Reconnect) or where its whole output is (Open in Terminal).
   */
  card?: string;
  /**
   * The turn stops once this step has ended, until the block lets it go on (`session.proceed`):
   * a command that failed and wants a decision. A step that `waiting`s holds the turn before it
   * runs instead.
   */
  holds?: boolean;
  /** The hold was let go. */
  released?: boolean;
  /** As it shows now: the turn stands at this step and waits for you. */
  holding?: boolean;
  /** How long it runs when the turn plays, in milliseconds. */
  ms?: number;
  /** While it runs: how far it is, from 0 to 1. */
  progress?: number;
};

/** One answer the agent offers to its own question, with the fact that decides it. */
export type QuestionOption = { value: string; label: string; description?: string };

export type Block =
  | { kind: 'reasoning'; id: string; seconds: number; text: string; running?: boolean }
  | ({ kind: 'step' } & Step)
  /**
   * Steps in a row, folded to one line in the Normal view: "Read 4 files". `total` is set while
   * they play or once they were stopped part-way: how many there are in all.
   */
  | { kind: 'steps'; id: string; label: string; steps: Step[]; total?: number }
  | { kind: 'text'; id: string; prose: Prose[]; streaming?: boolean }
  /**
   * Something of the block's own (a document, a pull request, a report), drawn by the block.
   * With `prose` it is written over time like an answer: it streams, stops and is copied with
   * it. With `holds` the turn stops at it until the block lets it go on (a plan waiting for
   * Start, a limit reached).
   */
  | {
      kind: 'card';
      id: string;
      card: string;
      prose?: Prose[];
      streaming?: boolean;
      holds?: boolean;
      released?: boolean;
      holding?: boolean;
    }
  /** A decision the agent needs before it goes on. The answer becomes your next message. */
  | { kind: 'question'; id: string; title: string; options: QuestionOption[]; answer?: string };

export type CardBlock = Extract<Block, { kind: 'card' }>;

/**
 * What you said, and what it was sent with when that is worth a caption: a tool that explains
 * the answer ("Research"), the files attached.
 */
export type UserTurn = { id: string; role: 'user'; text: string; sentWith?: string[] };

export type AgentTurn = {
  id: string;
  role: 'agent';
  blocks: Block[];
  /** Stopped this far into its run, in milliseconds: the rest was never written. */
  stoppedAt?: number;
  /** As it shows now: cut where it was stopped. */
  stopped?: boolean;
  /** As it shows now: not finished, held at a step, a question or a card that waits for you. */
  held?: boolean;
  rating?: 'up' | 'down';
};

/** A line across the transcript where something changed for everything after it. */
export type DividerTurn = {
  id: string;
  role: 'divider';
  /** "Earlier messages were summarized". */
  label: string;
  /** What stands in for the turns no longer here: one row that opens to it. */
  summary?: { label: string; prose: Prose[] };
};

/**
 * Turn = what you said, or what the agent did about it (its blocks, in the order they happened),
 * or a divider between turns.
 */
export type Turn = UserTurn | AgentTurn | DividerTurn;

export type ThreadState = 'working' | 'needs-you' | 'paused' | 'unread' | 'failed';

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

/** A model to answer with, and a line on what it is for. */
export type Model = { id: string; name: string; note: string };

/** How full a session's context is: the tokens in it, how many it holds, what it is made of. */
export type Context = { used: number; limit: number; parts: { label: string; tokens: number }[] };

/** A project or a repository and its threads; `fixed` for Recents, which takes no new ones. */
export type ThreadGroup = { id: string; label: string; fixed?: boolean; threads: Thread[] };
