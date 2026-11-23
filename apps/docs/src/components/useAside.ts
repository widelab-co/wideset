import { useSyncExternalStore } from 'react';

/** Same breakpoint as the right rail in DocsLayout. */
const WIDE = '(min-width: 80rem)';

const subscribe = (onChange: () => void) => {
  const query = matchMedia(WIDE);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

/**
 * Where to move a side panel (the Playground's properties) into the page's right rail: the rail
 * element when the window is wide enough to show it, otherwise null, and the panel stays inline.
 */
export const useAside = (id?: string) =>
  useSyncExternalStore(
    subscribe,
    () => (id && matchMedia(WIDE).matches ? document.getElementById(id) : null),
    () => null,
  );
