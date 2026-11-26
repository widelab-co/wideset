import { MultiSelect, Select } from '@wideset/react';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { resolveUtility, type TokenClassData } from '../../scripts/token-classes.mjs';
import tokenClassData from '../generated/token-classes.json';
import { segments } from './tokenClasses';
import type { tokenUsage } from './tokenUsage';

const options = [{ label: 'Poland', value: 'poland' }];

describe('token usage of portalled menus', () => {
  let components: ReturnType<typeof tokenUsage>['components'];

  beforeAll(async () => {
    // Load all playgrounds, as the server does when it builds the graph.
    vi.stubEnv('SSR', true);
    try {
      components = (await import('./tokenUsage')).tokenUsage().components;
    } finally {
      vi.unstubAllEnvs();
    }
  }, 120_000);

  const scrollIntoView = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollIntoView');
  beforeEach(() => {
    // Radix Select focuses and scrolls the selected option when it opens.
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn(),
    });
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    if (scrollIntoView) Object.defineProperty(Element.prototype, 'scrollIntoView', scrollIntoView);
    else Reflect.deleteProperty(Element.prototype, 'scrollIntoView');
  });

  it.each([
    {
      id: 'select',
      slot: 'select-content',
      part: 'SelectContent',
      // SelectContent defaults to popper. Position is a part prop, separate from the playground.
      partDefaults: { position: 'popper' },
      menu: () => createElement(Select, { options, defaultOpen: true }),
    },
    {
      id: 'select',
      slot: 'select-content',
      part: 'SelectContent',
      partDefaults: { position: 'item-aligned' },
      menu: () =>
        createElement(
          Select,
          { defaultOpen: true, defaultValue: 'poland' },
          createElement(Select.Trigger, null, createElement(Select.Value)),
          createElement(
            Select.Content,
            { position: 'item-aligned' },
            createElement(Select.Option, { value: 'poland' }, 'Poland'),
          ),
        ),
    },
    {
      id: 'multi-select',
      slot: 'multi-select-content',
      part: 'MultiSelectContent',
      partDefaults: { hasSearch: true },
      menu: () => createElement(MultiSelect, { options, defaultOpen: true, hasSearch: true }),
    },
    {
      id: 'multi-select',
      slot: 'multi-select-content',
      part: 'MultiSelectContent',
      partDefaults: {},
      menu: () => createElement(MultiSelect, { options, defaultOpen: true }),
    },
  ])(
    'matches $slot with part props $partDefaults',
    async ({ id, slot, part, partDefaults, menu }) => {
      const { defaults, uses } = components[id];
      const activeValues = new Map([...Object.entries(defaults), ...Object.entries(partDefaults)]);
      const expected = new Set(
        uses
          .filter(
            (use) =>
              use.part === part &&
              !use.nested &&
              use.when.some((values) =>
                Object.entries(values).every(([key, value]) => activeValues.get(key) === value),
              ),
          )
          .map((use) => use.className),
      );

      const container = document.createElement('div');
      document.body.append(container);
      const root = createRoot(container);
      try {
        await act(async () => root.render(menu()));
        const content = document.body.querySelector(`[data-slot="${slot}"]`);
        if (!content) throw new Error(`Could not find the portalled ${slot}`);
        expect(container.contains(content)).toBe(false);
        const actual = new Set(
          Array.from(content.classList).filter((className) => {
            const utility = segments(className).at(-1)!;
            return resolveUtility(tokenClassData as TokenClassData, utility)?.length;
          }),
        );
        const hint =
          `${part}: compare the rendered slot with PORTALLED in apps/docs/src/lib/tokenUsagePortals.ts. ` +
          'If the component change is intentional, update the variant sources or arguments in that map. ' +
          'If the classes should have stayed the same, fix the component.';
        expect(expected.size, hint).toBeGreaterThan(0);
        expect(actual, hint).toEqual(expected);
      } finally {
        await act(async () => root.unmount());
        container.remove();
      }
    },
  );
});
