// TODO(custom): a small composer for a comment on a line (a text area with Cancel and the send action under it); Wideset has no comment or composer part.
import { Button, Textarea } from '@wideset/react';
import { type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react';

type CommentComposerProps = {
  /** Names the field: "Comment on line 36", "Reply to Tom Becker". */
  label: string;
  /** The send button's word: Comment for a new thread, Reply inside one. */
  action: string;
  onSubmit: (text: string) => void;
  onCancel: () => void;
};

/**
 * Where a comment is written: the field takes the focus as it opens, Ctrl or Cmd with Enter
 * sends (Enter alone breaks the line, a review comment is often several), Escape cancels. The
 * send button is bordered, never filled: the session's composer owns the screen's filled button.
 * It stays disabled while the field is empty.
 */
export function CommentComposer({ label, action, onSubmit, onCancel }: CommentComposerProps) {
  const [text, setText] = useState('');
  const field = useRef<HTMLTextAreaElement>(null);

  useEffect(() => field.current?.focus(), []);

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (text.trim()) onSubmit(text.trim());
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Escape') {
      // Only this composer closes, not whatever holds the pane.
      event.stopPropagation();
      onCancel();
    }
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) submit();
  };

  return (
    <form
      onSubmit={submit}
      className="gap-ws-5 animate-in fade-in-0 flex flex-col duration-(--ws-motion-duration-fast) ease-(--ws-motion-ease-smooth-out)"
    >
      <Textarea
        ref={field}
        size="sm"
        rows={2}
        resize="none"
        aria-label={label}
        placeholder="Leave a comment"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={onKeyDown}
      />
      <div className="gap-ws-3 flex justify-end">
        <Button variant="secondary" preset="ghost" size="xs" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="secondary" preset="border" size="xs" disabled={!text.trim()}>
          {action}
        </Button>
      </div>
    </form>
  );
}
