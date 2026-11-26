import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vitest/config';

const library = (path: string) =>
  fileURLToPath(new URL(`../../packages/design-system/${path}`, import.meta.url));

/**
 * Unit tests for the docs app's own code, next to it (`src/**\/*.test.ts`). The aliases are
 * astro.config.mjs's, so a test can render the library from its source as the site does.
 */
export default defineConfig({
  resolve: {
    alias: [
      { find: /^@wideset\/react$/, replacement: library('src/index.ts') },
      { find: /^src\//, replacement: `${library('src')}/` },
    ],
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
  },
});
