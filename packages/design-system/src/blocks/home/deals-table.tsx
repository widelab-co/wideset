// TODO(custom): whole-row link done with a stretched <a>; Table has no row link.
import { Card, StatusBadge, type StatusBadgeProps, Table } from '@wideset/react';
import { useId } from 'react';

import type { Deal } from './data';
import { formatUsd } from './format';

/** A stage in the colour of what it says about the deal, the same in every block. */
const STAGE_COLOR: Record<Deal['stage'], StatusBadgeProps['color']> = {
  Discovery: 'neutral',
  Proposal: 'info',
  Negotiation: 'notice',
  Commit: 'positive',
};

/**
 * In a card, the table runs edge to edge: the outer cells are inset like the card's title, and
 * the last row leaves its line to the card's border.
 */
const IN_CARD =
  '[&_tr>*:first-child]:pl-ws-11 [&_tr>*:last-child]:pr-ws-11 [&_tbody>tr:last-child>*]:border-b-0';

/**
 * The deals whose next step falls this week, soonest first: who, where the deal stands, what to
 * do next, and what it is worth. A list to work through, so it sits in a card like the tasks. A
 * row opens its deal from anywhere on it.
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
      {/* Straight in the card, not in Card.Content, whose scrollbar gutter would stop the lines
          short. Auto layout: the short columns keep to one line and their width, the next step
          takes the rest. */}
      <Table interactive aria-labelledby={titleId} className={IN_CARD}>
        <Table.Head>
          <Table.Row>
            <Table.Header className="whitespace-nowrap">Customer</Table.Header>
            <Table.Header>Stage</Table.Header>
            <Table.Header className="w-full">Next step</Table.Header>
            <Table.Header align="right">Amount</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {deals.map((deal) => (
            // The customer's link stretches over the whole row: one target, the hover on every
            // cell.
            <Table.Row key={deal.id} className="relative">
              <Table.Cell className="whitespace-nowrap">
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
              <Table.Cell align="right">
                <span className="text-ws-static-strong tabular-nums">{formatUsd(deal.amount)}</span>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Card>
  );
}
