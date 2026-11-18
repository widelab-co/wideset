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

/** A question on the page still open: the turn that asks it, and its id in that turn. */
type OpenQuestion = { turn: string; id: string };

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
 *   waits for you answers its question, or leaves the turn where it stands, ahead of the queue.
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
  /** The thread's turns as last shown, for the ids already taken in it. */
  const latest = useRef(turns);
  useEffect(() => {
    latest.current = turns;
  });
  const queued = useRef(waiting?.length ?? 0);
  /**
   * The queued messages already sent, by id. StrictMode sets an effect up twice in development, and
   * a send can come before the render that drops a message the run's end just sent: neither may
   * send it again.
   */
  const claimed = useRef(new Set<number>());
  const [queue, setQueue] = useState<QueuedMessage[]>(() =>
    (waiting ?? []).map((text, index) => ({ id: index + 1, text })),
  );
  const [draft, setDraft] = useState({ text: opening ?? '', id: 0 });
  const [attachments, setAttachments] = useState<string[]>([]);
  /**
   * The tray as it is now, ahead of the next render: a handler that attaches, sends or edits more
   * than once sees what its own earlier calls did.
   */
  const tray = useRef<string[]>([]);
  const changeTray = (change: (files: string[]) => string[]) => {
    tray.current = change(tray.current);
    setAttachments(tray.current);
  };
  const { playback, at, start: play, stop: end } = useRun(turns, playing);
  const running = playback !== null;
  /**
   * Whether a turn is playing, as of now: set the moment one starts or stops, so a second send in
   * the same handler waits in the queue instead of cutting the first reply short.
   */
  const busy = useRef(running);
  useEffect(() => {
    busy.current = running;
  });
  const whole = reducedMotion();
  /** The turn last set playing: the one Continue goes on with once stopped, wherever it stands. */
  const [played, setPlayed] = useState(playing?.id);
  const start = useCallback(
    (id: string, from?: number) => {
      busy.current = true;
      setPlayed(id);
      play(id, from);
    },
    [play],
  );
  const halt = () => {
    busy.current = false;
    end();
  };

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
  const open: OpenQuestion[] = shown.flatMap((turn) =>
    turn.role !== 'agent' || turn.stopped
      ? []
      : turn.blocks.flatMap((block) =>
          block.kind === 'question' && block.answer === undefined
            ? [{ turn: turn.id, id: block.id }]
            : [],
        ),
  );

  const awaiting = shown.some((turn) => turn.role === 'agent' && turn.held);

  const changeTurn = (id: string, change: (turn: AgentTurn) => AgentTurn) =>
    onChange((all) =>
      all.map((turn) => (turn.id === id && turn.role === 'agent' ? change(turn) : turn)),
    );

  const deliver = useCallback(
    (text: string, sentWith?: string[], answering: OpenQuestion[] = []) => {
      // An id no turn in the thread has: a thread kept and opened again holds those made before.
      const newId = () => {
        let id: string;
        do id = `sent-${(ids.current += 1)}`;
        while (latest.current.some((turn) => turn.id === id));
        return id;
      };
      const answer = reply(newId(), text);
      const answered = (turn: AgentTurn) =>
        // Each answer goes to the turn whose question it is: two turns may use the same id.
        answering
          .filter((question) => question.turn === turn.id)
          .reduce((item, question) => answerQuestion(item, text, question.id), turn);
      onChange((all) => [
        ...all.map((turn) => (turn.role === 'agent' ? abandon(answered(turn)) : turn)),
        { id: newId(), role: 'user', text, sentWith },
        answer,
      ]);
      start(answer.id);
    },
    [onChange, reply, start],
  );

  /** Sends a message; it answers the questions named, the ones open on the page when it is sent. */
  const post = (text: string, answering: OpenQuestion[]) => {
    // The files go with this message only: the tray is emptied before another send can read it.
    const sentWith = tray.current.length > 0 ? tray.current : undefined;
    changeTray(() => []);
    // While the agent works the files wait with the message, not on the tray for the next one.
    const message = { id: (queued.current += 1), text, sentWith };
    // The queue is changed from what it holds now, so two sends in one handler both stay.
    const behind = () => setQueue((current) => [...current, message]);
    if (busy.current) return behind();
    // Stopped with messages waiting: sending goes on in order, the first that waited goes now.
    // A turn that waits for you is answered by what you send now; the queue goes after it.
    if (queue.length > 0 && !awaiting) {
      const [first] = queue;
      // Already sent as the run ended: this message waits behind it instead.
      if (claimed.current.has(first.id)) return behind();
      claimed.current.add(first.id);
      setQueue((current) => [...current.filter((item) => item.id !== first.id), message]);
      return deliver(first.text, first.sentWith, answering);
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

  // When a run ends, the first message that waited goes out; not while the turn waits for you,
  // and not after you stopped it: the queue waits for Continue, or for what you send next.
  const stopped = cut !== null;
  // As text, so the effect below runs again only when the open questions change.
  const answering = JSON.stringify(open);
  useEffect(() => {
    if (running || awaiting || stopped || queue.length === 0) return;
    const [next] = queue;
    if (claimed.current.has(next.id)) return;
    claimed.current.add(next.id);
    deliver(next.text, next.sentWith, JSON.parse(answering) as OpenQuestion[]);
    setQueue((current) => current.filter((item) => item.id !== next.id));
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
      halt();
      setPlayed(undefined);
      setQueue([]);
      changeTray(() => []);
      setDraft((current) => ({ text: '', id: current.id + 1 }));
    },

    /** Puts a file on the tray, once. */
    attach(name: string) {
      changeTray((files) => (files.includes(name) ? files : [...files, name]));
    },

    /** Puts the first of these files not on the tray yet there; none when all are. */
    attachNext(names: string[]) {
      changeTray((files) => {
        const next = names.find((name) => !files.includes(name));
        return next ? [...files, next] : files;
      });
    },

    /** Takes the file at this place on the tray, as it shows, off it. */
    detach(index: number) {
      const name = attachments[index];
      changeTray((files) => files.filter((item) => item !== name));
    },

    write(text: string) {
      setDraft((current) => ({ text, id: current.id + 1 }));
    },

    /** Takes the message at this place in the queue, as it shows, back into the composer. */
    edit(index: number) {
      const message = queue[index];
      if (!message) return;
      const { id, text, sentWith = [] } = message;
      setDraft((current) => ({ text, id: current.id + 1 }));
      // Its files go back on the tray with it.
      changeTray((files) => [...files, ...sentWith.filter((name) => !files.includes(name))]);
      setQueue((current) => current.filter((item) => item.id !== id));
    },

    /** Drops the message at this place in the queue, as it shows. */
    unqueue(index: number) {
      const message = queue[index];
      if (!message) return;
      setQueue((current) => current.filter((item) => item.id !== message.id));
    },

    stop() {
      if (!playback) return;
      changeTurn(playback.turn.id, (turn) => ({ ...turn, stoppedAt: at }));
      halt();
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
