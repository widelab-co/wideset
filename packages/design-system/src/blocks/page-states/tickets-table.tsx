import { StatusBadge, Table } from '@wideset/react';

import type { Ticket } from './data';
import { formatDate } from './format';

/**
 * What the failed module holds once Retry gets through: the customer's tickets, in the same four
 * columns as the other tables, so the skeleton before it keeps its shape.
 */
export function TicketsTable({ tickets }: { tickets: Ticket[] }) {
  return (
    <Table aria-label="Support tickets" className="w-full table-fixed whitespace-nowrap">
      <Table.Head>
        <Table.Row>
          <Table.Header>Ticket</Table.Header>
          <Table.Header className="w-[7rem]">Status</Table.Header>
          <Table.Header className="w-[7.75rem]">Opened</Table.Header>
          <Table.Header align="right" className="w-[6.25rem]">
            Replies
          </Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {tickets.map((ticket) => (
          <Table.Row key={ticket.id}>
            <Table.Cell truncate className="text-ws-static-strong">
              {ticket.subject}
            </Table.Cell>
            <Table.Cell>
              <StatusBadge size="sm">{ticket.status}</StatusBadge>
            </Table.Cell>
            <Table.Cell className="tabular-nums">{formatDate(ticket.opened)}</Table.Cell>
            <Table.Cell align="right" className="tabular-nums">
              {ticket.replies}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
