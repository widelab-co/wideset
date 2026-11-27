import { readdirSync, readFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { menuFadeMotion } from './recipes';

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

  it('only panels, dialogs, the tooltip and check marks zoom or slide', () => {
    expect(variantFilesMatching(/zoom-(in|out)-[\d[(]|slide-(in-from|out-to)-/)).toEqual([
      'ActionBar',
      'Checkbox',
      'Modal',
      'RadioButton',
      'Sidepanel',
      'StatusModal',
      'Tooltip',
    ]);
  });
});
