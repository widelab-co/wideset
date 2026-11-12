import { cleanup, render } from '@testing-library/react';
import type { ComponentType } from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { BLOCKS, PANELS } from '../blocks';
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
  'divider.tsx',
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
  those lists). Each one must be listed, and must render on its own, in light and in dark, with
  nothing missing from the library.
*/
const modules = import.meta.glob<{ default: ComponentType }>('../blocks/*/index.tsx', {
  eager: true,
});
const idOf = (path: string) => path.split('/').at(-2)!;
const entries = Object.entries(modules).map(([path, module]) => [idOf(path), module] as const);
const listed = [...BLOCKS, ...PANELS];

afterEach(() => {
  cleanup();
  document.documentElement.classList.remove('dark');
});

describe('blocks', () => {
  it('lists every block folder in the manifest, and nothing else', () => {
    expect(entries.map(([id]) => id).sort()).toEqual(listed.map((block) => block.id).sort());
  });

  it('gives every block a one-sentence description', () => {
    for (const block of listed) expect(block.description, block.id).toMatch(/^[A-Z].+\.$/);
  });

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

  it.each(entries)('%s renders', (_, module) => {
    const Block = module.default;
    expect(typeof Block).toBe('function');
    const { container } = render(<Block />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it.each(entries)('%s renders in dark', (_, module) => {
    document.documentElement.classList.add('dark');
    const Block = module.default;
    const { container } = render(<Block />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
