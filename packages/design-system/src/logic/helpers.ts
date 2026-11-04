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

export type FiniteOrOptions = {
  /** Warn with this message when a value is given but rejected. The received value is appended. */
  warn?: string;
};

/**
 * `value` when it is a finite number, otherwise `fallback`.
 * `undefined` falls back silently: an optional prop that is left out is not a mistake.
 */
export const finiteOr = (
  value: number | undefined,
  fallback: number,
  { warn }: FiniteOrOptions = {},
) => {
  if (isFiniteNumber(value)) return value;
  if (value !== undefined && warn) {
    console.warn(`${warn} Received ${String(value)}.`);
  }
  return fallback;
};
