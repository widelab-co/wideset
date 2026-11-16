/*
  Installs registry items into fresh Vite + Tailwind v4 + shadcn projects and type-checks them.
  This is the only proof that a scaffolded component compiles outside this repo.

    pnpm test:registry                         # every item, one fresh app each, then all at once
    pnpm test:registry --items button,select   # a subset
    pnpm test:registry --shard 2/4             # a quarter of the items (CI matrix)
    pnpm test:registry --all                   # only the "every item in one app + vite build" run
    pnpm test:registry --next                  # Next.js App Router: Server Components, named exports,
                                               # for the scaffolded files and the packed npm package
    pnpm test:registry --registry https://<branch>-wideset-docs-develop.<account>.workers.dev/r
                                               # against a deployed registry instead of a local build

  Without --registry the script builds the registry itself with a 127.0.0.1 base URL and serves
  it, so every URL the CLI fetches is the artefact under test. One pristine app is scaffolded with
  the hand-written components.json the docs tell consumers to copy (no `shadcn init`); per-item runs
  copy it and share its node_modules. The Next.js app runs `shadcn init` instead, covering projects
  that already use shadcn. `--keep` leaves the work directory behind for inspection.

  SHADCN_VERSION=latest overrides the CLI version (default: the pin in package.json devDependencies);
  CI runs that weekly.
*/
import { spawn } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildRegistry } from './build-registry.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SHADCN_VERSION =
  process.env.SHADCN_VERSION ||
  JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).devDependencies.shadcn;

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const has = (name) => args.includes(name);

const log = (msg) => console.log(`[smoke] ${msg}`);
// Async on purpose: the registry server lives in this process, and a synchronous spawn would block
// the event loop while the CLI waits for a response from it.
const run = (cmd, cmdArgs, cwd, { env = {}, quiet = false } = {}) =>
  new Promise((done, reject) => {
    const child = spawn(cmd, cmdArgs, {
      cwd,
      env: { ...process.env, CI: 'true', npm_config_yes: 'true', FORCE_COLOR: '0', ...env },
      stdio: quiet ? ['ignore', 'pipe', 'pipe'] : ['ignore', 'inherit', 'inherit'],
      shell: process.platform === 'win32',
    });
    let out = '';
    child.stdout?.on('data', (chunk) => (out += chunk));
    child.stderr?.on('data', (chunk) => (out += chunk));
    child.on('error', reject);
    child.on('close', (status) => {
      if (status === 0) return done(out);
      reject(
        new Error(
          `${cmd} ${cmdArgs.join(' ')} failed (${status})\n${out
            .trim()
            .split('\n')
            .slice(-40)
            .join('\n')}`,
        ),
      );
    });
  });

// ---------------------------------------------------------------------------------------------
// Registry: local build + static server, or a deployed URL.

async function serveRegistry(work) {
  const dir = join(work, 'r');
  const server = createServer((req, res) => {
    const file = join(
      dir,
      decodeURIComponent(new URL(req.url, 'http://x').pathname.replace(/^\/r\/?/, '')),
    );
    if (!file.startsWith(dir) || !existsSync(file) || extname(file) !== '.json') {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('not found');
      return;
    }
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(readFileSync(file));
  });
  await new Promise((done) => server.listen(0, '127.0.0.1', done));
  const base = `http://127.0.0.1:${server.address().port}/r`;
  let result;
  try {
    result = buildRegistry({ out: dir, base });
  } catch (err) {
    server.close();
    throw err;
  }
  log(`built ${result.items.length} items, serving at ${base}`);
  return { base, close: () => server.close() };
}

const itemsFrom = (base) =>
  fetch(`${base}/registry.json`)
    .then((r) => {
      if (!r.ok) throw new Error(`${base}/registry.json → ${r.status}`);
      return r.json();
    })
    .then((index) => index.items.map((i) => i.name));

// ---------------------------------------------------------------------------------------------
// Pristine consumer app: Vite + React + TS + Tailwind v4 + shadcn init.

