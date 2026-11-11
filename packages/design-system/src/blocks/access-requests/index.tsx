import { RiSideBarLine } from '@remixicon/react';
import { Breadcrumbs, cn, IconButton, Tabs, Toast, ToastProvider, useToast } from '@wideset/react';
import { useId, useState } from 'react';

import { BlockDialog } from './block-dialog';
import { BlockedTable } from './blocked-table';
import {
  type AccessRequest,
  account,
  blocked as initialBlocked,
  invitations as initialInvitations,
  NOW,
  requests as initialRequests,
  type Role,
  roleLabel,
  workspace,
} from './data';
import { InvitationsTable } from './invitations-table';
import { InviteDialog } from './invite-dialog';
import { PageHeader } from './page-header';
import { RequestsTable } from './requests-table';
import { SelectionBar } from './selection-bar';
import { AccessSidebar } from './sidebar';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';

type Tab = 'requests' | 'invitations' | 'blocked';

/** "a member", "an admin"; several people take the plural. */
const asRole = (role: Role, count: number) => {
  const label = roleLabel(role).toLowerCase();
  if (count > 1) return `${label}s`;
  return `${role === 'admin' ? 'an' : 'a'} ${label}`;
};

/**
 * The page inside the card, under the toasts: it holds the three lists and the seats taken, so
 * every answer moves a person out of a list and says so in a toast with Undo.
 */
function AccessPage() {
  const { showToast, dismissToast } = useToast();
  const [tab, setTab] = useState<Tab>('requests');
  const [requests, setRequests] = useState(initialRequests);
  const [invitations, setInvitations] = useState(initialInvitations);
  const [blocked, setBlocked] = useState(initialBlocked);
  const [seatsUsed, setSeatsUsed] = useState(workspace.members);
  const [selected, setSelected] = useState<string[]>([]);
  const [inviting, setInviting] = useState(false);
  // The person stays while the dialog closes, so its words do not vanish under the fade.
  const [blocking, setBlocking] = useState<{ person: AccessRequest; open: boolean }>();

  /** A toast whose Undo puts back what the action changed. */
  const toastWithUndo = (content: string, undo: () => void) => {
    const id = showToast({
      content,
      action: (
        <Toast.Action
          preset="ghost"
          onClick={() => {
            undo();
            dismissToast(id);
          }}
        >
          Undo
        </Toast.Action>
      ),
    });
  };

  /** Takes requests out of the list (and the selection); returns how to put them back. */
  const remove = (ids: string[]) => {
    const before = requests;
    setRequests(requests.filter((request) => !ids.includes(request.id)));
    setSelected(selected.filter((id) => !ids.includes(id)));
    return {
      gone: before.filter((request) => ids.includes(request.id)),
      restore: () => setRequests(before),
    };
  };

  const approve = (ids: string[], role: Role) => {
    const { gone, restore } = remove(ids);
    const seats = seatsUsed;
    setSeatsUsed(seats + gone.length);
    const who = gone.length === 1 ? gone[0].name : `${gone.length} people`;
    toastWithUndo(`${who} joined as ${asRole(role, gone.length)}`, () => {
      restore();
      setSeatsUsed(seats);
    });
  };

  const decline = (ids: string[]) => {
    const { gone, restore } = remove(ids);
    toastWithUndo(
      gone.length === 1
        ? `Request from ${gone[0].name} declined`
        : `${gone.length} requests declined`,
      restore,
    );
  };

  const block = (person: AccessRequest, reason: string) => {
    const { restore } = remove([person.id]);
    const before = blocked;
    const { id, name, initials, email } = person;
    setBlocked([
      { id, name, initials, email, reason, blockedBy: account.name, blocked: NOW.toISOString() },
      ...before,
    ]);
    toastWithUndo(`${name} declined and blocked`, () => {
      restore();
      setBlocked(before);
    });
  };

  return (
    <div className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-16 flex flex-col')}>
      <PageHeader onInvite={() => setInviting(true)} quiet={inviting || Boolean(blocking?.open)} />

      <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)} className="gap-ws-9">
        <Tabs.List aria-label="Access" className="w-full">
          <Tabs.Item value="requests">
            <Tabs.Label>Requests</Tabs.Label>
          </Tabs.Item>
          <Tabs.Item value="invitations">
            <Tabs.Label>Invitations</Tabs.Label>
          </Tabs.Item>
          <Tabs.Item value="blocked">
            <Tabs.Label>Blocked</Tabs.Label>
          </Tabs.Item>
        </Tabs.List>

        <Tabs.Content value="requests">
          <RequestsTable
            rows={requests}
            seatsUsed={seatsUsed}
            selected={selected}
            onSelectedChange={setSelected}
            onApprove={approve}
            onDecline={decline}
            onBlock={(person) => setBlocking({ person, open: true })}
          />
        </Tabs.Content>
        <Tabs.Content value="invitations">
          <InvitationsTable
            rows={invitations}
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
            onRevoke={(invitation) => {
              const before = invitations;
              setInvitations(invitations.filter((i) => i.id !== invitation.id));
              toastWithUndo(`Invitation to ${invitation.email} revoked`, () =>
                setInvitations(before),
              );
            }}
          />
        </Tabs.Content>
        <Tabs.Content value="blocked">
          <BlockedTable
            rows={blocked}
            onUnblock={(person) => {
              const before = blocked;
              setBlocked(blocked.filter((p) => p.id !== person.id));
              toastWithUndo(`${person.name} unblocked`, () => setBlocked(before));
            }}
          />
        </Tabs.Content>
      </Tabs>

      <SelectionBar
        // The bar answers requests, so it shows only on their tab.
        count={tab === 'requests' ? selected.length : 0}
        seatsUsed={seatsUsed}
        onClear={() => setSelected([])}
        onApprove={(role) => approve(selected, role)}
        onDecline={() => decline(selected)}
      />
      <InviteDialog
        open={inviting}
        onOpenChange={setInviting}
        invited={invitations.map((i) => i.email)}
        blocked={blocked.map((p) => p.email)}
        onInvite={(email, role) => {
          setInvitations([
            { id: email, email, role, invitedBy: account.name, sent: NOW.toISOString() },
            ...invitations,
          ]);
          setTab('invitations');
          showToast({ status: 'success', content: `Invitation sent to ${email}` });
        }}
      />
      {blocking && (
        <BlockDialog
          person={blocking.person}
          open={blocking.open}
          onOpenChange={(open) => setBlocking({ ...blocking, open })}
          onBlock={(reason) => block(blocking.person, reason)}
        />
      )}
    </div>
  );
}

