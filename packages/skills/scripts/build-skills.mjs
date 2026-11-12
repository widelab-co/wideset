/*
  Generates every file in this package that comes from somewhere else, so the skills cannot drift.
  Usage guidance is written once, by hand, in packages/design-system/specs; the docs site renders
  the same files. Props and tokens are not copied: an agent reads them from the component source
  or from https://wideset.co/components/<id>.md. Per-component good practices are the one part
  of a component spec that ships: the sections source cannot state.

    pnpm build:skills                 # from the repository root
    node scripts/build-skills.mjs     # from packages/skills

  Written here (never edit these by hand; src/skills.test.ts fails when they are stale):
    skills/wideset-build/references/specs/**  the cross-cutting specs for a consumer: README, patterns
                                              and the component group READMEs. Tokens, foundations and
                                              the full per-component specs stay in the library for the
                                              docs site; a link to a foundation points at its docs .md
                                              page
    skills/wideset-build/references/good-practices/<id>.md
                                              one per component spec: its title and GOOD_PRACTICE_SECTIONS
    skills/wideset-build/references/good-practices.md
                                              the entry point: one line per component, by group
    skills/wideset-build/references/registry-imports.md
                                              every public export of the library with the import a
                                              registry install gives it, from src/index.ts and
                                              registry.json
    skills/wideset-setup/SKILL.md             only its metadata.wideset-version line
    AGENTS.wideset.md                         templates/AGENTS.wideset.md with its slots filled
    cursor/wideset.mdc                        a thin pointer for Cursor
    agents/wideset-*-reviewer.md              frontmatter + skills/wideset-review/references/*.md
    .claude-plugin/plugin.json                only its version

  The output carries no dates, commits or `since` versions: a new git tag must not make it stale.
*/
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, posix, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import prettier from 'prettier';
import ts from 'typescript';

import { filesUnder, frontmatterOf } from './skill-files.mjs';

const PACKAGE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LIBRARY = resolve(PACKAGE, '../design-system');
const SPECS = join(LIBRARY, 'specs');
export const SPECS_DIR = 'skills/wideset-build/references/specs';
export const REGISTRY_IMPORTS = 'skills/wideset-build/references/registry-imports.md';
export const GOOD_PRACTICES_DIR = 'skills/wideset-build/references/good-practices';
export const GOOD_PRACTICES_INDEX = 'skills/wideset-build/references/good-practices.md';
/** What an agent cannot read from source, in reading order. */
export const GOOD_PRACTICE_SECTIONS = ['When to use', 'When not to use', "Do / Don't", 'Gotchas'];

const lf = (text) => text.replace(/\r\n/g, '\n');
const readText = (path) => lf(readFileSync(path, 'utf8'));

// --- specs -----------------------------------------------------------------------------------

/**
 * A spec as a consumer reads it: without what only makes sense inside this repository (Figma node
 * ids, Storybook ids, source paths, how to write a spec). Copied files must not carry a repo path;
 * src/skills.test.ts fails on any that a change here misses.
 */
