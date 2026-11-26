import { defineConfig } from 'vitest/config';

/** Unit tests for the docs app's own components, next to their code (`src/**\/*.test.ts`). */
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
  },
});
