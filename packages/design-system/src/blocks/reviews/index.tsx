import { RiSideBarLine } from '@remixicon/react';
import { Breadcrumbs, Button, cn, IconButton, ToastProvider, useToast } from '@wideset/react';
import { useId, useState } from 'react';

import {
  account,
  type Review,
  type ReviewRequest,
  reviewRequests,
  reviews as reviewsAtStart,
  type SortKey,
  TODAY,
} from './data';
import { EmptyState } from './empty-state';
import { PageHeader } from './page-header';
import { RatingSummary } from './rating-summary';
import { RequestReviewModal } from './request-review-modal';
import { ReviewFilters } from './review-filters';
import { ReviewItem } from './review-item';
import { ReviewsSidebar } from './sidebar';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';
/** The summary and every review share two columns: who (or the average) left, what right. */
const ROW = 'gap-x-ws-16 gap-y-ws-7 grid grid-cols-1 lg:grid-cols-[18rem_minmax(0,1fr)]';
/** How many reviews the list shows before "Show more". */
const PAGE = 5;

const newest = (a: Review, b: Review) => b.date.localeCompare(a.date);
const ORDER: Record<SortKey, (a: Review, b: Review) => number> = {
  newest,
  highest: (a, b) => b.rating - a.rating || newest(a, b),
  lowest: (a, b) => a.rating - b.rating || newest(a, b),
};

/** The page: the summary, then the reviews to filter, sort and answer. */
function ReviewsPage() {
  const sidebarId = useId();
  const { showToast } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [reviews, setReviews] = useState(reviewsAtStart);
  const [requests, setRequests] = useState(reviewRequests);
  const [ratings, setRatings] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>('newest');
  const [shown, setShown] = useState(PAGE);
  const [requesting, setRequesting] = useState(false);

  const matching = reviews
    .filter((review) => ratings.length === 0 || ratings.includes(String(review.rating)))
    .sort(ORDER[sort]);

  // Anything that changes the rows goes back to the first few.
  const filter = (next: string[]) => {
    setRatings(next);
    setShown(PAGE);
  };

  const reply = (id: string, text: string) =>
    setReviews((all) =>
      all.map((review) =>
        review.id === id
          ? { ...review, reply: { author: account.name, date: TODAY, text } }
          : review,
      ),
    );

  // A customer is asked once: the deal leaves the list the request is picked from.
  const send = (request: ReviewRequest) => {
    setRequests((all) => all.filter((item) => item.id !== request.id));
    setRequesting(false);
    showToast({
      status: 'success',
      content: `Review request sent to ${request.customer}`,
    });
  };

  const copyLink = (id: string) => {
    const { origin, pathname, search } = window.location;
    void navigator.clipboard?.writeText(`${origin}${pathname}${search}#${id}`).catch(() => {});
    showToast({ content: 'Link copied' });
  };

  return (
    <div className="bg-ws-static-background flex h-dvh">
      <ReviewsSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
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
              <Breadcrumbs.Item>Reviews</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The page scrolls inside the card, so the card's corners stay put. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-16 flex flex-col')}>
            <PageHeader canRequest={requests.length > 0} onRequest={() => setRequesting(true)} />

            <div className="gap-ws-14 flex flex-col">
              <RatingSummary className={ROW} />

              <section aria-label="Reviews" className="gap-ws-7 flex flex-col">
                <ReviewFilters
                  ratings={ratings}
                  onRatingsChange={filter}
                  sort={sort}
                  onSortChange={setSort}
                />
                {/* Rows on the white, split by lines: no card around the list or around a row. */}
                <div className="flex flex-col">
                  {matching.slice(0, shown).map((review) => (
                    <ReviewItem
                      key={review.id}
                      review={review}
                      className={cn(ROW, 'border-ws-static-subtle py-ws-12 border-t')}
                      onReply={(text) => reply(review.id, text)}
                      onCopyLink={() => copyLink(review.id)}
                      onReport={() =>
                        showToast({
                          content: 'Review reported. Orbit will check it against the review rules.',
                        })
                      }
                    />
                  ))}
                  {matching.length === 0 && (
                    <div className="border-ws-static-subtle py-ws-16 border-t">
                      <EmptyState
                        title="No reviews with this rating"
                        description="None of the latest reviews match the ratings you picked."
                      >
                        <Button
                          size="sm"
                          variant="secondary"
                          preset="border"
                          onClick={() => filter([])}
                        >
                          Clear filter
                        </Button>
                      </EmptyState>
                    </div>
                  )}
                  {matching.length > shown && (
                    <div className="border-ws-static-subtle pt-ws-9 border-t">
                      <Button
                        size="sm"
                        variant="secondary"
                        preset="border"
                        onClick={() => setShown(shown + PAGE)}
                      >
                        Show more reviews
                      </Button>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <RequestReviewModal
        open={requesting}
        onOpenChange={setRequesting}
        requests={requests}
        onSend={send}
      />
    </div>
  );
}

/**
 * Reviews (Inset direction): what customers say about the company after a deal closes, on the
 * raised page beside the workspace sidebar. The summary comes first, the average and its spread;
 * under it the reviews to filter, sort and answer, as rows on the white. The summary and the rows
 * share two columns, so the page reads down two edges: who, and what they said.
 */
export default function Reviews() {
  return (
    <ToastProvider position="bottom-center">
      <ReviewsPage />
    </ToastProvider>
  );
}
