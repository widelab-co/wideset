import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import tailwindcss from '@tailwindcss/postcss';
import postcss from 'postcss';
import ts from 'typescript';

const BLOCKS = 'src/blocks';
export const BLOCK_STYLES = 'block-styles';
const STYLES_TARGET = 'styles/wideset-blocks.css';
const BLOCK_CLASS = 'ws-block-utility';

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

/** Mark the element that gets each block utility, including when a component portals it. */
export function markBlockClasses(source, path) {
  const tree = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
  const edits = [];
  const insert = (pos, text) => edits.push({ pos, end: pos, text });
  const visit = (node) => {
    if (ts.isJsxAttribute(node) && /^(className|\w+ClassName)$/.test(node.name.getText(tree))) {
      const initializer = node.initializer;
      const value =
        initializer && ts.isJsxExpression(initializer) ? initializer.expression : initializer;
      if (value && (ts.isStringLiteralLike(value) || ts.isTemplateExpression(value))) {
        insert(value.getStart(tree) + 1, `${BLOCK_CLASS} `);
      } else if (value) {
        insert(value.getStart(tree), `['${BLOCK_CLASS}', `);
        insert(value.end, "].join(' ')");
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(tree);
  return edits;
}

export const blockStyleImport = `import '@/${STYLES_TARGET}';\n\n`;

export async function blockStyles(root) {
  const path = 'src/styles/blocks.css';
  const source = readFileSync(join(root, path), 'utf8');
  // Before optimisation, each utility is one class rule. Variants are nested inside it.
  const { root: compiled } = await postcss([tailwindcss({ optimize: false })]).process(source, {
    from: join(root, path),
  });
  // A block can also pass classes in nested props such as FileUpload's zoneProps.
  const marker = `:where(.${BLOCK_CLASS}, .${BLOCK_CLASS} *)`;
  const animations = new Map();
  compiled.walkAtRules('keyframes', (rule) => {
    const name = rule.params;
    rule.params = `ws-block-${name}`;
    animations.set(name, rule.params);
  });
  compiled.walkAtRules('layer', (layer) => {
    if (layer.params === 'utilities') {
      layer.each((rule) => {
        if (rule.type === 'rule') rule.selector += marker;
      });
      layer.walkDecls(/^animation(?:-name)?$/, (declaration) => {
        declaration.value = declaration.value.replace(
          /[^\s,]+/g,
          (name) => animations.get(name) ?? name,
        );
      });
    }
    if (layer.params === 'properties') {
      layer.walkRules((rule) => {
        rule.selectors = rule.selectors.map((selector) =>
          selector === '*' ? marker : marker + selector,
        );
      });
    }
  });
  return {
    name: BLOCK_STYLES,
    type: 'registry:item',
    title: 'Wideset block styles',
    description: 'Compiled layout utilities used by Wideset blocks.',
    registryDependencies: ['styles'],
    files: [{ path, type: 'registry:file', target: STYLES_TARGET, content: compiled.toString() }],
  };
}
