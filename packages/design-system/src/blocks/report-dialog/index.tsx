import { RiSideBarLine } from '@remixicon/react';
import { AppShell, Breadcrumbs, cn, IconButton, ToastProvider, useToast } from '@wideset/react';
import { useId, useState } from 'react';

import { posts, type Reportable, REPORTED_ON_LOAD } from './data';
import { FeedPost } from './feed-post';
import { ReportModal } from './report-modal';
import { FeedSidebar } from './sidebar';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';

const comments = posts.flatMap((post) => post.comments);
const onLoad = comments.find((comment) => comment.id === REPORTED_ON_LOAD);

/** The page: the feed's posts in a reading column, under the toasts. */
function Feed() {
  const sidebarId = useId();
  const { showToast } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [item, setItem] = useState<Reportable | undefined>(
    onLoad && { kind: 'comment', ...onLoad },
  );
  const [open, setOpen] = useState(true);
  const [reported, setReported] = useState<string[]>([]);
  const [shown, setShown] = useState<string[]>([]);

  const copyLink = (id: string) => {
    const { origin, pathname, search } = window.location;
    void navigator.clipboard?.writeText(`${origin}${pathname}${search}#${id}`).catch(() => {});
    showToast({ content: 'Link copied' });
  };

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
            <section aria-label="Updates" className="flex max-w-[40rem] flex-col">
              {posts.map((post) => (
                <FeedPost
                  key={post.id}
                  post={post}
                  reported={reported}
                  shown={shown}
                  onShow={(id) => setShown((all) => [...all, id])}
                  onReport={(target, kind) => {
                    setItem({ kind, ...target });
                    setOpen(true);
                  }}
                  onCopyLink={copyLink}
                />
              ))}
            </section>
          </div>
        </div>
      </AppShell.Main>

      <ReportModal
        item={item}
        open={open}
        onOpenChange={setOpen}
        onSend={(target) => {
          setReported((all) => [...all, target.id]);
          setShown((all) => all.filter((id) => id !== target.id));
        }}
      />
    </AppShell>
  );
}

/**
 * Report dialog (panel over the Feed, Inset direction): reporting a teammate's comment that
 * shares a customer's personal phone number, open on load. Every post and comment has Report in
 * its ⋯ menu. Once sent, the dialog says thanks and what happens next in place, and the reported
 * comment folds away for the reporter, with Show anyway.
 */
export default function ReportDialogBlock() {
  return (
    <ToastProvider position="bottom-center">
      <Feed />
    </ToastProvider>
  );
}
