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

/**
 * The first `count` words of the prose, in its own structure: what has streamed in so far. With
 * `whole`, a line that has begun is there in full (a paragraph, a list item, a line of code), so
 * the text arrives in steps and no word moves: how it is written when motion is reduced.
 */
export function takeProse(prose: Prose[], count: number, whole = false): Prose[] {
  const taken: Prose[] = [];
  let left = count;
  const take = (source: string[]) => {
    const part: string[] = [];
    for (const line of source) {
      if (left <= 0) break;
      part.push(whole ? line : takeWords(line, left));
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
  /** What the agent is doing now: "Thinking", "Running `pnpm typecheck`", "Writing". */
  activity: string;
  /** It waits for you (an approval, a question, a card that holds): the clock stands still. */
  waiting: boolean;
  /** Where the clock stood when the turn stopped to wait, or ended. */
  clock: number;
  done: boolean;
};

/**
 * The turn `at` milliseconds into its run: the blocks that are there by then, the one in progress
 * cut to what it has so far (seconds thought, a step running, words written), nothing after it.
 * Whatever waits for you holds everything behind it, however late it is: a step that waits to be
 * allowed, a step or a card that `holds`, a question not yet answered. `whole` writes text a line
 * at a time, for reduced motion; the clock is the same either way.
 */
export function playTurn(turn: AgentTurn, at: number, whole = false): Playback {
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
      const activity = step.approval ? 'Waiting for your approval' : 'Waiting for you';
      return { step: { ...step, holding: true }, activity, waiting: true };
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
    if (step.holds && !step.released) {
      return { step: { ...step, holding: true }, activity: 'Waiting for you', waiting: true };
    }
    return { step };
  };

  /** Text written over time: as much as there is by now, and whether more is to come. */
  const write = (prose: Prose[]) => {
    const total = countWords(prose);
    const shown = Math.floor((at - clock) / WORD_MS);
    if (shown < total) return { prose: takeProse(prose, shown, whole), streaming: true };
    clock += total * WORD_MS;
    return { prose, streaming: false };
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
          blocks.push({ ...block, steps, total: block.steps.length });
          return pause(played.activity, played.waiting);
        }
      }
      blocks.push(block);
    } else if (block.kind === 'text') {
      const written = write(block.prose);
      if (written.streaming) {
        blocks.push({ ...block, ...written });
        return pause('Writing');
      }
      blocks.push(block);
    } else if (block.kind === 'card') {
      const written = block.prose && write(block.prose);
      if (written?.streaming) {
        blocks.push({ ...block, ...written });
        return pause('Writing');
      }
      if (block.holds && !block.released) {
        blocks.push({ ...block, holding: true });
        return pause('Waiting for you', true);
      }
      blocks.push(block);
    } else {
      blocks.push(block);
      if (block.answer === undefined) return pause('Waiting for your answer', true);
    }
  }
  return { turn, activity: '', waiting: false, clock, done: true };
}

const eachBlock = (turn: AgentTurn, change: (block: Block) => Block): AgentTurn => ({
  ...turn,
  blocks: turn.blocks.map(change),
});

const eachStep = (turn: AgentTurn, change: (step: Step) => Step): AgentTurn =>
  eachBlock(turn, (block) =>
    block.kind === 'step'
      ? { ...change(block), kind: 'step' }
      : block.kind === 'steps'
        ? { ...block, steps: block.steps.map(change) }
        : block,
  );

/** The turn with one waiting step answered: allowed, it runs; denied, it is skipped. */
export const answerApproval = (turn: AgentTurn, stepId: string, answer: ApprovalAnswer) =>
  eachStep(turn, (step) =>
    step.id === stepId && step.approval
      ? {
          ...step,
          status: answer === 'denied' ? 'skipped' : 'done',
          approval: { ...step.approval, answer },
        }
      : step,
  );

/** The turn let go at the step or the card that held it: a step that waited now runs. */
export const release = (turn: AgentTurn, id: string) =>
  eachBlock(
    eachStep(turn, (step) =>
      step.id !== id
        ? step
        : { ...step, released: true, status: step.status === 'waiting' ? 'done' : step.status },
    ),
    (block) => (block.kind === 'card' && block.id === id ? { ...block, released: true } : block),
  );

/**
 * The turn with its open question answered, in your words or one of its own. Without an `id`
 * every question still open takes the answer: a message sent instead of picking one.
 */
export const answerQuestion = (turn: AgentTurn, text: string, id?: string) =>
  eachBlock(turn, (block) =>
    block.kind === 'question' && block.answer === undefined && (!id || block.id === id)
      ? { ...block, answer: text }
      : block,
  );

/** The turn as it was before anyone answered it: for playing it again from its start. */
export const rewind = (turn: AgentTurn): AgentTurn =>
  eachBlock(
    eachStep({ ...turn, stoppedAt: undefined }, (step) => ({
      ...step,
      released: undefined,
      ...(step.approval && {
        status: 'waiting',
        approval: { ...step.approval, answer: undefined },
      }),
    })),
    (block) =>
      block.kind === 'card'
        ? { ...block, released: undefined }
        : block.kind === 'question'
          ? { ...block, answer: undefined }
          : block,
  );

/** A turn cut short: whatever was in progress ends there, and the turn says it was stopped. */
function settle(turn: AgentTurn): AgentTurn {
  const cut = eachStep(turn, (step) =>
    step.status === 'running' || step.status === 'waiting'
      ? { ...step, status: 'skipped', result: 'Not finished', holding: false }
      : { ...step, holding: false },
  );
  return {
    ...eachBlock(cut, (block) =>
      block.kind === 'reasoning'
        ? { ...block, running: false }
        : block.kind === 'text'
          ? { ...block, streaming: false }
          : block.kind === 'card'
            ? { ...block, streaming: false, holding: false }
            : block,
    ),
    stopped: true,
  };
}

/**
 * A turn as the transcript shows it: `at` into its run while it plays; cut where it was stopped;
 * otherwise whole, or held at whatever it still waits for.
 */
export function showTurn(turn: AgentTurn, at?: number, whole = false): AgentTurn {
  if (at !== undefined) return playTurn(turn, at, whole).turn;
  if (turn.stoppedAt !== undefined) return settle(playTurn(turn, turn.stoppedAt, whole).turn);
  const rest = playTurn(turn, Infinity);
  return rest.done ? turn : { ...rest.turn, held: true };
}
