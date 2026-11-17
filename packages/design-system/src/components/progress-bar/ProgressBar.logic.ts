import * as React from 'react';
import { clamp, isFiniteNumber } from 'src/logic/helpers';

// Radix fills `aria-valuetext` with the rounded percentage by default. Screen readers derive the
// same percentage from `aria-valuenow` and `aria-valuemax`, so VoiceOver announced it twice (as
// found on #5). Omit the attribute; a caller's own `aria-valuetext` still reaches the root.
export const omitValueText = (() => undefined) as unknown as (value: number, max: number) => string;

const DEFAULT_MAX = 100;

/** `max` when it is a number greater than 0, otherwise 100 (with a warning if one was given). */
export const validateMax = (max?: number) => {
  if (max === undefined) return DEFAULT_MAX;
  if (isFiniteNumber(max) && max > 0) return max;
  console.warn(`ProgressBar \`max\` must be a number greater than 0. Received ${max}.`);
  return DEFAULT_MAX;
};

/** `value` kept within `0…max`; a missing or non-finite value is 0 (with a warning if one was given). */
export const validateValue = (value: number | undefined, max: number) => {
  if (value === undefined) return 0;
  if (isFiniteNumber(value)) return clamp(value, 0, max);
  console.warn(`ProgressBar \`value\` must be a finite number. Received ${value}.`);
  return 0;
};

/**
 * Whether a node renders anything: `null`, `undefined`, booleans and empty strings do not, so
 * `{false}` or `''` count as absent while `0` and rich nodes count as content.
 */
export const hasContent = (node: React.ReactNode) =>
  React.Children.toArray(node).some((child) => child !== '');
