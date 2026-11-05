import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';
import { beforeAll, describe, expect, it } from 'vitest';

import {
  checkCraft,
  checkHandlers,
  checkIcons,
  checkTokens,
  grade,
  parseCase,
  toolUsage,
} from '../evals/grade.mjs';
import {
  generateSkills,
  GOOD_PRACTICE_SECTIONS,
  GOOD_PRACTICES_DIR,
  GOOD_PRACTICES_INDEX,
  SPECS_DIR,
  specSections,
  writeGenerated,
} from '../scripts/build-skills.mjs';
import { frontmatterOf } from '../scripts/skill-files.mjs';

const PACKAGE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REPO = resolve(PACKAGE, '../..');
const read = (path: string) => readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const inPackage = (path: string) => read(join(PACKAGE, path));

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const skillNames = readdirSync(join(PACKAGE, 'skills'));
const skillFile = (name: string) => inPackage(`skills/${name}/SKILL.md`);
const SHIPPED_ROOTS = ['skills', 'agents', 'cursor'];
const shippedFiles = [
  ...SHIPPED_ROOTS.flatMap((root) => walk(join(PACKAGE, root))),
  join(PACKAGE, 'AGENTS.wideset.md'),
  join(PACKAGE, 'README.md'),
];

/**
 * The prose written for this package. The spec copies and good-practices files have their own
 * checks in specs.test.ts, which reads their source.
 */
const handWritten = shippedFiles.filter(
  (file) => !/references[\\/](?:specs|good-practices)[\\/]/.test(file),
);

const HANDLER_TABLE = `
import {
  Checkbox, ComboBox, DatePicker, DateRangePicker, FilterButton, Modal, MultiSelect, Pagination,
  Popup, RadioButton, SegmentedControl, Select, Sidebar, Sidepanel, Slider, Switch, Tabs, Textarea,
  TextInput, TimePicker, Tooltip,
} from '@wideset/react';

export const handlers = (
  <>
    <TextInput value="" onChange={(event) => event.target.value} />
    <Textarea value="" onChange={(event) => event.target.value} />
    <Select value="" onValueChange={(value: string) => value} />
    <TimePicker value="" onValueChange={(value: string) => value} />
    <ComboBox value="" onChange={(value: string) => value} />
    <MultiSelect value={['a']} onValueChange={(values: string[]) => values} />
    <FilterButton label="" options={[]} value={['a']} onChange={(values: string[]) => values} />
    <RadioButton.Group value="" onValueChange={(value: string) => value} />
    <SegmentedControl value="" onValueChange={(value: string) => value} />
    <Tabs value="" onValueChange={(value: string) => value} />
    <Checkbox checked onCheckedChange={(checked) => checked === 'indeterminate'} />
    <Switch checked onCheckedChange={(checked: boolean) => checked} />
    <Slider value={[1]} onValueChange={(values: number[]) => values} />
    <DatePicker selected="" onSelect={(day?: string) => day} />
    <DateRangePicker onSelect={(range, preset) => [range, preset]} />
    <Modal open onOpenChange={(open: boolean) => open} />
    <Sidepanel open onOpenChange={(open: boolean) => open} />
    <Popup open onOpenChange={(open: boolean) => open} />
    <Tooltip open onOpenChange={(open: boolean) => open} />
    <Sidebar collapsed onCollapsedChange={(collapsed: boolean) => collapsed} />
    <Pagination
      pagesCount={1}
      activePage={1}
      onChangeActivePage={(page: number) => page}
      onChangeItemsPerPage={(size: number) => size}
    />
  </>
);
`;

