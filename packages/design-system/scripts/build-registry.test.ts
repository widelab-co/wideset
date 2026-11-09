import { execSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, posix, resolve } from 'node:path';

import { registryItemSchema, registrySchema } from 'shadcn/schema';
import ts from 'typescript';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { buildRegistry } from './build-registry.mjs';

const ROOT = resolve(__dirname, '..');
const BASE = 'https://example.test/r';

type Item = {
  name: string;
  type: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: { path: string; type: string; target: string; content: string }[];
  meta: { version: string; commit: string };
};

let out: string;
let items: Item[];
let byName: Map<string, Item>;

const readAll = (dir: string): Item[] =>
  readdirSync(dir)
    .filter((f) => f.endsWith('.json') && f !== 'registry.json')
    .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')));

beforeAll(() => {
  // The registry ships dist/*.css. On a fresh clone, and in the pre-push hook, nothing has built
  // it yet; build it here rather than fail the whole suite with "run pnpm build:lib first".
  if (!existsSync(join(ROOT, 'dist', 'styles.css'))) {
    execSync('pnpm build:lib', { cwd: ROOT, stdio: 'ignore' });
  }
  out = mkdtempSync(join(tmpdir(), 'ws-registry-'));
  buildRegistry({ out, base: BASE, commit: 'test' });
  items = readAll(out);
  byName = new Map(items.map((i) => [i.name, i]));
}, 180_000);

afterAll(() => rmSync(out, { recursive: true, force: true }));

const closureTargets = (item: Item): Set<string> => {
  const seen = new Set<string>();
  const targets = new Set<string>();
  const visit = (name: string) => {
    if (seen.has(name)) return;
    seen.add(name);
    const it = byName.get(name);
    if (!it) throw new Error(`unknown item ${name}`);
    it.files.forEach((f) => targets.add(f.target));
    (it.registryDependencies ?? []).forEach((url) =>
      visit(
        url
          .split('/')
          .pop()!
          .replace(/\.json$/, ''),
      ),
    );
  };
  visit(item.name);
  return targets;
};

const specifiers = (content: string) =>
  ts.preProcessFile(content, true, true).importedFiles.map((f) => f.fileName);

