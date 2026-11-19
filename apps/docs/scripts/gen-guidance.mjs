/**
 * The usage guidance for each component, from the hand-written specs in
 * packages/design-system/specs/components. The page shows only when to use a component; the rest
 * (Choosing props, Do / Don't, Gotchas) is for models: the component's .md and the agent skills,
 * which read the same files. Parts, props and examples stay generated from the library.
 *
 * Output, one file per component with a spec:
 *   src/generated/guidance-md/<id>.md   the Usage section of /components/<id>.md (SECTIONS)
 *   src/generated/guidance-a11y/<id>.md the spec's Accessibility notes (v2 pages)
 */
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

import { asText } from './as-text.mjs';
import { generatedDir, library } from './paths.mjs';

/** What the .md takes from a spec, in reading order. Anatomy has its own section on the page. */
export const SECTIONS = [
  'When to use',
  'When not to use',
  'Choosing props',
  "Do / Don't",
  'Gotchas',
];

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

/** Splits a spec by its `## ` headings, ignoring the same text inside a code fence. */
export function sectionsOf(text) {
  const sections = new Map();
  let current = null;
  let fenced = false;
  for (const line of text.replace(/\r\n/g, '\n').split('\n')) {
    if (line.startsWith('```')) fenced = !fenced;
    const heading = !fenced && line.match(/^## (.+)$/);
    if (heading) {
      current = heading[1].trim();
      sections.set(current, []);
    } else if (current) sections.get(current).push(line);
  }
  return new Map([...sections].map(([name, lines]) => [name, lines.join('\n').trim()]));
}

export function buildGuidance({ specsDir, catalog, sections: wanted = SECTIONS, headings = true }) {
  const files = walk(specsDir).filter(
    (file) => file.endsWith('.md') && !file.endsWith('README.md'),
  );
  const idOfFile = new Map();
  const specs = [];
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    const name = text.match(/^name:\s*(.+?)\s*$/m)?.[1];
    const entry = catalog.find((item) => item.exports[0] === name);
    if (!entry) continue;
    idOfFile.set(resolve(file), entry.id);
    specs.push({ file, id: entry.id, text });
  }

  /** A link to another component stays a link; the site has no page for the rest. */
  const relink = (markdown, file) =>
    markdown.replace(/\[([^\]]+)\]\((\.{0,2}[^)\s#:]*\.md)(#[^)]*)?\)/g, (_, label, target) => {
      const id = idOfFile.get(resolve(dirname(file), target));
      return id ? `[${label}](/components/${id})` : label;
    });

  return new Map(
    specs.map(({ file, id, text }) => {
      const sections = sectionsOf(text);
      const body = wanted
        .filter((name) => sections.get(name))
        .map((name) =>
          headings
            ? `### ${name}\n\n${relink(sections.get(name), file)}`
            : relink(sections.get(name), file),
        )
        .join('\n\n');
      return [id, `${body}\n`];
    }),
  );
}

const catalog = JSON.parse(readFileSync(join(generatedDir, 'catalog.json'), 'utf8'));
const specsDir = join(library, 'specs/components');
const guidance = buildGuidance({ specsDir, catalog });
const outputs = {
  'guidance-md': guidance,
  // The spec's own Accessibility notes, for the page's Accessibility section (no heading: the
  // page has its own). Only components whose spec has the section get a file.
  'guidance-a11y': new Map(
    [...buildGuidance({ specsDir, catalog, sections: ['Accessibility'], headings: false })]
      .filter(([, markdown]) => markdown.trim())
      .map(([id, markdown]) => [id, asText(markdown)]),
  ),
};
for (const [dir, pages] of Object.entries(outputs)) {
  const out = join(generatedDir, dir);
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  for (const [id, markdown] of pages) writeFileSync(join(out, `${id}.md`), markdown);
}

const missing = catalog.filter((entry) => !guidance.has(entry.id)).map((entry) => entry.id);
console.log(
  `guidance: ${guidance.size} pages from ${relative(library, join(library, 'specs')).split(sep).join('/')}${
    missing.length ? `, no spec for ${missing.join(', ')}` : ''
  }`,
);
