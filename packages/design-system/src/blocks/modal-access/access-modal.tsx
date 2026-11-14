import { RiCheckLine, RiFileCopyLine } from '@remixicon/react';
import { Divider, IconButton, Modal, Tile } from '@wideset/react';
import { useEffect, useState } from 'react';

import { AccessList, type AccessPerson } from './access-list';
import { InviteForm } from './invite-form';
import type { RoleOption } from './role-menu';

type AccessModalProps<Role extends string> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  people: AccessPerson<Role>[];
  /** Every role; a `fixed` one (the owner's) cannot be given. */
  roles: RoleOption<Role>[];
  /** The role the invite field starts on. */
  defaultRole: Role;
  isPrivate: boolean;
  onPrivateChange: (isPrivate: boolean) => void;
  /** The address people join by, without the scheme. */
  link: string;
  onInvite: (emails: string[], role: Role) => void;
  onRoleChange: (person: AccessPerson<Role>, role: Role) => void;
};

/**
 * Figma's Modal `Type=Share`: who can open a project. Inviting comes first, then who has access
 * and their roles, then the one setting; the link to pass on sits in the footer. Every change
 * applies at once, so there is nothing to confirm and the X (or Esc) is the way out.
 */
export function AccessModal<Role extends string>({
  open,
  onOpenChange,
  people,
  roles,
  defaultRole,
  isPrivate,
  onPrivateChange,
  link,
  onInvite,
  onRoleChange,
}: AccessModalProps<Role>) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      {/* The e-mail field takes the focus on open (Modal's default): inviting comes first. */}
      <Modal.Content aria-describedby={undefined}>
        <Modal.Header>
          <Modal.Title>Access</Modal.Title>
        </Modal.Header>
        <Modal.Body className="gap-ws-11 flex flex-col">
          <InviteForm
            roles={roles.filter((role) => !role.fixed)}
            defaultRole={defaultRole}
            taken={people.map((person) => person.email)}
            onInvite={onInvite}
          />
          <Divider weight="thin" />
          <AccessList people={people} roles={roles} onRoleChange={onRoleChange} />
          {/* Figma's Select Tile with a switch: the whole tile is the control. */}
          <Tile.Checkbox
            title="Private project"
            description="This option will disable view access to everyone external"
            checked={isPrivate}
            onCheckedChange={onPrivateChange}
          >
            <Tile.Indicator />
          </Tile.Checkbox>
        </Modal.Body>
        {/* Figma lines this footer off; Modal.Footer's `extension` has no line of its own. */}
        <Divider weight="thin" />
        <Modal.Footer variant="extension" className="items-center justify-start">
          <ShareLink link={link} />
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
