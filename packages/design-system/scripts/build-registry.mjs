/*
  Builds the shadcn registry: one JSON per item under <out>/ (latest only, like shadcn's own registry;
  every item carries meta.version and meta.commit). Items and their entry files come from registry.json; every
  other file is found by walking imports from those entries (stories, tests, snapshots and Figma
  specs are never reached, and reaching one is an error).

    pnpm build:registry                      # dist/*.css must exist → pnpm build:lib runs first
    REGISTRY_URL=http://127.0.0.1:4873/r node scripts/build-registry.mjs --out /tmp/r

  Rules the walk enforces (each one is a hard error, never a warning):
  - a file belongs to exactly one item: the item declaring it, or the item whose declared file in
    the same folder has the longest name prefix (Button.types.ts → button, IconButton.variants.ts →
    icon-button); ambiguity means the file has to be declared in registry.json;
  - reaching another item's file adds a registryDependency (full URL — a bare name would pull
    shadcn's own item of that name);
  - every npm import must be in package.json dependencies (react/react-dom are peers);
  - only .ts/.tsx files ship: registry files are strings, so binaries go through data URLs;
  - a `registry:file` entry whose path is a directory expands to every file under it, keeping
    relative targets. Such files are never imported, so one source may appear in several items,
    each with its own target (the skills install to .agents/skills and to .claude/skills).

  Every component, context and hook file is emitted with a 'use client' directive (see
  needsClientDirective); lib items, variants and types are not.
*/
import { execSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, posix, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// The permanent registry address, a contract with every consumer's components.json (also
// packages/cli/src/registry.mjs). Moving it means a redirect from here, never a new default.
const DEFAULT_BASE = 'https://wideset.co/r';
const PEERS = new Set(['react', 'react-dom']);
const FORBIDDEN = [
  /\.stories\.tsx?$/,
  /\.test\.tsx?$/,
  /__snapshots__/,
  /\.figma-spec\.json$/,
  /\.mdx$/,
  /[\\/]examples[\\/]/,
  /^src[\\/]stories[\\/]/,
];
const SHIPPABLE = /\.(ts|tsx)$/;
const IMPLICIT_UI_DEPS = ['utils', 'styles'];

/**
 * The registry is served by the docs site (`wideset.co/r`); each deployment sets
 * REGISTRY_URL to its own address (develop, PR previews), see the deploy job in build.yaml.
 * @param {NodeJS.ProcessEnv} [env]
 */
export function resolveBaseUrl(env = process.env) {
  if (env.REGISTRY_URL) return env.REGISTRY_URL.replace(/\/$/, '');
  return DEFAULT_BASE;
}

const isDirectory = (path) => existsSync(path) && statSync(path).isDirectory();

/** Every file under a directory, posix-relative and sorted, so the output is deterministic. */
function filesUnder(dir, prefix = '') {
  return readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
      return entry.isDirectory() ? filesUnder(join(dir, entry.name), relativePath) : [relativePath];
    })
    .sort();
}

/** A `registry:file` entry naming a directory → one entry per file, keeping relative targets. */
function expandFiles(root, files) {
  return files.flatMap((file) => {
    if (file.type !== 'registry:file' || !isDirectory(resolve(root, file.path))) return [file];
    return filesUnder(resolve(root, file.path)).map((path) => ({
      ...file,
      path: posix.join(file.path, path),
      target: posix.join(file.target, path),
    }));
  });
}

const stripExt = (p) => p.replace(/\.(tsx?|css)$/, '');
const toPosix = (p) => p.split('\\').join('/');
const fail = (msg) => {
  throw new Error(`build-registry: ${msg}`);
};

function packageName(spec) {
  const parts = spec.split('/');
  return spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
}

