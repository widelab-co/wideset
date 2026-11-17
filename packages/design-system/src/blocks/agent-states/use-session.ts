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

/** A message waiting its turn: an id that stays with it while others go, its words, its files. */
export type QueuedMessage = { id: number; text: string; sentWith?: string[] };

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
 *   plays the newest turn (or a named one) again from its start, as before anyone answered it.
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
  const queued = useRef(waiting?.length ?? 0);
  const [queue, setQueue] = useState<QueuedMessage[]>(() =>
    (waiting ?? []).map((text, index) => ({ id: index + 1, text })),
  );
  const [draft, setDraft] = useState({ text: opening ?? '', id: 0 });
  const [attachments, setAttachments] = useState<string[]>([]);
  const { playback, at, start: play, stop: end } = useRun(turns, playing);
  const running = playback !== null;
  const whole = reducedMotion();
  /** The turn last set playing: the one Continue goes on with once stopped, wherever it stands. */
  const [played, setPlayed] = useState(playing?.id);
  const start = useCallback(
    (id: string, from?: number) => {
      setPlayed(id);
      play(id, from);
    },
    [play],
  );

  const shown = turns.map((turn) =>
    turn.role !== 'agent'
      ? turn
      : turn.id === playback?.turn.id
        ? playback.turn
        : showTurn(turn, undefined, whole),
  );
  const steps = shown.flatMap(stepsOf);
  // The turn stopped: the one last played (a replay of an earlier turn too), else the newest.
  const target = played ? turns.find((turn) => turn.id === played) : turns.at(-1);
  const cut =
    !running && target?.role === 'agent' && target.stoppedAt !== undefined ? target : null;
  /**
   * The questions on the page still open: a message sent answers these, never one not shown yet,
   * nor one a stopped turn no longer shows.
   */
  const open = shown.flatMap((turn) =>
    turn.role !== 'agent' || turn.stopped
      ? []
      : turn.blocks.flatMap((block) =>
          block.kind === 'question' && block.answer === undefined ? [block.id] : [],
        ),
  );

  const changeTurn = (id: string, change: (turn: AgentTurn) => AgentTurn) =>
    onChange((all) =>
      all.map((turn) => (turn.id === id && turn.role === 'agent' ? change(turn) : turn)),
    );

  const deliver = useCallback(
    (text: string, sentWith?: string[], answering: string[] = []) => {
      const answer = reply(`sent-${(ids.current += 1)}`, text);
      const answered = (turn: AgentTurn) =>
        answering.reduce((item, id) => answerQuestion(item, text, id), turn);
      onChange((all) => [
        ...all.map((turn) => (turn.role === 'agent' ? abandon(answered(turn)) : turn)),
        { id: `sent-${(ids.current += 1)}`, role: 'user', text, sentWith },
        answer,
      ]);
      start(answer.id);
    },
    [onChange, reply, start],
  );

  /** Sends a message; it answers the questions named, the ones open on the page when it is sent. */
  const post = (text: string, answering: string[]) => {
    const sentWith = attachments.length > 0 ? attachments : undefined;
    setAttachments([]);
    // While the agent works the files wait with the message, not on the tray for the next one.
    const message = { id: (queued.current += 1), text, sentWith };
    if (running) return setQueue([...queue, message]);
    // Stopped with messages waiting: sending goes on in order, the first that waited goes now.
    if (queue.length > 0) {
      setQueue([...queue.slice(1), message]);
      return deliver(queue[0].text, queue[0].sentWith, answering);
    }
    deliver(text, sentWith, answering);
  };

  const send = (text: string) => post(text, open);

  /** Sets a turn that was held going again from where it stood. */
  const go = (turn: AgentTurn) => start(turn.id, playTurn(turn, Infinity).clock);

  const agentTurn = (id: string) => {
    const turn = turns.find((item) => item.id === id);
    return turn?.role === 'agent' ? turn : undefined;
  };

  const awaiting = shown.some((turn) => turn.role === 'agent' && turn.held);

  // When a run ends, the first message that waited goes out; not while the turn waits for you,
  // and not after you stopped it: the queue waits for Continue, or for what you send next.
  const stopped = cut !== null;
  const answering = open.join(' ');
  useEffect(() => {
    if (running || awaiting || stopped || queue.length === 0) return;
    deliver(queue[0].text, queue[0].sentWith, answering ? answering.split(' ') : []);
    setQueue(queue.slice(1));
  }, [running, awaiting, stopped, queue, deliver, answering]);

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
    /** The turn last played (an earlier one too) was stopped: what it was in the middle of. */
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
      setPlayed(undefined);
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
      const { text, sentWith = [] } = queue[index];
      setDraft({ text, id: draft.id + 1 });
      // Its files go back on the tray with it.
      setAttachments([...attachments, ...sentWith.filter((name) => !attachments.includes(name))]);
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

    /** Plays a turn again from its start: the newest agent turn, or the one named. */
    replay(turnId?: string) {
      const turn = turnId ? agentTurn(turnId) : turns.findLast((item) => item.role === 'agent');
      if (!turn) return;
      changeTurn(turn.id, rewind);
      start(turn.id);
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
      // The choice answers its own question only.
      post(text, []);
    },

    rate(turnId: string, rating?: 'up' | 'down') {
      changeTurn(turnId, (turn) => ({ ...turn, rating }));
    },
  };
}

export type Session = ReturnType<typeof useSession>;
