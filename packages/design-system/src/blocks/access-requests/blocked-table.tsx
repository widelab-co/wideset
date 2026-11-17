import { Avatar, Button, Table } from '@wideset/react';

import { account, type BlockedPerson } from './data';
import { EmptyState } from './empty-state';
import { formatDateTime, formatRelative } from './format';

const COLUMNS = 4;

/**
 * Who may not get in: the person, why (as the admin who blocked them put it), and by whom and
 * when, one under the other.
 * Unblocking lets them ask to join again and can be undone from its toast.
 */
export function BlockedTable({
  rows,
  onUnblock,
}: {
  rows: BlockedPerson[];
  onUnblock: (person: BlockedPerson) => void;
}) {
  return (
    <Table size="md" className="min-w-[60rem] table-fixed">
      <Table.Head>
        <Table.Row>
          <Table.Header className="w-[21.25rem]">Person</Table.Header>
          <Table.Header>Reason</Table.Header>
          <Table.Header className="w-[13rem]">Blocked by</Table.Header>
          <Table.Header className="w-[8rem]">
            <span className="sr-only">Actions</span>
          </Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {rows.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={COLUMNS} className="py-ws-16">
              <EmptyState
                title="Nobody is blocked"
                description="People you block from a request show here, with who blocked them and why. They cannot ask to join or be invited until someone unblocks them."
              />
            </Table.Cell>
          </Table.Row>
        ) : (
          rows.map((person) => (
            <Table.Row key={person.id}>
              <Table.Cell>
                <div className="gap-ws-7 flex items-center">
                  <Avatar initials={person.initials} aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-ws-static-strong truncate">{person.name}</p>
                    <Table.CellDescription className="truncate">
                      {person.email}
                    </Table.CellDescription>
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell truncate>
                {person.reason || <span className="text-ws-static-subtle">No reason given</span>}
              </Table.Cell>
              <Table.Cell>
                <p className="truncate">
                  {person.blockedBy === account.name ? 'You' : person.blockedBy}
                </p>
                <Table.CellDescription>
                  <time dateTime={person.blocked} title={formatDateTime(person.blocked)}>
                    {formatRelative(person.blocked)}
                  </time>
                </Table.CellDescription>
              </Table.Cell>
              <Table.Cell align="right">
                <Button
                  size="sm"
                  variant="secondary"
                  preset="border"
                  aria-label={`Unblock ${person.name}`}
                  onClick={() => onUnblock(person)}
                >
                  Unblock
                </Button>
              </Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table>
  );
}
