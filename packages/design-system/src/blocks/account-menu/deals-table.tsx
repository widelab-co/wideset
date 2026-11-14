// TODO(custom): whole-row link done with a stretched <a>; Table has no row link.
import { Card, StatusBadge, type StatusBadgeProps, Table } from '@wideset/react';
import { useId } from 'react';

import type { Deal } from './data';
import { formatUsd } from './format';

/**
 * A stage's colour says how the deal stands, as on the sales overview: discovery is only a
 * start, a proposal is out and in progress, a negotiation still needs a look before it can close,
 * a commit is as good as won.
 */
const STAGE_COLOR: Record<Deal['stage'], NonNullable<StatusBadgeProps['color']>> = {
  Discovery: 'neutral',
  Proposal: 'info',
  Negotiation: 'notice',
  Commit: 'positive',
};

/**
 * The deals whose next step falls this week, soonest first, in a card: the list to work through
 * is the page's main job. Who, where the deal stands, what to do next, and what it is worth; a
 * row opens its deal from anywhere on it. The table sits in the card itself, not in
 * `Card.Content` (whose scrollbar gutter would stop the lines short of the right edge), so its
 * lines run edge to edge; the outer cells keep the card's 20px so the text lines up with the
 * title, and the last row drops its line, which the card's border replaces.
 */
export function DealsTable({ deals }: { deals: Deal[] }) {
  const titleId = useId();

  return (
    <Card role="region" aria-labelledby={titleId}>
      <Card.Header>
        <h2 id={titleId} className="typography-label-strong-md text-ws-static-strong">
          Deals to move this week
        </h2>
      </Card.Header>
      {/* Auto layout: the short columns keep to one line and their width, the next step takes
          the rest. */}
      <Table
        interactive
        aria-labelledby={titleId}
        className="[&_tbody_tr:last-child>td]:border-b-0"
      >
        <Table.Head>
          <Table.Row>
            <Table.Header className="pl-ws-11 whitespace-nowrap">Customer</Table.Header>
            <Table.Header>Stage</Table.Header>
            <Table.Header className="w-full">Next step</Table.Header>
            <Table.Header align="right" className="pr-ws-11">
              Amount
            </Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {deals.map((deal) => (
            // The customer's link stretches over the whole row: one target, the hover on every
            // cell.
            <Table.Row key={deal.id} className="relative">
              <Table.Cell className="pl-ws-11 whitespace-nowrap">
                <a
                  href={`#deal-${deal.id}`}
                  className="text-ws-static-strong focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default after:inset-ws-0 after:absolute"
                >
                  {deal.customer}
                </a>
              </Table.Cell>
              <Table.Cell>
                <StatusBadge color={STAGE_COLOR[deal.stage]}>{deal.stage}</StatusBadge>
              </Table.Cell>
              <Table.Cell>{deal.nextStep}</Table.Cell>
              <Table.Cell align="right" className="pr-ws-11">
                <span className="text-ws-static-strong tabular-nums">{formatUsd(deal.amount)}</span>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Card>
  );
}
