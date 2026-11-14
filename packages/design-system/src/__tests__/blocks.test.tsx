import { cleanup, render } from '@testing-library/react';
import type { ComponentType } from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { BLOCKS, PANELS } from '../blocks';
import ganttPanelSource from '../blocks/gantt/task-sidepanel.tsx?raw';
import panelSource from '../blocks/task-sidepanel/task-sidepanel.tsx?raw';

// The sign-in, sign-up and account-access screens share their card, and the two sign-in screens their form.
const authSources = import.meta.glob<string>(
  '../blocks/{sign-in,sign-in-card,sign-up}/{app-icon,auth-card,sign-in-form}.tsx',
  { query: '?raw', import: 'default', eager: true },
);
const AUTH_BLOCKS = ['sign-in', 'sign-in-card', 'sign-up'];
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
});

describe('Rendering', () => {
  it.each(entries)('%s renders', (_, module) => {
    const Block = module.default;
    expect(typeof Block).toBe('function');
    const { container } = render(<Block />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
