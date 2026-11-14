import { Button, Tile } from '@wideset/react';

import type { Alternative } from './data';

type AlternativeOfferProps = {
  /** The offer that fits the reason picked; none for most reasons. */
  alternative?: Alternative;
  /** While a choice is being saved. */
  busy: boolean;
  onAccept: (alternative: Alternative) => void;
};

/**
 * The third step, only when the reason has an answer: one alternative, said once, with what it
 * costs and what it gives up. It is a tile with a secondary button, placed before the
 * confirmation and never in its way: the buttons under it work whether it is read or not. The
 * region is live, so a screen reader hears the offer when a reason brings it in; empty, it takes
 * no room, which is why the space above the tile is the tile's own margin.
 */
export function AlternativeOffer({ alternative, busy, onAccept }: AlternativeOfferProps) {
  return (
    <div aria-live="polite">
      {alternative && (
        <Tile title={alternative.title} description={alternative.description} className="mt-ws-9">
          <Button
            size="sm"
            variant="secondary"
            preset="border"
            disabled={busy}
            onClick={() => onAccept(alternative)}
          >
            {alternative.action}
          </Button>
        </Tile>
      )}
    </div>
  );
}