async function scaffoldPristine(work, base) {
  const app = join(work, 'pristine');
  mkdirSync(join(app, 'src'), { recursive: true });
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  const dev = pkg.devDependencies;
  writeFileSync(
    join(app, 'package.json'),
    JSON.stringify(
      {
        name: 'wideset-smoke',
        private: true,
        type: 'module',
        scripts: { build: 'vite build', typecheck: 'tsc --noEmit' },
        // React only. Anything else has to arrive through an item's own `dependencies`, which is
        // exactly what this smoke test exists to prove.
        dependencies: { react: dev.react, 'react-dom': dev['react-dom'] },
        devDependencies: {
          '@tailwindcss/vite': dev.tailwindcss,
          '@types/react': dev['@types/react'],
          '@types/react-dom': dev['@types/react-dom'],
          '@vitejs/plugin-react': '^5.0.0',
          shadcn: SHADCN_VERSION,
          tailwindcss: dev.tailwindcss,
          typescript: dev.typescript,
          vite: dev.vite,
        },
      },
      null,
      2,
    ),
  );
  writeFileSync(
    join(app, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
          module: 'ESNext',
          moduleResolution: 'bundler',
          jsx: 'react-jsx',
          strict: true,
          skipLibCheck: true,
          isolatedModules: true,
          // create-vite's react-ts template sets this. Without it CI would pass on code that fails
          // `tsc -b` in a freshly scaffolded Vite project.
          verbatimModuleSyntax: true,
          noEmit: true,
          baseUrl: '.',
          paths: { '@/*': ['./src/*'] },
        },
        include: ['src'],
      },
      null,
      2,
    ),
  );
  writeFileSync(
    join(app, 'vite.config.ts'),
    `import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
});
`,
  );
  writeFileSync(
    join(app, 'index.html'),
    '<!doctype html><html><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n',
  );
  writeFileSync(join(app, 'src/index.css'), '@import "tailwindcss";\n');
  writeFileSync(
    join(app, 'src/main.tsx'),
    `import { createRoot } from 'react-dom/client';
import './index.css';

createRoot(document.getElementById('root')!).render(<div />);
`,
  );
  writeFileSync(join(app, 'src/vite-env.d.ts'), '/// <reference types="vite/client" />\n');

  log('installing pristine app dependencies');
  await run('npm', ['install', '--no-audit', '--no-fund', '--loglevel=error'], app, {
    quiet: true,
  });
  // No `shadcn init`: the docs tell consumers to copy this components.json instead, so this is the
  // path under test. Keep it identical to the snippet in README.md / apps/docs/src/content/docs/cli.mdx.
  writeFileSync(
    join(app, 'components.json'),
    JSON.stringify(
      {
        $schema: 'https://ui.shadcn.com/schema.json',
        style: 'radix-nova',
        tsx: true,
        rsc: false,
        tailwind: { config: '', css: 'src/index.css', baseColor: 'neutral', cssVariables: true },
        aliases: {
          components: '@/components',
          ui: '@/components/ui',
          lib: '@/lib',
          hooks: '@/hooks',
          utils: '@/lib/utils',
        },
        registries: { '@wideset': `${base}/{name}.json` },
      },
      null,
      2,
    ),
  );
  log(`shadcn@${SHADCN_VERSION}, components.json written by hand (no init)`);
  return app;
}

// A remote registry is untrusted input, and the name becomes a path cloneApp deletes.
const safeItemName = (name) => /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(name) && !name.includes('..');

function cloneApp(pristine, dest, appsDir) {
  if (appsDir && !resolve(dest).startsWith(resolve(appsDir))) {
    throw new Error(`refusing to touch ${dest}: outside ${appsDir}`);
  }
  rmSync(dest, { recursive: true, force: true });
  // join(): on Windows cpSync reports backslash paths, and a forward-slash needle would copy
  // node_modules and then fail on the symlink with EEXIST.
  const nodeModules = join(pristine, 'node_modules');
  cpSync(pristine, dest, {
    recursive: true,
    filter: (src) => src !== nodeModules && !src.startsWith(nodeModules + sep),
  });
  symlinkSync(join(pristine, 'node_modules'), join(dest, 'node_modules'), 'junction');
}

// ---------------------------------------------------------------------------------------------
// One install.

// A `~/` target is relative to the project root in every layout: never under src/.
function assertSkillsAtRoot(app) {
  for (const file of [
    'AGENTS.wideset.md',
    '.agents/skills/wideset-setup/SKILL.md',
    '.agents/skills/wideset-build/references/specs/patterns/form-page.md',
    '.cursor/rules/wideset.mdc',
  ]) {
    if (!existsSync(join(app, file))) throw new Error(`the skills item did not write ${file}`);
  }
  if (existsSync(join(app, 'src/AGENTS.wideset.md'))) {
    throw new Error('the skills item wrote under src/ instead of the project root');
  }
}

