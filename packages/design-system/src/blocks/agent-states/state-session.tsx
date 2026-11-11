import { SystemAlert } from '@wideset/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { CodeTools } from './code-tools';
import { ConnectorStep } from './connector-step';
import { ContextNotice } from './context-notice';
import {
  efforts,
  limit,
  models,
  product,
  question,
  type Scene,
  summary,
  working as longStep,
} from './data';
import { FailedStep } from './failed-step';
import { LimitNotice } from './limit-notice';
import { MessageQueue } from './message-queue';
import type { ThreadState, TranscriptView } from './model';
import { ModelMenu } from './model-menu';
import { PausedMark } from './paused-mark';
import { QuestionCard } from './question-card';
import { playTurn } from './run';
import { SessionColumn } from './session-column';
import { StoppedLine } from './stopped-line';
import { SummaryDivider } from './summary-divider';
import { useSeconds } from './use-seconds';
import { useSession } from './use-session';
import { WorkingLine } from './working-line';

type StateSessionProps = {
  scene: Scene;
  view: TranscriptView;
  /** Tells the shell what mark the session has in the sidebar now. */
  onMarkChange: (mark?: ThreadState) => void;
};

/**
 * The session in one of its states, under the top bar. It holds the scene's turns and draws each
 * state where it happens: in the transcript at the step it is about (through `card`), over the
 * composer when it is about what you can send next, and under the bar when it is about the whole
 * app. Every way out works: it plays the rest of the turn from where the scene stopped it. A new
 * scene is a new instance, so nothing of the last one lingers.
 */
