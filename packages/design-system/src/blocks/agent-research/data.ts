import { chatGroups as chats, withThread } from './canon';
import { researchTurns } from './research-data';

/*
  This block opens in Chat, on the canon's chat "Room booking hardware pricing" in Customer
  research, as a finished research run: its turns in full are in `research-data.ts`. Everything
  else (the account, the models, the other chats and the sessions) is the canon's.
*/

/** The chat that opens with the block, and whose sources the pane shows. */
export const OPEN_CHAT = 'hardware-pricing';

/**
 * The canon's chats, with this block's chat in full in its place. In the canon it is still
 * working; here the run is over, so it carries no mark.
 */
export const chatGroups = withThread(chats, OPEN_CHAT, (thread) => ({
  ...thread,
  state: undefined,
  turns: researchTurns,
}));
