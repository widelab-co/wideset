import { readdirSync, readFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { dropdownMenuContentMotionVariants } from '../components/dropdown/DropdownMenu.variants';
import { modalContainerMotionVariants } from '../components/modal/Modal.variants';
import { popupContainerMotionVariants } from '../components/popup/Popup.variants';
import { selectContentMotionVariants } from '../components/select/Select.variants';
import { statusModalContainerMotionVariants } from '../components/status-modal/StatusModal.variants';
import { tooltipContentMotionVariants } from '../components/tooltip/Tooltip.variants';
import { menuFadeMotion } from '../motion/recipes';

/*
  The motion rules of specs/foundations/motion.md ("What moves"). Only buttons press: fields,
  tabs, menus, list rows, tiles and calendar cells answer with colour, never with a scale. Menus,
  selects and pickers fade in and out, with no zoom or slide. Whatever still zooms reads a
  --ws-motion-scale token, which prefers-reduced-motion sets to 1.
*/
const COMPONENTS = resolve(__dirname, '../components');

/** Components whose variants scale on press: pressMotion or a hand-written active:scale. */
const pressing = readdirSync(COMPONENTS, { recursive: true, encoding: 'utf8' })
  .filter((file) => file.endsWith('.variants.ts'))
  .filter((file) =>
    /\bpressMotion\b|active:\S*scale-/.test(readFileSync(join(COMPONENTS, file), 'utf8')),
  )
  .map((file) => basename(file, '.variants.ts'))
  .sort();

describe('Press', () => {
  it('scales buttons only', () => {
    expect(pressing).toEqual(['Button', 'Chip', 'IconButton', 'SplitButton']);
  });
});

describe('Bounce', () => {
  // A checkbox's tick and a radio's dot once popped in past their size on ease-bounce.
  it('is used by no component: marks grow in on ease-out, never past their size', () => {
    const bouncing = readdirSync(COMPONENTS, { recursive: true, encoding: 'utf8' })
      .filter((file) => file.endsWith('.variants.ts'))
      .filter((file) => /ease-bounce/.test(readFileSync(join(COMPONENTS, file), 'utf8')))
      .map((file) => basename(file, '.variants.ts'));
    expect(bouncing).toEqual([]);
  });
});

describe('Menus', () => {
  it('fade in and out on the quick duration token, with no zoom or slide', () => {
    expect(menuFadeMotion).not.toMatch(/zoom-|slide-/);
    // The state variant matters: animate-in / animate-out set their own 150ms at that specificity.
    expect(menuFadeMotion).toContain('data-[state=open]:duration-(--ws-motion-duration-quick)');
    expect(menuFadeMotion).toContain('data-[state=closed]:duration-(--ws-motion-duration-quick)');
  });

  // Popup.Container also opens ComboBox, FilterButton, DatePicker and DateRangePicker;
  // DropdownMenu.Content opens MultiSelect; Select.Content opens TimePicker.
  it.each([
    ['Popup', popupContainerMotionVariants()],
    ['DropdownMenu', dropdownMenuContentMotionVariants()],
    ['Select', selectContentMotionVariants()],
  ])('%s content uses the menu fade', (_, classes) => {
    expect(classes).toBe(menuFadeMotion);
  });
});

describe('Zoom', () => {
  it.each([
    ['Tooltip', tooltipContentMotionVariants()],
    ['Modal', modalContainerMotionVariants()],
    ['StatusModal', statusModalContainerMotionVariants()],
  ])('%s zooms by a --ws-motion-scale token', (_, classes) => {
    const zooms = classes.split(' ').filter((name) => name.includes('zoom-'));
    expect(zooms).not.toEqual([]);
    for (const zoom of zooms) expect(zoom).toMatch(/zoom-(in|out)-\(--ws-motion-scale-[a-z]+\)$/);
  });
});
