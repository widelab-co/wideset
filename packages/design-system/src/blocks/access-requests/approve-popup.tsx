import { Button, FormField, Popup, Select } from '@wideset/react';
import { type ReactNode, useId, useState } from 'react';

import { type Role, ROLES, workspace } from './data';

/**
 * Letting people in. The role comes first, so Approve opens this small panel on its button
 * instead of approving at once: the role (Member unless changed, with what it may do under it),
 * what it costs in seats, then Approve. The row and the selection bar open the same panel.
 */
export function ApprovePopup({
  title,
  count,
  seatsUsed,
  side = 'bottom',
  onApprove,
  children,
}: {
  /** Who is let in: "Approve Aiko Tanaka", "Approve 3 people". */
  title: string;
  /** How many people the approval lets in. */
  count: number;
  /** Seats taken before this approval. */
  seatsUsed: number;
  side?: 'top' | 'bottom';
  onApprove: (role: Role) => void;
  /** The button that opens it. */
  children: ReactNode;
}) {
  const roleId = useId();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<Role>('member');
  const hint = ROLES.find((option) => option.value === role)!.hint;
  const after = seatsUsed + count;

  return (
    <Popup
      open={open}
      onOpenChange={(next) => {
        // Every opening starts from the default role.
        if (next) setRole('member');
        setOpen(next);
      }}
    >
      <Popup.Trigger asChild>{children}</Popup.Trigger>
      <Popup.Container side={side} align="end" className="w-[22rem]">
        <Popup.Header>
          <Popup.Title>{title}</Popup.Title>
        </Popup.Header>
        <Popup.Content contentClassName="gap-ws-9 flex flex-col">
          <FormField label="Role" htmlFor={roleId} helperText={hint}>
            <Select
              id={roleId}
              size="sm"
              className="w-full"
              options={ROLES}
              value={role}
              onValueChange={(value) => setRole(value as Role)}
            />
          </FormField>
          <Popup.Description className="tabular-nums">
            {count === 1 ? 'Takes a seat' : `Takes ${count} seats`}: {after} of {workspace.seats} in
            use after this.
          </Popup.Description>
        </Popup.Content>
        <Popup.Footer>
          <Popup.Close asChild>
            <Button size="sm" variant="secondary" preset="border">
              Cancel
            </Button>
          </Popup.Close>
          <Button
            size="sm"
            onClick={() => {
              setOpen(false);
              onApprove(role);
            }}
          >
            Approve
          </Button>
        </Popup.Footer>
      </Popup.Container>
    </Popup>
  );
}
