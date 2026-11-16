import {
  type RemixiconComponentType,
  RiDownload2Line,
  RiLinkM,
  RiMoreFill,
  RiPrinterLine,
  RiReceiptLine,
  RiSendPlaneLine,
} from '@remixicon/react';
import { Button, DropdownMenu, IconButton, ListItem, StatusBadge } from '@wideset/react';

import { invoice } from './data';
import { formatPeriod } from './format';

const MENU: { label: string; icon: RemixiconComponentType }[] = [
  { label: 'Copy link', icon: RiLinkM },
  { label: 'Print', icon: RiPrinterLine },
  { label: 'Download receipt', icon: RiReceiptLine },
];

/**
 * The invoice's header: its number and status, what it bills for, then what to do with it,
 * primary last. Paid is a lifecycle state, so the badge stays neutral.
 */
export function InvoiceHeader() {
  return (
    <header className="gap-ws-12 flex flex-wrap items-center justify-between">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <div className="gap-ws-7 flex items-center">
          <h1 className="typography-title-md text-ws-static-strong tabular-nums">
            {invoice.number}
          </h1>
          <StatusBadge size="lg">{invoice.status}</StatusBadge>
        </div>
        <p className="typography-body-md text-ws-static-subtle tabular-nums">
          {invoice.description}, {formatPeriod(invoice.period.from, invoice.period.to)}
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
        <Button variant="secondary" preset="border" size="sm">
          <Button.Icon icon={RiSendPlaneLine} />
          Send
        </Button>
        <Button size="sm">
          <Button.Icon icon={RiDownload2Line} />
          Download PDF
        </Button>
      </div>
    </header>
  );
}
