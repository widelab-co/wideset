/**
 * The catalogue: which components have a page and their one-line description, read from the
 * library so none of it is a hand-maintained copy. Parsed with the TypeScript API, not regexes.
 *
 * - one entry per `*.stories.tsx` whose component the library exports (`src/index.ts`): the
 *   `button` folder holds Button, IconButton, LinkButton and SplitButton, so stories are the
 *   unit, not folders; a story of an internal component (FieldLabel, Thumbnail) has no page;
 * - one list, "Components"; a story title with three segments (`Components/Button/IconButton`)
 *   folds the component under its family in the left column;
 * - the description is the first sentence of the meta's `parameters.docs.description.component`;
 * - the examples live in `src/components/<folder>/examples/<id>/` (see src/lib/examples.ts);
 * - `since` is the first release tag that contains the story file, read from git;
 * - `propTypes` are the `<Name>Props` keys in props.json from the same folder: the
 *   component's own first, then its exported members (`CardHeaderProps`, `ButtonIconProps`),
 *   minus another story's own type (CheckboxGroup has its own page, not a table on Checkbox).
 *
 * Output: src/generated/catalog.json, src/generated/pages.json
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import ts from 'typescript';

import { componentsDir, generatedDir, library } from './paths.mjs';

const props = JSON.parse(readFileSync(join(generatedDir, 'props.json'), 'utf8'));

const parse = (file) =>
  ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);

/** Every name `src/index.ts` exports, values and types. */
const publicNames = new Set();
for (const statement of parse(join(library, 'src/index.ts')).statements) {
  if (!ts.isExportDeclaration(statement) || !statement.exportClause) continue;
  if (!ts.isNamedExports(statement.exportClause)) continue;
  for (const element of statement.exportClause.elements) publicNames.add(element.name.text);
}
/** The exported name, which can differ in case from the story file (`Timepicker` → `TimePicker`). */
const exportedName = (name) =>
  [...publicNames].find((item) => item.toLowerCase() === name.toLowerCase());

/** `IconButton` → `icon-button` */
const slug = (name) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
/** `IconButton` → `Icon Button`: a component's name keeps a capital on every word. */
const title = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1 $2');

const firstSentence = (text) => {
  if (!text) return null;
  const cleaned = text
    .split('```')[0]
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const match = cleaned.match(/^(.*?[.!])(\s|$)/);
  const sentence = (match ? match[1] : cleaned).trim();
  return sentence.length > 0 ? sentence : null;
};

// --- the stories meta, read from the syntax tree --------------------------------------------

const unwrap = (node) =>
  node &&
  (ts.isSatisfiesExpression(node) || ts.isAsExpression(node) || ts.isParenthesizedExpression(node))
    ? unwrap(node.expression)
    : node;
const property = (object, name) => {
  const found = object.properties.find(
    (item) => ts.isPropertyAssignment(item) && item.name.getText() === name,
  );
  return found && unwrap(found.initializer);
};
const textOf = (node) =>
  node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
    ? node.text
    : undefined;
const at = (object, ...names) =>
  names.reduce(
    (node, name) => (node && ts.isObjectLiteralExpression(node) ? property(node, name) : undefined),
    object,
  );

/** The object a stories file exports as default (`const meta = {…}; export default meta;`). */
const metaOf = (file) => {
  const declarations = new Map();
  let exported;
  for (const statement of parse(file).statements) {
    if (ts.isVariableStatement(statement))
      for (const declaration of statement.declarationList.declarations)
        if (ts.isIdentifier(declaration.name))
          declarations.set(declaration.name.text, declaration.initializer);
    if (ts.isExportAssignment(statement)) exported = unwrap(statement.expression);
  }
  const meta =
    exported && ts.isIdentifier(exported) ? unwrap(declarations.get(exported.text)) : exported;
  if (!meta || !ts.isObjectLiteralExpression(meta))
    throw new Error(`catalog: no default-exported meta object in ${file}`);
  return {
    title: textOf(property(meta, 'title')),
    description: textOf(at(meta, 'parameters', 'docs', 'description', 'component')),
  };
};

// --- entries ---------------------------------------------------------------------------------

const storyFiles = [];
for (const dir of readdirSync(componentsDir)) {
  const full = join(componentsDir, dir);
  if (!statSync(full).isDirectory()) continue;
  for (const file of readdirSync(full).filter((name) => name.endsWith('.stories.tsx')))
    storyFiles.push({ dir, file, name: file.replace('.stories.tsx', '') });
}
const storyNames = new Set(storyFiles.map((story) => story.name.toLowerCase()));

const propTypesFor = (name, dir) => {
  const own = `${name}Props`;
  const members = Object.keys(props)
    .filter(
      (key) =>
        key !== own &&
        key.startsWith(name) &&
        props[key].component === dir &&
        publicNames.has(key) &&
        !storyNames.has(key.replace(/Props$/, '').toLowerCase()),
    )
    .sort();
  return [...(own in props ? [own] : []), ...members];
};

const entries = [];
for (const { dir, file, name } of storyFiles) {
  const exported = exportedName(name);
  if (!exported) continue; // an internal component: Storybook only
  const meta = metaOf(join(componentsDir, dir, file));
  if (!meta.title) throw new Error(`catalog: no story title in src/components/${dir}/${file}`);
  const id = slug(name);
  entries.push({
    id,
    title: title(exported),
    component: dir,
    storyTitle: meta.title,
    storyFile: `src/components/${dir}/${file}`,
    examples: `${dir}/examples/${id}`,
    description: firstSentence(meta.description),
    exports: [exported],
    propTypes: propTypesFor(exported, dir),
    sourceFiles: [
      `src/components/${dir}/${name}.tsx`,
      `src/components/${dir}/${name}.variants.ts`,
    ].filter((path) => existsSync(join(library, path))),
  });
}
entries.sort((a, b) => a.title.localeCompare(b.title));

/**
 * The version a component first shipped in: the oldest `v*` tag containing the commit that
 * added its story file. Without the history (a shallow clone) or before any tag contains it,
 * there is no version and the page shows none.
 */
const git = (...args) => {
  try {
    return execFileSync('git', args, { cwd: library, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
};
const shallow = git('rev-parse', '--is-shallow-repository') !== 'false';
for (const entry of entries) {
  const added = shallow
    ? ''
    : git('log', '--diff-filter=A', '--follow', '--format=%H', '--', entry.storyFile)
        .split('\n')
        .at(-1);
  const tag = added
    ? git('tag', '--contains', added, '--sort=v:refname', '--list', 'v*').split('\n')[0]
    : '';
  if (tag) entry.since = tag.replace(/^v/, '');
}

if (!existsSync(generatedDir)) mkdirSync(generatedDir, { recursive: true });
writeFileSync(join(generatedDir, 'catalog.json'), JSON.stringify(entries, null, 2) + '\n');
// What the browser needs per page (its examples folder, and the props type its playground
// switches) without pulling the whole catalogue in.
writeFileSync(
  join(generatedDir, 'pages.json'),
  JSON.stringify(
    Object.fromEntries(
      entries.map((entry) => [entry.id, { examples: entry.examples, props: entry.propTypes[0] }]),
    ),
    null,
    2,
  ) + '\n',
);
const missing = entries.filter((entry) => !entry.description).map((entry) => entry.id);
console.log(
  `catalog: ${entries.length} components${missing.length ? `, no description for ${missing.join(', ')}` : ''}`,
);
