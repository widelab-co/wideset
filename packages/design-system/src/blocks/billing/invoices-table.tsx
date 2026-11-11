import { RiDownload2Line } from '@remixicon/react';
import { Card, IconButton, StatusBadge, Table } from '@wideset/react';

import { billingDetails, type Invoice } from './data';
import { formatDate, formatUsd } from './format';

/** Every invoice, newest first, its status in the colour of its meaning: paid, or failed. */
export function InvoicesTable({ invoices }: { invoices: Invoice[] }) {
  return (
    <Card>
      <Card.Header>
        <div className="gap-ws-3 flex flex-col">
          <h2 className="typography-subtitle-xs text-ws-static-strong">Invoices</h2>
          <p className="typography-body-md text-ws-static-subtle">
            Sent to {billingDetails.email} when they are issued.
          </p>
        </div>
      </Card.Header>
      {/* Straight in the card, so the row lines run from edge to edge; the outer columns take the
          card's 20px inset, so the first lines up with the card title. The last row drops its
          line: the card's border closes the table. */}
      <Table className="w-full whitespace-nowrap">
        <Table.Head>
          <Table.Row>
            <Table.Header className="pl-ws-11">Invoice</Table.Header>
            <Table.Header>Date</Table.Header>
            <Table.Header className="w-full">Description</Table.Header>
            <Table.Header align="right">Amount</Table.Header>
            <Table.Header>Status</Table.Header>
            <Table.Header align="right" className="pr-ws-11">
              <span className="sr-only">Download</span>
            </Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body className="[&>tr:last-child>td]:border-b-0">
          {invoices.map((invoice) => (
            <Table.Row key={invoice.id}>
              <Table.Cell className="text-ws-static-strong pl-ws-11 tabular-nums">
                {invoice.id}
              </Table.Cell>
              <Table.Cell className="tabular-nums">{formatDate(invoice.date)}</Table.Cell>
              <Table.Cell>{invoice.description}</Table.Cell>
              <Table.Cell align="right" className="tabular-nums">
                {formatUsd(invoice.amount)}
              </Table.Cell>
              <Table.Cell>
                {invoice.status === 'failed' ? (
                  <StatusBadge color="negative" size="sm">
                    Failed
                  </StatusBadge>
                ) : (
                  <StatusBadge color="positive" size="sm">
                    Paid
                  </StatusBadge>
                )}
              </Table.Cell>
              <Table.Cell align="right" className="pr-ws-11">
                <IconButton
                  icon={RiDownload2Line}
                  variant="secondary"
                  preset="ghost"
                  size="xs"
                  aria-label={`Download ${invoice.id}`}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Card>
  );
}
