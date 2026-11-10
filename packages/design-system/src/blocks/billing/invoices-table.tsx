import { RiDownload2Line } from '@remixicon/react';
import { Card, IconButton, StatusBadge, Table } from '@wideset/react';

import { billingDetails, type Invoice } from './data';
import { formatDate, formatUsd } from './format';

/** Every invoice, newest first: a failed one is the only status in colour. */
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
      {/* The cells pad themselves: the content keeps 4px so the first column lines up with the
          card title. */}
      <Card.Content contentClassName="px-ws-3 pt-ws-0 pb-ws-3">
        <Table className="w-full whitespace-nowrap">
          <Table.Head>
            <Table.Row>
              <Table.Header>Invoice</Table.Header>
              <Table.Header>Date</Table.Header>
              <Table.Header className="w-full">Description</Table.Header>
              <Table.Header align="right">Amount</Table.Header>
              <Table.Header>Status</Table.Header>
              <Table.Header align="right">
                <span className="sr-only">Download</span>
              </Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {invoices.map((invoice) => (
              <Table.Row key={invoice.id}>
                <Table.Cell className="text-ws-static-strong tabular-nums">{invoice.id}</Table.Cell>
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
                    <StatusBadge color="neutral" size="sm">
                      Paid
                    </StatusBadge>
                  )}
                </Table.Cell>
                <Table.Cell align="right">
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
      </Card.Content>
    </Card>
  );
}
