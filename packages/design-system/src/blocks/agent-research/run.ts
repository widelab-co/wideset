// TODO(custom): playing a turn over time (thinking, steps, streaming) as a pure function of the clock; Wideset has no agent or streaming parts.
import type { AgentTurn, ApprovalAnswer, Block, Prose, Step } from './model';

/** How long a step runs when its data does not say, and how long one word of an answer takes. */
const STEP_MS = 1400;
const WORD_MS = 32;

/** A text in the pieces it streams in: each word with the space before it. */
const pieces = (text: string) => text.match(/\s*\S+/g) ?? [];

const takeWords = (text: string, count: number) => pieces(text).slice(0, count).join('');

const lines = (block: Prose) =>
  block.kind === 'list' ? block.items : block.kind === 'code' ? block.lines : [block.text];

export const countWords = (prose: Prose[]) =>
  prose.reduce(
    (sum, block) => sum + lines(block).reduce((n, line) => n + pieces(line).length, 0),
    0,
  );

/** The prose as plain text, for the clipboard. */
export const proseText = (prose: Prose[]) =>
  prose.map((block) => lines(block).join('\n')).join('\n\n');

/** The first `count` words of the prose, in its own structure: what has streamed in so far. */
export function takeProse(prose: Prose[], count: number): Prose[] {
  const taken: Prose[] = [];
  let left = count;
  const take = (source: string[]) => {
    const part: string[] = [];
    for (const line of source) {
      if (left <= 0) break;
      part.push(takeWords(line, left));
      left -= pieces(line).length;
    }
    return part;
  };
  for (const block of prose) {
    if (left <= 0) break;
    if (block.kind === 'list') taken.push({ ...block, items: take(block.items) });
    else if (block.kind === 'code') taken.push({ ...block, lines: take(block.lines) });
    else taken.push({ ...block, text: take([block.text])[0] });
  }
  return taken;
}

export type Playback = {
  /** The turn as far as it has come. */
  turn: AgentTurn;
  /** What the agent is doing now, for the working line. */
  activity: string;
  /** It waits for an approval: the clock stands still until the step is answered. */
  waiting: boolean;
  /** Where the clock stood when the turn stopped to wait, or ended. */
  clock: number;
  done: boolean;
};

/**
 * The turn `at` milliseconds into its run: the blocks that are there by then, the one in progress
 * cut to what it has so far (seconds thought, a step running, words written), nothing after it.
 * A step that waits for an approval holds everything behind it, however late it is.
 */
export function playTurn(turn: AgentTurn, at: number): Playback {
  const blocks: Block[] = [];
  let clock = 0;
  const pause = (activity: string, waiting = false): Playback => ({
    turn: { ...turn, blocks },
    activity,
    waiting,
    clock,
    done: false,
  });

  /** One step at the clock: as it shows now, and what holds the turn there, if anything. */
  const play = (step: Step): { step: Step; activity?: string; waiting?: boolean } => {
    if (step.status === 'waiting') {
      return { step, activity: 'Waiting for your approval', waiting: true };
    }
    if (step.status === 'skipped') return { step };
    const length = step.ms ?? STEP_MS;
    if (at < clock + length) {
      const progress = (at - clock) / length;
      return {
        step: { ...step, status: 'running', progress },
        activity: step.active ?? step.label,
      };
    }
    clock += length;
    return { step };
  };

  for (const block of turn.blocks) {
    if (block.kind === 'reasoning') {
      const length = block.seconds * 1000;
      if (at < clock + length) {
        const part = (at - clock) / length;
        blocks.push({
          ...block,
          running: true,
          seconds: Math.floor((at - clock) / 1000),
          text: takeWords(block.text, Math.ceil(pieces(block.text).length * part)),
        });
        return pause('Thinking');
      }
      clock += length;
      blocks.push(block);
    } else if (block.kind === 'step') {
      const played = play(block);
      blocks.push({ ...played.step, kind: 'step' });
      if (played.activity) return pause(played.activity, played.waiting);
    } else if (block.kind === 'steps') {
      const steps: Step[] = [];
      for (const step of block.steps) {
        const played = play(step);
        steps.push(played.step);
        if (played.activity) {
          blocks.push({ ...block, steps });
          return pause(played.activity, played.waiting);
        }
      }
      blocks.push(block);
    } else if (block.kind === 'text') {
      const total = countWords(block.prose);
      const shown = Math.floor((at - clock) / WORD_MS);
      if (shown < total) {
        blocks.push({ ...block, streaming: true, prose: takeProse(block.prose, shown) });
        return pause('Writing');
      }
      clock += total * WORD_MS;
      blocks.push(block);
    } else {
      blocks.push(block);
    }
  }
  return { turn, activity: '', waiting: false, clock, done: true };
}

const eachStep = (turn: AgentTurn, change: (step: Step) => Step): AgentTurn => ({
  ...turn,
  blocks: turn.blocks.map((block): Block =>
    block.kind === 'step'
      ? { ...change(block), kind: 'step' }
      : block.kind === 'steps'
        ? { ...block, steps: block.steps.map(change) }
        : block,
  ),
});

/** The turn with one waiting step answered: allowed, it runs; denied, it is skipped. */
export const answerApproval = (turn: AgentTurn, stepId: string, answer: ApprovalAnswer) =>
  eachStep(turn, (step) =>
    step.id === stepId && step.approval
      ? {
          ...step,
          status: answer === 'denied' ? 'skipped' : 'done',
          result: answer === 'denied' ? 'Denied' : step.result,
          approval: { ...step.approval, answer },
        }
      : step,
  );

/** A turn cut short: whatever was in progress ends there, and the turn says it was stopped. */
function settle(turn: AgentTurn): AgentTurn {
  const cut = eachStep(turn, (step) =>
    step.status === 'running' || step.status === 'waiting'
      ? { ...step, status: 'skipped', result: 'Not finished' }
      : step,
  );
  return {
    ...cut,
    stopped: true,
    blocks: cut.blocks.map((block): Block =>
      block.kind === 'reasoning'
        ? { ...block, running: false }
        : block.kind === 'text'
          ? { ...block, streaming: false }
          : block,
    ),
  };
}

/**
 * A turn as the transcript shows it: `at` into its run while it plays; cut where it was stopped;
 * otherwise whole, or as far as the approval it still waits for.
 */
export const showTurn = (turn: AgentTurn, at?: number): AgentTurn =>
  at !== undefined
    ? playTurn(turn, at).turn
    : turn.stoppedAt !== undefined
      ? settle(playTurn(turn, turn.stoppedAt).turn)
      : playTurn(turn, Infinity).turn;