export function StateSession({ scene, view, onMarkChange }: StateSessionProps) {
  const [turns, setTurns] = useState(scene.turns);
  /** The scene's own switch: waiting for the limit, the conversation compacted, back online. */
  const [settled, setSettled] = useState(false);
  /** The scene opens in the middle of a long step. */
  const [working, setWorking] = useState(scene.id === 'queued');
  const [queue, setQueue] = useState(scene.queue ?? []);
  const [draft, setDraft] = useState({ text: scene.draft ?? '', round: 0 });
  /** The message being answered: the scene's reply depends on what was asked. */
  const asked = useRef('');
  const session = useSession({
    turns,
    onChange: setTurns,
    reply: (id) => scene.reply(id, asked.current),
  });
  const send = (text: string) => {
    asked.current = text;
    session.send(text);
  };
  const seconds = useSeconds();

  /** Nothing has happened since the scene opened: its state still stands. */
  const untouched = turns === scene.turns;
  const running = working || session.running;
  const last = turns[turns.length - 1];
  const stopped = !running && last.role === 'agent' && last.stoppedAt !== undefined ? last : null;
  /** The agent waits for one answer: that answer is the filled button, so Send steps back. */
  const awaited = untouched && (scene.mark === 'needs-you' || scene.mark === 'failed');
  /** The newest turn is not finished: its answer has no actions yet. */
  const held = working || (untouched && Boolean(scene.mark));
  const mark = running ? 'working' : untouched && !settled ? scene.mark : undefined;

  useEffect(() => onMarkChange(mark), [mark, onMarkChange]);

  /** The way out: the turn, whole again, goes on from `from`. */
  const { start } = session;
  const play = useCallback(
    (from: number, turn = scene.resumed) => {
      if (!turn) return;
      setTurns((all) => all.map((item) => (item.id === turn.id ? turn : item)));
      start(turn.id, from);
    },
    [scene.resumed, start],
  );

  // The long step ends by itself; then the rest of the turn plays.
  const ended = working && seconds >= longStep.until - longStep.since;
  useEffect(() => {
    if (!ended) return;
    setWorking(false);
    play(scene.from ?? 0);
  }, [ended, play, scene.from]);

  // When a run ends, the first message that waited goes out.
  useEffect(() => {
    if (running || queue.length === 0) return;
    asked.current = queue[0];
    session.send(queue[0]);
    setQueue(queue.slice(1));
  }, [running, queue, session]);

  const stop = () => {
    if (!working) return session.stop();
    // Stopped inside the long step: it shows as not finished, and Continue picks it up there.
    setWorking(false);
    setTurns((all) =>
      all.map((item) =>
        scene.resumed && item.id === scene.resumed.id
          ? { ...scene.resumed, stoppedAt: (scene.from ?? 0) - 1 }
          : item,
      ),
    );
  };

  const card = (name: string) => {
    switch (name) {
      case 'limit':
        return <PausedMark reason="Usage limit reached at 1:46 PM" />;
      case 'failed':
        return <FailedStep live={untouched} onFix={() => play(scene.from ?? 0)} />;
      case 'connector':
        return <ConnectorStep live={untouched} onReconnect={() => play(scene.from ?? 0)} />;
      case 'question':
        // Answered, the question is the text above it and your message under it.
        return untouched ? <QuestionCard {...question} onAnswer={send} /> : null;
    }
  };

  const limited = scene.id === 'limit' && untouched;
  const offline = scene.id === 'offline' && !settled;

  return (
    <>
      {/* The connection is the whole app's, so it is said once, edge to edge under the bar. */}
      {offline && (
        <SystemAlert
          status="notice"
          dismissible={false}
          message="Connection lost. Reconnecting… Your draft is kept and can be sent once you are back online."
        >
          <SystemAlert.Action onClick={() => setSettled(true)}>Retry now</SystemAlert.Action>
        </SystemAlert>
      )}
      {scene.id === 'offline' && settled && (
        <SystemAlert
          status="positive"
          message="You are back online. Your draft is ready to send."
        />
      )}

      <SessionColumn
        session={session}
        agent={product}
        view={view}
        card={card}
        heldId={held ? last.id : undefined}
        tools={<CodeTools disabled={limited || offline} />}
        model={
          // Going on with the other model shows in the composer, where the model is picked.
          <ModelMenu
            key={String(limited)}
            models={models}
            efforts={efforts}
            defaultModel={scene.id === 'limit' && !limited ? limit.fallback.id : undefined}
          />
        }
        head={scene.id === 'context' && settled && <SummaryDivider points={summary} />}
        notice={
          <>
            {limited && (
              <LimitNotice
                waiting={settled}
                onWait={() => setSettled(true)}
                onCancel={() => setSettled(false)}
                onSwitch={() => play(scene.from ?? 0)}
              />
            )}
            {scene.id === 'context' && !settled && (
              <ContextNotice
                onCompact={() => {
                  setTurns(scene.compacted ?? turns);
                  setSettled(true);
                }}
              />
            )}
            {working && (
              <WorkingLine
                activity={longStep.activity}
                seconds={longStep.since + seconds}
                waiting={false}
              />
            )}
            {session.playback && (
              <WorkingLine
                activity={session.playback.activity}
                seconds={Math.floor(session.at / 1000)}
                waiting={session.playback.waiting}
              />
            )}
            {stopped && (
              <StoppedLine
                activity={playTurn(stopped, stopped.stoppedAt ?? 0).activity}
                onContinue={() =>
                  play(stopped.stoppedAt ?? 0, { ...stopped, stoppedAt: undefined })
                }
              />
            )}
            {queue.length > 0 && (
              <MessageQueue
                messages={queue}
                onEdit={(index) => {
                  // ponytail: the message replaces whatever is in the composer; the kit's composer
                  // keeps its text to itself, so there is nothing to merge it with.
                  setDraft({ text: queue[index], round: draft.round + 1 });
                  setQueue(queue.filter((_, at) => at !== index));
                }}
                onRemove={(index) => setQueue(queue.filter((_, at) => at !== index))}
              />
            )}
          </>
        }
        running={running}
        // Paused, Send keeps its fill, so it reads as the disabled main action.
        primary={limited || (!awaited && !session.awaiting)}
        paused={
          limited ? `Sending resumes at ${limit.resetsAt}` : offline ? 'You are offline' : undefined
        }
        draft={draft.text}
        draftKey={draft.round}
        onSend={(text) => (running ? setQueue([...queue, text]) : send(text))}
        onStop={stop}
      />
    </>
  );
}
