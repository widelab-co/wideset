// @vitest-environment node
import { describe, expect, it } from 'vitest';

import { MAX_RENDERS, tokenUsage, valueSets } from './tokenUsage';

describe('tokenUsage', () => {
  it('reads every component without a problem', () => {
    const { problems } = tokenUsage({ strict: false });
    expect(problems, `the token graph:\n  ${problems.join('\n  ')}`).toEqual([]);
  }, 120_000);
});

describe('valueSets', () => {
  const axis = (key: string, size: number) => ({
    key,
    values: Array.from({ length: size }, (_, i) => `${key}${i}`),
  });

  it('renders every combination up to the limit', () => {
    const { sets, sampled } = valueSets([axis('a', 3), axis('b', 2)], {});
    expect(sampled).toBe(false);
    expect(sets).toHaveLength(6);
  });

  it('renders every pair of controls past the limit, instead of failing', () => {
    const axes = Array.from({ length: 7 }, (_, i) => axis(`k${i}`, 4));
    expect(4 ** 7).toBeGreaterThan(MAX_RENDERS);
    const { sets, sampled } = valueSets(axes, { k0: 'k00' });
    expect(sampled).toBe(true);
    expect(sets.length).toBeLessThan(MAX_RENDERS);
    expect(sets).toContainEqual({ k0: 'k03', k6: 'k62' });
  });
});
