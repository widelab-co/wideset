// TODO(custom): article link row (title, topic); ListItem is a div with no link of its own, ActionTile is a bordered tile.
import { useId } from 'react';

import type { Article } from './data';

/**
 * A titled list of articles, each row one link across its width: the title, and on the right the
 * topic it belongs to. The hover fill reaches past the text so the titles stay on the column's
 * edge. Plain on purpose: it reads as a list of links, not as more tiles.
 */
export function ArticleLinks({ title, articles }: { title: string; articles: Article[] }) {
  const id = useId();

  return (
    <section aria-labelledby={id} className="gap-ws-7 flex flex-col">
      <h2 id={id} className="typography-label-strong-md text-ws-static-strong">
        {title}
      </h2>
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
    </section>
  );
}
