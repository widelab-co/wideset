// TODO(custom): what can be done in a thread (send, queue, stop, continue, replay, answer what it waits for, rate) over the turn model; Wideset has no agent or chat state.
import { useCallback, useEffect, useRef, useState } from 'react';

import type { AgentTurn, ApprovalAnswer, Step, Turn } from './model';
import { answerApproval, answerQuestion, playTurn, release, rewind, showTurn } from './run';
import { reducedMotion, useRun } from './use-run';

const stepsOf = (turn: Turn): Step[] =>
  turn.role !== 'agent'
    ? []
    : turn.blocks.flatMap((block) =>
        block.kind === 'step' ? [block] : block.kind === 'steps' ? block.steps : [],
      );

/** A turn that still waits for you, left behind by a new message: it ends where it stands. */
const abandon = (turn: AgentTurn): AgentTurn => {
  const rest = playTurn(turn, Infinity);
  return rest.done || turn.stoppedAt !== undefined ? turn : { ...turn, stoppedAt: rest.clock };
};

type SessionOptions = {
  /** The open thread's turns, whole, as its data holds them. */
  turns: Turn[];
  /** Writes the turns back to wherever the thread is kept. */
  onChange: (change: (turns: Turn[]) => Turn[]) => void;
  /** The agent's turn in answer to a message; a sample has one for everything. */
  reply: (id: string, text: string) => AgentTurn;
  /** Messages already waiting their turn when the session opens. */
  queue?: string[];
  /** What is in the composer when the session opens. */
  draft?: string;
  /** The session opens in the middle of a run: the turn, and how far into it, in milliseconds. */
  playing?: { id: string; at: number };
};

/**
 * One thread in use, the same in Chat and in Code. It keeps the turns whole in the block's own
 * state and works out what shows: the running turn as far as it has come, a stopped one cut
 * where it stopped, one that waits for you held at that point.
 *
 * - `send`: answered at once. While the agent works the message joins `queue` (over the
 *   composer, not in the transcript: it has not been said yet) and goes out when the run ends;
 *   `edit` takes one back into the composer, `unqueue` drops it. A message sent while a turn
 *   waits for you answers its question, or leaves the turn where it stands.
 * - `stop` keeps what is there and marks the turn stopped; `resume` goes on from there. `replay`
 *   plays the newest turn again from its start, as it was before anyone answered it.
 * - What a turn waits for: `answer` (an approval), `choose` (a question: the answer becomes your
 *   message), `proceed` (a step or a card that holds the turn). A turn that waits is at rest;
 *   each of these sets it going again from that point.
 * - `write` puts words in the composer for you to send or change; `attach` and `detach` keep
 *   the files that go with the next message.
 * - `start` and `leave` are for the shell: a thread still working when it is opened, and one
 *   that is left mid-run (it is simply finished on return).
 */
