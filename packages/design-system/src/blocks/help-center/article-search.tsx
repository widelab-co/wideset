import { RiSearchLine } from '@remixicon/react';
import { Button, TextInput } from '@wideset/react';
import { type KeyboardEvent, useId, useRef, useState } from 'react';

import { type Article, articles } from './data';
import { EmptyState } from './empty-state';
import { SearchResultRow } from './search-result';
import { TextLink } from './text-link';

type ArticleSearchProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

/**
 * The page's main control: one large field over every article. Typing turns the page under it
 * into the matches, the matched words marked; the field keeps the focus, the arrow keys move
 * the highlight (the field points at it for screen readers), Enter opens it and Esc clears. With
 * nothing found it offers the support team, the page's one filled button while it shows.
 */
export function ArticleSearch({ query, onQueryChange }: ArticleSearchProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [active, setActive] = useState(0);

  const term = query.trim();
  const found = term
    ? articles.filter((article) => article.title.toLowerCase().includes(term.toLowerCase()))
    : [];
  const current = found[active];
  const optionId = (article: Article) => `${id}-${article.id}`;

  const search = (value: string) => {
    onQueryChange(value);
    setActive(0);
  };

  const open = (article: Article) => window.location.assign(`#articles/${article.id}`);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const next = found[active + (event.key === 'ArrowDown' ? 1 : -1)];
      if (!next) return;
      setActive(found.indexOf(next));
      document.getElementById(optionId(next))?.scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter' && current) {
      open(current);
    } else if (event.key === 'Escape') {
      search('');
    }
  };

  return (
    <div className="gap-ws-12 flex flex-col">
      <TextInput
        ref={input}
        size="lg"
        value={query}
        onChange={(event) => search(event.target.value)}
      >
        <TextInput.Prefix inner>
          <TextInput.Icon icon={RiSearchLine} />
        </TextInput.Prefix>
        <TextInput.Input
          type="search"
          placeholder="Search help articles, for example “import customers”"
          aria-label="Search help articles"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={found.length > 0}
          aria-controls={`${id}-results`}
          aria-activedescendant={current && optionId(current)}
          onKeyDown={onKeyDown}
        />
        <TextInput.Suffix inner>
          <TextInput.ClearButton aria-label="Clear search" />
        </TextInput.Suffix>
      </TextInput>

      {term &&
        (found.length > 0 ? (
          <section aria-label="Search results" className="gap-ws-9 flex flex-col">
            {/* The screen counts here: how many articles the words found. */}
            <p role="status" className="typography-body-md text-ws-static-subtle">
              {found.length === 1 ? '1 article' : `${found.length} articles`} for “{term}”
            </p>
            <ul id={`${id}-results`} role="listbox" aria-label="Articles">
              {found.map((article, position) => (
                <SearchResultRow
                  key={article.id}
                  id={optionId(article)}
                  article={article}
                  query={term}
                  active={position === active}
                  onActivate={() => setActive(position)}
                  onOpen={() => open(article)}
                />
              ))}
            </ul>
            <p className="typography-body-md text-ws-static-base">
              Not what you need? <TextLink href="#contact-support">Contact support</TextLink>
            </p>
          </section>
        ) : (
          <div className="py-ws-16">
            <EmptyState
              title={`No articles match “${term}”`}
              description="Try other words, or ask the support team. They answer a chat in about three minutes."
            >
              <Button size="sm" asChild>
                <a href="#contact-support">Contact support</a>
              </Button>
              <Button
                size="sm"
                variant="secondary"
                preset="border"
                onClick={() => {
                  search('');
                  input.current?.focus();
                }}
              >
                Clear search
              </Button>
            </EmptyState>
          </div>
        ))}
    </div>
  );
}
