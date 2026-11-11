import { RiCloseLine } from '@remixicon/react';
import { Avatar, Button, Chip, FileUpload, Select, Textarea } from '@wideset/react';
import { type ChangeEvent, useRef, useState } from 'react';

import { AUDIENCES, me } from './data';

export type Draft = { text: string; audience: string; file?: string };

/**
 * "Share an update": the text, then one row for what goes with it (a file, who sees it) and Post,
 * the page's one filled button. Post stays disabled until there is text, the one thing a post
 * cannot go without; Ctrl or Cmd + Enter posts from the field.
 */
export function Composer({ onPost }: { onPost: (draft: Draft) => void }) {
  const upload = useRef<HTMLDivElement>(null);
  const [text, setText] = useState('');
  const [audience, setAudience] = useState(AUDIENCES[0].value);
  const [file, setFile] = useState<string>();
  const empty = !text.trim();

  const post = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (empty) return;
    onPost({ text: text.trim(), audience, file });
    setText('');
    setFile(undefined);
  };

  const attach = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0]?.name);
    // Emptied, so picking the same file again after removing it still reports a change.
    event.target.value = '';
  };

  return (
    <form onSubmit={post} className="gap-ws-7 flex">
      <Avatar initials={me.initials} color={me.color} aria-hidden />
      <div className="gap-ws-5 flex min-w-0 flex-1 flex-col">
        <Textarea
          size="sm"
          rows={3}
          resize="none"
          aria-label="Share an update"
          placeholder="Share an update"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) post(event);
          }}
        />
        {file && (
          <Chip
            variant="secondary"
            style="border"
            size="sm"
            className="self-start"
            aria-label={`Remove ${file}`}
            onClick={() => setFile(undefined)}
          >
            {file}
            <Chip.Icon icon={RiCloseLine} />
          </Chip>
        )}
        <div className="gap-ws-5 flex flex-wrap items-center">
          {/* FileUpload's button look. With no file library to open the picker, the button
              clicks the hidden input FileUpload renders. */}
          <FileUpload
            ref={upload}
            type="button"
            labels={{ upload: 'Attach' }}
            inputProps={{ onChange: attach }}
            onBrowse={() => upload.current?.querySelector('input')?.click()}
          />
          <Select
            size="sm"
            preset="border"
            aria-label="Who sees it"
            options={AUDIENCES}
            value={audience}
            onValueChange={setAudience}
            className="w-auto"
          />
          <Button type="submit" size="sm" disabled={empty} className="ml-auto">
            Post
          </Button>
        </div>
      </div>
    </form>
  );
}
