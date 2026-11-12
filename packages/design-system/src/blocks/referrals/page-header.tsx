// TODO(custom): page header (title and a line of description); no PageHeader in Wideset.
import { product, programme } from './data';
import { formatUsd } from './format';

/**
 * The page's title and the deal in one line: what a referral earns and when. The page has no
 * action of its own up here: sharing, its main job, starts right under the header.
 */
export function PageHeader() {
  return (
    <header className="gap-ws-2 flex min-w-0 flex-col">
      <h1 className="typography-subtitle-md text-ws-static-strong">Referrals</h1>
      <p className="typography-body-md text-ws-static-subtle tabular-nums">
        Earn {formatUsd(programme.reward)} in credit for each team that subscribes to {product.name}{' '}
        through your link.
      </p>
    </header>
  );
}
