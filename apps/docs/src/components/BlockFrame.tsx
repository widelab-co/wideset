import { type ComponentType, useEffect, useState } from 'react';

/**
 * One block, full screen, for the preview page and the cards' frames. Loads only the block it
 * shows; `?theme=dark` renders it dark, otherwise it follows the saved site theme.
 */
const files = import.meta.glob<{ default: ComponentType }>(
  '../../../../packages/design-system/src/blocks/*/index.tsx',
);

export default function BlockFrame({ id }: { id: string }) {
  const [Block, setBlock] = useState<ComponentType | null>(null);
  useEffect(() => {
    const theme = new URLSearchParams(location.search).get('theme');
    if (theme) document.documentElement.classList.toggle('dark', theme === 'dark');
    const load = Object.entries(files).find(([path]) => path.includes(`/blocks/${id}/`))?.[1];
    load?.().then((module) => setBlock(() => module.default));
  }, [id]);
  return Block ? <Block /> : null;
}
