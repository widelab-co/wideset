import type { ComponentType } from 'react';

/**
 * The library's blocks, loaded one at a time in the browser. A glob, not imports: without
 * `packages/design-system/src/blocks/` it matches nothing and no block is live.
 */
const modules = import.meta.glob<{ default: ComponentType }>(
  '../../../../packages/design-system/src/blocks/*/index.tsx',
);

/** The block's component, or `null` when the library has no such block. */
export const loadBlock = async (id: string): Promise<ComponentType | null> => {
  const load = modules[`../../../../packages/design-system/src/blocks/${id}/index.tsx`];
  return load ? (await load()).default : null;
};
