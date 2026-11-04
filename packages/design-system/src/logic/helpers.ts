export const generateId = () =>
  `inline-alert-${
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
  }`;

export const isBrowser = () => typeof window !== 'undefined';

/** A number that is not `NaN`, `Infinity` or `-Infinity`. */
export const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

/** `value` limited to `min…max`. Same arguments as the proposed `Math.clamp`. */
export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
