import { Avatar, Button, StatusBadge, Table } from '@wideset/react';

import { account, type Invitation, roleLabel } from './data';
import { EmptyState } from './empty-state';
import { formatDateTime, formatRelative, isExpired } from './format';

const COLUMNS = 6;

/**
 * Invitations nobody has accepted yet: to whom, as what, from whom and when, and whether the
 * link still works. Pending is a plain state; Expired needs someone to act, so it takes the
 * notice colour. Resend starts the seven days again; Revoke can be undone from its toast.
 */
export function InvitationsTable({
  rows,
  onInvite,
  onResend,
  onRevoke,
}: {
  rows: Invitation[];
  onInvite: () => void;
  onResend: (invitation: Invitation) => void;
  onRevoke: (invitation: Invitation) => void;
}) {
  return (
    <Table size="md" className="min-w-[60rem] table-fixed">
      <Table.Head>
        <Table.Row>
          <Table.Header>E-mail</Table.Header>
          <Table.Header className="w-[8rem]">Role</Table.Header>
          <Table.Header className="w-[11rem]">Invited by</Table.Header>
          <Table.Header className="w-[9rem]">Sent</Table.Header>
          <Table.Header className="w-[8rem]">Status</Table.Header>
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
                title="No pending invitations"
                description="Invitations you send wait here until someone accepts or you revoke them. Each link works for 7 days and can be sent again."
              >
                <Button size="sm" variant="secondary" preset="border" onClick={onInvite}>
                  Invite people
                </Button>
              </EmptyState>
            </Table.Cell>
          </Table.Row>
        ) : (
          rows.map((invitation) => {
            const expired = isExpired(invitation.sent);
            return (
              <Table.Row key={invitation.id}>
                <Table.Cell>
                  <div className="gap-ws-7 flex items-center">
                    <Avatar aria-hidden="true" />
                    <p className="text-ws-static-strong min-w-0 truncate">{invitation.email}</p>
                  </div>
                </Table.Cell>
                <Table.Cell>{roleLabel(invitation.role)}</Table.Cell>
                <Table.Cell truncate>
                  {invitation.invitedBy === account.name ? 'You' : invitation.invitedBy}
                </Table.Cell>
                <Table.Cell>
                  <time dateTime={invitation.sent} title={formatDateTime(invitation.sent)}>
                    {formatRelative(invitation.sent)}
                  </time>
                </Table.Cell>
                <Table.Cell>
                  <StatusBadge size="sm" color={expired ? 'notice' : 'neutral'}>
                    {expired ? 'Expired' : 'Pending'}
                  </StatusBadge>
                </Table.Cell>
                <Table.Cell align="right">
                  <div className="gap-ws-5 flex justify-end">
                    <Button
                      size="sm"
                      variant="secondary"
                      preset="border"
                      aria-label={`Resend the invitation to ${invitation.email}`}
                      onClick={() => onResend(invitation)}
                    >
                      Resend
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      preset="ghost"
                      aria-label={`Revoke the invitation to ${invitation.email}`}
                      onClick={() => onRevoke(invitation)}
                    >
                      Revoke
                    </Button>
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
