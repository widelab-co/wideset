import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import tailwindcss from '@tailwindcss/postcss';
import postcss from 'postcss';
import ts from 'typescript';

const BLOCKS = 'src/blocks';
export const BLOCK_STYLES = 'block-styles';
const STYLES_TARGET = 'styles/wideset-blocks.css';

const syntaxOf = (root, path) =>
  ts.createSourceFile(path, readFileSync(join(root, path), 'utf8'), ts.ScriptTarget.Latest, true);

export function blockEntries(root) {
  const manifest = join(root, BLOCKS, 'index.ts');
  if (!existsSync(manifest)) return [];

  const entries = [];
  const ids = new Set();
  const lists = new Set(['BLOCKS', 'PANELS']);
  for (const statement of syntaxOf(root, `${BLOCKS}/index.ts`).statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const list of statement.declarationList.declarations) {
      if (!lists.delete(list.name.getText())) continue;
      if (!list.initializer || !ts.isArrayLiteralExpression(list.initializer))
        throw new Error(`build-registry: ${list.name.getText()} must be an array of block entries`);
      for (const node of list.initializer.elements) {
        if (!ts.isObjectLiteralExpression(node))
          throw new Error(`build-registry: invalid entry in ${list.name.getText()}`);
        const field = (key) => {
          const property = node.properties.find(
            (member) => ts.isPropertyAssignment(member) && member.name.getText() === key,
          );
          return property && ts.isStringLiteral(property.initializer)
            ? property.initializer.text
            : undefined;
        };
        const id = field('id');
        const title = field('title');
        const description = field('description');
        if (!id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || !title || !description || ids.has(id))
          throw new Error(`build-registry: invalid or duplicate block entry ${id}`);
        ids.add(id);
        const path = `${BLOCKS}/${id}`;
        if (!existsSync(join(root, path, 'index.tsx')))
          throw new Error(`build-registry: block-${id} is missing ${path}/index.tsx`);
        entries.push({
          name: `block-${id}`,
          title,
          description,
          type: 'registry:block',
          registryDependencies: [BLOCK_STYLES],
          files: [{ path, type: 'registry:file', target: `blocks/wideset/${id}` }],
        });
      }
    }
  }
  if (lists.size)
    throw new Error('build-registry: the block manifest must declare BLOCKS and PANELS');
  return entries;
}

export function publicExports(root) {
  const entry = syntaxOf(root, 'src/index.ts');
  const exports = new Map();
  for (const node of entry.statements) {
    if (!ts.isExportDeclaration(node) || !node.moduleSpecifier || !node.exportClause) continue;
    if (!ts.isNamedExports(node.exportClause)) continue;
    for (const name of node.exportClause.elements) {
      exports.set(name.name.text, {
        spec: node.moduleSpecifier.text,
        name: (name.propertyName ?? name.name).text,
      });
    }
  }
  return exports;
}

export function rewriteBlockImports(source, path, locate, fail) {
  const tree = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
  const edits = [];
  for (const node of tree.statements) {
    if (!ts.isImportDeclaration(node) || node.moduleSpecifier.text !== '@wideset/react') continue;
    const clause = node.importClause;
    if (!clause?.namedBindings || clause.name || !ts.isNamedImports(clause.namedBindings))
      fail('imports @wideset/react without named specifiers');
    const groups = new Map();
    for (const { name, propertyName, isTypeOnly } of clause.namedBindings.elements) {
      const { target, exported } = locate((propertyName ?? name).text);
      const specifier = exported === name.text ? exported : `${exported} as ${name.text}`;
      const names = groups.get(target) ?? [];
      names.push(isTypeOnly ? `type ${specifier}` : specifier);
      groups.set(target, names);
    }
    const text = [...groups]
      .map(
        ([target, names]) =>
          `import ${clause.isTypeOnly ? 'type ' : ''}{ ${names.join(', ')} } from '@/${target}';`,
      )
      .join('\n');
    edits.push({ pos: node.getStart(tree), end: node.end, text });
  }
  return edits;
}

export const blockStyleImport = `import '@/${STYLES_TARGET}';\n\n`;

export async function blockStyles(root) {
  const path = 'src/styles/blocks.css';
  const source = readFileSync(join(root, path), 'utf8');
  const { css } = await postcss([tailwindcss({ optimize: { minify: false } })]).process(source, {
    from: join(root, path),
  });
  return {
    name: BLOCK_STYLES,
    type: 'registry:item',
    title: 'Wideset block styles',
    description: 'Compiled layout utilities used by Wideset blocks.',
    registryDependencies: ['styles'],
    files: [{ path, type: 'registry:file', target: STYLES_TARGET, content: css }],
  };
}
