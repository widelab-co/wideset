import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** The docs app, the library it documents, and where generated data lands. */
export const docs = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const library = resolve(docs, '../../packages/design-system');
export const componentsDir = join(library, 'src/components');
export const generatedDir = join(docs, 'src/generated');

/** The blocks in the library's manifest (BLOCKS, then PANELS), read as text: no TypeScript. */
export const blockIds = () =>
  [
    ...readFileSync(join(library, 'src/blocks/index.ts'), 'utf8').matchAll(
      /^ {4}id: '([^']+)',$/gm,
    ),
  ].map(([, id]) => id);