describe('registry build', () => {
  it('produces every item in registry.json', () => {
    const declared = JSON.parse(readFileSync(join(ROOT, 'registry.json'), 'utf8')).items.map(
      (i: Item) => i.name,
    );
    expect(items.map((i) => i.name).sort()).toEqual([...declared].sort());
  });

  it('validates against the shadcn schemas', () => {
    for (const item of items) expect(() => registryItemSchema.parse(item), item.name).not.toThrow();
    const index = JSON.parse(readFileSync(join(out, 'registry.json'), 'utf8'));
    expect(() => registrySchema.parse(index)).not.toThrow();
    expect(JSON.stringify(index)).not.toContain('"content"');
  });

  it('gives every file an explicit target and content', () => {
    for (const item of items) {
      for (const file of item.files) {
        expect(file.target, `${item.name}: ${file.path}`).toMatch(
          /^(components\/ui\/wideset\/|lib\/wideset\/|hooks\/wideset\/|styles\/|~\/\.agents\/skills\/|~\/\.claude\/(skills|agents)\/|~\/\.cursor\/rules\/|~\/AGENTS\.wideset\.md$)/,
        );
        expect(file.content.length, `${item.name}: ${file.path}`).toBeGreaterThan(0);
        expect(file.content, `${item.name}: ${file.path} has CRLF`).not.toContain('\r');
      }
    }
  });

  it('ships no stories, tests, snapshots or Figma specs', () => {
    for (const item of items) {
      for (const file of item.files) {
        expect(file.path).not.toMatch(/\.stories\.|\.test\.|__snapshots__|figma-spec|\.mdx$/);
      }
    }
  });

  it('pins every npm dependency to the range in package.json', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    for (const item of items) {
      for (const dep of item.dependencies ?? []) {
        const at = dep.lastIndexOf('@');
        const [name, range] = [dep.slice(0, at), dep.slice(at + 1)];
        expect(pkg.dependencies[name], `${item.name}: ${dep}`).toBe(range);
      }
    }
  });

  it('references other items by full URL', () => {
    for (const item of items) {
      for (const url of item.registryDependencies ?? []) {
        expect(url).toMatch(new RegExp(`^${BASE}/[a-z-]+\\.json$`));
        expect(
          byName.has(
            url
              .split('/')
              .pop()!
              .replace(/\.json$/, ''),
          ),
        ).toBe(true);
      }
    }
  });

  it('makes every component depend on utils and styles', () => {
    for (const item of items.filter((i) => i.type === 'registry:ui')) {
      expect(item.registryDependencies).toContain(`${BASE}/utils.json`);
      expect(item.registryDependencies).toContain(`${BASE}/styles.json`);
    }
  });

  it('leaves no src/ specifier in shipped code', () => {
    for (const item of items) {
      for (const file of item.files.filter((f) => f.type !== 'registry:file')) {
        for (const spec of specifiers(file.content))
          expect(spec, `${item.name}: ${file.path}`).not.toMatch(/^src\//);
      }
    }
  });

  it('resolves every local import inside the item and its dependency closure', () => {
    for (const item of items) {
      const closure = closureTargets(item);
      for (const file of item.files.filter((f) => f.type !== 'registry:file')) {
        for (const spec of specifiers(file.content)) {
          if (!spec.startsWith('.') && !spec.startsWith('@/')) continue;
          const bare = spec.startsWith('@/')
            ? spec.slice(2)
            : posix.join(posix.dirname(file.target), spec);
          const hit = ['.ts', '.tsx', '.css', ''].some((ext) => closure.has(bare + ext));
          expect(
            hit,
            `${item.name}: ${file.path} imports '${spec}' (${bare}) which is not in its closure`,
          ).toBe(true);
        }
      }
    }
  });

  it('keeps every owned file in the folder of its item', () => {
    for (const item of items.filter((i) => i.type === 'registry:ui')) {
      const folders = new Set(item.files.map((f) => posix.dirname(f.target)));
      expect([...folders], item.name).toHaveLength(1);
    }
  });

  it('covers every value export of src/index.ts with exactly one item', () => {
    const source = readFileSync(join(ROOT, 'src/index.ts'), 'utf8');
    const sf = ts.createSourceFile('index.ts', source, ts.ScriptTarget.Latest, true);
    const exported: string[] = [];
    sf.forEachChild((node) => {
      if (!ts.isExportDeclaration(node) || node.isTypeOnly || !node.moduleSpecifier) return;
      const clause = node.exportClause;
      const hasValues =
        !clause || !ts.isNamedExports(clause) || clause.elements.some((e) => !e.isTypeOnly);
      if (hasValues)
        exported.push(posix.join('src', (node.moduleSpecifier as ts.StringLiteral).text));
    });
    const owners = new Map<string, string[]>();
    // A specifier like './motion' resolves to motion/index.ts.
    const moduleOf = (path: string) => path.replace(/\.tsx?$/, '').replace(/\/index$/, '');
    for (const item of items) {
      for (const f of item.files) {
        owners.set(moduleOf(f.path), [...(owners.get(moduleOf(f.path)) ?? []), item.name]);
      }
    }
    for (const path of exported) expect(owners.get(path), path).toHaveLength(1);
  });

  it('stamps version and commit', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    for (const item of items) expect(item.meta).toEqual({ version: pkg.version, commit: 'test' });
  });

  it('ships a theme without package imports and a styles file without preflight', () => {
    const theme = byName.get('theme')!.files[0].content.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(theme).not.toMatch(/@import\s+['"][^.]/);
    const styles = byName.get('styles')!.files[0].content;
    expect(styles).not.toContain('googleapis');
    expect(existsSync(join(out, 'preflight.json'))).toBe(true);
  });

  it("marks components, contexts and hooks 'use client' and nothing else", () => {
    const usesReact = /\b(createContext|forwardRef|use[A-Z]\w*)\s*[(<]/;
    for (const item of items) {
      for (const file of item.files.filter((f) => f.type !== 'registry:file')) {
        const hasDirective = file.content.startsWith("'use client';\n");
        const isServerSafe = /\.(types|variants)\.ts$/.test(file.path);
        const expected =
          !isServerSafe && (file.path.endsWith('.tsx') || usesReact.test(file.content));
        expect(hasDirective, `${item.name}: ${file.path}`).toBe(expected);
      }
    }
    // cn() and variants must stay callable from a Server Component.
    expect(byName.get('utils')!.files[0].content).not.toContain('use client');
    const buttonVariants = byName
      .get('button')!
      .files.find((f) => f.path.endsWith('Button.variants.ts'))!;
    expect(buttonVariants.content).not.toContain('use client');
  });

  // A second full build, the work beforeAll gets 180s for: under the pre-push hook's parallel
  // `pnpm test` it took longer than vitest's 5s default and failed at random.
  it('is deterministic', { timeout: 30_000 }, () => {
    const again = mkdtempSync(join(tmpdir(), 'ws-registry-again-'));
    try {
      buildRegistry({ out: again, base: BASE, commit: 'test' });
      for (const f of readdirSync(out).filter((n) => n.endsWith('.json'))) {
        expect(readFileSync(join(again, f), 'utf8')).toBe(readFileSync(join(out, f), 'utf8'));
      }
    } finally {
      rmSync(again, { recursive: true, force: true });
    }
  });
});

describe('registry:file directories', () => {
  /** A throwaway registry root: `files` are paths to create, `entries` are registry.json items. */
  const buildFixture = (files: string[], entries: unknown[]) => {
    const root = mkdtempSync(join(tmpdir(), 'ws-registry-fixture-'));
    const output = mkdtempSync(join(tmpdir(), 'ws-registry-fixture-out-'));
    for (const file of files) {
      mkdirSync(join(root, file, '..'), { recursive: true });
      writeFileSync(join(root, file), `content of ${file}\r\n`);
    }
    writeFileSync(
      join(root, 'package.json'),
      JSON.stringify({ version: '1.0.0', dependencies: {} }),
    );
    writeFileSync(
      join(root, 'registry.json'),
      JSON.stringify({ name: 'fixture', homepage: 'https://x.test', items: entries }),
    );
    try {
      const { items: built } = buildRegistry({ root, out: output, base: BASE, commit: 'test' });
      return built as unknown as Item[];
    } finally {
      rmSync(root, { recursive: true, force: true });
      rmSync(output, { recursive: true, force: true });
    }
  };
  const fileItem = (name: string, path: string, target: string, type = 'registry:file') => ({
    name,
    type: 'registry:item',
    title: name,
    description: name,
    files: [{ path, type, target }],
  });

  it('expands a directory to every file under it, with relative targets and LF', () => {
    const [item] = buildFixture(
      ['docs/z.md', 'docs/a/SKILL.md', 'docs/a/references/api/b.md'],
      [fileItem('docs', 'docs', '~/.agents/skills')],
    );
    expect(item.files.map((file) => file.target).sort()).toEqual([
      '~/.agents/skills/a/SKILL.md',
      '~/.agents/skills/a/references/api/b.md',
      '~/.agents/skills/z.md',
    ]);
    const nested = item.files.find((file) => file.path === 'docs/a/references/api/b.md');
    expect(nested?.content).toBe('content of docs/a/references/api/b.md\n');
  });

  it('lets two items ship one directory, each with its own targets', () => {
    const [first, second] = buildFixture(
      ['docs/a/SKILL.md'],
      [fileItem('one', 'docs', '~/.agents/skills'), fileItem('two', 'docs', '~/.claude/skills')],
    );
    expect(first.files[0].target).toBe('~/.agents/skills/a/SKILL.md');
    expect(second.files[0].target).toBe('~/.claude/skills/a/SKILL.md');
  });

  it('still rejects code declared by two items', () => {
    expect(() =>
      buildFixture(
        ['src/a.ts'],
        [
          fileItem('one', 'src/a.ts', 'lib/a.ts', 'registry:lib'),
          fileItem('two', 'src/a.ts', 'lib/b.ts', 'registry:lib'),
        ],
      ),
    ).toThrow(/is declared by both one and two/);
  });

  it('ships the skills to the agents that read them', () => {
    const targets = (name: string) => byName.get(name)!.files.map((file) => file.target);
    expect(targets('skills')).toContain('~/.agents/skills/wideset-setup/SKILL.md');
    expect(targets('skills')).toContain('~/AGENTS.wideset.md');
    expect(targets('skills')).toContain('~/.cursor/rules/wideset.mdc');
    expect(targets('skills-claude')).toContain('~/.claude/skills/wideset-setup/SKILL.md');
    expect(targets('skills-claude')).toContain('~/.claude/agents/wideset-ui-reviewer.md');
  });
});
