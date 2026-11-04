import { afterEach, describe, expect, it, vi } from 'vitest';

import { clamp, finiteOr, isFiniteNumber } from './helpers';

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

describe('finiteOr', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a finite value', () => {
    expect(finiteOr(7, 0)).toBe(7);
  });

  it.each([NaN, Infinity, -Infinity])('falls back for %s', (value) => {
    expect(finiteOr(value, 3)).toBe(3);
  });

  it('warns with the message and the received value when it rejects a value', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    finiteOr(NaN, 0, { warn: 'Thing `value` must be a finite number.' });

    expect(warn).toHaveBeenCalledWith('Thing `value` must be a finite number. Received NaN.');
  });

  it('does not warn for undefined, an accepted value, or without a message', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    finiteOr(undefined, 0, { warn: 'message' });
    finiteOr(5, 0, { warn: 'message' });
    finiteOr(NaN, 0);

    expect(warn).not.toHaveBeenCalled();
  });
});
