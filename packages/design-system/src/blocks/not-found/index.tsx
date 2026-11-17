import { Button } from '@wideset/react';

import { Address } from './address';
import { BrandMark } from './brand-mark';
import { missingUrl, ROUTES } from './data';

/**
 * Not found (Inset direction, no navigation): a missing page outside the app, in a raised card on
 * the grey ground. One plain sentence on what happened, the address that was not found, and the
 * two ways back.
 */
export default function NotFound() {
  return (
    <main className="bg-ws-static-background p-ws-12 flex min-h-dvh items-center justify-center">
      <div className="bg-ws-static-foreground rounded-ws-container-xl shadow-ws-low gap-ws-16 p-ws-12 sm:p-ws-18 flex w-full max-w-[32rem] flex-col items-start">
        <BrandMark label="Orbit" className="size-ws-16" />

        <div className="gap-ws-12 flex w-full flex-col">
          <div className="gap-ws-3 flex flex-col">
            <p className="typography-label-sm text-ws-static-subtle">Error 404</p>
            <h1 className="typography-title-md text-ws-static-strong">Page not found</h1>
            <p className="typography-body-md text-ws-static-base">
              There’s no page at this address: it was moved or deleted, or the link has a typo.
            </p>
          </div>
          <Address url={missingUrl} />
        </div>

        <div className="gap-ws-5 flex flex-wrap">
          <Button asChild size="sm">
            <a href={ROUTES.dashboard}>Go to dashboard</a>
          </Button>
          <Button asChild size="sm" variant="secondary" preset="border">
            <a href={ROUTES.support}>Contact support</a>
          </Button>
        </div>
      </div>
    </main>
  );
}
