import { describe, expect, it } from 'vitest';

import { stateOf } from './tokenUsageStates';

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

  it('keeps an unknown variant unknown, also inside a group', () => {
    expect(stateOf(['wobbly'])).toBeUndefined();
    expect(stateOf(['group-wobbly/chip'])).toBeUndefined();
  });
});