describe('generated files', () => {
  let generated: Map<string, string>;
  beforeAll(async () => {
    generated = await generateSkills();
  }, 240_000);

  it('match the library (run pnpm build:skills when this fails)', () => {
    const stale = [...generated]
      .filter(([path, content]) => {
        const file = join(PACKAGE, path);
        return !existsSync(file) || read(file) !== content;
      })
      .map(([path]) => path);
    expect(stale).toEqual([]);
  });

  it('leave no copy behind for a spec that is gone', () => {
    const orphans = [SPECS_DIR, GOOD_PRACTICES_DIR]
      .flatMap((dir) => walk(join(PACKAGE, dir)))
      .map((file) => relative(PACKAGE, file).replace(/\\/g, '/'))
      .filter((path) => !generated.has(path));
    expect(orphans).toEqual([]);
  });

  it('ship the cross-cutting specs, no full component spec and no generated prop or token reference', () => {
    const paths = [...generated.keys()].filter((path) => path.startsWith(`${SPECS_DIR}/`));
    expect(paths).toContain(`${SPECS_DIR}/components/inputs/README.md`);
    expect(paths).toContain(`${SPECS_DIR}/patterns/form-page.md`);
    expect(paths).not.toContain(`${SPECS_DIR}/tokens.md`);
    expect(paths.filter((path) => path.includes('/foundations/'))).toEqual([]);
    expect(paths).not.toContain(`${SPECS_DIR}/AUTHORING.md`);
    expect(paths.filter((path) => /\/components\/[^/]+\/(?!README)[^/]+\.md$/.test(path))).toEqual(
      [],
    );
    expect([...generated.keys()].filter((path) => /references\/(api|catalog)/.test(path))).toEqual(
      [],
    );
  });

  describe('good practices', () => {
    const SPECS = join(REPO, 'packages/design-system/specs/components');
    const specFiles = walk(SPECS).filter(
      (file) => file.endsWith('.md') && !file.endsWith('README.md'),
    );
    /** The prose of a section, whatever a link now points at and however Prettier pads a table. */
    const prose = (text: string) =>
      text
        .replace(/\]\([^)\s]+\)/g, ']')
        .replace(/\[([^\]]*)\]/g, '$1')
        .replace(/-{3,}/g, '---')
        .replace(/[ \t]+/g, ' ')
        .trim();
    const practiceOf = (spec: string) => {
      const docs = frontmatterOf(read(spec)).docs;
      return `${GOOD_PRACTICES_DIR}/${docs.split('/').pop()}.md`;
    };

    it('give every component spec one file, and no file without a spec', () => {
      const files = [...generated.keys()].filter((path) =>
        path.startsWith(`${GOOD_PRACTICES_DIR}/`),
      );
      expect(specFiles.length).toBeGreaterThan(0);
      expect(files.length).toBe(specFiles.length);
      expect([...files].sort()).toEqual(specFiles.map(practiceOf).sort());
    });

    it.each(specFiles.map((file) => [relative(SPECS, file).replace(/\\/g, '/'), file]))(
      '%s holds its title and exactly the sections of its source',
      (_, spec) => {
        const page = generated.get(practiceOf(spec)) ?? '';
        const source = read(spec);
        expect(page.startsWith(`${source.match(/^# .+$/m)?.[0]}\n`)).toBe(true);
        const shipped = specSections(page);
        const original = specSections(source);
        expect([...shipped.keys()]).toEqual(
          GOOD_PRACTICE_SECTIONS.filter((name: string) => original.has(name)),
        );
        for (const [name, body] of shipped)
          expect(prose(body as string), name as string).toBe(
            prose(original.get(name as string) as string),
          );
      },
    );

    it('carry no frontmatter or repository path', () => {
      const files = [...generated].filter(([path]) => path.startsWith(GOOD_PRACTICES_DIR));
      expect(files.length).toBeGreaterThan(0);
      for (const [path, content] of files) {
        expect(content.startsWith('---'), path).toBe(false);
        expect(content, path).not.toMatch(/packages\/design-system|^figma:|^storybook:/m);
      }
    });

    it('list every component once in the entry point', () => {
      const index = generated.get(GOOD_PRACTICES_INDEX) ?? '';
      const linked = [...index.matchAll(/^- \[[^\]]+\]\((good-practices\/[^)]+)\): \S/gm)].map(
        (match) => `skills/wideset-build/references/${match[1]}`,
      );
      expect([...linked].sort()).toEqual(specFiles.map(practiceOf).sort());
      expect(index.match(/^## \[/gm)?.length).toBe(9);
    });

    it('are what the skill and the always-on files send an agent to', () => {
      expect(skillFile('wideset-build')).toContain('(references/good-practices.md)');
      expect(skillFile('wideset-build')).not.toMatch(/fetch `https:\/\/docs[^`]*components/);
      expect(generated.get('AGENTS.wideset.md')).toContain('references/good-practices.md');
      expect(generated.get('cursor/wideset.mdc')).toContain('references/good-practices.md');
    });
  });

  it('link only to shipped files, or to the docs for a foundation', () => {
    const shipped = new Set(
      [...generated.keys()].filter(
        (path) => path.startsWith(SPECS_DIR) || path.startsWith(GOOD_PRACTICES_DIR),
      ),
    );
    const broken: string[] = [];
    for (const [path, content] of generated) {
      if (
        !path.startsWith(SPECS_DIR) &&
        !path.startsWith(GOOD_PRACTICES_DIR) &&
        !path.endsWith('SKILL.md')
      )
        continue;
      for (const [, target] of content.matchAll(/\]\(([^)\s#]+\.md)(?:#[^)\s]*)?\)/g)) {
        const page = target.match(
          /^https:\/\/wideset-docs\.widelab\.workers\.dev\/docs\/([a-z-]+)\.md$/,
        )?.[1];
        if (page && existsSync(join(REPO, `apps/docs/src/content/docs/${page}.mdx`))) continue;
        if (/^[a-z]+:/i.test(target)) broken.push(`${path} → ${target}`);
        else {
          const file = join(dirname(path), target).replace(/\\/g, '/');
          if (!shipped.has(file) && !existsSync(join(PACKAGE, file)))
            broken.push(`${path} → ${target}`);
        }
      }
    }
    expect(broken).toEqual([]);
  });

  it('keep a deprecated component out of the always-on index', () => {
    expect(generated.get('AGENTS.wideset.md')).not.toMatch(/^- Search:/m);
    expect(generated.get('AGENTS.wideset.md')).toMatch(/^- TextInput:/m);
  });

  it('state the library version', () => {
    const { version } = JSON.parse(read(join(REPO, 'packages/design-system/package.json')));
    expect(generated.get('AGENTS.wideset.md')).toContain(version);
    expect(generated.get('skills/wideset-setup/SKILL.md')).toContain(
      `wideset-version: '${version}'`,
    );
  });

  it('carry no date, commit or `since` stamp', () => {
    const page = generated.get('AGENTS.wideset.md') ?? '';
    expect(page).not.toMatch(/\bsince\b.*\d+\.\d+/i);
    expect(page).not.toMatch(/\b[0-9a-f]{7,40}\b.*commit/i);
  });
});

