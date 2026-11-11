import { RiArrowDownSLine } from '@remixicon/react';
import {
  Avatar,
  Button,
  Checkbox,
  DropdownMenu,
  ListItem,
  SplitButton,
  Table,
} from '@wideset/react';

import { ApprovePopup } from './approve-popup';
import type { AccessRequest, Role } from './data';
import { EmptyState } from './empty-state';
import { formatDateTime, formatRelative } from './format';

const COLUMNS = 5;

/**
 * The people waiting to get in: who they are, what they say about themselves and how they
 * came, and when. A click on a row selects it for the selection bar; the row's own buttons
 * answer just that one request. Approve asks for the role first; Decline declines at once and
 * keeps blocking behind its arrow, since it needs a dialog.
 */
export function RequestsTable({
  rows,
  seatsUsed,
  selected,
  onSelectedChange,
  onApprove,
  onDecline,
  onBlock,
}: {
  rows: AccessRequest[];
  seatsUsed: number;
  selected: string[];
  onSelectedChange: (ids: string[]) => void;
  onApprove: (ids: string[], role: Role) => void;
  onDecline: (ids: string[]) => void;
  onBlock: (request: AccessRequest) => void;
}) {
  const picked = rows.filter((row) => selected.includes(row.id)).length;
  const toggle = (id: string) =>
    onSelectedChange(
      selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id],
    );

  return (
    <Table
      size="md"
      selectionMode={rows.length > 0 ? 'multiple' : undefined}
      className="min-w-[60rem] table-fixed"
    >
      <Table.Head>
        <Table.Row>
          <Table.Header className="w-[3.25rem]">
            <Checkbox
              aria-label="Select all requests"
              disabled={rows.length === 0}
              checked={picked === 0 ? false : picked === rows.length ? true : 'indeterminate'}
              onCheckedChange={(checked) =>
                onSelectedChange(checked === true ? rows.map((row) => row.id) : [])
              }
            />
          </Table.Header>
          <Table.Header className="w-[18rem]">Person</Table.Header>
          <Table.Header>Request</Table.Header>
          <Table.Header className="w-[9rem]">Requested</Table.Header>
          <Table.Header className="w-[13.5rem]">
            <span className="sr-only">Actions</span>
          </Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {rows.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={COLUMNS} className="py-ws-16">
              <EmptyState
                title="No requests to review"
                description="People who sign up with a lumenstudio.co e-mail or come through a teammate’s invite link wait here for an admin."
              />
            </Table.Cell>
          </Table.Row>
        ) : (
          rows.map((request) => {
            const isSelected = selected.includes(request.id);
            return (
              <Table.Row key={request.id} selected={isSelected} onClick={() => toggle(request.id)}>
                <Table.Cell>
                  <Checkbox checked={isSelected} aria-label={`Select ${request.name}`} />
                </Table.Cell>
                <Table.Cell>
                  <div className="gap-ws-7 flex items-center">
                    <Avatar initials={request.initials} aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-ws-static-strong truncate">{request.name}</p>
                      <Table.CellDescription className="truncate">
                        {request.email}
                      </Table.CellDescription>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <p className="truncate">{request.note}</p>
                  <Table.CellDescription className="truncate">
                    {request.source}
                  </Table.CellDescription>
                </Table.Cell>
                <Table.Cell>
                  <time dateTime={request.requested} title={formatDateTime(request.requested)}>
                    {formatRelative(request.requested)}
                  </time>
                </Table.Cell>
                {/* The row's buttons answer this request only; they do not select it. */}
                <Table.Cell align="right" onClick={(event) => event.stopPropagation()}>
                  <div className="gap-ws-5 flex justify-end">
                    <ApprovePopup
                      title={`Approve ${request.name}`}
                      count={1}
                      seatsUsed={seatsUsed}
                      onApprove={(role) => onApprove([request.id], role)}
                    >
                      <Button size="sm" variant="secondary" preset="border">
                        Approve
                      </Button>
                    </ApprovePopup>
                    <SplitButton
                      size="sm"
                      variant="secondary"
                      preset="border"
                      icon={RiArrowDownSLine}
                      iconAriaLabel={`More ways to decline ${request.name}`}
                      onClick={() => onDecline([request.id])}
                      menuContent={
                        <DropdownMenu.Item variant="danger" onSelect={() => onBlock(request)}>
                          <ListItem.Content>
                            <ListItem.Label>Decline and block</ListItem.Label>
                          </ListItem.Content>
                        </DropdownMenu.Item>
                      }
                    >
                      Decline
                    </SplitButton>
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })
        )}
      </Table.Body>
    </Table>
  );
}
