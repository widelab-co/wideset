import {
  type RemixiconComponentType,
  RiDownload2Line,
  RiLinkM,
  RiMailSendLine,
  RiMoreFill,
  RiPrinterLine,
  RiRefund2Line,
} from '@remixicon/react';
import { Button, DropdownMenu, IconButton, ListItem, StatusBadge } from '@wideset/react';

import { customer, order } from './data';
import { formatDate } from './format';

const MENU: { label: string; icon: RemixiconComponentType }[] = [
  { label: 'Print packing slip', icon: RiPrinterLine },
  { label: 'Resend confirmation', icon: RiMailSendLine },
  { label: 'Copy link', icon: RiLinkM },
];

type OrderHeaderProps = {
  /** Where the order stands, in a word or two. */
  status: string;
  /** Opens the refund dialog; left out once nothing is left to refund, which disables the button. */
  onRefund?: () => void;
  /** While a dialog holds the filled button: Download invoice steps back to a bordered one. */
  quiet?: boolean;
};

/**
 * The order's header: its number and status, who placed it and when, then what to do with it,
 * primary last. Every status here is a step of the order's life or how it ended, so the badge
 * stays neutral. Refund is a secondary button: it takes money back, so it must not be the
 * loudest thing on the page. Once an order has shipped it can be refunded, not cancelled.
 */
export function OrderHeader({ status, onRefund, quiet }: OrderHeaderProps) {
  return (
    <header className="gap-ws-12 flex flex-wrap items-center justify-between">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <div className="gap-ws-7 flex items-center">
          <h1 className="typography-subtitle-md text-ws-static-strong tabular-nums">
            Order {order.number}
          </h1>
          <StatusBadge size="lg">{status}</StatusBadge>
        </div>
        <p className="typography-body-md text-ws-static-subtle tabular-nums">
          Placed by {customer.name} on {formatDate(order.placed)}
        </p>
      </div>

      <div className="gap-ws-5 flex items-center">
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <IconButton
              icon={RiMoreFill}
              variant="secondary"
              preset="border"
              size="sm"
              aria-label="More actions"
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" className="w-[14rem]">
            {MENU.map(({ label, icon: Icon }) => (
              <DropdownMenu.Item key={label}>
                <ListItem.Prefix>
                  <Icon className="size-ws-9" />
                </ListItem.Prefix>
                <ListItem.Content>
                  <ListItem.Label>{label}</ListItem.Label>
                </ListItem.Content>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu>
        <Button
          variant="secondary"
          preset="border"
          size="sm"
          disabled={!onRefund}
          onClick={onRefund}
        >
          <Button.Icon icon={RiRefund2Line} />
          Refund
        </Button>
        <Button
          size="sm"
          variant={quiet ? 'secondary' : 'primary'}
          preset={quiet ? 'border' : 'filled'}
        >
          <Button.Icon icon={RiDownload2Line} />
          Download invoice
        </Button>
      </div>
    </header>
  );
}
