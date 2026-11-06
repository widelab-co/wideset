import process from 'node:process';
import { fileURLToPath, URL } from 'node:url';

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

const library = (path) =>
  fileURLToPath(new URL(`../../packages/design-system/${path}`, import.meta.url));

/**
 * The documentation site. Static output; React runs only in the islands that need it (the
 * playground, the examples, the theme toggle).
 *
 * The site renders the library from its source, one copy for every page: the examples in
 * `packages/design-system/src/components/<folder>/examples/` import `@wideset/react` as a
 * consumer does, and that name resolves to `src/index.ts` here as it does in Storybook and
 * the tests. Only the stylesheets come from the built package (`@wideset/react/styles`),
 * which Turborepo builds first (`dependsOn: ["^build"]`).
 */
export default defineConfig({
  // The deploy job in build.yaml sets DOCS_URL per environment (develop, PR previews).
  site: process.env.DOCS_URL || 'https://wideset-docs.widelab.workers.dev',
  // Site contract (wideset-edge/SITE_CONTRACT.md): the docs' assets live under /_docs/, so they
  // never collide with the landing's on the shared domain; pages have no trailing slash.
  build: { assets: '_docs' },
  trailingSlash: 'never',
  integrations: [react(), mdx()],
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  // Code in the Markdown pages carries both themes as variables, like the CodeBlock island;
  // docs.css picks one by `.dark`. Astro's default (github-dark only) is unreadable on light.
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' }, defaultColor: false },
  },
  // The site opens on the Introduction; there is no separate home page.
  redirects: { '/': '/docs/introduction' },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: [
        { find: /^@wideset\/react$/, replacement: library('src/index.ts') },
        // The library imports its own files from its root (`src/lib/utils`).
        { find: /^src\//, replacement: `${library('src')}/` },
      ],
    },
    // The examples load lazily, one per card; scanning them up front keeps the dev server
    // from re-bundling their dependencies mid-page ("Outdated Optimize Dep").
    optimizeDeps: {
      entries: [
        'src/**/*.{astro,ts,tsx}',
        '../../packages/design-system/src/components/*/examples/*/*.tsx',
      ],
    },
  },
});
