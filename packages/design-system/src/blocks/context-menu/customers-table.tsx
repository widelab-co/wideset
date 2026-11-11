import { RiMoreFill } from '@remixicon/react';
import { Avatar, cn, IconButton, StatusBadge, Table, Tag } from '@wideset/react';
import { type KeyboardEvent, useState } from 'react';

import type { MenuAction, MenuAnchor } from './customer-menu';
import { type Customer, HEALTH, PEOPLE, TAGS } from './data';
import { formatActivity, formatDateTime, formatUsd } from './format';

type CustomersTableProps = {
  rows: Customer[];
  /** The row whose menu is open: it keeps the hover fill, so the eye can find it. */
  menuFor?: string;
  onOpen: (customer: Customer) => void;
  onMenu: (customer: Customer, anchor: MenuAnchor) => void;
  /** A shortcut pressed on a focused row: the same action as the menu's row. */
  onAction: (customer: Customer, action: MenuAction) => void;
};

/** A box in viewport pixels, from an element. */
const boxOf = (element: Element) => {
  const { left, top, width, height } = element.getBoundingClientRect();
  return { x: left, y: top, width, height };
};

/**
 * The customers, one row each. A click opens the customer; the right button, Shift F10 or the
 * Menu key opens its actions where they were asked for, and the ⋯ at the end of the row opens the
 * same menu for anyone who does not know the other two. The rows are one tab stop: the arrows move
 * between them, and the menu's shortcuts work on the focused one.
 */
export function CustomersTable({ rows, menuFor, onOpen, onMenu, onAction }: CustomersTableProps) {
  const [focused, setFocused] = useState<string>();
  const tabStop = rows.some((row) => row.id === focused) ? focused : rows[0]?.id;

  const keyDown = (event: KeyboardEvent<HTMLTableRowElement>, customer: Customer) => {
    // Keys pressed on the ⋯ button are the button's own.
    if (event.target !== event.currentTarget) return;
    const row = event.currentTarget;
    const mod = event.metaKey || event.ctrlKey;
    const go = (to: Element | null | undefined) => {
      event.preventDefault();
      (to as HTMLElement | null)?.focus();
    };
    const run = (action: MenuAction) => {
      event.preventDefault();
      onAction(customer, action);
    };
    const key = event.key.toLowerCase();

    if (event.key === 'ArrowDown') go(row.nextElementSibling);
    else if (event.key === 'ArrowUp') go(row.previousElementSibling);
    else if (event.key === 'Home') go(row.parentElement?.firstElementChild);
    else if (event.key === 'End') go(row.parentElement?.lastElementChild);
    else if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
      event.preventDefault();
      onMenu(customer, { ...boxOf(row.cells[0]), align: 'start', origin: row });
    } else if (event.key === 'Enter') run(mod ? 'open-new-tab' : 'open');
    else if (mod && key === 'c' && !window.getSelection()?.toString()) run('copy-link');
    else if (mod && key === 'd') run('duplicate');
    else if (!mod && !event.altKey && key === 'e') run('archive');
    else if (event.key === 'Delete' || event.key === 'Backspace') run('delete');
  };

  return (
    // Narrower than its columns, the table scrolls sideways inside its own area.
    <div className="overflow-x-auto">
      <Table size="md" interactive className="min-w-[60rem] table-fixed">
        <Table.Head>
          <Table.Row>
            <Table.Header>Company</Table.Header>
            <Table.Header className="w-[11rem]">Owner</Table.Header>
            <Table.Header className="w-[8rem]">Health</Table.Header>
            <Table.Header className="w-[13rem]">Tags</Table.Header>
            <Table.Header align="right" className="w-[7rem]">
              MRR
            </Table.Header>
            <Table.Header className="w-[9.5rem]">Last activity</Table.Header>
            <Table.Header className="w-[3.5rem]">
              <span className="sr-only">Actions</span>
            </Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {rows.map((customer) => {
            const owner = PEOPLE[customer.owner];
            const health = HEALTH[customer.health];
            return (
              <Table.Row
                key={customer.id}
                data-customer={customer.id}
                tabIndex={customer.id === tabStop ? 0 : -1}
                onFocus={(event) => event.target === event.currentTarget && setFocused(customer.id)}
                onClick={() => onOpen(customer)}
                onContextMenu={(event) => {
                  event.preventDefault();
                  onMenu(customer, {
                    x: event.clientX,
                    y: event.clientY,
                    width: 0,
                    height: 0,
                    align: 'start',
                    origin: event.currentTarget,
                  });
                }}
                onKeyDown={(event) => keyDown(event, customer)}
                className={cn(
                  'focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default focus-visible:-outline-offset-2',
                  customer.id === menuFor && '[&>td]:bg-ws-dynamic-secondary-alpha-hover',
                )}
              >
                <Table.Cell>
                  <span className="text-ws-static-strong block truncate">{customer.name}</span>
                  <Table.CellDescription className="truncate">
                    {customer.domain}
                  </Table.CellDescription>
                </Table.Cell>
                <Table.Cell>
                  <div className="gap-ws-5 flex items-center">
                    <Avatar size="sm" initials={owner.initials} color={owner.color} />
                    <span className="truncate">{owner.name}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <StatusBadge size="sm" color={health.color}>
                    {health.label}
                  </StatusBadge>
                </Table.Cell>
                <Table.Cell>
                  <div className="gap-ws-3 flex flex-wrap">
                    {TAGS.filter((tag) => customer.tags.includes(tag.id)).map((tag) => (
                      <Tag key={tag.id} color="secondary" size="sm">
                        {tag.label}
                      </Tag>
                    ))}
                  </div>
                </Table.Cell>
                <Table.Cell align="right">
                  <span className="typography-number-sm tabular-nums">
                    {formatUsd(customer.mrr)}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <time
                    dateTime={customer.lastActivity}
                    title={formatDateTime(customer.lastActivity)}
                    className="text-ws-static-subtle"
                  >
                    {formatActivity(customer.lastActivity)}
                  </time>
                </Table.Cell>
                {/* The button is its own target: its clicks must not open the row. */}
                <Table.Cell align="right" onClick={(event) => event.stopPropagation()}>
                  <IconButton
                    icon={RiMoreFill}
                    size="xs"
                    variant="secondary"
                    preset="ghost"
                    aria-label={`Actions for ${customer.name}`}
                    aria-haspopup="menu"
                    aria-expanded={customer.id === menuFor}
                    onClick={(event) =>
                      onMenu(customer, {
                        ...boxOf(event.currentTarget),
                        align: 'end',
                        origin: event.currentTarget,
                      })
                    }
                  />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}
