import { Card } from '@wideset/react';

import { BrandMark } from './brand-mark';
import { billedTo, invoice, issuer, type Party, product, total } from './data';
import { formatDate, formatPeriod, formatUsd } from './format';
import { InvoiceTotals } from './invoice-totals';
import { KeyValue } from './key-value';
import { LineItemsTable } from './line-items-table';

/** A company's block on the invoice: its legal name, address and tax number, one per line. */
function PartyLines({ party }: { party: Party }) {
  return (
    <>
      {[party.name, ...party.address, party.taxId].map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </>
  );
}

/**
 * The invoice as a document, the page's one object: who bills whom, the dates, the lines and what
 * they come to, how it was paid. The total stands at the top, where the eye lands first.
 */
export function InvoiceDocument() {
  return (
    <Card aria-label={`Invoice ${invoice.number}`} role="article">
      <Card.Header>
        <div className="gap-ws-9 flex items-start justify-between">
          <div className="gap-ws-5 flex items-center">
            <BrandMark />
            <span className="typography-label-strong-md text-ws-static-strong">{product.name}</span>
          </div>
          <div className="gap-ws-2 flex flex-col items-end">
            <span className="typography-subtitle-lg text-ws-static-strong tabular-nums">
              {formatUsd(total)}
            </span>
            <span className="typography-body-md text-ws-static-subtle tabular-nums">
              Paid on {formatDate(invoice.paid)}
            </span>
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="gap-ws-14 flex flex-col">
          <dl className="gap-ws-12 grid grid-cols-2">
            <KeyValue label="From">
              <PartyLines party={issuer} />
            </KeyValue>
            <KeyValue label="Billed to">
              <PartyLines party={billedTo} />
            </KeyValue>
          </dl>

          <dl className="gap-ws-12 grid grid-cols-4">
            <KeyValue label="Invoice number">{invoice.number}</KeyValue>
            <KeyValue label="Issued">{formatDate(invoice.issued)}</KeyValue>
            <KeyValue label="Due">{formatDate(invoice.due)}</KeyValue>
            <KeyValue label="Billing period">
              {formatPeriod(invoice.period.from, invoice.period.to)}
            </KeyValue>
          </dl>

          <div className="gap-ws-12 flex flex-col">
            <LineItemsTable />
            <div className="gap-ws-12 grid grid-cols-[minmax(0,1fr)_18rem] items-start">
              <dl className="gap-ws-11 flex flex-col">
                <KeyValue label="Paid with">
                  {invoice.card.brand} ending {invoice.card.last4}
                </KeyValue>
                <KeyValue label="Note">
                  Reverse charge: {billedTo.name} accounts for the VAT to HMRC. Questions about this
                  invoice go to {issuer.email}.
                </KeyValue>
              </dl>
              <InvoiceTotals />
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
