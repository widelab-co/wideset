import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

import ts from 'typescript';
import { describe, expect, it } from 'vitest';

/*
  Every compound member has to be reachable by name as well: `Card.Header` and `CardHeader`.
  A React Server Component (Next.js App Router) receives a reference to a client module's named
  exports only, so `Card.Header` is undefined there and `<CardHeader>` is the only form that works.
  The name is always Component + Member. Members of an internal component (one `src/index.ts`
  does not export, like FieldLabel) are internal too.
*/
const ROOT = resolve(__dirname, '..');
const COMPONENTS = join(ROOT, 'components');
// Internal identifier → public name, where they differ.
const PUBLIC_NAME: Record<string, string> = { PaginationComponent: 'Pagination' };

const valueExports = (() => {
  const source = readFileSync(join(ROOT, 'index.ts'), 'utf8');
  const sf = ts.createSourceFile('index.ts', source, ts.ScriptTarget.Latest, true);
  const names = new Set<string>();
  sf.forEachChild((node) => {
    if (!ts.isExportDeclaration(node) || node.isTypeOnly || !node.exportClause) return;
    if (!ts.isNamedExports(node.exportClause)) return;
    for (const el of node.exportClause.elements) if (!el.isTypeOnly) names.add(el.name.text);
  });
  return names;
})();

const members = readdirSync(COMPONENTS)
  .filter((dir) => statSync(join(COMPONENTS, dir)).isDirectory())
  .flatMap((dir) =>
    readdirSync(join(COMPONENTS, dir))
      .filter((file) => file.endsWith('.tsx') && !/\.(stories|test)\.tsx$/.test(file))
      .flatMap((file) => {
        const source = readFileSync(join(COMPONENTS, dir, file), 'utf8');
        return [...source.matchAll(/^(\w+)\.(\w+) = [\w.]+;$/gm)]
          .filter(([, , member]) => member !== 'displayName' && member !== 'variants')
          .map(([, component, member]) => ({
            dotted: `${PUBLIC_NAME[component] ?? component}.${member}`,
            named: `${PUBLIC_NAME[component] ?? component}${member}`,
            file: `${dir}/${file}`,
          }))
          .filter(({ dotted }) => valueExports.has(dotted.split('.')[0]));
      }),
  );

describe('named exports for compound members', () => {
  it('finds the compound components', () => {
    expect(members.length).toBeGreaterThan(150);
  });

  it.each(members)('$dotted is exported as $named', ({ named }) => {
    expect(valueExports.has(named)).toBe(true);
  });
});
