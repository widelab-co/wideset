import { useToast } from '@wideset/react';
import { useEffect, useId, useRef, useState } from 'react';

import { TextLink } from './auth-card';
import {
  type Invitation,
  INVITATIONS,
  LAST_USED,
  ROUTES,
  SIGNED_IN_AS,
  type Workspace,
  WORKSPACES,
} from './data';
import { InvitationList } from './invitation-list';
import { WorkspaceList } from './workspace-list';

/**
 * Choosing where to go after signing in to an account in several workspaces: the workspaces, the
 * last used first and marked; invitations waiting, as their own group; and creating a workspace as
 * a quiet link at the end. There is no filled button: each tile is the action. Choosing one shows
 * it busy for a moment while it opens; accepting an invitation moves it into the workspaces and
 * focus with it. Nothing here talks to a server.
 */
export function WorkspacePicker() {
  const id = useId();
  const title = useRef<HTMLHeadingElement>(null);
  const { showToast } = useToast();
  const [workspaces, setWorkspaces] = useState(WORKSPACES);
  const [invitations, setInvitations] = useState(INVITATIONS);
  const [busy, setBusy] = useState<string>();
  const [joined, setJoined] = useState<string>();
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  // The accepted invitation becomes a tile on the next render: focus follows it there.
  useEffect(() => {
    if (joined) document.getElementById(`${id}-${joined}`)?.focus();
  }, [id, joined]);

  const choose = (workspace: Workspace) => {
    if (busy) return;
    setBusy(workspace.id);
    // Open the workspace here.
    timer.current = window.setTimeout(
      () => window.location.assign(ROUTES.workspace(workspace.id)),
      900,
    );
  };

  const accept = (invitation: Invitation) => {
    // Accept the invitation here.
    setInvitations((all) => all.filter((other) => other.id !== invitation.id));
    setWorkspaces((all) => [...all, invitation]);
    setJoined(invitation.id);
    showToast({ content: `You joined ${invitation.name}`, status: 'success' });
  };

  const decline = (invitation: Invitation) => {
    // Decline the invitation here.
    setInvitations((all) => all.filter((other) => other.id !== invitation.id));
    title.current?.focus();
    showToast({ content: `You declined the invitation to ${invitation.name}` });
  };

  return (
    <section aria-labelledby={`${id}-title`} className="gap-ws-12 flex w-full flex-col">
      <div className="gap-ws-5 mb-ws-5 flex flex-col">
        <h1
          ref={title}
          id={`${id}-title`}
          tabIndex={-1}
          className="typography-subtitle-lg text-ws-static-strong outline-none"
        >
          Choose a workspace
        </h1>
        <p className="typography-body-md text-ws-static-base">
          You’re signed in as <span className="text-ws-static-strong">{SIGNED_IN_AS}</span>.
        </p>
      </div>
      <WorkspaceList
        idPrefix={`${id}-`}
        workspaces={workspaces}
        lastUsed={LAST_USED}
        busy={busy}
        onChoose={choose}
      />
      {invitations.length > 0 && (
        <InvitationList invitations={invitations} onAccept={accept} onDecline={decline} />
      )}
      <p className="typography-body-md text-ws-static-subtle">
        Starting something new?{' '}
        <TextLink href={ROUTES.createWorkspace} className="whitespace-nowrap">
          Create a workspace
        </TextLink>
      </p>
    </section>
  );
}
