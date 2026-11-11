// TODO(custom): page header (title, a line of description, the actions on the right); no PageHeader in Wideset.
import { RiAddLine } from '@remixicon/react';
import { Button } from '@wideset/react';

/** The page's title, one line saying what the list holds, and its actions. */
export function PageHeader() {
  return (
    <header className="gap-ws-12 flex flex-wrap items-center justify-between">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <h1 className="typography-subtitle-md text-ws-static-strong">Deals</h1>
        <p className="typography-body-md text-ws-static-subtle">
          Every deal in Lumen Studio’s pipeline, open and closed.
        </p>
      </div>
      <div className="gap-ws-5 flex items-center">
        <Button variant="secondary" preset="border" size="sm">
          Export
        </Button>
        <Button size="sm">
          <Button.Icon icon={RiAddLine} />
          New deal
        </Button>
      </div>
    </header>
  );
}