describe('writing generated files', () => {
  const API = SPECS_DIR;

  it('leaves an up-to-date tree alone, and rewrites and removes only what differs', () => {
    const root = mkdtempSync(join(tmpdir(), 'skills-write-'));
    try {
      const put = (path: string, text: string) => {
        mkdirSync(dirname(join(root, path)), { recursive: true });
        writeFileSync(join(root, path), text);
      };
      put(`${API}/kept.md`, 'kept\r\n');
      put(`${API}/gone.md`, 'gone\n');
      put('AGENTS.wideset.md', 'old\n');
      const files = new Map([
        [`${API}/kept.md`, 'kept\n'],
        ['AGENTS.wideset.md', 'new\n'],
        [`${API}/added.md`, 'added\n'],
      ]);
      expect(writeGenerated(files, root).sort()).toEqual(
        ['AGENTS.wideset.md', `${API}/added.md`, `${API}/gone.md`].sort(),
      );
      // A CRLF checkout of the same content counts as up to date.
      expect(read(join(root, `${API}/kept.md`))).toBe('kept\n');
      expect(readFileSync(join(root, `${API}/kept.md`), 'utf8')).toBe('kept\r\n');
      expect(existsSync(join(root, `${API}/gone.md`))).toBe(false);
      expect(writeGenerated(files, root)).toEqual([]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe('Agent Skills spec', () => {
  const ALLOWED = ['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools'];

  it.each(skillNames)('%s has a valid name and description', (name) => {
    const fields = frontmatterOf(skillFile(name));
    expect(name).toMatch(/^wideset-[a-z0-9-]+$/);
    expect(fields.name).toBe(name);
    expect(fields.description.length).toBeGreaterThan(40);
    expect(fields.description.length).toBeLessThanOrEqual(1024);
  });

  it.each(skillNames)('%s uses only spec frontmatter keys', (name) => {
    expect(Object.keys(frontmatterOf(skillFile(name))).filter((k) => !ALLOWED.includes(k))).toEqual(
      [],
    );
  });

  it.each(skillNames)('%s is under 400 lines', (name) => {
    expect(skillFile(name).split('\n').length).toBeLessThanOrEqual(400);
  });

  it.each(skillNames)('%s links only to files that exist, one level deep', (name) => {
    const root = join(PACKAGE, 'skills', name);
    const links = [...skillFile(name).matchAll(/\]\((references\/[^)#]+)/g)].map((m) => m[1]);
    for (const link of links) expect(existsSync(join(root, link)), link).toBe(true);
    const nested = walk(root)
      .filter((file) => file.endsWith('.md') && !file.endsWith('SKILL.md'))
      .map((file) => relative(root, file).split(/[\\/]/))
      .filter(
        (parts) =>
          parts[0] !== 'references' ||
          (parts.length > 2 && parts[1] !== 'specs' && parts[1] !== 'good-practices'),
      );
    expect(nested).toEqual([]);
  });

  it('keeps AGENTS.wideset.md within 8 KB', () => {
    expect(Buffer.byteLength(inPackage('AGENTS.wideset.md'))).toBeLessThanOrEqual(8192);
  });
});

describe('what ships', () => {
  it('has no internal links', () => {
    const internal = /docs\/internal|\.prime|claude\.ai/;
    expect(shippedFiles.filter((file) => internal.test(read(file)))).toEqual([]);
  });

  // `wideset` is not on public npm yet, so a bare `npx wideset` would run whoever registers the name.
  it('never tells anyone to fetch the wideset CLI', () => {
    const released = [
      join(REPO, 'packages/design-system/registry.json'),
      join(REPO, '.changeset/wideset-skills-cli.md'),
      join(REPO, '.changeset/wideset-skills-package.md'),
    ];
    const bare = [...shippedFiles, ...released].filter(
      (file) => existsSync(file) && /npx\s+wideset\b/.test(read(file)),
    );
    expect(bare.map((file) => relative(REPO, file))).toEqual([]);
  });

  // The skills describe the library, so Changesets must release them under one version.
  it('shares one version with the library through a fixed changeset group', () => {
    const config = JSON.parse(read(join(REPO, '.changeset/config.json'))) as { fixed: string[][] };
    const group = config.fixed.find((names) => names.includes('@wideset/skills'));
    expect(group).toContain('@wideset/react');
  });

  it('has no Claude-only includes or paths inside skills', () => {
    const hits = walk(join(PACKAGE, 'skills')).filter((file) =>
      /^@[\w./-]+\.md$|\.claude\/skills\//m.test(read(file)),
    );
    expect(hits).toEqual([]);
  });

  it('leaves contributor skills out and marks them internal', () => {
    const contributors = readdirSync(join(REPO, '.agents/skills'));
    expect(contributors.length).toBeGreaterThan(0);
    for (const name of contributors) {
      expect(skillNames, name).not.toContain(name);
      expect(read(join(REPO, '.agents/skills', name, 'SKILL.md')), name).toMatch(
        /^metadata:\n(?:\s+.*\n)*?\s+internal: true$/m,
      );
    }
  });

  describe('prose matches the library', () => {
    const indexSource = read(join(REPO, 'packages/design-system/src/index.ts'));
    const exportsOf = (() => {
      const names = new Set<string>();
      const sf = ts.createSourceFile('index.ts', indexSource, ts.ScriptTarget.Latest, true);
      sf.forEachChild((node) => {
        if (!ts.isExportDeclaration(node) || !node.exportClause) return;
        if (!ts.isNamedExports(node.exportClause)) return;
        for (const element of node.exportClause.elements) names.add(element.name.text);
      });
      return names;
    })();

    const fences = (text: string) => [...text.matchAll(/```tsx?\n([\s\S]*?)```/g)].map((m) => m[1]);
    const proseFiles = handWritten.filter((file) => file.endsWith('.md'));

    it.each(proseFiles.map((file) => [relative(PACKAGE, file), file]))(
      '%s imports only real exports',
      (_, file) => {
        const unknown: string[] = [];
        for (const fence of fences(read(file)))
          for (const match of fence.matchAll(
            /import\s+\{([^}]*)\}\s+from\s+['"]@wideset\/react['"]/g,
          ))
            for (const part of match[1].split(',')) {
              const name = part
                .trim()
                .replace(/^type\s+/, '')
                .split(/\s+as\s+/)[0];
              if (name && !exportsOf.has(name)) unknown.push(name);
            }
        expect(unknown).toEqual([]);
      },
    );

    it.each(proseFiles.map((file) => [relative(PACKAGE, file), file]))(
      '%s renders only real components in its code',
      (_, file) => {
        const unknown = new Set<string>();
        for (const fence of fences(read(file))) {
          const local = new Set(
            [
              ...fence.matchAll(/import\s+(?:type\s+)?(?:(\w+)\s*,?\s*)?(?:\{([^}]*)\})?\s+from/g),
            ].flatMap((m) => [
              m[1] ?? '',
              ...(m[2] ?? '').split(',').map(
                (part) =>
                  part
                    .trim()
                    .split(/\s+as\s+/)
                    .pop() ?? '',
              ),
            ]),
          );
          for (const [, name] of fence.matchAll(/function\s+([A-Z]\w*)/g)) local.add(name);
          for (const [, tag] of fence.matchAll(/<([A-Z]\w*)/g))
            if (!exportsOf.has(tag) && !local.has(tag)) unknown.add(tag);
        }
        expect([...unknown]).toEqual([]);
      },
    );

    it('never recommends a deprecated component or one that does not exist', () => {
      const hits = proseFiles.filter((file) =>
        /<Search\b|\bCommand\b.*(component|palette)|from '@wideset\/react\/icons'/.test(read(file)),
      );
      expect(hits.map((file) => relative(PACKAGE, file))).toEqual([]);
    });

    it('type-checks every complete code block against the library', () => {
      const LIBRARY = join(REPO, 'packages/design-system');
      const dir = join(LIBRARY, 'src/__skill_fences__');
      const virtual = new Map<string, string>([
        [
          join(dir, 'ambient.d.ts'),
          `declare module 'next/link' {
  const Link: (props: { href: string }) => null;
  export default Link;
}
`,
        ],
      ]);
      const origin = new Map<string, string>();
      // The handler table in specs/foundations/props.md is prose, so it is compiled here: a renamed handler or
      // changed value shape in the library fails this test until the table is corrected.
      const handlerTable = join(dir, 'handler_table.tsx');
      virtual.set(handlerTable, HANDLER_TABLE);
      origin.set(handlerTable, 'src/skills.test.ts (HANDLER_TABLE)');
      for (const file of proseFiles)
        fences(read(file)).forEach((fence, index) => {
          if (!/^\s*(import|export) /m.test(fence)) return;
          const path = join(dir, `${relative(PACKAGE, file).replace(/\W+/g, '_')}_${index}.tsx`);
          virtual.set(
            path,
            fence.includes('React.')
              ? `import type React from 'react';
${fence}`
              : fence,
          );
          origin.set(path, relative(PACKAGE, file));
        });
      expect(origin.size).toBeGreaterThan(3);

      const norm = (path: string) => resolve(path);
      const configPath = join(LIBRARY, 'tsconfig.json');
      const config = ts.parseJsonConfigFileContent(
        ts.readConfigFile(configPath, ts.sys.readFile).config,
        ts.sys,
        LIBRARY,
      );
      const options = {
        ...config.options,
        noEmit: true,
        skipLibCheck: true,
        noUnusedLocals: false,
      };
      const host = ts.createCompilerHost(options);
      const { fileExists, readFile, getSourceFile } = host;
      host.fileExists = (file) => virtual.has(norm(file)) || fileExists(file);
      host.readFile = (file) => virtual.get(norm(file)) ?? readFile(file);
      host.getSourceFile = (file, version, ...rest) => {
        const text = virtual.get(norm(file));
        return text !== undefined
          ? ts.createSourceFile(file, text, version)
          : getSourceFile(file, version, ...rest);
      };
      const program = ts.createProgram([...virtual.keys()], options, host);
      const errors = ts
        .getPreEmitDiagnostics(program)
        .filter((d) => d.file && virtual.has(norm(d.file.fileName)))
        .map((d) => {
          const { line } = d.file!.getLineAndCharacterOfPosition(d.start ?? 0);
          return `${origin.get(norm(d.file!.fileName))}:fence+${line + 1}: ${ts.flattenDiagnosticMessageText(d.messageText, ' ')}`;
        });
      expect(errors).toEqual([]);
    }, 180_000);

    it('has no palette classes or unprefixed scale classes in code', () => {
      const palette =
        /\b(?:bg|text|border|ring|fill)-(?:gray|slate|zinc|red|green|blue|yellow|amber|emerald|indigo|violet|neutral|stone|orange|teal|cyan|sky|purple|pink|rose|lime|fuchsia)-\d{2,3}\b/;
      const unprefixed =
        /(?<![\w-])(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y)-\d+(?:\.\d+)?(?![\w-])/;
      const scale =
        /(?<![\w-])(?:text-(?:xs|sm|base|lg|xl|\dxl)|rounded-(?:sm|md|lg|xl)|shadow-(?:sm|md|lg|xl)|font-(?:medium|semibold|bold))(?![\w-])/;
      const bad: string[] = [];
      for (const file of proseFiles)
        for (const fence of fences(read(file)))
          for (const [, value] of fence.matchAll(/className="([^"]*)"/g))
            if (palette.test(value) || unprefixed.test(value) || scale.test(value))
              bad.push(`${relative(PACKAGE, file)}: ${value}`);
      expect(bad).toEqual([]);
    });
  });
});

describe('eval grader', () => {
  it('flags palette, unprefixed and scale classes, and accepts ws tokens', () => {
    expect(checkTokens('<div className="bg-gray-100 p-4 text-sm" />')).toEqual([
      'palette class bg-gray-100',
      'unprefixed spacing p-4',
      'Tailwind scale class text-sm',
    ]);
    expect(checkTokens('<div className="dark:bg-ws-static-container" />')).toEqual([
      'dark: variant',
    ]);
    expect(checkTokens('<div style={{ color: "#ff0000" }} />')).toEqual([
      'raw hex colour in styling',
    ]);
    expect(
      checkTokens(
        '<div className="bg-ws-static-container p-ws-4 gap-ws-7 typography-body-md w-[24rem] shadow-ws-low rounded-ws-control-md flex" />',
      ),
    ).toEqual([]);
  });

  it('flags foreign icons and inline svg, and accepts Remix', () => {
    expect(checkIcons("import { Check } from 'lucide-react';")).toHaveLength(1);
    expect(checkIcons('<svg viewBox="0 0 1 1" />')).toEqual(['inline <svg>']);
    expect(checkIcons("import { RiCheckLine } from '@remixicon/react';")).toEqual([]);
  });

  it('flags a handler the component does not take', () => {
    expect(checkHandlers('<Select options={o} onChange={f} />')).toEqual([
      'Select takes no onChange',
    ]);
    expect(checkHandlers('<Select options={o} onValueChange={f} />')).toEqual([]);
    expect(checkHandlers('<ComboBox onChange={f} />')).toEqual([]);
  });

  it('requires the listed components, from either consumption mode', () => {
    const npm = "import { Modal, type ModalProps } from '@wideset/react';";
    const registry = "import { Button } from '@/components/ui/wideset/button/Button';";
    expect(grade([npm, registry], ['Modal', 'Button']).pass).toBe(true);
    expect(grade([npm], ['Modal', 'Button']).checks.required).toEqual(['does not use Button']);
  });

  it('reports which skills and sources an agent actually read', () => {
    const tool = (name: string, input: object) =>
      JSON.stringify({
        type: 'assistant',
        message: { content: [{ type: 'tool_use', name, input }] },
      });
    const stream = [
      'not json',
      tool('Skill', { skill: 'wideset-build' }),
      tool('Read', { file_path: 'C:\\app\\.claude\\skills\\wideset-tokens\\SKILL.md' }),
      tool('Read', {
        file_path:
          '/app/.claude/skills/wideset-build/references/specs/components/overlays/modal.md',
      }),
      tool('Read', { file_path: '/app/AGENTS.wideset.md' }),
      tool('Read', { file_path: '/app/src/components/ui/wideset/modal/Modal.tsx' }),
      tool('Grep', { pattern: 'x', path: 'src/components/ui/wideset' }),
      tool('Write', { file_path: '/app/src/App.tsx' }),
    ].join('\n');
    expect(toolUsage(stream)).toEqual({
      skillsInvoked: ['wideset-build'],
      skillFilesRead: 2,
      specsRead: ['components/overlays/modal'],
      agentsFileRead: true,
      librarySourceReads: 2,
      skillFilesBySkill: { 'wideset-tokens': 1, 'wideset-build': 1 },
      subagents: [],
    });
    expect(toolUsage('')).toEqual({
      skillsInvoked: [],
      skillFilesRead: 0,
      specsRead: [],
      agentsFileRead: false,
      librarySourceReads: 0,
      skillFilesBySkill: {},
      subagents: [],
    });
  });

  describe('craft', () => {
    it('allows one filled primary per view, an open overlay being its own view', () => {
      const page = (footer: string) =>
        `<main><Button>Save</Button><Button variant="secondary" preset="border">Export</Button>${footer}</main>`;
      expect(checkCraft(page(''))).toEqual([]);
      expect(checkCraft(page('<Button>Send</Button>'))).toEqual([
        'more than one filled primary Button in a view',
      ]);
      expect(
        checkCraft(
          page(
            '<Modal.Content><Modal.Title>Invite</Modal.Title><Button>Send</Button></Modal.Content>',
          ),
        ),
      ).toEqual([]);
    });

    const MANY_PRIMARIES = ['more than one filled primary Button in a view'];

    it('keeps filled primaries apart when they cannot show at once', () => {
      // An early return and a ternary: a finished screen and the wizard before it.
      expect(
        checkCraft(`function App() {
          if (done) { return <Card><Button>Open project</Button></Card>; }
          return <form><Button type="submit">Continue</Button></form>;
        }`),
      ).toEqual([]);
      expect(
        checkCraft(`function App() {
          return <main>{done ? <Button>Open</Button> : <Button>Continue</Button>}</main>;
        }`),
      ).toEqual([]);
      // Tab panels, written inline or as components of the same file.
      expect(
        checkCraft(
          '<Tabs><Tabs.Content value="a"><Button>Save</Button></Tabs.Content><Tabs.Content value="b"><Button>Invite</Button></Tabs.Content></Tabs>',
        ),
      ).toEqual([]);
      expect(
        checkCraft(`function Profile() { return <Button>Save</Button>; }
          const Team = () => <Button>Invite</Button>;
          function App() {
            return <Tabs><Tabs.Content value="a"><Profile /></Tabs.Content><Tabs.Content value="b"><Team /></Tabs.Content></Tabs>;
          }`),
      ).toEqual([]);
    });

    it('still counts filled primaries that show together', () => {
      expect(
        checkCraft(`function Profile() { return <Button>Save</Button>; }
          function Team() { return <Button>Invite</Button>; }
          function App() { return <main><Profile /><Team /></main>; }`),
      ).toEqual(MANY_PRIMARIES);
      // A && can show next to its sibling, and a branch adds to what sits outside it.
      expect(
        checkCraft('<main>{step === 1 && <Button>Next</Button>}<Button>Finish</Button></main>'),
      ).toEqual(MANY_PRIMARIES);
      expect(
        checkCraft('<main><Button>Save</Button>{done ? <Button>Open</Button> : <span />}</main>'),
      ).toEqual(MANY_PRIMARIES);
      expect(
        checkCraft(
          '<Tabs.Content value="a"><Button>Save</Button><Button>Send</Button></Tabs.Content>',
        ),
      ).toEqual(MANY_PRIMARIES);
      // An `if` that does not return leaves what follows on the same screen.
      expect(
        checkCraft(`function App() {
          let extra = null;
          if (done) { extra = <Button>Open</Button>; }
          return <main>{extra}<Button>Save</Button></main>;
        }`),
      ).toEqual(MANY_PRIMARIES);
      // Two in one branch are two whichever branch shows.
      expect(
        checkCraft(`function App() {
          if (done) { return <main><Button>A</Button><Button>B</Button></main>; }
          return <main />;
        }`),
      ).toEqual(MANY_PRIMARIES);
    });

    it('flags hand-built controls and nested cards', () => {
      expect(checkCraft('<button onClick={f}>Save</button>')).toEqual([
        'hand-built <button> where Wideset has Button',
      ]);
      expect(checkCraft('<Card><Card.Content><Card>x</Card></Card.Content></Card>')).toEqual([
        'Card nested inside a card',
      ]);
      expect(checkCraft('<Card>x</Card>')).toEqual([]);
    });

    it('flags mistakes that compile and then break', () => {
      expect(
        checkCraft('<Sidebar.Expanded><div><Sidebar.Trigger /></div></Sidebar.Expanded>'),
      ).toEqual(['Sidebar.Trigger inside Sidebar.Expanded loses focus on toggle']);
      expect(
        checkCraft(
          '<Sidebar.Header><Sidebar.Expanded>x</Sidebar.Expanded><Sidebar.Trigger /></Sidebar.Header>',
        ),
      ).toEqual([]);
      expect(
        checkCraft('<Modal.Trigger><Button variant="secondary">x</Button></Modal.Trigger>'),
      ).toEqual(['Modal.Trigger wraps a button without asChild']);
      expect(
        checkCraft('<Modal.Trigger asChild><Button variant="secondary">x</Button></Modal.Trigger>'),
      ).toEqual([]);
      expect(checkCraft('<Modal.Content><Modal.Body>x</Modal.Body></Modal.Content>')).toEqual([
        'Modal.Content has no title',
      ]);
      expect(checkCraft('<IconButton icon={RiAddLine} />')).toEqual([
        'IconButton without aria-label',
      ]);
      expect(checkCraft('<FormField label="a" errorText={e}><TextInput /></FormField>')).toEqual([
        'FormField errorText without variant on its control',
      ]);
    });

    it('flags placeholder content, filler and decoration, but not class names', () => {
      expect(checkCraft('<p>Lorem ipsum dolor</p>')[0]).toContain('placeholder content');
      expect(checkCraft('<h1>Welcome back</h1>')[0]).toContain('filler heading');
      expect(checkCraft('<p>Saved 🎉</p>')).toEqual(['emoji in the interface']);
      expect(checkCraft('<div className="bg-gradient-to-r" />')).toEqual(['gradient']);
      expect(checkCraft('<p className="typography-body-md">Northwind Traders</p>')).toEqual([]);
    });
  });

  it('fails a run in which the agent wrote nothing', () => {
    expect(grade([], []).pass).toBe(false);
  });

  it('every case parses and requires only real exports', () => {
    const dir = join(PACKAGE, 'evals/cases');
    const index = read(join(REPO, 'packages/design-system/src/index.ts'));
    const cases = readdirSync(dir).map((file) => parseCase(read(join(dir, file))));
    expect(cases.length).toBeGreaterThanOrEqual(12);
    for (const testCase of cases) {
      expect(testCase.prompt.length, testCase.name).toBeGreaterThan(40);
      for (const name of testCase.requires)
        expect(index, `${testCase.name}: ${name}`).toMatch(new RegExp(`\\b${name}\\b`));
    }
  });
});
