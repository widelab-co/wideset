/**
 * The component relationship graph, read out of imports so the map on a page is never a
 * hand-maintained picture. Two kinds of edge:
 *
 * - `uses`: one component's runtime files import another (TextInput contains an IconButton);
 * - `with`: the two appear together in a story file or an example (how the system
 *   expects them to meet without either being built from the other).
 *
 * Output: src/generated/graph.json  { nodes: [{ id, title }], edges: [{ from, to, kind }] }
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { componentsDir, generatedDir } from './paths.mjs';

const catalog = JSON.parse(readFileSync(join(generatedDir, 'catalog.json'), 'utf8'));
const stem = (fileName) =>
  fileName.replace(/\.(tsx?|jsx?)$/, '').replace(/\.(variants|types|context|figma-spec)$/, '');

const entries = catalog
  .map((entry) => ({
    id: entry.id,
    title: entry.title,
    folder: entry.component,
    name: entry.exports[0] ?? entry.component,
    exports: entry.exports,
    examples: entry.examples,
    files: new Set(entry.sourceFiles.map((path) => path.split('/').pop())),
  }))
  .filter((entry) => entry.folder);

const byFolder = new Map();
for (const entry of entries) {
  if (!byFolder.has(entry.folder)) byFolder.set(entry.folder, []);
  byFolder.get(entry.folder).push(entry);
}
const byExport = new Map();
for (const entry of entries) for (const name of entry.exports) byExport.set(name, entry);

const ownerOf = (folder, fileName) => {
  const candidates = byFolder.get(folder);
  if (!candidates) return null;
  const primary =
    candidates.find((entry) => entry.id === folder) ??
    [...candidates].sort((a, b) => a.name.length - b.name.length)[0];
  const base = stem(fileName);
  const declared = candidates.find((entry) => entry.files.has(fileName));
  if (declared) return declared;
  const matches = candidates
    .filter((entry) => base.startsWith(entry.name))
    .sort((a, b) => b.name.length - a.name.length);
  return matches[0] ?? primary;
};

const isSource = (name) => /\.tsx?$/.test(name) && !/\.d\.ts$/.test(name);
const isStory = (name) => /\.stories\.tsx?$/.test(name);
const isTest = (name) => /\.test\.tsx?$/.test(name);
const namedImports = /import\s+(type\s+)?\{([^}]*)\}\s+from\s+['"]([^'"]+)['"]/g;
const symbolsOf = (clause) =>
  clause
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part && !part.startsWith('type '))
    .map((part) => part.split(/\s+as\s+/)[0].trim())
    .filter(Boolean);

const key = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);
const uses = new Map();
const together = new Map();
const record = (map, from, to) => {
  if (from !== to) map.set(key(from, to), [from, to]);
};

const folders = readdirSync(componentsDir).filter((name) =>
  statSync(join(componentsDir, name)).isDirectory(),
);
for (const folder of folders) {
  for (const file of readdirSync(join(componentsDir, folder)).filter(isSource)) {
    if (isTest(file)) continue;
    const owner = ownerOf(folder, file);
    if (!owner) continue;
    const source = readFileSync(join(componentsDir, folder, file), 'utf8');
    const targets = new Set();
    for (const match of source.matchAll(namedImports)) {
      if (match[1]) continue;
      const path = match[3];
      if (!path.startsWith('.')) continue;
      const segments = path.split('/');
      const targetFile = segments[segments.length - 1];
      const targetFolder = path.startsWith('./') ? folder : segments[segments.length - 2];
      if (!folders.includes(targetFolder)) continue;
      for (const symbol of symbolsOf(match[2])) {
        const target = byExport.get(symbol) ?? ownerOf(targetFolder, `${targetFile}.tsx`);
        if (target && target.folder === targetFolder) targets.add(target.id);
      }
    }
    for (const target of targets) record(isStory(file) ? together : uses, owner.id, target);
  }
}

// The examples: what a page shows next to the component it documents.
const packageImports = /import\s+(type\s+)?\{([^}]*)\}\s+from\s+['"]@wideset\/react['"]/g;
for (const owner of entries) {
  const folder = join(componentsDir, owner.examples);
  if (!existsSync(folder)) continue;
  for (const file of readdirSync(folder).filter(isSource)) {
    const source = readFileSync(join(folder, file), 'utf8');
    for (const match of source.matchAll(packageImports)) {
      if (match[1]) continue;
      for (const symbol of symbolsOf(match[2])) {
        const target = byExport.get(symbol);
        if (target) record(together, owner.id, target.id);
      }
    }
  }
}

const edges = [
  ...[...uses.values()].map(([from, to]) => ({ from, to, kind: 'uses' })),
  ...[...together.entries()]
    .filter(([id]) => !uses.has(id))
    .map(([, [from, to]]) => ({ from, to, kind: 'with' })),
].sort((a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to));
const nodes = entries.map(({ id, title }) => ({ id, title }));

writeFileSync(join(generatedDir, 'graph.json'), JSON.stringify({ nodes, edges }, null, 2) + '\n');
console.log(`graph: ${nodes.length} components, ${edges.length} edges`);
