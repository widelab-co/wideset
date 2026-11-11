// TODO(custom): article link row (title, topic); ListItem is a div with no link of its own, ActionTile is a bordered tile.
import { Card } from '@wideset/react';
import { useId } from 'react';

import type { Article } from './data';

/**
 * A titled list of articles in a card, each row one link across its width: the title, and on
 * the right the topic it belongs to. The hover fill reaches past the text so the titles stay on
 * the card title's edge. Rows, not tiles: it reads as a list of links to work through.
 */
export function ArticleLinks({ title, articles }: { title: string; articles: Article[] }) {
  const id = useId();

  return (
    <Card role="region" aria-labelledby={id}>
      <Card.Header>
        <h2 id={id} className="typography-label-strong-md text-ws-static-strong">
          {title}
        </h2>
      </Card.Header>
      {/* Card.Content keeps 10px free on its right for a scrollbar: the padding gives it back.
          The rows bring their own height, so the content keeps less above and below them. */}
      <Card.Content contentClassName="pr-ws-6 py-ws-7">
        <ul className="-mx-ws-5 flex flex-col">
          {articles.map((article) => (
            <li key={article.id}>
              <a
                href={`#articles/${article.id}`}
                className="h-ws-15 gap-ws-9 px-ws-5 rounded-ws-control-lg hover:bg-ws-dynamic-secondary-alpha-hover focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex items-center"
              >
                <span className="typography-label-sm text-ws-static-strong min-w-0 flex-1 truncate">
                  {article.title}
                </span>
                <span className="typography-label-sm text-ws-static-subtle shrink-0">
                  {article.topic}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Card.Content>
    </Card>
  );
}
