import type { ReactNode } from 'react';

/** `0` is content; `null`, `undefined`, `false` and `''` are not. */
export const hasContent = (node: ReactNode) => node != null && node !== false && node !== '';
