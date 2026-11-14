import { RiCheckLine, RiFileCopyLine } from '@remixicon/react';
import { Divider, IconButton, Modal } from '@wideset/react';
import { useEffect, useState } from 'react';

import { AccessList } from './access-list';
import {
  account,
  type Invitation,
  type Member,
  type Role,
  ROLE_HINT,
  ROLE_LABEL,
  ROLE_OPTIONS,
  workspace,
} from './data';
import { InviteForm } from './invite-form';
import type { RoleOption } from './role-menu';

type InviteRole = Invitation['role'];

/** The roles a person can be invited with, each with what it may do. */
const INVITE_ROLES: RoleOption<InviteRole>[] = ROLE_OPTIONS.map((option) => ({
  ...option,
  hint: ROLE_HINT[option.value],
}));

/** Every role. Ownership is transferred, never given: it shows only on the owner. */
const ROLES: RoleOption<Role>[] = [
  { value: 'owner', label: ROLE_LABEL.owner, fixed: true },
  ...INVITE_ROLES,
];

/**
 * Figma's Modal `Type=Share` on the workspace: inviting by e-mail with a role, the members and
 * their roles, and the link to pass on in the footer. Sending closes it, since the invitation
 * shows on the Invitations tab behind it; a role changed here applies at once, as in the table.
 */
export function InviteModal({
  open,
  onOpenChange,
  members,
  taken,
  onInvite,
  onRoleChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: Member[];
  /** Addresses already in the workspace or invited. */
  taken: string[];
  onInvite: (emails: string[], role: InviteRole) => void;
  onRoleChange: (member: Member, role: Role) => void;
}) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      {/* The e-mail field takes the focus on open (Modal's default): inviting comes first. */}
      <Modal.Content aria-describedby={undefined}>
        <Modal.Header>
          <Modal.Title>Access</Modal.Title>
        </Modal.Header>
        <Modal.Body className="gap-ws-11 flex flex-col">
          <InviteForm
            roles={INVITE_ROLES}
            defaultRole="member"
            taken={taken}
            onInvite={(emails, role) => {
              onInvite(emails, role);
              onOpenChange(false);
            }}
          />
          <Divider weight="thin" />
          <AccessList
            people={members.map((member) => ({
              ...member,
              name: member.id === account.id ? `${member.name} (you)` : member.name,
            }))}
            roles={ROLES}
            onRoleChange={(person, role) => {
              const member = members.find((m) => m.id === person.id);
              if (member) onRoleChange(member, role);
            }}
          />
        </Modal.Body>
        {/* Figma lines this footer off; Modal.Footer's `extension` has no line of its own. */}
        <Divider weight="thin" />
        <Modal.Footer variant="extension" className="items-center justify-start">
          <ShareLink link={workspace.inviteLink} />
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

/** The link to pass on: the button copies it and says so for two seconds. */
function ShareLink({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <>
      <IconButton
        size="xs"
        variant="secondary"
        preset="border"
        icon={copied ? RiCheckLine : RiFileCopyLine}
        aria-label="Copy link"
        onClick={() => {
          void navigator.clipboard?.writeText(`https://${link}`).catch(() => {});
          setCopied(true);
        }}
      />
      <span role="status" className="typography-body-md text-ws-static-subtle">
        {copied ? 'Link copied' : link}
      </span>
    </>
  );
}
