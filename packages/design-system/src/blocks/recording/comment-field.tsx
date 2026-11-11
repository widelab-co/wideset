import { RiSendPlaneLine } from '@remixicon/react';
import { Avatar, TextInput } from '@wideset/react';
import { type FormEvent, useState } from 'react';

import { maya } from './data';
import { formatClock } from './format';

type CommentFieldProps = {
  /** The moment of the call a comment sent now refers to. */
  at: number;
  onComment: (text: string) => void;
};

/**
 * The one-line field for a comment at the moment the call is at, which its placeholder names:
 * Enter (or the arrow) sends it, and nothing is sent while it is empty.
 */
export function CommentField({ at, onComment }: CommentFieldProps) {
  const [text, setText] = useState('');

  const send = (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;
    onComment(text.trim());
    setText('');
  };

  return (
    <form onSubmit={send} className="gap-ws-5 flex items-center">
      <Avatar size="sm" initials={maya.initials} color={maya.color} aria-hidden />
      <TextInput
        size="sm"
        className="min-w-0 flex-1"
        value={text}
        onChange={(event) => setText(event.target.value)}
      >
        <TextInput.Input
          placeholder={`Comment at ${formatClock(at)}`}
          aria-label={`Comment at ${formatClock(at)}`}
        />
        <TextInput.Suffix inner>
          <TextInput.IconButton
            type="submit"
            icon={RiSendPlaneLine}
            aria-label="Send comment"
            disabled={!text.trim()}
          />
        </TextInput.Suffix>
      </TextInput>
    </form>
  );
}