async function installAndCheck(app, base, names, { build = false } = {}) {
  const refs = names.map((n) => `@wideset/${n}`);
  await run('npx', ['shadcn', 'add', '--yes', '--overwrite', '--silent', ...refs], app, {
    quiet: true,
  });

  const main = join(app, 'src/main.tsx');
  const imports = [];
  if (existsSync(join(app, 'src/styles/wideset-preflight.css')))
    imports.push("import '@/styles/wideset-preflight.css';");
  if (existsSync(join(app, 'src/styles/wideset.css')))
    imports.push("import '@/styles/wideset.css';");
  if (imports.length) writeFileSync(main, `${imports.join('\n')}\n${readFileSync(main, 'utf8')}`);
  if (existsSync(join(app, 'src/styles/wideset-theme.css'))) {
    writeFileSync(
      join(app, 'src/index.css'),
      '@import "tailwindcss";\n@import "./styles/wideset-theme.css";\n',
    );
  }

  // shadcn's import transformer must leave our lib path alone: a shipped file that imports cn from
  // the wideset utils has to still do so after install, and nothing may point at shadcn's lib/utils.
  const componentDir = join(app, 'src/components/ui/wideset');
  if (existsSync(componentDir)) {
    const filesContaining = (needle) => {
      const hits = [];
      const walk = (dir) => {
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
          const full = join(dir, entry.name);
          if (entry.isDirectory()) walk(full);
          else if (readFileSync(full, 'utf8').includes(needle)) hits.push(full);
        }
      };
      walk(componentDir);
      return hits;
    };
    if (filesContaining("from '@/lib/utils'").length) {
      throw new Error(
        "a shipped file imports '@/lib/utils' (shadcn's cn) — the CLI rewrote the specifier",
      );
    }
    const shipsCn = await Promise.all(
      names.map((n) => fetch(`${base}/${n}.json`).then((r) => r.text())),
    ).then((bodies) => bodies.some((b) => b.includes("from '@/lib/wideset/utils'")));
    if (shipsCn && !filesContaining("from '@/lib/wideset/utils'").length) {
      throw new Error(
        "no shipped file imports '@/lib/wideset/utils' after add — the CLI rewrote the specifier",
      );
    }
  }

  if (names.includes('skills')) assertSkillsAtRoot(app);

  await run('npx', ['tsc', '--noEmit', '-p', 'tsconfig.json'], app, { quiet: true });
  if (build) await run('npx', ['vite', 'build', '--logLevel', 'error'], app, { quiet: true });
}

// ---------------------------------------------------------------------------------------------
// Next.js App Router: React Server Components.
//
// A Server Component only ever sees a client module's named exports, so this proves three things
// the Vite runs cannot: every scaffolded component file carries 'use client', compound members are
// importable by name (<CardHeader>, not <Card.Header>), and cn() / *Variants stay callable on the
// server. The same is checked for the npm package, packed from this checkout.

const nextServerPage = ({ imports, marker }) => `${imports}

// No 'use client': this file is a Server Component.
export default function Page() {
  return (
    <main className={cn('p-ws-8', buttonVariants({ variant: 'secondary' }))}>
      <Card>
        <CardHeader>
          <CardTitle>${marker}</CardTitle>
        </CardHeader>
        <CardContent>Rendered on the server</CardContent>
      </Card>
      <Tabs defaultValue="one">
        <TabsList>
          <TabsItem value="one">
            <TabsLabel>One</TabsLabel>
          </TabsItem>
        </TabsList>
        <TabsContent value="one">Tab content</TabsContent>
      </Tabs>
      <Modal>
        <ModalTrigger asChild>
          <Button>Open</Button>
        </ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Title</ModalTitle>
          </ModalHeader>
        </ModalContent>
      </Modal>
    </main>
  );
}
`;

const NEXT_PAGES = {
  // Scaffolded files, imported by name.
  'app/page.tsx': nextServerPage({
    marker: 'Scaffolded server card',
    imports: `import { Button } from '@/components/ui/wideset/button/Button';
import { buttonVariants } from '@/components/ui/wideset/button/Button.variants';
import { Card } from '@/components/ui/wideset/card/Card';
import { CardContent } from '@/components/ui/wideset/card/CardContent';
import { CardHeader } from '@/components/ui/wideset/card/CardHeader';
import { CardTitle } from '@/components/ui/wideset/card/CardTitle';
import { Modal, ModalTrigger } from '@/components/ui/wideset/modal/Modal';
import { ModalContent } from '@/components/ui/wideset/modal/ModalContent';
import { ModalHeader } from '@/components/ui/wideset/modal/ModalHeader';
import { ModalTitle } from '@/components/ui/wideset/modal/ModalTitle';
import { Tabs } from '@/components/ui/wideset/tabs/Tabs';
import { TabsContent } from '@/components/ui/wideset/tabs/TabsContent';
import { TabsItem } from '@/components/ui/wideset/tabs/TabsItem';
import { TabsLabel } from '@/components/ui/wideset/tabs/TabsLabel';
import { TabsList } from '@/components/ui/wideset/tabs/TabsList';
import { cn } from '@/lib/wideset/utils';`,
  }),
  // The npm package: client bundle for components, server-safe entry for cn().
  'app/pkg/page.tsx': nextServerPage({
    marker: 'Package server card',
    imports: `import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  Tabs,
  TabsContent,
  TabsItem,
  TabsLabel,
  TabsList,
} from '@wideset/react';
import { cn } from '@wideset/react/utils';

// Inside the package every export is a client reference, variants included; on the server only
// the /utils entry is callable.
const buttonVariants = (_: { variant: string }) => '';`,
  }),
  // The dot form keeps working wherever the file itself is a Client Component.
  'app/dot/page.tsx': `'use client';

import { Card } from '@/components/ui/wideset/card/Card';

export default function Page() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Dot form client card</Card.Title>
      </Card.Header>
    </Card>
  );
}
`,
};

