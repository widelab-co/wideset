import { cleanup, render } from '@testing-library/react';
import type { ComponentType } from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { BLOCKS } from '../blocks';

/*
  Blocks (src/blocks/<id>/index.tsx) are whole screens a consumer copies as a starting point, listed
  in reading order by src/blocks/index.ts (the docs site reads that list). Each one must be listed,
  and must render on its own, in light and in dark, with nothing missing from the library.
*/
const modules = import.meta.glob<{ default: ComponentType }>('../blocks/*/index.tsx', {
  eager: true,
});
const idOf = (path: string) => path.split('/').at(-2)!;
const entries = Object.entries(modules).map(([path, module]) => [idOf(path), module] as const);

afterEach(() => {
  cleanup();
  document.documentElement.classList.remove('dark');
});

describe('blocks', () => {
  it('lists every block folder in the manifest, and nothing else', () => {
    expect(entries.map(([id]) => id).sort()).toEqual(BLOCKS.map((block) => block.id).sort());
  });

  it('gives every block a one-sentence description', () => {
    for (const block of BLOCKS) expect(block.description, block.id).toMatch(/^[A-Z].+\.$/);
  });

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
