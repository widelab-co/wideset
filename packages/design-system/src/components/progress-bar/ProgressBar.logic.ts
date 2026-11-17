import * as React from 'react';
import { clamp, isFiniteNumber } from 'src/logic/helpers';

// Radix's default `aria-valuetext` repeats the percentage, which screen readers then announce twice.
export const omitValueText = (() => undefined) as unknown as (value: number, max: number) => string;

const DEFAULT_MAX = 100;

export const validateMax = (max?: number) => {
  if (max === undefined) return DEFAULT_MAX;
  if (isFiniteNumber(max) && max > 0) return max;
  console.warn(`ProgressBar \`max\` must be a number greater than 0. Received ${max}.`);
  return DEFAULT_MAX;
};

export const validateValue = (value: number | undefined, max: number) => {
  if (value === undefined) return 0;
  if (isFiniteNumber(value)) return clamp(value, 0, max);
  console.warn(`ProgressBar \`value\` must be a finite number. Received ${value}.`);
  return 0;
};

/** False for `null`, `undefined`, booleans and `''`; `0` counts as content. */
export const hasContent = (node: React.ReactNode) =>
  React.Children.toArray(node).some((child) => child !== '');
