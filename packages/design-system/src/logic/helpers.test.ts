import { describe, expect, it } from 'vitest';

import { clamp, isFiniteNumber } from './helpers';

describe('isFiniteNumber', () => {
  it.each([0, -1, 1.5, Number.MAX_SAFE_INTEGER])('accepts %s', (value) => {
    expect(isFiniteNumber(value)).toBe(true);
  });

  it.each([NaN, Infinity, -Infinity, '5', null, undefined])('rejects %s', (value) => {
    expect(isFiniteNumber(value)).toBe(false);
  });
});

describe('clamp', () => {
  it('keeps a value inside the range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('raises a value below min to min', () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });

  it('lowers a value above max to max', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});
