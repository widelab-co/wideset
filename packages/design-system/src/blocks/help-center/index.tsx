import { RiSideBarLine } from '@remixicon/react';
import { AppShell, Breadcrumbs, cn, IconButton } from '@wideset/react';
import { useId, useState } from 'react';

import { ArticleLinks } from './article-links';
import { ArticleSearch } from './article-search';
import { ContactSupport } from './contact-support';
import { popular } from './data';
import { PageHeader } from './page-header';
import { HelpSidebar } from './sidebar';
import { TopicGrid } from './topic-grid';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';

/**
 * Help center (Inset direction): help inside Orbit on the raised page beside the workspace
 * sidebar. Read top to bottom: the title, then the search, the page's main control and its
 * largest thing; the topics as tiles; the articles read most; and last the ways to reach a
 * person. Typing turns everything under the search into its matches.
 */
export default function HelpCenter() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <AppShell direction="inset">
      <HelpSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
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
              <Breadcrumbs.Item>Help</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The page scrolls inside the card, so the card's corners stay put. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className={cn(COLUMN, 'gap-ws-16 pt-ws-14 pb-ws-16 flex flex-col')}>
            {/* The hero: the title and the search, centred in a column of their own, with more
                air above and below than the sections under it keep between them. */}
            <div className="gap-ws-12 pt-ws-14 pb-ws-14 mx-auto flex w-full max-w-[44rem] flex-col">
              <PageHeader />
              <ArticleSearch query={query} onQueryChange={setQuery} />
            </div>

            {!query.trim() && (
              <>
                <TopicGrid />
                {/* On the tiles' grid: the contacts line up with the third column. Two cards of
                    one height, drawn as the tiles are: with a border. */}
                <div className="gap-ws-7 grid grid-cols-1 lg:grid-cols-3">
                  <div className="flex lg:col-span-2">
                    <ArticleLinks title="Popular articles" articles={popular} />
                  </div>
                  <ContactSupport />
                </div>
              </>
            )}
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