function resolveLocal(fromFile, spec, root) {
  const base = spec.startsWith('.') ? resolve(dirname(fromFile), spec) : resolve(root, spec);
  for (const ext of ['', '.ts', '.tsx', '/index.ts', '/index.tsx']) {
    const candidate = base + ext;
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

// Components, contexts and hooks run in the browser. Variants, types, logic and cn() do not touch
// React at runtime and stay importable from a Server Component (`buttonVariants()`, `cn()`).
const REACT_RUNTIME = /\b(createContext|forwardRef|use[A-Z]\w*)\s*[(<]/;
export function needsClientDirective(file, source) {
  if (/\.(types|variants)\.ts$/.test(file)) return false;
  return file.endsWith('.tsx') || REACT_RUNTIME.test(source);
}

function imports(file) {
  // Some sources are checked out with CRLF; consumers get LF regardless.
  const source = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const info = ts.preProcessFile(source, true, true);
  return {
    source,
    // preProcessFile reports pos at the opening quote and end one short; shift to the literal text.
    specs: info.importedFiles.map(({ fileName, pos, end }) => {
      const [start, stop] = [pos + 1, end + 1];
      if (source.slice(start, stop) !== fileName)
        fail(`cannot locate specifier ${fileName} in ${file}`);
      return { spec: fileName, pos: start, end: stop };
    }),
  };
}

/**
 * @param {object} [options]
 * @param {string} [options.root]    repository root (default: this repo)
 * @param {string} [options.out]     output directory (default: public/r)
 * @param {string} [options.base]    URL every registryDependency is built from (default: resolveBaseUrl())
 * @param {string} [options.version] version stamp (default: package.json version)
 * @param {string} [options.commit]  commit stamp (default: git HEAD)
 */
export function buildRegistry({ root = ROOT, out, base, version, commit } = {}) {
  const registry = JSON.parse(readFileSync(join(root, 'registry.json'), 'utf8'));
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  version ??= pkg.version;
  commit ??= gitCommit(root);
  base ??= resolveBaseUrl();
  out ??= join(root, 'public', 'r');

  const items = registry.items.map((item) => ({
    ...item,
    files: item.files && expandFiles(root, item.files),
  }));
  const byName = new Map(items.map((item) => [item.name, item]));
  if (byName.size !== items.length) fail('duplicate item names in registry.json');

  // Declared files: absolute source path → { item, target }.
  const declared = new Map();
  for (const item of items) {
    if (!item.files?.length) fail(`item ${item.name} declares no files`);
    for (const file of item.files) {
      if (!file.target) fail(`${item.name}: ${file.path} has no target`);
      const abs = resolve(root, file.path);
      const previous = declared.get(abs);
      // Code belongs to exactly one item, because imports resolve through its owner. A registry:file
      // is never imported, so several items may ship it; each takes its target from its own entry.
      if (previous && !(previous.type === 'registry:file' && file.type === 'registry:file'))
        fail(`${file.path} is declared by both ${previous.item.name} and ${item.name}`);
      if (!previous) declared.set(abs, { item, target: file.target, type: file.type });
    }
  }

  // Owner of an undeclared file: longest declared-basename prefix among items in its folder.
  const ownerOf = (abs) => {
    const folder = dirname(abs);
    const name = posix.basename(toPosix(abs));
    let best = null;
    for (const [declAbs, decl] of declared) {
      if (dirname(declAbs) !== folder) continue;
      const stem = stripExt(posix.basename(toPosix(declAbs)));
      if (!name.startsWith(stem)) continue;
      if (best && best.stem.length === stem.length && best.decl.item !== decl.item) {
        fail(
          `${relative(root, abs)} could belong to ${best.decl.item.name} or ${
            decl.item.name
          }; declare it in registry.json`,
        );
      }
      if (!best || stem.length > best.stem.length) best = { stem, decl };
    }
    if (!best)
      fail(
        `${relative(
          root,
          abs,
        )} is imported but no item in its folder declares an entry; declare it in registry.json`,
      );
    return best.decl;
  };

  const targetOf = (abs) => {
    if (declared.has(abs)) return declared.get(abs).target;
    const owner = ownerOf(abs);
    return posix.join(posix.dirname(owner.target), posix.basename(toPosix(abs)));
  };

  const built = new Map();
  for (const item of items) {
    const files = new Map(); // abs → { target, type, content }
    const deps = new Set();
    // registry:component is an internal building block (FieldLabel, ScrollArea): installed with the
    // components that use it, never listed on its own; it needs the same styles and utils.
    const registryDeps = new Set(
      item.type === 'registry:ui' || item.type === 'registry:component' ? IMPLICIT_UI_DEPS : [],
    );
    const queue = item.files.map((f) => resolve(root, f.path));
    const ownTargets = new Map(item.files.map((f) => [resolve(root, f.path), f.target]));

    while (queue.length) {
      const abs = queue.shift();
      if (files.has(abs)) continue;
      const rel = relative(root, abs);
      if (!existsSync(abs))
        fail(
          `${item.name}: ${rel} does not exist${
            rel.startsWith('dist/') ? ' — run pnpm build:lib first' : ''
          }`,
        );
      const decl = declared.get(abs);
      const fileType = decl?.type ?? item.files[0].type;
      const target = ownTargets.get(abs) ?? targetOf(abs);

      if (!SHIPPABLE.test(abs)) {
        if (fileType === 'registry:file') {
          // CSS built on a CRLF checkout (Windows) would otherwise ship CRLF; consumers get LF.
          files.set(abs, {
            target,
            type: fileType,
            content: readFileSync(abs, 'utf8').replace(/\r\n/g, '\n'),
          });
          continue;
        }
        fail(
          `${item.name}: ${rel} is not a .ts/.tsx file; registry files are strings (see Avatar.assets.ts for the data-URL convention)`,
        );
      }
      if (FORBIDDEN.some((re) => re.test(rel)))
        fail(
          `${item.name}: ${rel} is a story/test/snapshot/spec and must not be reachable from an entry`,
        );

      const { source, specs } = imports(abs);
      const edits = [];
      for (const { spec, pos, end } of specs) {
        const local =
          spec.startsWith('.') || spec.startsWith('src/') ? resolveLocal(abs, spec, root) : null;
        if (!local) {
          if (spec.startsWith('.') || spec.startsWith('src/'))
            fail(`${item.name}: cannot resolve '${spec}' from ${rel}`);
          const name = packageName(spec);
          if (PEERS.has(name) || spec === 'react/jsx-runtime') continue;
          if (!pkg.dependencies?.[name])
            fail(
              `${item.name}: ${rel} imports '${name}', which is not in package.json dependencies`,
            );
          deps.add(`${name}@${pkg.dependencies[name]}`);
          continue;
        }
        const localRel = relative(root, local);
        if (FORBIDDEN.some((re) => re.test(localRel)))
          fail(`${item.name}: ${rel} imports ${localRel}, which must not ship`);
        if (!SHIPPABLE.test(local))
          fail(
            `${item.name}: ${rel} imports ${localRel}; only .ts/.tsx can ship (see Avatar.assets.ts)`,
          );

        const ownerItem = declared.get(local)?.item ?? ownerOf(local).item;
        if (ownerItem !== item) {
          registryDeps.add(ownerItem.name);
        } else {
          queue.push(local);
        }

        const localTarget = targetOf(local);
        const relFromTarget = posix.relative(posix.dirname(target), stripExt(localTarget));
        const wanted =
          spec.startsWith('.') && posix.normalize(spec) === posix.normalize(relFromTarget)
            ? null
            : `@/${stripExt(localTarget)}`;
        if (wanted) edits.push({ pos, end, text: wanted });
      }

      let content = source;
      for (const edit of edits.sort((a, b) => b.pos - a.pos)) {
        content = content.slice(0, edit.pos) + edit.text + content.slice(edit.end);
      }
      if (/from\s+['"]src\//.test(content))
        fail(`${item.name}: ${rel} still references src/ after rewriting`);
      // Next.js App Router: a Server Component may only import these through a client boundary.
      // With the semicolon on purpose. shadcn's stripper for `rsc: false` projects only matches
      // `"use client"` without one, and its global regex is stateful, so it would remove the
      // directive from every second file. This form is never matched: every project gets the
      // same files, and bundlers without Server Components ignore the directive.
      if (needsClientDirective(abs, source)) content = `'use client';\n\n${content}`;
      files.set(abs, { target, type: fileType, content });
    }

    if (registryDeps.has(item.name)) fail(`${item.name} depends on itself`);
    for (const dep of registryDeps)
      if (!byName.has(dep)) fail(`${item.name} depends on unknown item ${dep}`);
    built.set(item.name, {
      item,
      files,
      deps: [...deps].sort(),
      registryDeps: [...registryDeps].sort(),
    });
  }

  detectCycles(built);

  const render = (baseUrl) =>
    [...built.values()].map(({ item, files, deps, registryDeps }) => ({
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      ...(deps.length ? { dependencies: deps } : {}),
      ...(registryDeps.length
        ? { registryDependencies: registryDeps.map((d) => `${baseUrl}/${d}.json`) }
        : {}),
      files: [...files.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([abs, f]) => ({
          path: toPosix(relative(root, abs)),
          type: f.type,
          target: f.target,
          content: f.content,
        })),
      ...(item.docs ? { docs: item.docs } : {}),
      meta: { version, commit },
    }));

  const write = (dir, baseUrl) => {
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    const rendered = render(baseUrl);
    for (const entry of rendered)
      writeFileSync(join(dir, `${entry.name}.json`), JSON.stringify(entry, null, 2) + '\n');
    const index = {
      $schema: 'https://ui.shadcn.com/schema/registry.json',
      name: registry.name,
      homepage: registry.homepage,
      // The index carries every item without its $schema and without file contents.
      items: rendered.map((entry) => {
        const item = { ...entry };
        delete item.$schema;
        item.files = entry.files.map((file) => {
          const copy = { ...file };
          delete copy.content;
          return copy;
        });
        return item;
      }),
    };
    writeFileSync(join(dir, 'registry.json'), JSON.stringify(index, null, 2) + '\n');
    return rendered;
  };

  const rendered = write(out, base);
  return { items: rendered, out, base, version, commit };
}

function detectCycles(built) {
  const state = new Map();
  const visit = (name, path) => {
    if (state.get(name) === 'done') return;
    if (state.get(name) === 'active') fail(`dependency cycle: ${[...path, name].join(' -> ')}`);
    state.set(name, 'active');
    for (const dep of built.get(name).registryDeps) visit(dep, [...path, name]);
    state.set(name, 'done');
  };
  for (const name of built.keys()) visit(name, []);
}

function gitCommit(root) {
  try {
    return execSync('git rev-parse --short HEAD', {
      cwd: root,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch {
    return 'unknown';
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const flag = (name) => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const result = buildRegistry({
    out: flag('--out') && resolve(flag('--out')),
    base: flag('--base'),
  });
  console.log(
    `registry: ${result.items.length} items → ${relative(process.cwd(), result.out)}/ (base ${
      result.base
    }, ${result.version}@${result.commit})`,
  );
}
