import { describe, expect, it } from 'vitest';

import { frozenAnchor } from './FilterButton.logic';

const box = (left: number, width: number, top = 0) => ({
  left,
  right: left + width,
  top,
  width,
  height: 32,
});

// The list once slid sideways under the pointer each time an option was ticked, because it
// followed a trigger whose "Design, +3" summary kept growing.
describe('frozenAnchor', () => {
  it('holds the right edge when the trigger grows leftwards (right-aligned toolbar)', () => {
    const anchor = frozenAnchor(box(500, 80), box(440, 140));
    expect(anchor).toMatchObject({ left: 500, width: 80 });
  });

  it('holds the left edge when the trigger grows rightwards (left-aligned toolbar)', () => {
    const anchor = frozenAnchor(box(100, 80), box(100, 140));
    expect(anchor).toMatchObject({ left: 100, width: 80 });
  });

  it('follows the trigger when the page scrolls', () => {
    const anchor = frozenAnchor(box(100, 80, 200), box(100, 140, 120));
    expect(anchor.top).toBe(120);
  });
});
