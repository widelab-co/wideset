// TODO(custom): page header (title, a line of description, the action on the right); no PageHeader in Wideset.
import { RiMailSendLine } from '@remixicon/react';
import { Button } from '@wideset/react';

import { workspace } from './data';

/**
 * The page's title, what it holds, and its one action. Asking for a review is something the page
 * offers, not what it is for (that is reading and answering), so the button is secondary.
 */
export function PageHeader({
  canRequest,
  onRequest,
}: {
  /** Whether a closed deal is still waiting to be asked about. */
  canRequest: boolean;
  onRequest: () => void;
}) {
  return (
    <header className="gap-ws-12 flex flex-wrap items-center justify-between">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <h1 className="typography-title-md text-ws-static-strong">Reviews</h1>
        <p className="typography-body-md text-ws-static-subtle">
          What customers say about {workspace.name} after a deal closes.
        </p>
      </div>
      <Button
        variant="secondary"
        preset="border"
        size="sm"
        disabled={!canRequest}
        onClick={onRequest}
      >
        <Button.Icon icon={RiMailSendLine} />
        Request a review
      </Button>
    </header>
  );
}
