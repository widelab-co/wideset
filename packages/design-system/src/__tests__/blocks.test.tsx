import { act, cleanup, render, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ComponentType, StrictMode, useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { BLOCKS, PANELS } from '../blocks';
import type { AgentTurn, Turn } from '../blocks/agent-chat/model';
import { useSession } from '../blocks/agent-chat/use-session';
import ganttPanelSource from '../blocks/gantt/task-sidepanel.tsx?raw';
import panelSource from '../blocks/task-sidepanel/task-sidepanel.tsx?raw';

// The sign-in, sign-up and account-access screens share their card, and the two sign-in screens their form.
const authSources = import.meta.glob<string>(
  '../blocks/{sign-in,sign-in-card,sign-up,forgot-password,check-email,two-factor,sso-sign-in,accept-invite,new-password,verify-email,signed-out,choose-workspace}/{app-icon,auth-card,sign-in-form}.tsx',
  { query: '?raw', import: 'default', eager: true },
);
const AUTH_BLOCKS = [
  'sign-in',
  'sign-in-card',
  'sign-up',
  'forgot-password',
  'check-email',
  'two-factor',
  'sso-sign-in',
  'accept-invite',
  'new-password',
  'verify-email',
  'signed-out',
  'choose-workspace',
];
// The agent interface (agent-*) is one app shown screen by screen: the transcript kit and the shell
// live in agent-chat, and every other agent block carries copies of the files it uses.
const agentSources = import.meta.glob<string>('../blocks/agent-*/*.{ts,tsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const AGENT_KIT = [
  'model.ts',
  'canon.ts',
  'run.ts',
  'use-run.ts',
  'use-session.ts',
  'use-shell.ts',
  'format.ts',
  'motion.ts',
  'session.tsx',
  'transcript.tsx',
  'agent-turn.tsx',
  'user-message.tsx',
  'transcript-break.tsx',
  'reasoning.tsx',
  'step-row.tsx',
  'step-group.tsx',
  'step-mark.tsx',
  'step-detail.tsx',
  'approval-card.tsx',
  'question-card.tsx',
  'row.tsx',
  'fold.tsx',
  'shimmer.tsx',
  'prose.tsx',
  'inline.tsx',
  'code-block.tsx',
  'copy-button.tsx',
  'icon-action.tsx',
  'answer-actions.tsx',
  'pane-card.tsx',
  'working-line.tsx',
  'message-queue.tsx',
  'composer.tsx',
  'model-menu.tsx',
  'tools-menu.tsx',
  'chat-tools.tsx',
  'code-tools.tsx',
  'context-meter.tsx',
  'context-summary.tsx',
  'sidebar.tsx',
  'thread-mark.tsx',
  'top-bar.tsx',
  'thread-menu.tsx',
  'brand-mark.tsx',
  'home.tsx',
  'person-avatar.tsx',
  'people.assets.ts',
  'keyboard-key.tsx',
  'menu-sub.tsx',
  'menu-choice.tsx',
];

const SHARED = {
  'app-icon.tsx': AUTH_BLOCKS,
  'auth-card.tsx': AUTH_BLOCKS,
  'sign-in-form.tsx': ['sign-in', 'sign-in-card'],
};

/*
  Blocks (src/blocks/<id>/index.tsx) are whole screens, and panels that open over them, a consumer
  copies as a starting point, listed in reading order by src/blocks/index.ts (the docs site reads
  those lists). Each one must be listed, and must render on its own with nothing missing from the
  library. Dark mode is CSS only (jsdom applies none of it), so it is checked in Storybook, not here.
*/
const modules = import.meta.glob<{ default: ComponentType }>('../blocks/*/index.tsx', {
  eager: true,
});
const idOf = (path: string) => path.split('/').at(-2)!;
const entries = Object.entries(modules).map(([path, module]) => [idOf(path), module] as const);
const listed = [...BLOCKS, ...PANELS];

afterEach(() => {
  cleanup();
});

describe('Manifest', () => {
  it('lists every block folder in the manifest, and nothing else', () => {
    expect(entries.map(([id]) => id).sort()).toEqual(listed.map((block) => block.id).sort());
  });

  it('gives every block a one-sentence description', () => {
    for (const block of listed) expect(block.description, block.id).toMatch(/^[A-Z].+\.$/);
  });
});

describe('Shared copies', () => {
  // Blocks are copied whole, so Gantt carries its own copy of the task side panel: one source.
  it('keeps Gantt’s task side panel identical to the task-sidepanel block’s', () => {
    expect(ganttPanelSource).toBe(panelSource);
  });

  it.each(Object.entries(SHARED))(
    'keeps %s identical in every screen that carries it',
    (file, ids) => {
      const copies = ids.map((id) => authSources[`../blocks/${id}/${file}`]);
      expect(copies.every((copy) => typeof copy === 'string')).toBe(true);
      for (const copy of copies) expect(copy).toBe(copies[0]);
    },
  );

  it.each(AGENT_KIT)(
    'keeps the agent kit’s %s identical in every agent block that carries it',
    (file) => {
      const source = agentSources[`../blocks/agent-chat/${file}`];
      expect(typeof source).toBe('string');
      const copies = Object.entries(agentSources).filter(([path]) => path.endsWith(`/${file}`));
      for (const [path, copy] of copies) expect(copy, path).toBe(source);
    },
  );
});

describe('Rendering', () => {
  it.each(entries)('%s renders', (_, module) => {
    const Block = module.default;
    expect(typeof Block).toBe('function');
    const { container } = render(<Block />);
    expect(container.firstElementChild).not.toBeNull();
  });
});

describe('Agent context', () => {
  // Reconnected, the focus goes to the badge once; a later render (the popover makes the rows
  // anew each time) does not take it back from wherever it went.
  it('moves the focus to a reconnected connector once', async () => {
    const { ConnectorList } = await import('../blocks/agent-context/connector-list');
    const { connectors } = await import('../blocks/agent-context/data');
    function Popover() {
      const [back, setBack] = useState<string[]>([]);
      const [renders, setRenders] = useState(0);
      return (
        <>
          <ConnectorList
            connectors={connectors.map((item) =>
              back.includes(item.id) ? { ...item, state: 'connected' } : { ...item },
            )}
            onReconnect={(id) => setBack([...back, id])}
          />
          <button type="button" onClick={() => setRenders(renders + 1)}>
            Something else
          </button>
        </>
      );
    }
    const user = userEvent.setup();
    const { getByRole } = render(<Popover />);
    await user.click(getByRole('button', { name: 'Reconnect Team chat' }));
    expect(document.activeElement).toHaveTextContent('Connected');
    expect(getByRole('status')).toHaveTextContent('Team chat is connected');
    const other = getByRole('button', { name: 'Something else' });
    await user.click(other);
    expect(other).toHaveFocus();
  });
});

describe('Agent code', () => {
  // The pane's six tabs each control a panel, mounted or not yet opened.
  it('gives every pane tab its panel', async () => {
    const { default: AgentCode } = await import('../blocks/agent-code');
    const { getAllByRole, getByRole } = render(<AgentCode />);
    const tabs = getAllByRole('tab');
    expect(tabs.length).toBeGreaterThan(0);
    for (const tab of tabs) {
      const panel = document.getElementById(tab.getAttribute('aria-controls')!);
      expect(panel, tab.textContent!).not.toBeNull();
      expect(panel).toHaveAttribute('role', 'tabpanel');
    }
    expect(getByRole('tabpanel', { name: 'Changes' })).toBeVisible();
  });

  // Closing the pane hides it: a review comment written in it is there when it opens again.
  it('keeps a review comment through closing and reopening the pane', async () => {
    const { default: AgentCode } = await import('../blocks/agent-code');
    const user = userEvent.setup();
    const { getAllByRole, getByRole, getByText } = render(<AgentCode />);
    await user.click(getAllByRole('button', { name: /^Comment on / })[0]);
    await user.type(getAllByRole('textbox', { name: /^Comment on line/ })[0], 'Kept on reopening');
    await user.click(getAllByRole('button', { name: /^Comment$/ })[0]);
    expect(getByText('Kept on reopening')).toBeInTheDocument();
    await user.click(getByRole('button', { name: 'Close pane' }));
    expect(getByText('Kept on reopening')).not.toBeVisible();
    await user.click(getByRole('button', { name: 'Open pane' }));
    expect(getByText('Kept on reopening')).toBeVisible();
  });
});

describe('Agent copy button', () => {
  // A copy that cannot happen says so, whether the clipboard is missing or the text throws.
  it('says the copy failed when the text cannot be worked out', async () => {
    const { CopyButton } = await import('../blocks/agent-chat/copy-button');
    const user = userEvent.setup();
    const { getByRole } = render(
      <CopyButton
        label="Copy path"
        text={() => {
          throw new Error('No text');
        }}
      />,
    );
    await user.click(getByRole('button', { name: 'Copy path' }));
    expect(getByRole('status')).toHaveTextContent('Copy failed');
  });
});

describe('Agent session', () => {
  const asking = (...ids: string[]): AgentTurn => ({
    id: 'asking',
    role: 'agent',
    blocks: ids.map((id) => ({ kind: 'question', id, title: `Question ${id}`, options: [] })),
  });
  const reply = (id: string): AgentTurn => ({ id, role: 'agent', blocks: [] });
  const session = (first: AgentTurn, queue?: string[]) =>
    renderHook(() => {
      const [turns, setTurns] = useState<Turn[]>([first]);
      return { turns, session: useSession({ turns, onChange: setTurns, reply, queue }) };
    }).result;
  const sent = (turns: Turn[]) =>
    turns.flatMap((turn) => (turn.role === 'user' ? [turn.text] : []));
  const answerOf = (turns: Turn[], id: string) => {
    const turn = turns.find((item) => item.id === 'asking') as AgentTurn;
    const block = turn.blocks.find((item) => item.id === id);
    return block?.kind === 'question' ? block.answer : undefined;
  };

  // Choosing the first of two questions leaves the turn stopped, so the second shows no card.
  it('does not answer a question its stopped turn hides with the next message', () => {
    const result = session(asking('first', 'second'));
    act(() => result.current.session.choose('asking', 'first', 'Chosen answer'));
    act(() => result.current.session.send('Unrelated later message'));
    expect(answerOf(result.current.turns, 'first')).toBe('Chosen answer');
    expect(answerOf(result.current.turns, 'second')).toBeUndefined();
  });

  it('answers the question on the page with the next message', () => {
    const result = session(asking('only'));
    act(() => result.current.session.send('Typed answer'));
    expect(answerOf(result.current.turns, 'only')).toBe('Typed answer');
  });

  // A message queued while the agent worked is not what answers the question it then asked.
  it('answers a waiting question with the message sent, not one queued before it', () => {
    const result = session(asking('only'), ['Queued earlier']);
    act(() => result.current.session.send('Typed answer'));
    expect(answerOf(result.current.turns, 'only')).toBe('Typed answer');
    expect(sent(result.current.turns)[0]).toBe('Typed answer');
  });

  // Two files attached in one handler both stay on the tray.
  it('keeps every file attached before the next render', () => {
    const result = session(reply('done'));
    act(() => {
      result.current.session.attach('a.txt');
      result.current.session.attach('b.txt');
    });
    expect(result.current.session.attachments).toEqual(['a.txt', 'b.txt']);
  });

  // A thread kept by the app and opened again already holds turns the hook made last time.
  it('gives a new turn an id no turn in the thread has', () => {
    const kept: Turn[] = [
      { id: 'sent-1', role: 'user', text: 'Earlier message' },
      { id: 'sent-2', role: 'agent', blocks: [] },
    ];
    const { result } = renderHook(() => {
      const [turns, setTurns] = useState<Turn[]>(kept);
      return { turns, session: useSession({ turns, onChange: setTurns, reply }) };
    });
    act(() => result.current.session.send('Later message'));
    const ids = result.current.turns.map((turn) => turn.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  // While the agent works, two messages sent in one handler both wait their turn.
  it('queues every message sent in one handler during a run', () => {
    const long: AgentTurn = {
      id: 'long',
      role: 'agent',
      blocks: [
        {
          kind: 'text',
          id: 'answer',
          prose: [
            { kind: 'paragraph', text: 'A long answer that is still being written. '.repeat(20) },
          ],
        },
      ],
    };
    const { result } = renderHook(() => {
      const [turns, setTurns] = useState<Turn[]>([long]);
      return {
        turns,
        session: useSession({ turns, onChange: setTurns, reply, playing: { id: 'long', at: 0 } }),
      };
    });
    expect(result.current.session.running).toBe(true);
    act(() => {
      result.current.session.send('First');
      result.current.session.send('Second');
    });
    expect(result.current.session.queue.map((item) => item.text)).toEqual(['First', 'Second']);
  });

  // Stopped with a message waiting, a send lets it go first; a second send before the next
  // render must not send it again, and both new messages follow it.
  it('sends a waiting message once when two sends follow a stop', () => {
    const stopped: AgentTurn = { id: 'stopped', role: 'agent', blocks: [], stoppedAt: 0 };
    const result = session(stopped, ['Queued earlier']);
    act(() => {
      result.current.session.send('First');
      result.current.session.send('Second');
    });
    // The replies here end at once, so the two new messages follow in order.
    expect(sent(result.current.turns)).toEqual(['Queued earlier', 'First', 'Second']);
  });

  // StrictMode sets effects up twice in development: a waiting message still goes out once.
  it('sends a queued message once under StrictMode', () => {
    const done: AgentTurn = { id: 'asking', role: 'agent', blocks: [] };
    const { result } = renderHook(
      () => {
        const [turns, setTurns] = useState<Turn[]>([done]);
        return {
          turns,
          session: useSession({ turns, onChange: setTurns, reply, queue: ['Export a PDF'] }),
        };
      },
      { wrapper: StrictMode },
    );
    expect(sent(result.current.turns)).toEqual(['Export a PDF']);
  });

  it('sends a chosen answer before a message queued earlier', () => {
    const result = session(asking('only'), ['Queued earlier']);
    act(() => result.current.session.choose('asking', 'only', 'Chosen answer'));
    expect(answerOf(result.current.turns, 'only')).toBe('Chosen answer');
    expect(sent(result.current.turns)[0]).toBe('Chosen answer');
  });
});
