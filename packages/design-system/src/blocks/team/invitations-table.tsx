import { RiMoreLine } from '@remixicon/react';
import {
  Avatar,
  Button,
  DropdownMenu,
  IconButton,
  ListItem,
  StatusBadge,
  Table,
} from '@wideset/react';

import { account, type Invitation, ROLE_LABEL } from './data';
import { EmptyState } from './empty-state';
import { daysToExpiry, formatDateTime, formatExpiry, formatRelative } from './format';

const COLUMNS = 6;

/**
 * Invitations nobody has accepted yet: who, as what, from whom and when, and whether the link
 * still works. Its columns match the members table, so switching tabs moves nothing.
 */
export function InvitationsTable({
  invitations,
  query,
  onClearSearch,
  onInvite,
  onResend,
  onRevoke,
}: {
  invitations: Invitation[];
  query: string;
  onClearSearch: () => void;
  onInvite: () => void;
  onResend: (invitation: Invitation) => void;
  onRevoke: (invitation: Invitation) => void;
}) {
  return (
    <Table size="md" className="min-w-[56rem] table-fixed">
      <Table.Head>
        <Table.Row>
          <Table.Header flushMargin>E-mail</Table.Header>
          <Table.Header className="w-[10rem]">Role</Table.Header>
          <Table.Header className="w-[14rem]">Invited by</Table.Header>
          <Table.Header className="w-[10rem]">Sent</Table.Header>
          <Table.Header className="w-[10rem]">Status</Table.Header>
          <Table.Header flushMargin className="w-ws-12">
            <span className="sr-only">Actions</span>
          </Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {invitations.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={COLUMNS}>
              {query ? (
                <EmptyState
                  title={`No invitations match “${query}”`}
                  description="Search looks at e-mail addresses."
                  action={
                    <Button size="sm" variant="secondary" preset="border" onClick={onClearSearch}>
                      Clear search
                    </Button>
                  }
                />
              ) : (
                <EmptyState
                  title="No pending invitations"
                  description="People you invite show here until they join."
                  action={
                    <Button size="sm" variant="secondary" preset="border" onClick={onInvite}>
                      Invite people
                    </Button>
                  }
                />
              )}
            </Table.Cell>
          </Table.Row>
        ) : (
          invitations.map((invitation) => {
            const days = daysToExpiry(invitation.sent);
            return (
              <Table.Row key={invitation.id}>
                <Table.Cell flushMargin>
                  <div className="gap-ws-7 flex items-center">
                    <Avatar aria-hidden="true" />
                    <p className="text-ws-static-strong min-w-0 truncate">{invitation.email}</p>
                  </div>
                </Table.Cell>
                <Table.Cell>{ROLE_LABEL[invitation.role]}</Table.Cell>
                <Table.Cell truncate>
                  {invitation.invitedBy === account.name ? 'You' : invitation.invitedBy}
                </Table.Cell>
                <Table.Cell title={formatDateTime(invitation.sent)}>
                  {formatRelative(invitation.sent)}
                </Table.Cell>
                <Table.Cell>
                  {days > 0 ? (
                    <span className="text-ws-static-subtle">{formatExpiry(days)}</span>
                  ) : (
                    <StatusBadge size="sm" color="notice">
                      Expired
                    </StatusBadge>
                  )}
                </Table.Cell>
                <Table.Cell align="right" flushMargin>
                  <DropdownMenu>
                    <DropdownMenu.Trigger asChild>
                      <IconButton
                        icon={RiMoreLine}
                        variant="secondary"
                        preset="ghost"
                        size="xs"
                        aria-label={`Actions for ${invitation.email}`}
                      />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content align="end" className="w-[14rem]">
                      <DropdownMenu.Item onSelect={() => onResend(invitation)}>
                        <ListItem.Content>
                          <ListItem.Label>Resend invitation</ListItem.Label>
                        </ListItem.Content>
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator />
                      <DropdownMenu.Item variant="danger" onSelect={() => onRevoke(invitation)}>
                        <ListItem.Content>
                          <ListItem.Label>Revoke invitation</ListItem.Label>
                        </ListItem.Content>
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu>
                </Table.Cell>
              </Table.Row>
            );
          })
        )}
      </Table.Body>
    </Table>
  );
}
