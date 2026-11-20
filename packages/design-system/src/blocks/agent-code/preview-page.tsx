import { Avatar, Button, cn } from '@wideset/react';

import { PersonAvatar } from './person-avatar';
import { PreviewBookings } from './preview-bookings';
import { HOME, INES } from './preview-data';

type PreviewPageProps = {
  /** The address loaded: the bookings page, or one the app has no page for. */
  address: string;
  /** The width the viewport gives the page. */
  className?: string;
  onExport: (rows: number) => void;
  onHome: () => void;
};

/**
 * What the dev server serves, drawn with Wideset at the width the viewport gives it: Lumen's
 * booking app, its own small product with its own bar (the mark, who is signed in) over the page.
 * It is a size container, so the page inside answers to the preview's width and not the window's.
 * It scrolls inside itself; the page's toast is laid over its foot and stays put.
 */
export function PreviewPage({ address, className, onExport, onHome }: PreviewPageProps) {
  return (
    <div className={cn('bg-ws-static-foreground shadow-ws-low @container relative', className)}>
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="h-ws-18 border-ws-static-subtle px-ws-11 gap-ws-5 flex shrink-0 items-center border-b">
          <Avatar shape="square" size="sm" initials="L" color="yellow" aria-hidden="true" />
          <span className="typography-label-strong-md text-ws-static-strong">Lumen</span>
          <span className="ml-auto flex">
            <PersonAvatar size="sm" {...INES} title={INES.name} alt={INES.name} />
          </span>
        </div>
        {address === HOME ? (
          <PreviewBookings onExport={onExport} />
        ) : (
          <div className="gap-ws-9 px-ws-11 flex flex-1 flex-col items-center justify-center text-center">
            <div className="gap-ws-2 flex flex-col">
              <h3 className="typography-subtitle-xs text-ws-static-strong">Page not found</h3>
              <p className="typography-body-md text-ws-static-subtle wrap-anywhere">
                Lumen has no page at {address}
              </p>
            </div>
            <Button size="sm" variant="secondary" preset="border" onClick={onHome}>
              Back to bookings
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
