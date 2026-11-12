import { RiSideBarLine } from '@remixicon/react';
import { Breadcrumbs, cn, IconButton } from '@wideset/react';
import { useId, useRef, useState } from 'react';

import { ArticleBody } from './article-body';
import { ArticleFeedback } from './article-feedback';
import { ArticleHeader } from './article-header';
import { ArticleLinks } from './article-links';
import { article, related, sections } from './data';
import { OnThisPage } from './on-this-page';
import { ArticleSidebar } from './sidebar';
import { TextLink } from './text-link';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';

/**
 * Article (Inset direction): one help article on the raised page beside the workspace sidebar.
 * The text reads in a 42rem column on the page's left edge; "On this page" stands beside it and
 * follows the scroll; the end of the text asks whether it helped, offers what to read next and
 * the way to a person. The crumbs lead back to the article's topic.
 */
export default function Article() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-ws-static-background flex h-dvh">
      <ArticleSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
          {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is pulled
              left so its glyph, not its box, sits 20px from the edge; the crumbs follow it. */}
          <div className="gap-ws-5 px-ws-11 flex w-full min-w-0 items-center">
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
              <Breadcrumbs.Item asChild>
                <a href="#help">Help</a>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item asChild>
                <a href={`#topics/${article.topic.id}`}>{article.topic.title}</a>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item>{article.title}</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The page scrolls inside the card, so the card's corners stay put; anchor jumps glide. */}
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto scroll-smooth motion-reduce:scroll-auto"
        >
          <div className={cn(COLUMN, 'gap-ws-14 pt-ws-14 pb-ws-16 flex flex-col')}>
            <ArticleHeader />

            <div className="gap-ws-16 grid grid-cols-1 items-start lg:grid-cols-[minmax(0,42rem)_14rem] lg:justify-between">
              <article className="flex min-w-0 flex-col">
                <ArticleBody />

                {/* After the text: did it help, what next, and a person if not. */}
                <div className="gap-ws-14 border-ws-static-base mt-ws-18 pt-ws-14 flex flex-col border-t">
                  <ArticleFeedback />
                  <ArticleLinks title="Related articles" articles={related} />
                  <p className="typography-body-md text-ws-static-base">
                    Still need help? <TextLink href="#contact-support">Contact support</TextLink>
                  </p>
                </div>
              </article>

              <aside className="top-ws-14 sticky hidden lg:block">
                <OnThisPage sections={sections} scrollRef={scrollRef} />
              </aside>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
