import { SystemAlert } from '@wideset/react';
import { useEffect, useState } from 'react';

import { context, efforts, models, permissions, product } from './canon';
import { CodeTools } from './code-tools';
import { ConnectorStep } from './connector-step';
import { ContextNotice } from './context-notice';
import { BEFORE_PUSH, compactedContext, fullContext, limit, REVIEW, type Scene } from './data';
import { FailedStep } from './failed-step';
import { LimitNotice } from './limit-notice';
import type { ThreadState, TranscriptView } from './model';
import { ModelMenu } from './model-menu';
import { PausedMark } from './paused-mark';
import { Session } from './session';
import type { CardRender } from './step-row';
import { useSession } from './use-session';

type StateSessionProps = {
  scene: Scene;
  view: TranscriptView;
  /** Tells the shell what mark the session has in the sidebar now. */
  onMarkChange: (mark?: ThreadState) => void;
};

/**
 * The session in one of its states, under the top bar. The scene's turn is whole in the data and
 * the kit holds it where the state is: at a step that failed or waits, at a card, at a question.
 * This draws only what is the state's own: what hangs under such a step (through `card`), the
 * notice over the composer when the state is about what you can send next, and the alert under
 * the bar when it is about the whole app. Every way out lets the turn go on from where it
 * stood. A new scene is a new instance, so nothing of the last one lingers.
 */
export function StateSession({ scene, view, onMarkChange }: StateSessionProps) {
  const [turns, setTurns] = useState(scene.turns);
  /** The scene's own switch: waiting for the limit, the conversation compacted, back online. */
  const [settled, setSettled] = useState(false);
  const session = useSession({
    turns,
    onChange: setTurns,
    reply: scene.reply,
    queue: scene.queue,
    draft: scene.draft,
    playing: scene.playing === undefined ? undefined : { id: REVIEW, at: scene.playing },
  });

  /** The limit still holds the turn: nothing can be sent until it resets or the model changes. */
  const limited = session.shown.some(
    (turn) =>
      turn.role === 'agent' &&
      turn.blocks.some((block) => block.kind === 'card' && block.card === 'limit' && block.holding),
  );
  const offline = scene.id === 'offline' && !settled;
  const mark = session.running ? 'working' : session.awaiting ? scene.mark : undefined;

  useEffect(() => onMarkChange(mark), [mark, onMarkChange]);

  const proceed = (id: string) => session.proceed(REVIEW, id);

  /** What is this block's own in the transcript: the mark where the run paused, and the ways out
   *  of the step it stands at. They are there only while the turn is held there. */
  const card: CardRender = (name, of) => {
    if (!of.holding) return null;
    switch (name) {
      case 'limit':
        return <PausedMark reason="Usage limit reached at 1:46 PM" />;
      case 'failed':
        return (
          <FailedStep
            onFix={() => proceed(of.id)}
            // The same command again, from just before it: it fails the same way and holds again.
            onRetry={() => session.start(REVIEW, BEFORE_PUSH)}
          />
        );
      case 'connector':
        return <ConnectorStep onReconnect={() => proceed(of.id)} />;
    }
  };

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

      <Session
        session={session}
        threadId={scene.id}
        agent={product}
        view={view}
        card={card}
        tools={
          <CodeTools
            permissions={permissions}
            context={scene.id !== 'context' ? context : settled ? compactedContext : fullContext}
          />
        }
        model={
          // Going on with the other model shows in the composer, where the model is picked.
          <ModelMenu
            key={String(limited)}
            models={models}
            efforts={efforts}
            defaultModel={scene.id === 'limit' && !limited ? limit.fallback.id : undefined}
          />
        }
        notice={
          <>
            {limited && (
              <LimitNotice
                waiting={settled}
                onWait={() => setSettled(true)}
                onCancel={() => setSettled(false)}
                onSwitch={() => proceed('review-limit')}
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
          </>
        }
        blocked={
          limited ? `Sending resumes at ${limit.resetsAt}` : offline ? 'You are offline' : undefined
        }
      />
    </>
  );
}
