// TODO(custom): what can be done in a thread (send, queue, stop, replay, answer an approval, rate) over the turn model; Wideset has no agent or chat state.
import { useEffect, useRef } from 'react';

import type { AgentTurn, ApprovalAnswer, Step, Turn } from './model';
import { answerApproval, playTurn, showTurn } from './run';
import { useRun } from './use-run';

const stepsOf = (turn: Turn): Step[] =>
  turn.role === 'user'
    ? []
    : turn.blocks.flatMap((block) =>
        block.kind === 'step' ? [block] : block.kind === 'steps' ? block.steps : [],
      );

type SessionOptions = {
  /** The open thread's turns, whole, as its data holds them. */
  turns: Turn[];
  /** Writes the turns back to wherever the thread is kept. */
  onChange: (change: (turns: Turn[]) => Turn[]) => void;
  /** The agent's turn in answer to a new message; a sample has one for everything. */
  reply: (id: string) => AgentTurn;
};

/**
 * One thread in use, the same in Chat and in Code. It keeps the turns whole in the block's own
 * state and works out what shows: the running turn as far as it has come, a stopped one cut
 * where it stopped, one that waits for an approval held at that step.
 *
 * - `send`: answered at once; while the agent works the message waits as Queued and goes out
 *   when the run ends.
 * - `stop`: keeps what is there and marks the turn stopped. `replay`: plays the newest turn again
 *   from its start, whole again if it had been stopped.
 * - `answer`: an approval answered at rest sets the turn going again from that step; answered in
 *   a run, it lets the clock go on.
 * - `start` and `leave` are for the shell: a thread still working when it is opened, and one
 *   that is left mid-run (it is simply finished on return).
 */
export function useSession({ turns, onChange, reply }: SessionOptions) {
  const ids = useRef(0);
  const { playback, at, start, stop: leave } = useRun(turns);
  const running = playback !== null;

  const shown = turns.map((turn) =>
    turn.role === 'user' ? turn : turn.id === playback?.turn.id ? playback.turn : showTurn(turn),
  );
  const steps = shown.flatMap(stepsOf);

  const nextId = () => `sent-${(ids.current += 1)}`;

  const changeTurn = (id: string, change: (turn: AgentTurn) => AgentTurn) =>
    onChange((all) =>
      all.map((turn) => (turn.id === id && turn.role === 'agent' ? change(turn) : turn)),
    );

  // When a run ends, the first message that waited is sent.
  useEffect(() => {
    const queued = turns.find((turn) => turn.role === 'user' && turn.queued);
    if (running || !queued) return;
    const answer = reply(`${queued.id}-reply`);
    onChange((all) =>
      all.flatMap((turn) =>
        turn.role === 'user' && turn.id === queued.id
          ? [{ ...turn, queued: false }, answer]
          : [turn],
      ),
    );
    start(answer.id);
  }, [running, turns, onChange, reply, start]);

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
    /** An approval is on the page: its Allow once is the filled button, so Send steps back. */
    awaiting: steps.some((step) => step.status === 'waiting'),
    start,
    leave,

    send(text: string) {
      if (running) {
        return onChange((all) => [...all, { id: nextId(), role: 'user', text, queued: true }]);
      }
      const answer = reply(nextId());
      onChange((all) => [...all, { id: nextId(), role: 'user', text }, answer]);
      start(answer.id);
    },

    stop() {
      if (!playback) return;
      changeTurn(playback.turn.id, (turn) => ({ ...turn, stoppedAt: at }));
      leave();
    },

    replay() {
      const last = turns.findLast((turn) => turn.role === 'agent');
      if (!last) return;
      changeTurn(last.id, (turn) => ({ ...turn, stoppedAt: undefined }));
      start(last.id);
    },

    answer(turnId: string, stepId: string, answer: ApprovalAnswer) {
      const turn = turns.find((item) => item.id === turnId);
      if (turn?.role !== 'agent') return;
      changeTurn(turnId, (item) => answerApproval(item, stepId, answer));
      if (!running) start(turnId, playTurn(turn, Infinity).clock);
    },

    rate(turnId: string, rating?: 'up' | 'down') {
      changeTurn(turnId, (turn) => ({ ...turn, rating }));
    },
  };
}

export type Session = ReturnType<typeof useSession>;
