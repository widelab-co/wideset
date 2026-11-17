import { Button, Textarea } from '@wideset/react';
import { type FormEvent, useEffect, useRef, useState } from 'react';

type ReplyFormProps = {
  /** Who wrote the review: the reply is addressed to them. */
  to: string;
  onReply: (text: string) => void;
  onCancel: () => void;
};

/**
 * The reply field that opens under a review, in place of its Reply button. It takes the caret as
 * it opens; Esc or Cancel puts the button back. Post reply is filled, the only filled button on
 * the page while a reply is open, and disabled until there is something to post.
 */
export function ReplyForm({ to, onReply, onCancel }: ReplyFormProps) {
  const field = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState('');
  const empty = !text.trim();

  useEffect(() => field.current?.focus(), []);

  const post = (event: FormEvent) => {
    event.preventDefault();
    if (!empty) onReply(text.trim());
  };

  return (
    <form onSubmit={post} className="gap-ws-5 flex max-w-[40rem] flex-col">
      <Textarea
        ref={field}
        size="sm"
        rows={3}
        resize="none"
        aria-label={`Reply to ${to}`}
        placeholder={`Reply to ${to.split(' ')[0]}`}
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') onCancel();
        }}
      />
      <div className="gap-ws-5 flex items-center">
        <p className="typography-body-md text-ws-static-subtle min-w-0 flex-1">
          Replies are public and show under the review.
        </p>
        <Button size="sm" variant="secondary" preset="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={empty}>
          Post reply
        </Button>
      </div>
    </form>
  );
}
