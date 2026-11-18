import * as React from 'react';
import { clamp, isFiniteNumber } from 'src/logic/helpers';

// Radix's default `aria-valuetext` repeats the percentage, which screen readers then announce twice.
export const omitValueText = (() => undefined) as unknown as (value: number, max: number) => string;

const DEFAULT_MAX = 100;

const isValidMax = (max?: number): max is number => isFiniteNumber(max) && max > 0;

export const validateMax = (max?: number) => (isValidMax(max) ? max : DEFAULT_MAX);

export const validateValue = (value: number | undefined, max: number) =>
  isFiniteNumber(value) ? clamp(value, 0, max) : 0;

export const warnInvalidMax = (max?: number) => {
  if (max !== undefined && !isValidMax(max)) {
    console.warn(`ProgressBar \`max\` must be a number greater than 0. Received ${max}.`);
  }
};

export const warnInvalidValue = (value?: number) => {
  if (value !== undefined && !isFiniteNumber(value)) {
    console.warn(`ProgressBar \`value\` must be a finite number. Received ${value}.`);
  }
};

/** False for `null`, `undefined`, booleans and `''`; `0` counts as content. */
export const hasContent = (node: React.ReactNode) =>
  React.Children.toArray(node).some((child) => child !== '');
