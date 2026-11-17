import { act, cleanup, render, renderHook } from '@testing-library/react';
import { type ComponentType, useState } from 'react';
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
});

describe('Agent session', () => {
  const asking = (...ids: string[]): AgentTurn => ({
    id: 'asking',
    role: 'agent',
    blocks: ids.map((id) => ({ kind: 'question', id, title: `Question ${id}`, options: [] })),
  });
  const reply = (id: string): AgentTurn => ({ id, role: 'agent', blocks: [] });
  const session = (first: AgentTurn) =>
    renderHook(() => {
      const [turns, setTurns] = useState<Turn[]>([first]);
      return { turns, session: useSession({ turns, onChange: setTurns, reply }) };
    }).result;
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
});
