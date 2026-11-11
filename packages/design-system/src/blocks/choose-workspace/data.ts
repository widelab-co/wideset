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
  members: number;
  plan: 'Starter' | 'Growth' | 'Scale';
};

/** The workspaces this account belongs to, the last one used first. */
export const WORKSPACES: Workspace[] = [
  { id: 'lumen-studio', name: 'Lumen Studio', initials: 'LS', members: 40, plan: 'Growth' },
  { id: 'lumen-partners', name: 'Lumen Partners', initials: 'LP', members: 12, plan: 'Starter' },
  { id: 'sales-sandbox', name: 'Sales sandbox', initials: 'SS', members: 3, plan: 'Starter' },
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
    members: 9,
    plan: 'Growth',
    invitedBy: 'Leo Marchetti',
  },
];
