import { RiSendPlaneLine } from '@remixicon/react';
import { Avatar, TextInput } from '@wideset/react';
import { type FormEvent, useState } from 'react';

import { PEOPLE } from './data';

/**
 * The one-line field for a new comment, under the others (copied from the recording block):
 * Enter or the arrow sends it, and nothing is sent while it is empty.
 */
export function CommentField({ onComment }: { onComment: (text: string) => void }) {
  const [text, setText] = useState('');
  const me = PEOPLE.maya;

  const send = (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;
    onComment(text.trim());
    setText('');
  };

  return (
    <form onSubmit={send} className="gap-ws-5 flex items-center">
      <Avatar size="sm" initials={me.initials} color={me.color} aria-hidden />
      <TextInput
        size="sm"
        className="min-w-0 flex-1"
        value={text}
        onChange={(event) => setText(event.target.value)}
      >
        <TextInput.Input placeholder="Add a comment" aria-label="Add a comment" />
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
