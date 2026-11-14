const count = new Intl.NumberFormat('en-US');

/** "40 members · Growth": a workspace's size and plan, as plain text. */
export const workspaceFacts = ({ members, plan }: { members: number; plan: string }) =>
  `${count.format(members)} ${members === 1 ? 'member' : 'members'} · ${plan}`;
