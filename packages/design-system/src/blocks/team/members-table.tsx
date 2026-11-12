// TODO(custom): inline ghost Select pulled left (-ml-ws-7) to line up with its column.
import { RiMoreLine } from '@remixicon/react';
import {
  Button,
  DropdownMenu,
  IconButton,
  ListItem,
  Select,
  StatusBadge,
  Table,
} from '@wideset/react';

import { account, type Member, type Role, ROLE_LABEL, ROLE_OPTIONS } from './data';
import { EmptyState } from './empty-state';
import { formatDateTime, formatRelative } from './format';
import { PersonAvatar } from './person-avatar';

const COLUMNS = 6;

function MemberMenu({
  member,
  onCopyEmail,
  onRemind,
  onRemove,
}: {
  member: Member;
  onCopyEmail: () => void;
  onRemind: () => void;
  onRemove: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton
          icon={RiMoreLine}
          variant="secondary"
          preset="ghost"
          size="xs"
          aria-label={`Actions for ${member.name}`}
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="w-[14rem]">
        <DropdownMenu.Item onSelect={onCopyEmail}>
          <ListItem.Content>
            <ListItem.Label>Copy e-mail address</ListItem.Label>
          </ListItem.Content>
        </DropdownMenu.Item>
        {!member.twoFactor && (
          <DropdownMenu.Item onSelect={onRemind}>
            <ListItem.Content>
              <ListItem.Label>Send two-factor reminder</ListItem.Label>
            </ListItem.Content>
          </DropdownMenu.Item>
        )}
        <DropdownMenu.Separator />
        <DropdownMenu.Item variant="danger" onSelect={onRemove}>
          <ListItem.Content>
            <ListItem.Label>Remove from workspace</ListItem.Label>
          </ListItem.Content>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}

/**
 * The workspace's members: who they are, their role (changed in place, except the owner's),
 * teams, when they were last in, whether two-factor is on, and their actions.
 */
export function MembersTable({
  members,
  query,
  onClearSearch,
  onRoleChange,
  onCopyEmail,
  onRemind,
  onRemove,
}: {
  members: Member[];
  query: string;
  onClearSearch: () => void;
  onRoleChange: (member: Member, role: Role) => void;
  onCopyEmail: (member: Member) => void;
  onRemind: (member: Member) => void;
  onRemove: (member: Member) => void;
}) {
  return (
    <Table size="md" className="min-w-[56rem] table-fixed">
      <Table.Head>
        <Table.Row>
          <Table.Header flushMargin>Member</Table.Header>
          <Table.Header className="w-[10rem]">Role</Table.Header>
          <Table.Header className="w-[14rem]">Teams</Table.Header>
          <Table.Header className="w-[10rem]">Last active</Table.Header>
          <Table.Header className="w-[10rem]">Two-factor</Table.Header>
          <Table.Header flushMargin className="w-ws-12">
            <span className="sr-only">Actions</span>
          </Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {members.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={COLUMNS}>
              <EmptyState
                title={`No members match “${query}”`}
                description="Search looks at names and e-mail addresses."
                action={
                  <Button size="sm" variant="secondary" preset="border" onClick={onClearSearch}>
                    Clear search
                  </Button>
                }
              />
            </Table.Cell>
          </Table.Row>
        ) : (
          members.map((member) => (
            <Table.Row key={member.id}>
              <Table.Cell flushMargin>
                <div className="gap-ws-7 flex items-center">
                  <PersonAvatar name={member.name} initials={member.initials} aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-ws-static-strong truncate">
                      {member.name}
                      {member.id === account.id && (
                        <span className="text-ws-static-subtle"> (you)</span>
                      )}
                    </p>
                    <Table.CellDescription className="truncate">
                      {member.email}
                    </Table.CellDescription>
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell>
                {member.role === 'owner' ? (
                  <span className="text-ws-static-strong">{ROLE_LABEL.owner}</span>
                ) : (
                  // Ghost reads as a value; pulled left so its text starts on the column's edge.
                  <Select
                    size="sm"
                    preset="ghost"
                    className="-ml-ws-7 w-[8rem]"
                    aria-label={`Role of ${member.name}`}
                    options={ROLE_OPTIONS}
                    value={member.role}
                    onValueChange={(role) => onRoleChange(member, role as Role)}
                  />
                )}
              </Table.Cell>
              <Table.Cell truncate>{member.teams.join(', ')}</Table.Cell>
              <Table.Cell title={formatDateTime(member.lastActive)}>
                {formatRelative(member.lastActive)}
              </Table.Cell>
              <Table.Cell>
                {member.twoFactor ? (
                  'On'
                ) : (
                  <StatusBadge size="sm" color="notice">
                    Off
                  </StatusBadge>
                )}
              </Table.Cell>
              <Table.Cell align="right" flushMargin>
                {member.role !== 'owner' && (
                  <MemberMenu
                    member={member}
                    onCopyEmail={() => onCopyEmail(member)}
                    onRemind={() => onRemind(member)}
                    onRemove={() => onRemove(member)}
                  />
                )}
              </Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table>
  );
}
