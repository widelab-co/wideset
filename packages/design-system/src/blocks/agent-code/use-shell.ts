// TODO(custom): the app's state around the open thread (the mode, the threads by group, which one is open, starting a new one); Wideset has no app shell state.
import { useEffect, useRef, useState } from 'react';

import type { AgentTurn, Mode, Thread, ThreadGroup, Turn, Workplace } from './model';
import { useSession } from './use-session';

/** A thread that is still working when it is opened has been at it for a moment already. */
const HEAD_START = 3000;

const NOUN: Record<Mode, string> = { chat: 'chat', code: 'session' };

const mapThread = (groups: ThreadGroup[], id: string, change: (thread: Thread) => Thread) =>
  groups.map((group) => ({
    ...group,
    threads: group.threads.map((thread) => (thread.id === id ? change(thread) : thread)),
  }));

type ShellOptions = {
  /** The threads of each mode, in their groups. */
  chat: ThreadGroup[];
  code: ThreadGroup[];
  /** The mode and the thread the block opens on; no thread is the new-thread screen. */
  mode: Mode;
  openId: string | null;
  /** The agent's turn in answer to a message. */
  reply: (id: string, text: string) => AgentTurn;
  /** Files in the workspace, by name: Add files attaches them one after another. */
  files?: string[];
};

/**
 * Everything a block's shell holds, the same in every block that lets you move about: the mode,
 * each mode's threads, the one that is open and its session, and the new-thread screen.
 *
 * - Opening a thread reads it. One that was still working goes on from where it is; the one left
 *   behind ends its run without a mark, so back there its turn is simply finished.
 * - A thread that waited for you stops saying so once nothing in it waits any more.
 * - The first message on the new-thread screen makes the thread: it takes its name from the
 *   message and joins the group whose `+` was pressed, or Recents.
 * - `sidebar` is what `AgentSidebar` needs; `crumbs` is where you are, for the top bar.
 */
export function useShell({
  chat,
  code,
  mode: firstMode,
  openId: firstId,
  reply,
  files,
}: ShellOptions) {
  const [mode, setMode] = useState(firstMode);
  const [groups, setGroups] = useState({ chat, code });
  const [openIds, setOpenIds] = useState<Record<Mode, string | null>>({
    chat: null,
    code: null,
    [firstMode]: firstId,
  });
  /** The group whose `+` started the new thread; without one it goes to Recents. */
  const [newIn, setNewIn] = useState<string>();
  const ids = useRef(0);

  const openId = openIds[mode];
  const group = groups[mode].find((item) => item.threads.some((thread) => thread.id === openId));
  const thread = group?.threads.find((item) => item.id === openId);

  const changeThread = (id: string, change: (thread: Thread) => Thread) =>
    setGroups((current) => ({ ...current, [mode]: mapThread(current[mode], id, change) }));

  const session = useSession({
    turns: thread?.turns ?? [],
    onChange: (change: (turns: Turn[]) => Turn[]) =>
      openId && changeThread(openId, (item) => ({ ...item, turns: change(item.turns) })),
    reply,
  });

  // Whatever the thread waited for has been dealt with: it no longer says it needs you.
  const waited = thread?.state === 'needs-you' && !session.awaiting;
  useEffect(() => {
    if (!waited || !openId) return;
    setGroups((current) => ({
      ...current,
      [mode]: mapThread(current[mode], openId, (item) => ({ ...item, state: undefined })),
    }));
  }, [waited, openId, mode]);

  // Something in the open thread waits for you (a replayed approval too): the thread says so, and
  // keeps saying so when you open another one.
  const waits = thread !== undefined && thread.state !== 'needs-you' && session.awaiting;
  useEffect(() => {
    if (!waits || !openId) return;
    setGroups((current) => ({
      ...current,
      [mode]: mapThread(current[mode], openId, (item) => ({ ...item, state: 'needs-you' })),
    }));
  }, [waits, openId, mode]);

  const nextId = () => `new-${(ids.current += 1)}`;

  const open = (id: string) => {
    // The thread is open already: nothing to leave, so the draft and the queue stay.
    if (id === openId) return;
    session.leave();
    setOpenIds((current) => ({ ...current, [mode]: id }));
    const target = groups[mode].flatMap((item) => item.threads).find((item) => item.id === id);
    if (target?.state === 'unread' || target?.state === 'working') {
      changeThread(id, (item) => ({ ...item, state: undefined }));
    }
    const last = target?.turns.findLast((turn) => turn.role === 'agent');
    if (target?.state === 'working' && last) session.start(last.id, HEAD_START);
  };

  const startNew = (groupId?: string) => {
    session.leave();
    setNewIn(groupId);
    setOpenIds((current) => ({ ...current, [mode]: null }));
  };

  return {
    mode,
    /** The open thread and its group; none on the new-thread screen. */
    thread,
    group,
    session,
    changeThread,
    startNew,
    /** The group whose `+` started the new thread: in Code, the repository it starts in. */
    newIn,

    crumbs:
      thread && group
        ? [group.label, thread.title]
        : [
            ...groups[mode].filter((item) => item.id === newIn).map((item) => item.label),
            `New ${NOUN[mode]}`,
          ],

    sidebar: {
      mode,
      onModeChange: (next: Mode) => {
        session.leave();
        setNewIn(undefined);
        setMode(next);
      },
      groups: groups[mode],
      openId,
      workingId: session.running ? (openId ?? undefined) : undefined,
      onOpen: open,
      onNew: startNew,
    },

    /** Attaches the next file of the workspace that is not on the tray yet. */
    attach() {
      // From the tray as it is now, so Add files twice in a row adds two.
      session.attachNext(files ?? []);
    },

    /**
     * The first message of a new thread, with the files attached on the new-thread screen. In Code
     * the session goes under the repository chosen there and keeps its branch.
     */
    begin(text: string, sentWith?: string[], workplace?: Workplace) {
      const id = nextId();
      const answer = reply(nextId(), text);
      const created: Thread = {
        id,
        title: text.length > 32 ? `${text.slice(0, 32).trimEnd()}…` : text,
        branch: workplace?.branch,
        turns: [{ id: nextId(), role: 'user', text, sentWith }, answer],
      };
      setGroups((current) => {
        // The chosen repository's group, else the group whose + was pressed, else Recents.
        const wanted = workplace?.repository ?? newIn;
        const home = current[mode].some((item) => item.id === wanted) ? wanted : undefined;
        return {
          ...current,
          [mode]: current[mode].map((item) =>
            (home ? item.id === home : item.fixed)
              ? { ...item, threads: [created, ...item.threads] }
              : item,
          ),
        };
      });
      setOpenIds((current) => ({ ...current, [mode]: id }));
      session.start(answer.id);
    },
  };
}
