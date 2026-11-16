import { Button } from '@wideset/react';
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
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const theme = new URLSearchParams(location.search).get('theme');
    if (theme) document.documentElement.classList.toggle('dark', theme === 'dark');
    const load = Object.entries(files).find(([path]) => path.includes(`/blocks/${id}/`))?.[1];
    if (!load) return setFailed(true);
    let current = true;
    setFailed(false);
    // A chunk that fails to load (a deploy in between, a dropped connection) says so and offers a retry.
    load()
      .then((module) => current && setBlock(() => module.default))
      .catch(() => current && setFailed(true));
    return () => {
      current = false;
    };
  }, [id, attempt]);
  if (Block) return <Block />;
  if (!failed) return null;
  return (
    <div
      role="alert"
      className="flex h-dvh flex-col items-center justify-center gap-ws-5 bg-ws-static-foreground"
    >
      <p className="typography-body-md text-ws-static-subtle">This preview did not load.</p>
      <Button size="sm" variant="secondary" onClick={() => setAttempt((count) => count + 1)}>
        Try again
      </Button>
    </div>
  );
}
