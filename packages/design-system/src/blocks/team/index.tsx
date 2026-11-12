import { RiSearchLine } from '@remixicon/react';
import { Tabs, TextInput, Toast, ToastProvider, useToast } from '@wideset/react';
import { useState } from 'react';

import {
  account,
  type Invitation,
  invitations as initialInvitations,
  type Member,
  members as initialMembers,
  NOW,
  type Role,
  ROLE_LABEL,
  workspace,
} from './data';
import { InvitationsTable } from './invitations-table';
import { InviteModal } from './invite-modal';
import { MembersTable } from './members-table';
import { PageHeader } from './page-header';
import { RemoveMemberModal } from './remove-member-modal';
import { TeamSidebar } from './sidebar';

type Tab = 'members' | 'invitations';

const matches = (query: string, ...fields: string[]) =>
  fields.some((field) => field.toLowerCase().includes(query));

/** The page: header, the two tabs with one search over both, and the dialogs they open. */
function TeamPage() {
  const { showToast, dismissToast } = useToast();
  const [members, setMembers] = useState(initialMembers);
  const [invitations, setInvitations] = useState(initialInvitations);
  const [tab, setTab] = useState<Tab>('members');
  const [query, setQuery] = useState('');
  const [inviting, setInviting] = useState(false);
  const [removing, setRemoving] = useState<{ member?: Member; open: boolean }>({ open: false });

  const q = query.trim().toLowerCase();
  const shownMembers = members.filter((m) => matches(q, m.name, m.email));
  const shownInvitations = invitations.filter((i) => matches(q, i.email));
  const shown = tab === 'members' ? shownMembers.length : shownInvitations.length;
  const total = tab === 'members' ? members.length : invitations.length;

  const invite = (emails: string[], role: Invitation['role']) => {
    const sent = NOW.toISOString();
    setInvitations([
      ...emails.map((email) => ({ id: email, email, role, invitedBy: account.name, sent })),
      ...invitations,
    ]);
    setTab('invitations');
    setQuery('');
    showToast({
      status: 'success',
      content:
        emails.length === 1
          ? `Invitation sent to ${emails[0]}`
          : `${emails.length} invitations sent`,
    });
  };

  /** A role changed in the table or in the invite modal's list. */
  const changeRole = (member: Member, role: Role) => {
    setMembers(members.map((m) => (m.id === member.id ? { ...m, role } : m)));
    showToast({
      content: `${member.name} is now ${role === 'admin' ? 'an' : 'a'} ${ROLE_LABEL[role].toLowerCase()}`,
    });
  };

  const revoke = (invitation: Invitation) => {
    const before = invitations;
    setInvitations(invitations.filter((i) => i.id !== invitation.id));
    const id = showToast({
      content: `Invitation to ${invitation.email} revoked`,
      action: (
        <Toast.Action
          preset="ghost"
          onClick={() => {
            setInvitations(before);
            dismissToast(id);
          }}
        >
          Undo
        </Toast.Action>
      ),
    });
  };

  return (
    <main className="px-ws-16 min-w-0 flex-1 overflow-y-auto">
      <div className="gap-ws-14 py-ws-14 mx-auto flex w-full max-w-[80rem] flex-col">
        <PageHeader seatsUsed={members.length} onInvite={() => setInviting(true)} />

        <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)} className="gap-ws-9">
          <Tabs.List aria-label="People in the workspace" className="w-full">
            <Tabs.Item value="members">
              <Tabs.Label>Members</Tabs.Label>
            </Tabs.Item>
            <Tabs.Item value="invitations">
              <Tabs.Label>Invitations</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>

          <div className="gap-ws-5 flex items-center">
            <TextInput
              size="sm"
              className="w-[20rem] max-w-full"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            >
              <TextInput.Prefix inner>
                <TextInput.Icon icon={RiSearchLine} />
              </TextInput.Prefix>
              <TextInput.Input
                type="search"
                placeholder="Search by name or e-mail"
                aria-label="Search people"
              />
              <TextInput.Suffix inner>
                <TextInput.ClearButton />
              </TextInput.Suffix>
            </TextInput>
            <p
              role="status"
              className="typography-body-md text-ws-static-subtle ml-auto tabular-nums"
            >
              {q && `${shown} of ${total} ${tab}`}
            </p>
          </div>

          <Tabs.Content value="members">
            <MembersTable
              members={shownMembers}
              query={query.trim()}
              onClearSearch={() => setQuery('')}
              onRoleChange={changeRole}
              onCopyEmail={(member) => {
                void navigator.clipboard?.writeText(member.email).catch(() => {});
                showToast({ content: `Copied ${member.email}` });
              }}
              onRemind={(member) =>
                showToast({ content: `Two-factor reminder sent to ${member.name}` })
              }
              onRemove={(member) => setRemoving({ member, open: true })}
            />
          </Tabs.Content>
          <Tabs.Content value="invitations">
            <InvitationsTable
              invitations={shownInvitations}
              query={query.trim()}
              onClearSearch={() => setQuery('')}
              onInvite={() => setInviting(true)}
              onResend={(invitation) => {
                setInvitations(
                  invitations.map((i) =>
                    i.id === invitation.id ? { ...i, sent: NOW.toISOString() } : i,
                  ),
                );
                showToast({
                  status: 'success',
                  content: `Invitation sent again to ${invitation.email}`,
                });
              }}
              onRevoke={revoke}
            />
          </Tabs.Content>
        </Tabs>
      </div>

      <InviteModal
        open={inviting}
        onOpenChange={setInviting}
        members={members}
        taken={[...members.map((m) => m.email), ...invitations.map((i) => i.email)]}
        onInvite={invite}
        onRoleChange={changeRole}
      />
      <RemoveMemberModal
        member={removing.member}
        open={removing.open}
        onOpenChange={(open) => setRemoving({ ...removing, open })}
        onRemove={(member) => {
          setMembers(members.filter((m) => m.id !== member.id));
          showToast({ content: `${member.name} removed from ${workspace.name}` });
        }}
      />
    </main>
  );
}

/** Team (Frame direction): the people in a workspace, their roles and pending invitations. */
export default function Team() {
  return (
    <ToastProvider position="bottom-center">
      <div className="bg-ws-static-foreground flex h-dvh">
        <TeamSidebar />
        <TeamPage />
      </div>
    </ToastProvider>
  );
}
