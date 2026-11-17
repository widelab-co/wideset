// TODO(custom): customer summary (the company, the person who ordered, the way to the customer); ListItem always looks clickable.
import { Avatar, LinkButton } from '@wideset/react';

import { customer } from './data';
import { formatMonth } from './format';

/**
 * Who bought: the company first, then the person who placed the order and how to reach them.
 * The one link leads to the customer's own page; the contact lines stay text to copy.
 */
export function CustomerSummary() {
  const { contact } = customer;

  return (
    <div className="gap-ws-9 flex flex-col">
      <div className="gap-ws-7 flex items-center">
        <Avatar shape="square" initials={customer.initials} aria-hidden="true" />
        <div className="flex min-w-0 flex-col">
          <span className="typography-label-strong-sm text-ws-static-strong truncate">
            {customer.name}
          </span>
          <span className="typography-caption-md text-ws-static-subtle truncate">
            Customer since {formatMonth(customer.since)}
          </span>
        </div>
      </div>
      <div className="gap-ws-3 flex flex-col items-start">
        <p className="typography-body-md text-ws-static-base flex max-w-full flex-col">
          <span>
            {contact.name}, {contact.role.toLowerCase()}
          </span>
          <span className="truncate">{contact.email}</span>
          <span className="tabular-nums">{contact.phone}</span>
        </p>
        {/* Pulled left by its own padding, so its words start on the column's edge. */}
        <LinkButton href={`#customer-${customer.id}`} className="-ml-ws-6">
          View customer
        </LinkButton>
      </div>
    </div>
  );
}
