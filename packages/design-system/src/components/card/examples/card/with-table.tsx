/**
 * A table goes straight into `Card.Content`, with no wrapper: the card keeps the width of its
 * column and a table wider than that scrolls horizontally inside it. `contentClassName="px-ws-3"`
 * adds 4px to the cells' own 16px, so the first column lines up with the title. A table is heavy
 * content, so the card sets `divider`.
 */
import { RiDownloadLine } from '@remixicon/react';
import { Card, IconButton, StatusBadge, Table } from '@wideset/react';

const invoices = [
  {
    number: 'INV-2041',
    date: '2 Nov 2026',
    period: 'October 2026',
    amount: '$12,480.00',
    paid: true,
  },
  {
    number: 'INV-2040',
    date: '2 Oct 2026',
    period: 'September 2026',
    amount: '$11,920.00',
    paid: true,
  },
  {
    number: 'INV-2039',
    date: '2 Sep 2026',
    period: 'August 2026',
    amount: '$12,105.00',
    paid: false,
  },
];

export default function CardWithTable() {
  return (
    <div className="grid w-full max-w-[32rem]">
      <Card divider>
        <Card.Header>
          <Card.Title>Invoices</Card.Title>
          <Card.Description>Billed on the 2nd of every month.</Card.Description>
        </Card.Header>
        <Card.Content contentClassName="px-ws-3">
          <Table className="whitespace-nowrap">
            <Table.Head>
              <Table.Row>
                <Table.Header>Number</Table.Header>
                <Table.Header>Date</Table.Header>
                <Table.Header>Period</Table.Header>
                <Table.Header align="right">Amount</Table.Header>
                <Table.Header>Status</Table.Header>
                <Table.Header>
                  <span className="sr-only">Actions</span>
                </Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {invoices.map((invoice) => (
                <Table.Row key={invoice.number}>
                  <Table.Cell>{invoice.number}</Table.Cell>
                  <Table.Cell>{invoice.date}</Table.Cell>
                  <Table.Cell>{invoice.period}</Table.Cell>
                  <Table.Cell align="right">{invoice.amount}</Table.Cell>
                  <Table.Cell>
                    <StatusBadge color={invoice.paid ? 'positive' : 'negative'}>
                      {invoice.paid ? 'Paid' : 'Overdue'}
                    </StatusBadge>
                  </Table.Cell>
                  <Table.Cell align="right">
                    <IconButton
                      aria-label={`Download ${invoice.number}`}
                      icon={RiDownloadLine}
                      preset="ghost"
                      size="sm"
                      variant="secondary"
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card.Content>
      </Card>
    </div>
  );
}
