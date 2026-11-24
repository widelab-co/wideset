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

const COMPONENTS = resolve(__dirname, '../components');

const variantFilesMatching = (pattern: RegExp) =>
  readdirSync(COMPONENTS, { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.variants.ts'))
    .filter((file) => pattern.test(readFileSync(join(COMPONENTS, file), 'utf8')))
    .map((file) => basename(file, '.variants.ts'))
    .sort();

describe('Press', () => {
  it('scales buttons only', () => {
    expect(variantFilesMatching(/import[^;]*\bpressMotion\b|active:\S*scale-/)).toEqual([
      'Button',
      'Chip',
      'IconButton',
    ]);
  });
});

describe('Menus', () => {
  it('fade in and out on the quick duration token, with no zoom or slide', () => {
    expect(menuFadeMotion).not.toMatch(/zoom-|slide-/);
    expect(menuFadeMotion).toContain('data-[state=open]:duration-(--ws-motion-duration-quick)');
    expect(menuFadeMotion).toContain('data-[state=closed]:duration-(--ws-motion-duration-quick)');
  });

  it.each([
    ['Popup', popupContainerMotionVariants()],
    ['DropdownMenu', dropdownMenuContentMotionVariants()],
    ['Select', selectContentMotionVariants()],
  ])('%s content uses the menu fade', (_, classes) => {
    expect(classes).toBe(menuFadeMotion);
  });

  it('only panels slide or zoom by a fixed amount', () => {
    expect(variantFilesMatching(/zoom-(in|out)-\d|slide-in-from-/)).toEqual([
      'ActionBar',
      'Sidepanel',
    ]);
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
