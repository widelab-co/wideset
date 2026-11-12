import { RiSendPlaneLine } from '@remixicon/react';
import { Avatar, TextInput } from '@wideset/react';
import { type FormEvent, forwardRef, useState } from 'react';

import { me } from './data';

type CommentFieldProps = {
  /** Whose post it answers, for the field's name. */
  author: string;
  onComment: (text: string) => void;
};

/**
 * The one-line comment field under a post: Enter (or the arrow) sends it, and nothing is sent
 * while it is empty. The ref is the input, so the post's Comment button can put the caret in it.
 */
export const CommentField = forwardRef<HTMLInputElement, CommentFieldProps>(
  ({ author, onComment }, ref) => {
    const [text, setText] = useState('');

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
          ref={ref}
          size="sm"
          className="min-w-0 flex-1"
          value={text}
          onChange={(event) => setText(event.target.value)}
        >
          <TextInput.Input
            placeholder="Write a comment"
            aria-label={`Comment on ${author}’s post`}
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
  },
);
CommentField.displayName = 'CommentField';