export function specForConsumer(text) {
  return lf(text)
    .replace(/^(figma|storybook):.*\n/gm, '')
    .replace(/ · Types:\s*`packages\/design-system\/[^`]*`/g, '')
    .replace(/ \(plus `\w+` in\s*`packages\/design-system\/[^`]*`\)/g, '')
    .replace(/ · Source:[^\n]*(?:\n(?!\n)[^\n]*)*/g, '')
    .replace(/^Source:[^\n]*(?:\n(?!\n)[^\n]*)*\n\n/gm, '')
    .replace(/^## Using these specs in your project\n[\s\S]*?(?=^## )/m, '')
    .replace(/^## Foundations\n[\s\S]*?(?=^## )/m, '')
    .replace(/, a foundation file to style around it/, '')
    .replace(/its spec \(or, in the Wideset skills, its docs page\)/, 'its good-practices file')
    .replace(/`packages\/design-system\/src\/styles\/utilities\/([\w.-]+)`/g, '`$1`')
    .replace(/ Writing or changing a spec:\s*\[AUTHORING\.md\]\(AUTHORING\.md\)\./, '');
}

/**
 * The always-on component index, from the hand-written lines in specs/README.md. Those lines carry
 * the "not X" decision, which a prop table cannot. Deprecated components stay out, so the index
 * never suggests one.
 */
export function componentIndex(readme) {
  const section = lf(readme).match(/^## Components\n([\s\S]*?)(?=^## |(?![\s\S]))/m);
  if (!section) throw new Error('build-skills: specs/README.md has no Components section');
  return [
    ...section[1].matchAll(
      /^- \[([^\]]+)\]\([^)]+\):\s*([\s\S]*?)(?=\n- \[|\n\n|\n#|$(?![\s\S]))/gm,
    ),
  ]
    .filter(([, , text]) => !/\*\*deprecated\*\*/i.test(text))
    .map(([, name, text]) => `- ${name}: ${text.replace(/\s*\n\s*/g, ' ').trim()}`)
    .join('\n');
}

/** A full per-component spec (components/<group>/<name>.md) is not shipped; a group README is. */
export const isComponentSpec = (path) => /^components\/[^/]+\/(?!README\.md$)[^/]+\.md$/.test(path);

/**
 * Foundations and tokens stay in the library for the docs site. Agents never opened them, so their
 * rules are condensed by hand in wideset-craft/references/foundations.md.
 */
const isFoundationSpec = (path) => path === 'tokens.md' || path.startsWith('foundations/');

export const isShippedSpec = (path) =>
  path !== 'AUTHORING.md' && !isComponentSpec(path) && !isFoundationSpec(path);

/** The docs page of a foundation that has one; a link to any other keeps only its text. */
const FOUNDATION_DOCS = {
  'tokens.md': 'tokens',
  'foundations/color.md': 'colors',
  'foundations/elevation.md': 'elevation',
  'foundations/iconography.md': 'icons',
  'foundations/motion.md': 'motion',
  'foundations/radius.md': 'radius',
  'foundations/spacing.md': 'spacing',
  'foundations/theming.md': 'theming',
  'foundations/typography.md': 'typography',
};

/**
 * `components/<group>/<name>.md` → its good-practices file, named after the docs id in the `docs:`
 * frontmatter line, the id every other Wideset URL uses.
 */
function goodPracticeFiles(specs) {
  const files = new Map();
  for (const path of filesUnder(specs).filter(isComponentSpec)) {
    const docs = frontmatterOf(readText(join(specs, path))).docs;
    if (!docs) throw new Error(`build-skills: ${path} has no docs: line`);
    files.set(path, `${GOOD_PRACTICES_DIR}/${posix.basename(docs)}.md`);
  }
  if (new Set(files.values()).size !== files.size)
    throw new Error('build-skills: two component specs share a docs id');
  return files;
}

/**
 * Rewrites the relative links of a spec for where its copy lands (`output`): a component spec's
 * link goes to its good-practices file, a shipped spec's to its copy, and a foundation's to its
 * docs Markdown page. A foundation with no docs page loses the link and keeps its text.
 */
export function relinkSpec(file, text, goodPractices, output = `${SPECS_DIR}/${file}`) {
  const local = (path) => posix.relative(posix.dirname(output), path);
  return text.replace(
    /\[([^\]]*)\]\(([^)\s#]+\.md)(#[^)\s]*)?\)/g,
    (match, label, target, hash = '') => {
      if (/^[a-z]+:/i.test(target)) return match;
      const path = posix.normalize(posix.join(posix.dirname(file), target));
      if (goodPractices.has(path)) return `[${label}](${local(goodPractices.get(path))}${hash})`;
      if (isFoundationSpec(path))
        return FOUNDATION_DOCS[path]
          ? `[${label}](https://wideset.co/docs/${FOUNDATION_DOCS[path]}.md${hash})`
          : label;
      return isShippedSpec(path) ? `[${label}](${local(`${SPECS_DIR}/${path}`)}${hash})` : match;
    },
  );
}

// --- good practices ---------------------------------------------------------------------------

/** A spec's `## ` sections, name → body, ignoring the same text inside a code fence. */
export function specSections(text) {
  const sections = new Map();
  let current = null;
  let fenced = false;
  for (const line of lf(text).split('\n')) {
    if (line.startsWith('```')) fenced = !fenced;
    const heading = !fenced && line.match(/^## (.+)$/);
    if (heading) {
      current = heading[1].trim();
      sections.set(current, []);
    } else if (current) sections.get(current).push(line);
  }
  return new Map([...sections].map(([name, lines]) => [name, lines.join('\n').trim()]));
}

/** A component's file: its title and the sections source cannot state, those it has. */
export function goodPracticePage(text) {
  const title = lf(text).match(/^# .+$/m)?.[0];
  if (!title) throw new Error('build-skills: a component spec has no title');
  const sections = specSections(text);
  const body = GOOD_PRACTICE_SECTIONS.filter((name) => sections.get(name)).map(
    (name) => `## ${name}\n\n${sections.get(name)}`,
  );
  return `${[title, ...body].join('\n\n')}\n`;
}

/**
 * The entry point, from the hand-written lines in specs/README.md: the same groups and sentences as
 * the always-on index, with deprecated components kept because their files say what replaces them.
 */
export function goodPracticesIndex(readme, goodPractices) {
  const section = lf(readme).match(/^## Components\n([\s\S]*?)(?=^## |(?![\s\S]))/m);
  if (!section) throw new Error('build-skills: specs/README.md has no Components section');
  const local = (path) => posix.relative(posix.dirname(GOOD_PRACTICES_INDEX), path);
  const listed = new Set();
  const groups = section[1].split(/^(?=### )/m).filter((group) => group.startsWith('### '));
  const body = groups.map((group) => {
    const [, name, readmePath] = group.match(/^### \[([^\]]+)\]\(([^)]+)\)/);
    const lines = [
      ...group.matchAll(
        /^- \[([^\]]+)\]\(([^)]+)\):\s*([\s\S]*?)(?=\n- \[|\n\n|\n#|$(?![\s\S]))/gm,
      ),
    ].map(([, component, path, text]) => {
      if (!goodPractices.has(path)) throw new Error(`build-skills: README lists ${path}, no spec`);
      listed.add(path);
      return `- [${component}](${local(goodPractices.get(path))}): ${text.replace(/\s*\n\s*/g, ' ').trim()}`;
    });
    return `## [${name}](${local(`${SPECS_DIR}/${readmePath}`)})\n\n${lines.join('\n')}`;
  });
  const missing = [...goodPractices.keys()].filter((path) => !listed.has(path));
  if (missing.length) throw new Error(`build-skills: not in README: ${missing.join(', ')}`);
  return `# Good practices

One file per component: when to use it, when not, do and don't, and gotchas. Read a component's file before you use it, and its source for props. To choose between components, start from the group file in each heading. Rules for every component: [the specs index](specs/README.md#rules-that-hold-everywhere) and [what compiles and still breaks](../SKILL.md#what-compiles-and-still-breaks).

${body.join('\n\n')}
`;
}

// --- registry imports ------------------------------------------------------------------------

/** The source file an export in src/index.ts comes from, relative to the library. */
function sourceFile(library, specifier) {
  const base = posix.join('src', specifier);
  const file = ['.ts', '.tsx', '/index.ts', '/index.tsx']
    .map((extension) => base + extension)
    .find((candidate) => existsSync(join(library, candidate)));
  if (!file)
    throw new Error(`build-skills: src/index.ts exports from ${specifier}, which is missing`);
  return file;
}

/**
 * Where a source file lands in a project: its declared target or, as build-registry.mjs does for a
 * file it reaches by walking imports, the folder its neighbours in registry.json install to.
 */
function installedPath(file, registry) {
  const declared = registry.items.flatMap((item) => item.files ?? []);
  const own = declared.find(({ path }) => path === file);
  if (own) return own.target;
  const folders = new Set(
    declared
      .filter(({ path }) => posix.dirname(path) === posix.dirname(file))
      .map(({ target }) => posix.dirname(target)),
  );
  if (folders.size !== 1)
    throw new Error(`build-skills: no single registry folder for ${file}: ${[...folders]}`);
  return posix.join([...folders][0], posix.basename(file));
}

/**
 * The page an agent copies imports from in registry mode, where nothing resolves through a barrel
 * and every export has its own path. An export renamed by the barrel keeps its file's name in the
 * project, so its line carries the rename (`DescriptionProps as TileDescriptionProps`).
 */
export function registryImports(indexSource, registry, library = LIBRARY) {
  const index = ts.createSourceFile('index.ts', indexSource, ts.ScriptTarget.Latest, true);
  const modules = new Map();
  for (const node of index.statements) {
    if (
      !ts.isExportDeclaration(node) ||
      !node.exportClause ||
      !ts.isNamedExports(node.exportClause)
    )
      throw new Error(`build-skills: src/index.ts must name its exports: ${node.getText()}`);
    const path = `@/${installedPath(sourceFile(library, node.moduleSpecifier.text), registry)}`
      .replace(/\.tsx?$/, '')
      .replace(/\/index$/, '');
    if (!modules.has(path)) modules.set(path, { values: [], types: [] });
    for (const element of node.exportClause.elements) {
      const name = element.propertyName
        ? `${element.propertyName.text} as ${element.name.text}`
        : element.name.text;
      modules.get(path)[node.isTypeOnly || element.isTypeOnly ? 'types' : 'values'].push(name);
    }
  }
  const lines = (keyword, kind) =>
    [...modules]
      .filter(([, module]) => module[kind].length)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([path, module]) => {
        const names = module[kind].sort().join(', ');
        return `- \`${keyword} { ${names} } from '${path}';\``;
      })
      .join('\n');
  return `# Registry imports

Every public export of Wideset, with the import that works after a registry install (\`components/ui/wideset/\` in the source). Search this file for the name instead of guessing its path: one folder holds several components, and folder names differ from component names. A project with the \`@wideset/react\` package imports all of these from that package instead.

A member such as \`Card.Header\` comes with \`Card\`; its named form, \`CardHeader\`, is listed for Server Components.

## Components, hooks and utilities

${lines('import', 'values')}

## Types

${lines('import type', 'types')}
`;
}

// --- AGENTS.wideset.md -----------------------------------------------------------------------

/** The first sentence of a skill's description, which says what it covers. */
const skillSummary = (description) => description.split(/(?<=[.!])\s/)[0].replace(/\.$/, '');

function fillAgents({ template, version, skills, readme }) {
  const slots = {
    version,
    'component-index': componentIndex(readme),
    'skill-index': skills
      .map(({ name, description }) => `- \`${name}\`: ${skillSummary(description)}`)
      .join('\n'),
  };
  return template.replace(/<!-- generated:([a-z-]+) -->/g, (match, slot) => {
    if (!(slot in slots)) throw new Error(`build-skills: unknown slot ${match}`);
    return slots[slot];
  });
}

// --- reviewers -------------------------------------------------------------------------------

const REVIEWERS = {
  'wideset-ui-reviewer': {
    rubric: 'ui-review.md',
    description:
      'Reviews UI built with Wideset for craft, fidelity to the request and design-system compliance. Use on changed files or screenshots before calling a screen done.',
  },
  'wideset-theme-reviewer': {
    rubric: 'theme-review.md',
    description:
      'Reviews UI built with Wideset for surface roles, contrast and light/dark parity. Use after a theme change or on any screen that ships in dark mode.',
  },
};

const reviewerAgent = (name, { description, rubric }) =>
  `---
name: ${name}
description: ${description}
tools: Read, Grep, Glob
---

${readText(join(PACKAGE, 'skills/wideset-review/references', rubric))}`;

// --- everything ------------------------------------------------------------------------------

const format = async (path, text) => {
  const absolute = join(PACKAGE, path);
  const options = (await prettier.resolveConfig(absolute)) ?? {};
  return lf(await prettier.format(text, { ...options, filepath: absolute, endOfLine: 'lf' }));
};

/** @returns {Promise<Map<string, string>>} package-relative path → the content it must have */
export async function generateSkills() {
  const { version } = JSON.parse(readText(join(LIBRARY, 'package.json')));
  const pkg = JSON.parse(readText(join(PACKAGE, 'package.json')));

  const skillsDir = join(PACKAGE, 'skills');
  const skills = readdirSync(skillsDir)
    .filter((name) => existsSync(join(skillsDir, name, 'SKILL.md')))
    .sort()
    .map((name) => ({
      name,
      description: frontmatterOf(readText(join(skillsDir, name, 'SKILL.md'))).description ?? '',
    }));

  const out = new Map();
  const put = async (path, text) => out.set(path, await format(path, text));

  const goodPractices = goodPracticeFiles(SPECS);
  for (const file of filesUnder(SPECS).filter(isShippedSpec))
    await put(
      `${SPECS_DIR}/${file}`,
      relinkSpec(file, specForConsumer(readText(join(SPECS, file))), goodPractices),
    );
  for (const [file, output] of goodPractices)
    await put(
      output,
      relinkSpec(
        file,
        goodPracticePage(specForConsumer(readText(join(SPECS, file)))),
        goodPractices,
        output,
      ),
    );
  await put(
    GOOD_PRACTICES_INDEX,
    goodPracticesIndex(readText(join(SPECS, 'README.md')), goodPractices),
  );

  await put(
    REGISTRY_IMPORTS,
    registryImports(
      readText(join(LIBRARY, 'src/index.ts')),
      JSON.parse(readText(join(LIBRARY, 'registry.json'))),
    ),
  );

  const setup = 'skills/wideset-setup/SKILL.md';
  await put(
    setup,
    readText(join(PACKAGE, setup)).replace(/^(\s*wideset-version:).*$/m, `$1 '${version}'`),
  );

  await put(
    'AGENTS.wideset.md',
    fillAgents({
      template: readText(join(PACKAGE, 'templates/AGENTS.wideset.md')),
      version,
      skills,
      readme: readText(join(SPECS, 'README.md')),
    }),
  );
  out.set(
    'cursor/wideset.mdc',
    `---
description: Wideset design system rules
alwaysApply: true
---

This project builds UI with the Wideset design system. Follow AGENTS.wideset.md in the project root. Before using a component, read its file, listed in \`references/good-practices.md\` of the \`wideset-build\` skill.
`,
  );

  for (const [name, reviewer] of Object.entries(REVIEWERS))
    await put(`agents/${name}.md`, reviewerAgent(name, reviewer));

  const plugin = JSON.parse(readText(join(PACKAGE, '.claude-plugin/plugin.json')));
  await put(
    '.claude-plugin/plugin.json',
    `${JSON.stringify({ ...plugin, version: pkg.version }, null, 2)}\n`,
  );
  return out;
}

/**
 * Brings `root` in line with the generated files: writes only what differs and deletes only spec
 * copies and good-practices files that no longer have a source. Tests read these files in parallel with this build in
 * `pnpm test`, so an up-to-date tree must not be touched at all.
 * @returns {string[]} the paths that changed
 */
export function writeGenerated(files, root = PACKAGE) {
  const changed = [];
  for (const [path, content] of files) {
    const file = join(root, path);
    if (existsSync(file) && lf(readFileSync(file, 'utf8')) === content) continue;
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
    changed.push(path);
  }
  for (const dir of [SPECS_DIR, GOOD_PRACTICES_DIR]) {
    const copies = join(root, dir);
    for (const name of existsSync(copies) ? filesUnder(copies) : []) {
      const path = `${dir}/${name}`;
      if (files.has(path)) continue;
      rmSync(join(root, path));
      changed.push(path);
    }
  }
  return changed;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const files = await generateSkills();
  const changed = writeGenerated(files);
  console.log(`skills: ${files.size} generated files, ${changed.length} changed`);
}