async function runNext(work, registry) {
  const app = join(work, 'next-app');
  rmSync(app, { recursive: true, force: true });
  mkdirSync(join(app, 'app'), { recursive: true });
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  const dev = pkg.devDependencies;

  log('packing @wideset/react from dist/');
  if (!existsSync(join(ROOT, 'dist', 'index.mjs'))) {
    throw new Error('dist/ is missing — run pnpm build:lib');
  }
  await run('npm', ['pack', '--ignore-scripts', '--pack-destination', work], ROOT, { quiet: true });
  const tarball = join(work, `wideset-react-${pkg.version}.tgz`);
  if (!existsSync(tarball)) throw new Error(`npm pack did not produce ${tarball}`);

  const write = (path, content) => {
    mkdirSync(dirname(join(app, path)), { recursive: true });
    writeFileSync(join(app, path), content);
  };
  const read = (path) => readFileSync(join(app, path), 'utf8');

  write(
    'package.json',
    JSON.stringify(
      {
        name: 'wideset-smoke-next',
        private: true,
        scripts: { build: 'next build' },
        dependencies: {
          // Exact, like shadcn: a floating range would let CI go red (or green) on a release nobody
          // here chose. Bump deliberately.
          next: '16.3.8',
          react: dev.react,
          'react-dom': dev['react-dom'],
          ...pkg.dependencies,
          '@wideset/react': `file:${tarball}`,
        },
        devDependencies: {
          '@tailwindcss/postcss': dev['@tailwindcss/postcss'],
          '@types/node': dev['@types/node'],
          '@types/react': dev['@types/react'],
          '@types/react-dom': dev['@types/react-dom'],
          shadcn: SHADCN_VERSION,
          tailwindcss: dev.tailwindcss,
          typescript: dev.typescript,
        },
      },
      null,
      2,
    ),
  );
  write(
    'tsconfig.json',
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          lib: ['dom', 'dom.iterable', 'esnext'],
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: 'esnext',
          moduleResolution: 'bundler',
          resolveJsonModule: true,
          isolatedModules: true,
          verbatimModuleSyntax: true,
          jsx: 'preserve',
          incremental: true,
          plugins: [{ name: 'next' }],
          // No src/ directory here on purpose: the Vite runs cover the src/ layout.
          paths: { '@/*': ['./*'] },
        },
        include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
        exclude: ['node_modules'],
      },
      null,
      2,
    ),
  );
  write('next.config.mjs', 'export default {};\n');
  write('postcss.config.mjs', "export default { plugins: { '@tailwindcss/postcss': {} } };\n");
  write('app/globals.css', '@import "tailwindcss";\n');
  write(
    'app/layout.tsx',
    `import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
  );
  write('app/page.tsx', 'export default function Page() {\n  return <main />;\n}\n');

  log('installing Next.js app dependencies');
  await run('npm', ['install', '--no-audit', '--no-fund', '--loglevel=error'], app, {
    quiet: true,
  });
  log(`shadcn@${SHADCN_VERSION} init (Next.js)`);
  await run(
    'npx',
    ['shadcn', 'init', '-b', 'radix', '-p', 'nova', '--yes', '--force', '--no-reinstall'],
    app,
    { quiet: true },
  );
  const config = JSON.parse(read('components.json'));
  if (config.rsc !== true) {
    throw new Error('shadcn init did not detect React Server Components (rsc: true)');
  }
  await run('npx', ['shadcn', 'registry', 'add', `@wideset=${registry.base}/{name}.json`], app, {
    quiet: true,
  });

  const all = await itemsFrom(registry.base);
  await run(
    'npx',
    ['shadcn', 'add', '--yes', '--overwrite', '--silent', ...all.map((n) => `@wideset/${n}`)],
    app,
    { quiet: true },
  );

  assertSkillsAtRoot(app);

  // With rsc: true the CLI must keep the directive on component files, and server-safe files
  // must not have gained one.
  if (!/^['"]use client['"]/.test(read('components/ui/wideset/card/Card.tsx'))) {
    throw new Error("Card.tsx was installed without 'use client'");
  }
  for (const path of ['components/ui/wideset/button/Button.variants.ts', 'lib/wideset/utils.ts']) {
    if (read(path).includes('use client')) throw new Error(`${path} must stay server-safe`);
  }

  for (const [path, content] of Object.entries(NEXT_PAGES)) write(path, content);
  write('app/layout.tsx', `import '@/styles/wideset.css';\n${read('app/layout.tsx')}`);

  log('next build (type-check + prerender)');
  await run('npx', ['next', 'build'], app, { quiet: true });

  const expectations = [
    ['index', 'Scaffolded server card'],
    ['pkg', 'Package server card'],
    ['dot', 'Dot form client card'],
  ];
  for (const [route, marker] of expectations) {
    const file = join(app, '.next', 'server', 'app', `${route}.html`);
    if (!existsSync(file)) throw new Error(`next build did not prerender ${route} (${file})`);
    if (!readFileSync(file, 'utf8').includes(marker)) {
      throw new Error(`${route} was built but does not render "${marker}"`);
    }
    log(`ok    next /${route === 'index' ? '' : route} renders "${marker}"`);
  }
  log(`ok    Next.js App Router: ${all.length} items installed, 3 pages built`);
}

async function main() {
  const work = flag('--work')
    ? resolve(flag('--work'))
    : mkdtempSync(join(tmpdir(), 'wideset-smoke-'));
  mkdirSync(work, { recursive: true });
  log(`work dir ${work}`);

  try {
    const remote = flag('--registry');
    const registry = remote
      ? { base: remote.replace(/\/$/, ''), close: () => {} }
      : await serveRegistry(work);
    try {
      if (has('--next')) await runNext(work, registry);
      else await runAll(work, registry);
    } finally {
      registry.close();
    }
  } finally {
    if (!has('--keep') && !flag('--work')) rmSync(work, { recursive: true, force: true });
  }
}

async function runAll(work, registry) {
  const appsDir = join(work, 'apps');
  const all = await itemsFrom(registry.base);
  const unsafe = all.filter((name) => !safeItemName(name));
  if (unsafe.length) throw new Error(`registry item names are not path-safe: ${unsafe.join(', ')}`);

  let selected = flag('--items') ? flag('--items').split(',') : all;
  if (flag('--shard')) {
    const [i, n] = flag('--shard').split('/').map(Number);
    if (!Number.isInteger(i) || !Number.isInteger(n) || n < 1 || i < 1 || i > n) {
      throw new Error(`--shard expects i/n with 1 <= i <= n, got "${flag('--shard')}"`);
    }
    selected = selected.filter((_, idx) => idx % n === i - 1);
  }
  const perItem = has('--all') ? [] : selected;
  const allRun = has('--all') || (!flag('--items') && !flag('--shard'));

  const pristine = await scaffoldPristine(work, registry.base);
  const failures = [];

  for (const name of perItem) {
    if (!safeItemName(name)) throw new Error(`--items got a name that is not path-safe: ${name}`);
    const app = join(appsDir, name);
    const started = Date.now();
    try {
      cloneApp(pristine, app, appsDir);
      await installAndCheck(app, registry.base, [name]);
      log(`ok    ${name} (${((Date.now() - started) / 1000).toFixed(1)}s)`);
      if (!has('--keep')) rmSync(app, { recursive: true, force: true });
    } catch (err) {
      failures.push(name);
      log(`FAIL  ${name}\n${err.message}`);
    }
  }

  if (allRun) {
    const app = join(appsDir, '_all');
    try {
      cloneApp(pristine, app, appsDir);
      await installAndCheck(app, registry.base, all, { build: true });
      log(`ok    all ${all.length} items in one app + vite build`);
    } catch (err) {
      failures.push('_all');
      log(`FAIL  all items\n${err.message}`);
    }
  }

  if (failures.length) {
    log(`${failures.length} failed: ${failures.join(', ')}`);
    process.exit(1);
  }
  log(`${perItem.length + (allRun ? 1 : 0)} runs passed`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
