import { RiSideBarLine } from '@remixicon/react';
import { AppShell, Breadcrumbs, cn, IconButton, ToastProvider, useToast } from '@wideset/react';
import { useId, useState } from 'react';

import { Composer, type Draft } from './composer';
import { AUDIENCES, me, NOW_AT, type Post, posts as postsAtStart, suggestions } from './data';
import { FeedPost } from './feed-post';
import { FollowedThreads } from './followed-threads';
import { FeedSidebar } from './sidebar';
import { WhoToFollow } from './who-to-follow';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';

const isPinned = (post: Post) => post.kind === 'announcement';

/** The page: the composer and the posts in a reading column, people and threads beside it. */
function Feed() {
  const sidebarId = useId();
  const { showToast } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [posts, setPosts] = useState(postsAtStart);
  const [followedPeople, setFollowedPeople] = useState<string[]>([]);

  const change = (id: string, next: (post: Post) => Post) =>
    setPosts((all) => all.map((post) => (post.id === id ? next(post) : post)));

  // A new post goes on top of the feed and its author follows the thread.
  const publish = ({ text, audience, file }: Draft) =>
    setPosts((all) => [
      {
        id: `post-${all.length}`,
        kind: 'update',
        author: me,
        at: NOW_AT,
        text,
        subject: file ? { kind: 'File', name: file, detail: 'Attachment' } : undefined,
        audience:
          audience === AUDIENCES[0].value
            ? undefined
            : AUDIENCES.find((option) => option.value === audience)?.label,
        likes: 0,
        liked: false,
        following: true,
        comments: [],
      },
      ...all,
    ]);

  const like = (id: string) =>
    change(id, (post) => ({
      ...post,
      liked: !post.liked,
      likes: post.likes + (post.liked ? -1 : 1),
    }));

  const comment = (id: string, text: string) =>
    change(id, (post) => ({
      ...post,
      comments: [
        ...post.comments,
        { id: `${id}-${post.comments.length}`, author: me, at: NOW_AT, text },
      ],
    }));

  const copyLink = (id: string) => {
    const { origin, pathname, search } = window.location;
    void navigator.clipboard?.writeText(`${origin}${pathname}${search}#${id}`).catch(() => {});
    showToast({ content: 'Link copied' });
  };

  // What is pinned stays on top; the rest is newest first, as the list holds it.
  const feed = [...posts.filter(isPinned), ...posts.filter((post) => !isPinned(post))];

  return (
    <AppShell direction="inset">
      <FeedSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <AppShell.Main>
        <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
          {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is pulled
              left so its glyph, not its box, sits 20px from the edge; the crumbs follow it. */}
          <div className="gap-ws-5 px-ws-11 flex w-full items-center">
            <IconButton
              icon={RiSideBarLine}
              variant="secondary"
              preset="ghost"
              size="sm"
              iconClassName="text-ws-static-subtle size-ws-9"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!collapsed}
              aria-controls={sidebarId}
              onClick={() => setCollapsed(!collapsed)}
              className="-ml-ws-5"
            />
            <Breadcrumbs separator="arrow">
              <Breadcrumbs.Item>Feed</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The page scrolls inside the card, so the card's corners stay put. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-16 flex flex-col')}>
            <header className="gap-ws-2 flex flex-col">
              <h1 className="typography-title-md text-ws-static-strong">Feed</h1>
              <p className="typography-body-md text-ws-static-subtle">
                What the team shares and what happened to deals.
              </p>
            </header>

            {/* A reading column, not the page's width: a post is read, line after line. */}
            <div className="gap-x-ws-20 gap-y-ws-16 grid grid-cols-1 items-start lg:grid-cols-[minmax(0,40rem)_18rem]">
              <div className="gap-ws-9 flex min-w-0 flex-col">
                <Composer onPost={publish} />
                <section aria-label="Updates" className="gap-ws-9 flex flex-col">
                  {feed.map((post) => (
                    <FeedPost
                      key={post.id}
                      post={post}
                      onLike={() => like(post.id)}
                      onComment={(text) => comment(post.id, text)}
                      onFollow={() =>
                        change(post.id, (current) => ({
                          ...current,
                          following: !current.following,
                        }))
                      }
                      onShare={() => showToast({ content: 'Shared with your followers' })}
                      onCopyLink={() => copyLink(post.id)}
                      onReport={() =>
                        showToast({ content: 'Post reported. A workspace admin will review it.' })
                      }
                    />
                  ))}
                </section>
              </div>

              {/* It stays in view while the feed scrolls past. */}
              <aside
                aria-label="People and threads"
                className="gap-ws-9 lg:top-ws-14 flex flex-col lg:sticky"
              >
                <WhoToFollow
                  people={suggestions}
                  following={followedPeople}
                  onToggle={(id) =>
                    setFollowedPeople((all) =>
                      all.includes(id) ? all.filter((item) => item !== id) : [...all, id],
                    )
                  }
                />
                <FollowedThreads posts={posts.filter((post) => post.following)} />
              </aside>
            </div>
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}

/**
 * Activity feed (Inset direction): what the team posts and what happened to deals, on the raised
 * page beside the workspace sidebar. The feed is a reading column and leads: the composer, then
 * the posts, each in its own bordered card. Who to follow and the followed threads sit in a
 * narrow column beside it, in cards of their own, so the whole row is drawn one way.
 */
export default function ActivityFeed() {
  return (
    <ToastProvider position="bottom-center">
      <Feed />
    </ToastProvider>
  );
}
