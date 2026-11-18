import { cn } from '@wideset/react';
import { useEffect, useState } from 'react';

import { PLAYGROUNDS, useValues, withPlayground } from '../lib/playground';
import { useFrameTheme } from '../lib/useFrameTheme';
import FrameThemeButton from './FrameThemeButton';

/**
 * The stage: the component rendered for the current values in the shared store. It renders on
 * the server at the defaults, so the page opens on it; a playground marked `clientOnly` (it
 * reads `document` while rendering, or opens on today's date) mounts its component in the
 * browser instead. Like an example, the stage follows the page theme until its own sun/moon
 * button switches it.
 */
const Playground = ({ component, className }: { component: string; className?: string }) => {
  const definition = PLAYGROUNDS[component];
  const values = useValues(component);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const stage = definition.stage?.(values);
  const theme = useFrameTheme(mounted);

  return (
    <div
      data-playground-stage
      className={cn(
        `docs-frame relative grid min-h-[20rem] place-items-center overflow-hidden rounded-ws-container-lg border border-ws-static-base px-ws-14 py-ws-14 text-ws-static-base ${theme.frameClass} ${stage ?? ''}`,
        className,
      )}
    >
      <FrameThemeButton dark={theme.dark} onToggle={theme.toggle} />
      {(mounted || !definition.clientOnly) && definition.render(values)}
    </div>
  );
};

export default withPlayground(Playground);
