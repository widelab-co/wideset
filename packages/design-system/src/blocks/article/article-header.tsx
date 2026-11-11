import { RiBookmarkFill, RiBookmarkLine, RiCheckLine, RiLinkM } from '@remixicon/react';
import { Button } from '@wideset/react';
import { useEffect, useState } from 'react';

import { article } from './data';
import { formatDay } from './format';

/**
 * The article's header: its title, when it was last updated and how long it takes to read, then
 * what a reader may do with it. A reading page has no primary action, so both are bordered and
 * quiet: Copy link confirms in its own label for a moment, Save toggles to Saved.
 */
export function ArticleHeader() {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = () =>
    navigator.clipboard?.writeText(window.location.href).then(
      () => setCopied(true),
      () => {},
    );

  return (
    <header className="gap-ws-12 flex flex-wrap items-start justify-between">
      <div className="gap-ws-2 flex max-w-[42rem] min-w-0 flex-col">
        <h1 className="typography-subtitle-md text-ws-static-strong">{article.title}</h1>
        <p className="typography-body-md text-ws-static-subtle tabular-nums">
          Updated {formatDay(article.updated)}, {article.minutes} min read
        </p>
      </div>

      <div className="gap-ws-5 flex items-center">
        <Button variant="secondary" preset="border" size="sm" onClick={copy}>
          <Button.Icon icon={copied ? RiCheckLine : RiLinkM} />
          {copied ? 'Link copied' : 'Copy link'}
        </Button>
        <Button
          variant="secondary"
          preset="border"
          size="sm"
          aria-pressed={saved}
          onClick={() => setSaved(!saved)}
        >
          <Button.Icon icon={saved ? RiBookmarkFill : RiBookmarkLine} />
          {saved ? 'Saved' : 'Save'}
        </Button>
        {/* The labels change in place; this says so to a screen reader. */}
        <span role="status" className="sr-only">
          {copied ? 'Link copied' : ''}
        </span>
      </div>
    </header>
  );
}
