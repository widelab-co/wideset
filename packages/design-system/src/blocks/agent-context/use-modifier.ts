import { useSyncExternalStore } from 'react';

const never = () => () => {};
const apple = () => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘' : 'Ctrl');

/**
 * ⌘ on Apple keyboards, Ctrl elsewhere. The server, which has no keyboard, renders Ctrl and the
 * browser corrects it after hydration, so a server-rendered page does not mismatch.
 */
export const useModifier = () => useSyncExternalStore(never, apple, () => 'Ctrl');
