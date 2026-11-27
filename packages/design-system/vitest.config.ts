/// <reference types="vitest" />
import fs from 'fs';
import path from 'path';
import { configDefaults, defineConfig } from 'vitest/config';

// On Windows the root is derived from the shell's cwd, whose drive letter (and any
// path segment) can be cased differently from the filesystem. Vitest then loads its
// own modules under two URLs, the runner never initialises, and every file fails to
// collect with "Cannot read properties of undefined". realpath returns the true case.
// https://github.com/vitest-dev/vitest/issues/5251
const projectRoot = fs.realpathSync.native(path.resolve(__dirname));

export default defineConfig({
  root: projectRoot,
  resolve: {
    alias: [
      // Examples (src/components/*/examples/) import the library by its package name.
      { find: /^@wideset\/react$/, replacement: path.resolve(projectRoot, './src/index.ts') },
      { find: 'src', replacement: path.resolve(projectRoot, './src') },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    // StrictMode (test-setup.ts) renders twice; the timeout catches a hang, not a slow render.
    testTimeout: 15_000,
    exclude: [...configDefaults.exclude, '**/.claude/**'],
  },
});
