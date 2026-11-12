// TODO(custom): a message row in the assistant's conversation (mark, name, text, then what the answer carries); Wideset has no message component.
import { RiQuestionAnswerLine } from '@remixicon/react';
import { Avatar } from '@wideset/react';

import { AnswerFeedback } from './answer-feedback';
import { maya, type Turn } from './data';
import { ProposedChange } from './proposed-change';
import { SourceLinks } from './source-links';

type MessageProps = {
  turn: Turn;
  /** While the answer streams in: the part of its text written so far. */
  partial?: string;
  onApply: () => void;
  onDiscard: () => void;
  onRate: (rating?: 'up' | 'down') => void;
};

/**
 * One turn of the conversation as a row on the page, as the chat block draws messages: the mark
 * and the name, the text under them. Maya is her avatar; the assistant is its name and a small
 * neutral icon, no orb and no colour. Once an answer is complete it shows where it comes from,
 * the change it proposes, if any, and a quiet rating; until then only its words.
 */
export function Message({ turn, partial, onApply, onDiscard, onRate }: MessageProps) {
  const assistant = turn.role === 'assistant';
  const done = partial === undefined;

  return (
    <article
      aria-label={assistant ? 'Assistant' : maya.name}
      aria-busy={!done}
      className="gap-ws-7 flex"
    >
      {assistant ? (
        <Avatar icon={<RiQuestionAnswerLine />} aria-hidden />
      ) : (
        <Avatar initials={maya.initials} color={maya.color} aria-hidden />
      )}
      <div className="gap-ws-7 flex min-w-0 flex-1 flex-col">
        <div className="flex flex-col">
          <p className="typography-label-strong-sm text-ws-static-strong">
            {assistant ? 'Assistant' : maya.name}
          </p>
          <p className="typography-body-md text-ws-static-base whitespace-pre-line">
            {partial ?? turn.text}
          </p>
          {assistant && turn.stopped && (
            <p className="typography-caption-md text-ws-static-subtle mt-ws-3">Stopped</p>
          )}
        </div>
        {assistant && done && (
          <>
            {turn.sources && turn.sources.length > 0 && <SourceLinks sources={turn.sources} />}
            {turn.change && (
              <ProposedChange change={turn.change} onApply={onApply} onDiscard={onDiscard} />
            )}
            <AnswerFeedback rating={turn.rating} onRate={onRate} />
          </>
        )}
      </div>
    </article>
  );
}