/**
 * Access requests (Inset direction): who gets into the workspace, on the raised page beside the
 * workspace sidebar with Members open. Three tabs split the ways in: requests to approve (after
 * picking a role) or decline, one by one or selected together; invitations to resend or revoke;
 * and the people who are blocked. Inviting is the page's one filled button.
 */
export default function AccessRequests() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ToastProvider>
      <div className="bg-ws-static-background flex h-dvh">
        <AccessSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
        <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
            {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is
                pulled left so its glyph, not its box, sits 20px from the edge; the crumbs follow
                it. */}
            <div className="gap-ws-5 px-ws-11 flex w-full items-center">
              <IconButton
                icon={RiSideBarLine}
                variant="secondary"
                preset="ghost"
                size="sm"
                iconClassName="text-ws-static-subtle size-ws-9"
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-expanded={!collapsed}
                aria-controls={sidebarId}
                onClick={() => setCollapsed(!collapsed)}
                className="-ml-ws-5"
              />
              <Breadcrumbs separator="arrow">
                <Breadcrumbs.Item asChild>
                  <a href="#settings">Settings</a>
                </Breadcrumbs.Item>
                <Breadcrumbs.Item asChild>
                  <a href="#members">Members</a>
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>Access</Breadcrumbs.Item>
              </Breadcrumbs>
            </div>
          </div>

          {/* The page scrolls inside the card, so the card's corners stay put. */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <AccessPage />
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
