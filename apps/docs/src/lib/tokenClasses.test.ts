import { describe, expect, it } from 'vitest';

import { classify } from './tokenClasses';

describe('classify', () => {
  it('names the physical and the logical padding sides', () => {
    expect(classify('pt-ws-2')?.property).toBe('Padding top');
    expect(classify('ps-ws-2')?.property).toBe('Padding start');
    expect(classify('pe-[calc(var(--spacing-ws-3)+var(--spacing-ws-9))]')?.property).toBe(
      'Padding end',
    );
  });
});
