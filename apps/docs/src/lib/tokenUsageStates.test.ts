import { describe, expect, it } from 'vitest';

import { stateOf, unknownPrefix } from './tokenUsageStates';

describe('stateOf', () => {
  it('reads a structural group or peer variant, named or not, as layout', () => {
    expect(stateOf(['group-has-[[data-slot=chip-action]]/chip'])).toBe('default');
    expect(stateOf(['group-[.is-open]'])).toBe('default');
    expect(stateOf(['peer-has-[:checked]'])).toBe('default');
  });

  it('reads the state inside a group or peer variant', () => {
    expect(stateOf(['group-hover/chip'])).toBe('hover');
    expect(stateOf(['peer-data-[state=open]'])).toBe('state:open');
    expect(stateOf(['group-not-[[data-disabled]]/field'])).toBe('default');
  });

  it('reads any ARIA or data attribute variant', () => {
    expect(stateOf(['aria-expanded'])).toBe('expanded');
    expect(stateOf(['aria-[sort=ascending]'])).toBe('sort:ascending');
    expect(stateOf(['data-[orientation=vertical]'])).toBe('orientation:vertical');
    expect(stateOf(['data-[invalid]'])).toBe('invalid');
    expect(stateOf(['data-loading'])).toBe('loading');
  });

  it('reads form states and user settings as their own key', () => {
    expect(stateOf(['checked'])).toBe('checked');
    expect(stateOf(['peer-invalid'])).toBe('invalid');
    expect(stateOf(['motion-reduce'])).toBe('motion-reduce');
    expect(stateOf(['in-data-[state=open]'])).toBe('state:open');
  });

  it('reads breakpoints, container queries and pseudo elements as layout', () => {
    for (const prefix of ['max-md', 'min-[600px]', '@max-sm', 'nth-3', 'marker', 'supports-grid'])
      expect(stateOf([prefix]), prefix).toBe('default');
  });

  it('keeps an unknown variant unknown, also inside a group, and names it', () => {
    expect(stateOf(['wobbly'])).toBeUndefined();
    expect(stateOf(['group-wobbly/chip'])).toBeUndefined();
    expect(unknownPrefix(['hover', 'wobbly'])).toBe('wobbly');
  });
});
