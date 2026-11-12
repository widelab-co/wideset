import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { main } from './cli.mjs';
import {
  addAgentsPointer,
  addClaudeImport,
  addPathAlias,
  addStyleImports,
  addViteAlias,
  detectProject,
  parseJsonc,
  withRegistry,
} from './project.mjs';
import { registryBase, suggest } from './registry.mjs';
import { assertSafeArgs, SHADCN_VERSION } from './shadcn.mjs';

// Files as `npm create vite@latest -- --template react-ts` writes them (create-vite 9).
const VITE_TSCONFIG_APP = `{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "es2023",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "jsx": "react-jsx",

    /* Linting */
    "noUnusedLocals": true
  },
  "include": ["src"]
}
`;
const VITE_CONFIG = `import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
`;
const VITE_MAIN = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
`;

const REGISTRY = 'http://registry.test/r';
const INDEX = {
  name: 'wideset',
  items: [
    { name: 'button', type: 'registry:ui', description: 'Buttons trigger actions.' },
    { name: 'select', type: 'registry:ui', description: 'Pick one option from a list.' },
    { name: 'skills', type: 'registry:item', description: 'Agent skills.' },
    { name: 'skills-claude', type: 'registry:item', description: 'Agent skills for Claude.' },
    { name: 'styles', type: 'registry:item', description: 'Compiled CSS.' },
    { name: 'utils', type: 'registry:lib', description: 'cn()' },
  ],
};
const fakeFetch = (async (url: string) => {
  if (url !== `${REGISTRY}/registry.json`) return { ok: false, status: 404 };
  return { ok: true, json: async () => INDEX };
}) as unknown as typeof fetch;

let dir: string;
const write = (path: string, content: string) => {
  mkdirSync(dirname(join(dir, path)), { recursive: true });
  writeFileSync(join(dir, path), content);
};
const read = (path: string) => readFileSync(join(dir, path), 'utf8');

// What the fake shadcn writes for @wideset/font; 'missing' is a registry without the item.
const FONT_CSS = "@import '@fontsource-variable/inter';\n";
let fontRegistry: 'present' | 'missing' = 'present';

function viteApp() {
  write(
    'package.json',
    JSON.stringify({ name: 'app', devDependencies: { vite: '^8.0.0', typescript: '~6.0.2' } }),
  );
  write('tsconfig.json', '{ "files": [], "references": [{ "path": "./tsconfig.app.json" }] }\n');
  write('tsconfig.app.json', VITE_TSCONFIG_APP);
  write('vite.config.ts', VITE_CONFIG);
  write('src/main.tsx', VITE_MAIN);
}

async function run(argv: string[]) {
  const out: string[] = [];
  const err: string[] = [];
  const shadcn: string[][] = [];
  const code = await main(argv, {
    cwd: dir,
    env: {},
    log: (line: string) => out.push(line),
    error: (line: string) => err.push(line),
    runShadcn: async (args: string[]) => {
      shadcn.push(args);
      if (args.includes('@wideset/font')) {
        if (fontRegistry === 'missing') throw new Error('item not found: @wideset/font');
        write('src/styles/wideset-font.css', FONT_CSS);
      }
    },
    fetchImpl: fakeFetch,
    columns: 200,
  });
  return { code, out: out.join('\n'), err: err.join('\n'), shadcn };
}

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'wideset-cli-'));
  fontRegistry = 'present';
});
afterEach(() => rmSync(dir, { recursive: true, force: true }));

describe('parseJsonc', () => {
  it('drops comments and trailing commas but keeps // inside strings', () => {
    expect(parseJsonc('{ /* a */ "url": "https://x.test/r", // b\n "list": [1, 2,], }')).toEqual({
      url: 'https://x.test/r',
      list: [1, 2],
    });
  });
});

describe('addPathAlias', () => {
  it('adds @/* to create-vite tsconfig.app.json and keeps its comments', () => {
    const { text, changed } = addPathAlias(VITE_TSCONFIG_APP, './src/*');
    expect(changed).toBe(true);
    expect(text).toContain('/* Bundler mode */');
    expect(parseJsonc(text).compilerOptions.paths).toEqual({ '@/*': ['./src/*'] });
  });

  it('adds @/* next to existing paths', () => {
    const { text } = addPathAlias(
      '{ "compilerOptions": { "paths": { "~/*": ["./x/*"] } } }',
      './*',
    );
    expect(parseJsonc(text).compilerOptions.paths).toEqual({ '@/*': ['./*'], '~/*': ['./x/*'] });
  });

  it('handles empty compilerOptions and a missing compilerOptions', () => {
    expect(parseJsonc(addPathAlias('{ "compilerOptions": {} }', './*').text)).toEqual({
      compilerOptions: { paths: { '@/*': ['./*'] } },
    });
    expect(parseJsonc(addPathAlias('{ "files": [] }', './*').text).compilerOptions.paths).toEqual({
      '@/*': ['./*'],
    });
  });

  it('leaves an existing @/* alone and reports it', () => {
    const source = '{ "compilerOptions": { "paths": { "@/*": ["./*"] } } }';
    expect(addPathAlias(source, './src/*')).toEqual({
      text: source,
      changed: false,
      existing: './*',
    });
  });
});

describe('addViteAlias', () => {
  it('adds resolve.alias and the fileURLToPath import in the file style', () => {
    const { text, changed } = addViteAlias(VITE_CONFIG, 'src');
    expect(changed).toBe(true);
    expect(text.split('\n')[0]).toBe("import { fileURLToPath } from 'node:url'");
    expect(text).toContain(
      "resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },",
    );
    expect(text).toContain('plugins: [react()],');
  });

  it('uses semicolons when the file does', () => {
    const { text } = addViteAlias(VITE_CONFIG.replace(/'\n/g, "';\n"), 'src');
    expect(text.split('\n')[0]).toBe("import { fileURLToPath } from 'node:url';");
  });

  it('leaves an existing @ alias alone', () => {
    const source = VITE_CONFIG.replace(
      'plugins',
      "resolve: { alias: { '@': '/src' } },\n  plugins",
    );
    expect(addViteAlias(source, 'src')).toEqual({ text: source, changed: false });
  });

  it('leaves a config using vite-tsconfig-paths alone', () => {
    const source = `import tsconfigPaths from 'vite-tsconfig-paths'\n${VITE_CONFIG}`;
    expect(addViteAlias(source, 'src')).toEqual({ text: source, changed: false });
  });

  it('asks for a manual edit when resolve exists or the config is not defineConfig({…})', () => {
    expect(
      addViteAlias(VITE_CONFIG.replace('plugins', 'resolve: {},\n  plugins'), 'src').manual,
    ).toBe(true);
    expect(addViteAlias('export default { plugins: [] }', 'src').manual).toBe(true);
  });
});

describe('addStyleImports', () => {
  it('prepends the imports in the file style, once', () => {
    const first = addStyleImports(VITE_MAIN, ['@/styles/wideset.css']);
    expect(first.text.split('\n')[0]).toBe("import '@/styles/wideset.css'");
    expect(addStyleImports(first.text, ['@/styles/wideset.css'])).toEqual({
      text: first.text,
      changed: false,
    });
  });

  it('appends after a multi-line last import, and after one with no trailing newline', () => {
    const multi =
      "import './index.css'\nimport {\n  App,\n  Other,\n} from './App.tsx'\n\nrender()\n";
    expect(addStyleImports(multi, ['@/styles/wideset-font.css'], { last: true }).text).toBe(
      "import './index.css'\nimport {\n  App,\n  Other,\n} from './App.tsx'\nimport '@/styles/wideset-font.css'\n\nrender()\n",
    );
    expect(addStyleImports("import './a.css'", ['@/styles/b.css'], { last: true }).text).toBe(
      "import './a.css'\nimport '@/styles/b.css'\n",
    );
  });

  it('keeps a directive first and follows double quotes and semicolons', () => {
    const { text } = addStyleImports('"use client";\nimport "./globals.css";\n', [
      '@/styles/wideset.css',
    ]);
    expect(text).toBe('"use client";\nimport "@/styles/wideset.css";\nimport "./globals.css";\n');
  });
});

describe('withRegistry', () => {
  const url = `${REGISTRY}/{name}.json`;

  it('adds the namespace and keeps the rest of a shadcn components.json', () => {
    const { config, changed } = withRegistry({ style: 'new-york', registries: { '@x': 'y' } }, url);
    expect(changed).toBe(true);
    expect(config).toEqual({ style: 'new-york', registries: { '@x': 'y', '@wideset': url } });
  });

  it('keeps an existing @wideset URL unless asked to replace it', () => {
    const config = { registries: { '@wideset': 'http://other.test/r/{name}.json' } };
    expect(withRegistry(config, url).changed).toBe(false);
    expect(withRegistry(config, url, { replace: true }).config.registries['@wideset']).toBe(url);
  });
});

describe('registry helpers', () => {
  it('normalises every form of the registry URL', () => {
    for (const input of [REGISTRY, `${REGISTRY}/`, `${REGISTRY}/{name}.json`]) {
      expect(registryBase(input)).toBe(REGISTRY);
    }
    expect(() => registryBase('registry.test/r')).toThrow(/http/);
  });

  it('suggests close names only', () => {
    expect(suggest('buton', ['button', 'select'])).toBe('button');
    expect(suggest('xyz', ['button', 'select'])).toBeNull();
  });
});

describe('detectProject', () => {
  it('reads a create-vite app', () => {
    viteApp();
    expect(detectProject(dir)).toMatchObject({
      framework: 'vite',
      srcDir: 'src',
      entry: 'src/main.tsx',
      tsconfig: 'tsconfig.app.json',
      viteConfig: 'vite.config.ts',
      hasTailwind: false,
    });
  });

  it('reads a Next.js app with and without src/', () => {
    write(
      'package.json',
      JSON.stringify({ dependencies: { next: '16.0.0' }, devDependencies: { tailwindcss: '4' } }),
    );
    write('tsconfig.json', '{}');
    write('app/layout.tsx', '');
    expect(detectProject(dir)).toMatchObject({
      framework: 'next',
      srcDir: '.',
      entry: 'app/layout.tsx',
      css: 'app/globals.css',
      hasTailwind: true,
    });
    rmSync(join(dir, 'app'), { recursive: true });
    write('src/app/layout.tsx', '');
    expect(detectProject(dir)).toMatchObject({ srcDir: 'src', entry: 'src/app/layout.tsx' });
  });

  it('explains what to do outside a project', () => {
    expect(() => detectProject(dir)).toThrow(/No package.json/);
  });
});

describe('wideset init', () => {
  it('sets up a create-vite app and adds the stylesheets through shadcn', async () => {
    viteApp();
    const { code, shadcn } = await run(['init', '--registry', REGISTRY]);
    expect(code).toBe(0);

    const config = JSON.parse(read('components.json'));
    expect(config).toMatchObject({
      rsc: false,
      tailwind: { css: 'src/index.css' },
      registries: { '@wideset': `${REGISTRY}/{name}.json` },
    });
    expect(parseJsonc(read('tsconfig.app.json')).compilerOptions.paths['@/*']).toEqual(['./src/*']);
    expect(read('vite.config.ts')).toContain("'@': fileURLToPath");
    // No Tailwind in a fresh Vite app, so it gets the reset, imported before the styles.
    expect(shadcn).toEqual([
      ['add', '--yes', '--overwrite', '--silent', '@wideset/preflight', '@wideset/styles'],
      ['add', '--yes', '--silent', '@wideset/font'],
    ]);
    expect(read('src/main.tsx').split('\n').slice(0, 2)).toEqual([
      "import '@/styles/wideset-preflight.css'",
      "import '@/styles/wideset.css'",
    ]);
  });

  it('adds Inter and imports it after the stylesheets the template already imports', async () => {
    viteApp();
    await run(['init', '--registry', REGISTRY]);
    const imports = read('src/main.tsx').trimEnd().split('\n');
    expect(imports.at(-1)).toBe("import '@/styles/wideset-font.css'");
    expect(imports.indexOf("import './index.css'")).toBeLessThan(imports.length - 1);
  });

  it('--no-font leaves the page font alone', async () => {
    viteApp();
    const { shadcn, out } = await run(['init', '--registry', REGISTRY, '--no-font']);
    expect(shadcn.flat()).not.toContain('@wideset/font');
    expect(read('src/main.tsx')).not.toContain('wideset-font');
    expect(out).toContain('font: left as it is (--no-font)');
  });

  it('keeps a font the project brought itself', async () => {
    viteApp();
    write(
      'package.json',
      JSON.stringify({
        devDependencies: { vite: '^8.0.0' },
        dependencies: { '@fontsource-variable/geist': '^5.0.0' },
      }),
    );
    const { shadcn, out } = await run(['init', '--registry', REGISTRY]);
    expect(shadcn.flat()).not.toContain('@wideset/font');
    expect(out).toContain('font: kept yours (@fontsource-variable/geist)');
  });

  it('does not bring the font back once its file was deleted', async () => {
    viteApp();
    await run(['init', '--registry', REGISTRY]);
    expect(read('src/styles/wideset-font.css')).toBe(FONT_CSS);
    rmSync(join(dir, 'src/styles/wideset-font.css'));
    write('src/main.tsx', read('src/main.tsx').replace("import '@/styles/wideset-font.css'\n", ''));
    const { shadcn, out } = await run(['init']);
    expect(shadcn.flat()).not.toContain('@wideset/font');
    expect(read('src/main.tsx')).not.toContain('wideset-font');
    expect(out).toContain('font: left as it is');
  });

  it('does not bring the import back once only the import was removed', async () => {
    viteApp();
    await run(['init', '--registry', REGISTRY]);
    write('src/main.tsx', read('src/main.tsx').replace("import '@/styles/wideset-font.css'\n", ''));
    const { shadcn } = await run(['init']);
    expect(shadcn.flat()).not.toContain('@wideset/font');
    expect(read('src/main.tsx')).not.toContain('wideset-font');
    expect(read('src/styles/wideset-font.css')).toBe(FONT_CSS);
  });

  it('finishes with a warning when the registry has no font item', async () => {
    viteApp();
    fontRegistry = 'missing';
    const { code, out } = await run(['init', '--registry', REGISTRY]);
    expect(code).toBe(0);
    expect(out).toContain('! font: could not add @wideset/font');
    expect(out).toContain('Load a variable font');
    expect(read('src/main.tsx')).toContain("import '@/styles/wideset.css'");
    expect(read('src/main.tsx')).not.toContain('wideset-font');
    expect(read('components.json')).toContain('@wideset');
  });

  it('keeps a font the entry loads itself through --font-ws-sans', async () => {
    viteApp();
    write(
      'src/main.tsx',
      read('src/main.tsx').replace(
        "import './index.css'",
        "import './index.css'\nconst inter = Inter({ subsets: ['latin'], variable: '--font-ws-sans' })",
      ),
    );
    const { shadcn, out } = await run(['init', '--registry', REGISTRY]);
    expect(shadcn.flat()).not.toContain('@wideset/font');
    expect(read('src/main.tsx')).not.toContain('wideset-font');
    expect(out).toContain('font: kept yours (src/main.tsx sets --font-ws-sans)');
  });

  it('imports a font file that is already there in a project set up for the first time', async () => {
    viteApp();
    await run(['init', '--registry', REGISTRY]);
    rmSync(join(dir, 'components.json'));
    write('src/main.tsx', read('src/main.tsx').replace("import '@/styles/wideset-font.css'\n", ''));
    const { shadcn, out } = await run(['init', '--registry', REGISTRY]);
    expect(shadcn.flat()).not.toContain('@wideset/font');
    expect(read('src/main.tsx').trimEnd().split('\n').at(-1)).toBe(
      "import '@/styles/wideset-font.css'",
    );
    expect(out).toContain('src/main.tsx: imports @/styles/wideset-font.css');
  });

  it('keeps the import of a font file that is already there', async () => {
    viteApp();
    await run(['init', '--registry', REGISTRY]);
    write('src/styles/wideset-font.css', 'body { font-family: Georgia; }\n');
    const { shadcn } = await run(['init']);
    expect(shadcn.flat()).not.toContain('@wideset/font');
    expect(read('src/styles/wideset-font.css')).toBe('body { font-family: Georgia; }\n');
    expect(read('src/main.tsx')).toContain("import '@/styles/wideset-font.css'");
  });

  it('changes nothing on a second run', async () => {
    viteApp();
    await run(['init', '--registry', REGISTRY]);
    const files = ['components.json', 'tsconfig.app.json', 'vite.config.ts', 'src/main.tsx'];
    const before = files.map(read);
    const { out } = await run(['init']);
    expect(files.map(read)).toEqual(before);
    expect(out).not.toMatch(/✔ (components|tsconfig|vite|src)/);
  });

  it('only registers the namespace in an existing shadcn project', async () => {
    write('package.json', JSON.stringify({ dependencies: { next: '16.0.0', tailwindcss: '4' } }));
    write('tsconfig.json', '{ "compilerOptions": { "paths": { "@/*": ["./*"] } } }');
    write('app/layout.tsx', 'import "./globals.css";\n');
    const shadcnConfig = { style: 'radix-nova', rsc: true, aliases: { ui: '@/components/ui' } };
    write('components.json', JSON.stringify(shadcnConfig));

    const { shadcn } = await run(['init', '--registry', REGISTRY]);
    expect(JSON.parse(read('components.json'))).toEqual({
      ...shadcnConfig,
      registries: { '@wideset': `${REGISTRY}/{name}.json` },
    });
    expect(shadcn[0]).toEqual(['add', '--yes', '--overwrite', '--silent', '@wideset/styles']);
    expect(read('app/layout.tsx')).toBe(
      'import "@/styles/wideset.css";\nimport "./globals.css";\n',
    );
  });

  it('--dry-run prints the plan and changes nothing', async () => {
    viteApp();
    const files = ['tsconfig.app.json', 'vite.config.ts', 'src/main.tsx'];
    const before = files.map(read);
    const { code, out, shadcn } = await run(['init', '--dry-run', '--registry', REGISTRY]);
    expect(code).toBe(0);
    expect(files.map(read)).toEqual(before);
    expect(() => read('components.json')).toThrow();
    expect(shadcn).toEqual([]);
    expect(out).toContain('would: components.json: created');
    expect(out).toContain('Dry run: nothing was changed.');
  });

  it('refuses a project without TypeScript', async () => {
    write('package.json', JSON.stringify({ devDependencies: { vite: '8' } }));
    const { code, err, shadcn } = await run(['init']);
    expect(code).toBe(1);
    expect(err).toMatch(/tsconfig/);
    expect(shadcn).toEqual([]);
  });
});

describe('wideset add', () => {
  beforeEach(() => {
    write('package.json', '{}');
    write(
      'components.json',
      JSON.stringify({ registries: { '@wideset': `${REGISTRY}/{name}.json` } }),
    );
  });

  it('passes namespaced addresses to shadcn add', async () => {
    const { code, shadcn } = await run(['add', 'button', '@wideset/select']);
    expect(code).toBe(0);
    expect(shadcn).toEqual([['add', '--yes', '@wideset/button', '@wideset/select']]);
  });

  it('forwards --overwrite and expands --all to components only', async () => {
    const { shadcn } = await run(['add', '--all', '--overwrite']);
    expect(shadcn).toEqual([['add', '--yes', '--overwrite', '@wideset/button', '@wideset/select']]);
  });

  it('rejects unknown names with a suggestion and never calls shadcn', async () => {
    const { code, err, shadcn } = await run(['add', 'buton']);
    expect(code).toBe(1);
    expect(err).toContain('did you mean button?');
    expect(shadcn).toEqual([]);
  });

  it('runs init first in a project that was never set up', async () => {
    rmSync(join(dir, 'components.json'));
    viteApp();
    const { code, shadcn } = await run(['add', 'button', '--registry', REGISTRY]);
    expect(code).toBe(0);
    expect(JSON.parse(read('components.json')).registries['@wideset']).toBe(
      `${REGISTRY}/{name}.json`,
    );
    expect(shadcn).toEqual([
      ['add', '--yes', '--overwrite', '--silent', '@wideset/preflight', '@wideset/styles'],
      ['add', '--yes', '--silent', '@wideset/font'],
      ['add', '--yes', '@wideset/button'],
    ]);
  });
});

describe('wideset list', () => {
  it('lists components with their descriptions, not the shared items', async () => {
    const { code, out } = await run(['list', '--registry', REGISTRY]);
    expect(code).toBe(0);
    expect(out).toMatch(/button\s+Buttons trigger actions\./);
    expect(out).not.toMatch(/^\s+styles/m);
  });
});

describe('pointers to AGENTS.wideset.md', () => {
  it('appends the AGENTS.md pointer once and keeps what is there', () => {
    const first = addAgentsPointer('# My rules\n');
    expect(first.text).toBe('# My rules\n\nSee AGENTS.wideset.md for Wideset rules.\n');
    expect(addAgentsPointer(first.text)).toEqual({ text: first.text, changed: false });
    expect(addAgentsPointer('').text).toBe('See AGENTS.wideset.md for Wideset rules.\n');
    expect(addAgentsPointer('no newline').text).toBe(
      'no newline\n\nSee AGENTS.wideset.md for Wideset rules.\n',
    );
  });

  it('appends the CLAUDE.md import once', () => {
    const first = addClaudeImport('@AGENTS.md\n');
    expect(first.text).toBe('@AGENTS.md\n\n@AGENTS.wideset.md\n');
    expect(addClaudeImport(first.text).changed).toBe(false);
  });
});

describe('wideset skills', () => {
  const SKILLS = `${REGISTRY}/skills.json`;
  const SKILLS_CLAUDE = `${REGISTRY}/skills-claude.json`;
  beforeEach(() => write('package.json', '{}'));

  it('adds the skills by URL, with no components.json, and points AGENTS.md at the rules', async () => {
    const { code, shadcn } = await run(['skills', '--registry', REGISTRY]);
    expect(code).toBe(0);
    expect(shadcn).toEqual([['add', '--yes', '--overwrite', '--silent', SKILLS]]);
    expect(read('AGENTS.md')).toBe('See AGENTS.wideset.md for Wideset rules.\n');
    expect(() => read('components.json')).toThrow();
    expect(() => read('CLAUDE.md')).toThrow();
  });

  it('uses the registry components.json names', async () => {
    write(
      'components.json',
      JSON.stringify({ registries: { '@wideset': `${REGISTRY}/{name}.json` } }),
    );
    const { shadcn } = await run(['skills']);
    expect(shadcn[0]).toContain(SKILLS);
  });

  it('changes nothing the second time and keeps an existing AGENTS.md', async () => {
    write('AGENTS.md', '# Team rules\n');
    await run(['skills', '--registry', REGISTRY]);
    const once = read('AGENTS.md');
    expect(once).toContain('# Team rules');
    await run(['skills', '--registry', REGISTRY]);
    expect(read('AGENTS.md')).toBe(once);
  });

  it('adds the Claude item and import when the project has a CLAUDE.md', async () => {
    write('CLAUDE.md', '# Notes\n');
    const { shadcn } = await run(['skills', '--registry', REGISTRY]);
    expect(shadcn[0]).toEqual(expect.arrayContaining([SKILLS, SKILLS_CLAUDE]));
    expect(read('CLAUDE.md')).toBe('# Notes\n\n@AGENTS.wideset.md\n');
    await run(['skills', '--registry', REGISTRY]);
    expect(read('CLAUDE.md')).toBe('# Notes\n\n@AGENTS.wideset.md\n');
  });

  it('adds the Claude item for a .claude folder or --claude, without creating CLAUDE.md', async () => {
    const flagged = await run(['skills', '--claude', '--registry', REGISTRY]);
    expect(flagged.shadcn[0]).toContain(SKILLS_CLAUDE);
    expect(() => read('CLAUDE.md')).toThrow();

    rmSync(join(dir, 'AGENTS.md'));
    write('.claude/settings.json', '{}');
    const detected = await run(['skills', '--registry', REGISTRY]);
    expect(detected.shadcn[0]).toContain(SKILLS_CLAUDE);
    expect(detected.out).toContain('add `@AGENTS.wideset.md`');
  });

  it('touches nothing in a dry run', async () => {
    const { shadcn, out } = await run(['skills', '--dry-run', '--registry', REGISTRY]);
    expect(shadcn).toEqual([]);
    expect(out).toContain('Dry run');
    expect(() => read('AGENTS.md')).toThrow();
  });

  it('fails clearly outside a project', async () => {
    rmSync(join(dir, 'package.json'));
    const { code, err, shadcn } = await run(['skills', '--registry', REGISTRY]);
    expect(code).toBe(1);
    expect(err).toContain('No package.json');
    expect(shadcn).toEqual([]);
  });

  it('keeps the skills items out of list and add --all', async () => {
    expect((await run(['list', '--registry', REGISTRY])).out).not.toMatch(/skills/);
    write(
      'components.json',
      JSON.stringify({ registries: { '@wideset': `${REGISTRY}/{name}.json` } }),
    );
    const { shadcn } = await run(['add', '--all']);
    expect(shadcn[0].join(' ')).not.toContain('skills');
  });
});

describe('wideset info', () => {
  const info = async () => JSON.parse((await run(['info', '--json'])).out);

  it('reports a project using the npm package', async () => {
    write(
      'package.json',
      JSON.stringify({
        dependencies: { '@wideset/react': '^1.3.0' },
        devDependencies: { vite: '^8.0.0', tailwindcss: '^4.1.0' },
      }),
    );
    expect(await info()).toMatchObject({
      mode: 'npm',
      version: '^1.3.0',
      import: '@wideset/react',
      framework: 'vite',
      tailwind: { v4: true },
      skills: { installed: false },
    });
  });

  it('prefers the installed version to the range', async () => {
    write('package.json', JSON.stringify({ dependencies: { '@wideset/react': '^1.3.0' } }));
    write('node_modules/@wideset/react/package.json', JSON.stringify({ version: '1.3.7' }));
    expect((await info()).version).toBe('1.3.7');
  });

  it('reports a scaffolded project, its registry and aliases', async () => {
    write('package.json', JSON.stringify({ devDependencies: { next: '16.0.0' } }));
    write(
      'components.json',
      JSON.stringify({
        aliases: { ui: '@/components/ui' },
        registries: { '@wideset': `${REGISTRY}/{name}.json` },
      }),
    );
    write('components/ui/wideset/button/Button.tsx', '');
    expect(await info()).toMatchObject({
      mode: 'registry',
      version: null,
      import: '@/components/ui/wideset/<folder>/<Name>',
      registry: `${REGISTRY}/{name}.json`,
      aliases: { ui: '@/components/ui' },
      framework: 'next',
      tailwind: { version: null, v4: false },
    });
  });

  it('reports the installed skills and the version they describe', async () => {
    write('package.json', '{}');
    write('.agents/skills/wideset-setup/SKILL.md', "metadata:\n  wideset-version: '1.3.0'\n");
    write('.claude/skills/wideset-setup/SKILL.md', "metadata:\n  wideset-version: '1.3.0'\n");
    expect((await info()).skills).toEqual({
      installed: true,
      version: '1.3.0',
      paths: ['.agents/skills', '.claude/skills'],
    });
  });

  it('reports none in a project without Wideset, and with no project at all', async () => {
    write('package.json', '{}');
    expect(await info()).toMatchObject({ mode: 'none', version: null, import: null });
    rmSync(join(dir, 'package.json'));
    expect(await info()).toMatchObject({ mode: 'none', framework: null });
  });

  it('prints a readable summary without --json', async () => {
    write('package.json', JSON.stringify({ dependencies: { '@wideset/react': '^1.3.0' } }));
    const { code, out } = await run(['info']);
    expect(code).toBe(0);
    expect(out).toMatch(/^mode\s+npm \(\^1\.3\.0\)/m);
  });
});

describe('arguments', () => {
  it('prints help without a command and fails on unknown ones', async () => {
    expect((await run([])).code).toBe(1);
    expect((await run(['--help'])).out).toContain('npx wideset init');
    const unknown = await run(['deploy']);
    expect(unknown.code).toBe(1);
    expect(unknown.err).toContain('Unknown command "deploy"');
  });
});

describe('shadcn arguments', () => {
  it('accepts flags, item names and namespaced addresses', () => {
    expect(() =>
      assertSafeArgs(['add', '--yes', '--overwrite', '@wideset/icon-button', 'date-picker']),
    ).not.toThrow();
  });

  it('rejects names a Windows shell could interpret', () => {
    for (const name of ['@wideset/a&calc', 'x|y', 'a b', '"quoted"', 'a^b', '%PATH%']) {
      expect(() => assertSafeArgs(['add', name])).toThrow(/unexpected characters/);
    }
  });
});

describe('package', () => {
  const manifest = (path: string) => JSON.parse(readFileSync(resolve(__dirname, path), 'utf8'));

  it('runs an exact shadcn version, the one the registry smoke tests pin', () => {
    expect(SHADCN_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    expect(SHADCN_VERSION).toBe(
      manifest('../../design-system/package.json').devDependencies.shadcn,
    );
  });

  it('ships the CLI as the wideset command, with no runtime dependencies', () => {
    const pkg = manifest('../package.json');
    expect(pkg.name).toBe('wideset');
    expect(pkg.bin).toEqual({ wideset: './src/wideset.mjs' });
    expect(pkg.files).toContain('src');
    expect(pkg.dependencies).toBeUndefined();
  });
});
