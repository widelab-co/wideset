import type { AvatarColor } from '@wideset/react';

/** Where the screen leads: replace with your routes. */
export const ROUTES = {
  /** A workspace's home; your router builds it from the workspace's id. */
  workspace: (id: string) => `#${id}`,
  createWorkspace: '#new-workspace',
  signIn: '#sign-in',
};

/** The account that signed in. */
export const SIGNED_IN_AS = 'maya@lumenstudio.co';

export type Workspace = {
  id: string;
  name: string;
  initials: string;
  /** Pinned, so a workspace keeps the colour the account menu gives it. */
  color: AvatarColor;
  members: number;
  plan: 'Starter' | 'Growth' | 'Scale';
};

/** The workspaces this account belongs to, the last one used first. */
export const WORKSPACES: Workspace[] = [
  {
    id: 'lumen-studio',
    name: 'Lumen Studio',
    initials: 'LS',
    color: 'orange',
    members: 40,
    plan: 'Growth',
  },
  { id: 'sandbox', name: 'Sandbox', initials: 'SB', color: 'teal', members: 3, plan: 'Starter' },
  {
    id: 'northgate',
    name: 'Northgate Partners',
    initials: 'NP',
    color: 'blue',
    members: 12,
    plan: 'Starter',
  },
];

/** The workspace opened last on this account. */
export const LAST_USED = 'lumen-studio';

export type Invitation = Workspace & { invitedBy: string };

/** Invitations waiting for this account's address. */
export const INVITATIONS: Invitation[] = [
  {
    id: 'lumen-studio-eu',
    name: 'Lumen Studio EU',
    initials: 'LE',
    color: 'green',
    members: 9,
    plan: 'Growth',
    invitedBy: 'Leo Marchetti',
  },
];
