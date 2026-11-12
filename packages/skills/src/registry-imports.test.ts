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
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { buildRegistry } from '../../design-system/scripts/build-registry.mjs';
import { generateSkills, REGISTRY_IMPORTS, registryImports } from '../scripts/build-skills.mjs';

const PACKAGE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LIBRARY = resolve(PACKAGE, '../design-system');

const COMPILER: ts.CompilerOptions = {
  noEmit: true,
  noLib: true,
  types: [],
  jsx: ts.JsxEmit.Preserve,
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
};

type Entry = { kind: 'value' | 'type'; path: string; local: string; exported: string };

/** Each `import { A, B as C } from 'path';` line of the page, one entry per name. */
function parseEntries(page: string): Entry[] {
  return page.split(/\r?\n/).flatMap((line) => {
    const match = line.match(/^- `import (type )?\{ (.+) \} from '(.+)';`$/);
    if (!match) return [];
    return match[2].split(', ').map((name) => {
      const [local, exported = local] = name.split(' as ');
      return { kind: match[1] ? 'type' : 'value', path: match[3], local, exported } as Entry;
    });
  });
}

/** Exports of a module as the compiler sees them, with whether each one exists at runtime. */
function exportsOf(checker: ts.TypeChecker, file: ts.SourceFile) {
  const symbol = checker.getSymbolAtLocation(file);
  const found = new Map<string, boolean>();
  for (const item of symbol ? checker.getExportsOfModule(symbol) : []) {
    const target = item.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(item) : item;
    found.set(item.name, Boolean(target.flags & ts.SymbolFlags.Value));
  }
  return found;
}

describe('registry imports', () => {
  let entries: Entry[];
  let app: string;
  let installed: ts.Program;
  const fileOf = (path: string) =>
    ['.ts', '.tsx', '/index.ts', '/index.tsx']
      .map((extension) => join(app, 'src', path.replace(/^@\//, '') + extension))
      .find((candidate) => existsSync(candidate));

  // The files a consumer really gets: the registry's own output, written where it says they go.
  beforeAll(async () => {
    entries = parseEntries((await generateSkills()).get(REGISTRY_IMPORTS) ?? '');
    if (!existsSync(join(LIBRARY, 'dist/styles.css')))
      execSync('pnpm build:lib', { cwd: LIBRARY, stdio: 'ignore' });

    app = mkdtempSync(join(tmpdir(), 'skills-registry-imports-'));
    const out = join(app, 'r');
    buildRegistry({ out, base: 'https://registry.test/r', commit: 'test' });
    const files: string[] = [];
    for (const name of readdirSync(out)) {
      const item = JSON.parse(readFileSync(join(out, name), 'utf8')) as {
        files?: { target: string; content?: string }[];
      };
      for (const { target, content } of item.files ?? []) {
        if (content === undefined || !/\.tsx?$/.test(target) || target.startsWith('~')) continue;
        const file = join(app, 'src', target);
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, content);
        files.push(file);
      }
    }
    installed = ts.createProgram(files, {
      ...COMPILER,
      baseUrl: app,
      paths: { '@/*': ['src/*'] },
    });
  }, 240_000);

  afterAll(() => {
    if (app) rmSync(app, { recursive: true, force: true });
  });

  // Type-checks the whole library entry: under turbo's parallel `pnpm test` (other packages
  // building and testing at once) that took longer than vitest's 5s default and failed at random.
  it('has an entry for every public export, and for nothing else', { timeout: 30_000 }, () => {
    const index = join(LIBRARY, 'src/index.ts');
    const program = ts.createProgram([index], COMPILER);
    const expected = exportsOf(program.getTypeChecker(), program.getSourceFile(index)!);
    expect(expected.size).toBeGreaterThan(100);
    expect(entries.map(({ exported }) => exported).sort()).toEqual([...expected.keys()].sort());
  });

  it('lists a name only under a path the registry installs and which exports it', () => {
    const checker = installed.getTypeChecker();
    const problems = entries.flatMap(({ kind, path, local }) => {
      const file = fileOf(path);
      const source = file && installed.getSourceFile(file);
      if (!source) return [`${path}: not installed by any registry item`];
      const found = exportsOf(checker, source);
      if (!found.has(local)) return [`${path}: does not export ${local}`];
      return kind === 'value' && !found.get(local) ? [`${path}: ${local} is only a type`] : [];
    });
    expect(problems).toEqual([]);
  });

  it('sends IconButton to its own file, not to Button or an icon-button folder', () => {
    const pathsOf = (name: string) =>
      entries.filter(({ exported }) => exported === name).map(({ path }) => path);
    expect(pathsOf('IconButton')).toEqual(['@/components/ui/wideset/button/IconButton']);
    expect(pathsOf('IconButtonIcon')).toEqual(['@/components/ui/wideset/button/IconButton']);
    expect(pathsOf('IconButtonProps')).toEqual(['@/components/ui/wideset/button/IconButton.types']);
    expect(pathsOf('Button')).toEqual(['@/components/ui/wideset/button/Button']);
  });

  it('sends every dropdown export to the dropdown folder, not to dropdown-menu', () => {
    const dropdown = entries.filter(({ exported }) => exported.startsWith('DropdownMenu'));
    const paths = Object.fromEntries(dropdown.map(({ exported, path }) => [exported, path]));
    expect(paths).toMatchObject({
      DropdownMenu: '@/components/ui/wideset/dropdown/DropdownMenu',
      DropdownMenuCheckboxItem: '@/components/ui/wideset/dropdown/DropdownMenu',
      DropdownMenuContent: '@/components/ui/wideset/dropdown/DropdownMenuContent',
      DropdownMenuItem: '@/components/ui/wideset/dropdown/DropdownMenuItem',
      DropdownMenuTrigger: '@/components/ui/wideset/dropdown/DropdownMenuTrigger',
      DropdownMenuProps: '@/components/ui/wideset/dropdown/DropdownMenu.types',
    });
    expect(
      dropdown.filter(({ path }) => !path.startsWith('@/components/ui/wideset/dropdown/')),
    ).toEqual([]);
  });

  it('keeps the file name of an export the barrel renames', () => {
    expect(entries).toContainEqual({
      kind: 'type',
      path: '@/components/ui/wideset/tile/Tile.types',
      local: 'DescriptionProps',
      exported: 'TileDescriptionProps',
    });
  });

  it('fails the build on what it cannot place', () => {
    const registry = {
      items: [
        {
          files: [
            {
              path: 'src/components/button/Button.tsx',
              target: 'components/ui/wideset/button/Button.tsx',
            },
          ],
        },
      ],
    };
    const page = (source: string) => registryImports(source, registry, LIBRARY);
    expect(page("export { IconButton } from './components/button/IconButton';")).toContain(
      "`import { IconButton } from '@/components/ui/wideset/button/IconButton';`",
    );
    expect(() => page("export { Card } from './components/card/Card';")).toThrow(/registry folder/);
    expect(() => page("export { Nope } from './components/nope/Nope';")).toThrow(/missing/);
    expect(() => page("export * from './components/button/Button';")).toThrow(/name its exports/);
  });
});
