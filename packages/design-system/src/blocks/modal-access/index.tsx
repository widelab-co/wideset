import { Button } from '@wideset/react';
import { useState } from 'react';

import { AccessModal } from './access-modal';
import { link, people as initialPeople, roles } from './data';

/** Access modal: sharing a project, here over an empty page that reopens it. */
export default function ModalAccessBlock() {
  const [open, setOpen] = useState(true);
  const [people, setPeople] = useState(initialPeople);
  const [isPrivate, setPrivate] = useState(false);

  return (
    <div className="bg-ws-static-foreground flex h-dvh items-center justify-center">
      <Button variant="secondary" preset="border" onClick={() => setOpen(true)}>
        Manage access
      </Button>
      <AccessModal
        open={open}
        onOpenChange={setOpen}
        people={people}
        roles={roles}
        defaultRole="view"
        isPrivate={isPrivate}
        onPrivateChange={setPrivate}
        link={link}
        onInvite={(emails, role) =>
          setPeople([...people, ...emails.map((email) => ({ id: email, email, role }))])
        }
        onRoleChange={(person, role) =>
          setPeople(people.map((p) => (p.id === person.id ? { ...p, role } : p)))
        }
      />
    </div>
  );
}