export function useSession({
  turns,
  onChange,
  reply,
  queue: waiting,
  draft: opening,
  playing,
}: SessionOptions) {
  const ids = useRef(0);
  const [queue, setQueue] = useState(waiting ?? []);
  const [draft, setDraft] = useState({ text: opening ?? '', id: 0 });
  const [attachments, setAttachments] = useState<string[]>([]);
  const { playback, at, start, stop: end } = useRun(turns, playing);
  const running = playback !== null;
  const whole = reducedMotion();

  const shown = turns.map((turn) =>
    turn.role !== 'agent'
      ? turn
      : turn.id === playback?.turn.id
        ? playback.turn
        : showTurn(turn, undefined, whole),
  );
  const steps = shown.flatMap(stepsOf);
  const last = turns.at(-1);
  const cut = !running && last?.role === 'agent' && last.stoppedAt !== undefined ? last : null;

  const changeTurn = (id: string, change: (turn: AgentTurn) => AgentTurn) =>
    onChange((all) =>
      all.map((turn) => (turn.id === id && turn.role === 'agent' ? change(turn) : turn)),
    );

  const deliver = useCallback(
    (text: string, sentWith?: string[]) => {
      const answer = reply(`sent-${(ids.current += 1)}`, text);
      onChange((all) => [
        ...all.map((turn) => (turn.role === 'agent' ? abandon(answerQuestion(turn, text)) : turn)),
        { id: `sent-${(ids.current += 1)}`, role: 'user', text, sentWith },
        answer,
      ]);
      start(answer.id);
    },
    [onChange, reply, start],
  );

  const send = (text: string) => {
    if (running) return setQueue([...queue, text]);
    deliver(text, attachments.length > 0 ? attachments : undefined);
    setAttachments([]);
  };

  /** Sets a turn that was held going again from where it stood. */
  const go = (turn: AgentTurn) => start(turn.id, playTurn(turn, Infinity).clock);

  const agentTurn = (id: string) => {
    const turn = turns.find((item) => item.id === id);
    return turn?.role === 'agent' ? turn : undefined;
  };

  const awaiting = shown.some((turn) => turn.role === 'agent' && turn.held);

  // When a run ends, the first message that waited goes out; not while the turn waits for you.
  useEffect(() => {
    if (running || awaiting || queue.length === 0) return;
    deliver(queue[0]);
    setQueue(queue.slice(1));
  }, [running, awaiting, queue, deliver]);

  return {
    /** The turns as the transcript shows them now. */
    shown,
    /** Every step on the page, as it shows now. */
    steps,
    /** The run in progress, or null at rest. */
    playback,
    /** Milliseconds into the run. */
    at,
    running,
    /** Something on the page waits for you: its way out is the filled button, so Send steps back. */
    awaiting,
    /** The newest turn was stopped: what it was in the middle of. */
    stopped: cut && { activity: playTurn(cut, cut.stoppedAt ?? 0).activity },
    /** The messages waiting their turn, in the order they go out. */
    queue,
    /** What was last put in the composer from outside; a new `id` puts it there again. */
    draft,
    /** The files attached to the next message, by name. */
    attachments,
    start,
    send,

    leave() {
      end();
      setQueue([]);
      setAttachments([]);
      setDraft({ text: '', id: draft.id + 1 });
    },

    attach(name: string) {
      if (!attachments.includes(name)) setAttachments([...attachments, name]);
    },

    detach(index: number) {
      setAttachments(attachments.filter((_, at) => at !== index));
    },

    write(text: string) {
      setDraft({ text, id: draft.id + 1 });
    },

    edit(index: number) {
      setDraft({ text: queue[index], id: draft.id + 1 });
      setQueue(queue.filter((_, at) => at !== index));
    },

    unqueue(index: number) {
      setQueue(queue.filter((_, at) => at !== index));
    },

    stop() {
      if (!playback) return;
      changeTurn(playback.turn.id, (turn) => ({ ...turn, stoppedAt: at }));
      end();
    },

    resume() {
      if (!cut) return;
      changeTurn(cut.id, (turn) => ({ ...turn, stoppedAt: undefined }));
      start(cut.id, cut.stoppedAt);
    },

    replay() {
      const newest = turns.findLast((turn) => turn.role === 'agent');
      if (!newest) return;
      changeTurn(newest.id, rewind);
      start(newest.id);
    },

    answer(turnId: string, stepId: string, answer: ApprovalAnswer) {
      const turn = agentTurn(turnId);
      if (!turn) return;
      changeTurn(turnId, (item) => answerApproval(item, stepId, answer));
      go(turn);
    },

    proceed(turnId: string, id: string) {
      const turn = agentTurn(turnId);
      if (!turn) return;
      changeTurn(turnId, (item) => release(item, id));
      go(turn);
    },

    choose(turnId: string, id: string, text: string) {
      changeTurn(turnId, (item) => answerQuestion(item, text, id));
      send(text);
    },

    rate(turnId: string, rating?: 'up' | 'down') {
      changeTurn(turnId, (turn) => ({ ...turn, rating }));
    },
  };
}

export type Session = ReturnType<typeof useSession>;
