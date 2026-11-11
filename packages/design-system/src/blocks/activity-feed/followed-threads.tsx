// TODO(custom): thread link row (first line, author and time); ListItem is a div with no link of its own.
import { useId } from 'react';

import type { Post } from './data';
import { formatWhen } from './format';

/**
 * The threads the signed-in user follows, as links back to their posts on the page. Each row is
 * one link across its width; the fill on hover reaches past the text so the words stay on the
 * column's edge. Following a thread from a post's menu adds it here.
 */
export function FollowedThreads({ posts }: { posts: Post[] }) {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="gap-ws-5 flex flex-col">
      <h2 id={titleId} className="typography-label-strong-md text-ws-static-strong">
        Threads you follow
      </h2>
      {posts.length === 0 ? (
        <p className="typography-body-md text-ws-static-subtle">
          Follow a thread from a post’s menu to keep it here.
        </p>
      ) : (
        <ul className="-mx-ws-5 flex flex-col">
          {posts.map((post) => (
            <li key={post.id}>
              <a
                href={`#${post.id}`}
                className="px-ws-5 py-ws-4 rounded-ws-control-lg hover:bg-ws-dynamic-secondary-alpha-hover focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex flex-col"
              >
                <span className="typography-label-sm text-ws-static-strong truncate">
                  {post.text}
                </span>
                <span className="typography-caption-md text-ws-static-subtle truncate">
                  {post.author.name} · {formatWhen(post.at)}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
