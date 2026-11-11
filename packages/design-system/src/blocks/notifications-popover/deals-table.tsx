// TODO(custom): whole-row link done with a stretched <a>; Table has no row link.
import { StatusBadge, Table } from '@wideset/react';
import { useId } from 'react';

import type { Deal } from './data';
import { formatUsd } from './format';

/**
 * The deals whose next step falls this week, soonest first: who, where the deal stands, what to
 * do next, and what it is worth. A row opens its deal from anywhere on it. Stages are lifecycle
 * states, so the badges stay neutral.
 */
export function DealsTable({ deals }: { deals: Deal[] }) {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="gap-ws-9 flex flex-col">
      <h2 id={titleId} className="typography-label-strong-md text-ws-static-strong">
        Deals to move this week
      </h2>
      {/* Auto layout: the short columns keep to one line and their width, the next step takes
          the rest. */}
      <Table interactive aria-labelledby={titleId} className="w-full">
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
                <StatusBadge>{deal.stage}</StatusBadge>
              </Table.Cell>
              <Table.Cell>{deal.nextStep}</Table.Cell>
              <Table.Cell align="right">
                <span className="text-ws-static-strong tabular-nums">{formatUsd(deal.amount)}</span>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </section>
  );
}
