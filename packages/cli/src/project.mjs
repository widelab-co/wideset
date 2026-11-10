/*
  Reads a consumer project and makes the few edits `init` and `skills` need: components.json, the
  `@/*` path alias in tsconfig and the bundler, the stylesheet imports in the app entry, and the
  pointers to AGENTS.wideset.md. Every edit is a
  pure text → text function so it can be tested without a project on disk, and every one is
  idempotent: running `init` twice changes nothing the second time.

  Edits are textual on purpose. tsconfig files are JSONC (create-vite's carry comments) and
  vite.config.ts is code; re-serialising either would drop the user's comments and formatting.
*/
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { CliError, NAMESPACE } from './registry.mjs';

const firstExisting = (cwd, candidates) =>
  candidates.find((candidate) => existsSync(join(cwd, candidate))) ?? null;

// JSONC → JSON: drops comments and trailing commas outside strings.
export function parseJsonc(text) {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      let j = i + 1;
      while (j < text.length && text[j] !== '"') j += text[j] === '\\' ? 2 : 1;
      out += text.slice(i, j + 1);
      i = j;
    } else if (ch === '/' && text[i + 1] === '/') {
      while (i < text.length && text[i] !== '\n') i++;
      out += '\n';
    } else if (ch === '/' && text[i + 1] === '*') {
      const end = text.indexOf('*/', i + 2);
      i = end === -1 ? text.length : end + 1;
    } else {
      out += ch;
    }
  }
  return JSON.parse(out.replace(/,(\s*[}\]])/g, '$1'));
}

export function detectProject(cwd) {
  const pkgPath = join(cwd, 'package.json');
  if (!existsSync(pkgPath)) {
    throw new CliError(
      `No package.json in ${cwd}. Run wideset inside your app, e.g. after \`npm create vite@latest\`.`,
    );
  }
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const framework = deps.next ? 'next' : deps.vite ? 'vite' : 'other';

  const appDir = framework === 'next' ? firstExisting(cwd, ['src/app', 'app']) : null;
  const srcDir =
    framework === 'next'
      ? appDir?.startsWith('src/') || (!appDir && existsSync(join(cwd, 'src')))
        ? 'src'
        : '.'
      : existsSync(join(cwd, 'src'))
        ? 'src'
        : '.';
  const inSrc = (file) => (srcDir === '.' ? file : `${srcDir}/${file}`);

  const entry =
    framework === 'next'
      ? appDir &&
        firstExisting(
          cwd,
          ['tsx', 'jsx', 'js'].map((ext) => `${appDir}/layout.${ext}`),
        )
      : firstExisting(cwd, ['main.tsx', 'main.ts', 'main.jsx', 'index.tsx'].map(inSrc));

  return {
    cwd,
    framework,
    srcDir,
    // components.json wants a CSS path even though Wideset items inject no CSS variables.
    css: framework === 'next' ? `${appDir ?? 'app'}/globals.css` : inSrc('index.css'),
    entry,
    // create-vite keeps compilerOptions for src/ in tsconfig.app.json; tsconfig.json only
    // references it.
    tsconfig: firstExisting(cwd, ['tsconfig.app.json', 'tsconfig.json']),
    viteConfig: firstExisting(cwd, [
      'vite.config.ts',
      'vite.config.mts',
      'vite.config.js',
      'vite.config.mjs',
    ]),
    hasTailwind: Boolean(deps.tailwindcss),
    hasComponentsJson: existsSync(join(cwd, 'components.json')),
  };
}

// ---------------------------------------------------------------------------------------------
// components.json

export function newComponentsJson(project, registryTemplate) {
  return {
    $schema: 'https://ui.shadcn.com/schema.json',
    style: 'radix-nova',
    tsx: true,
    rsc: project.framework === 'next',
    tailwind: { config: '', css: project.css, baseColor: 'neutral', cssVariables: true },
    aliases: {
      components: '@/components',
      ui: '@/components/ui',
      lib: '@/lib',
      hooks: '@/hooks',
      utils: '@/lib/utils',
    },
    registries: { [NAMESPACE]: registryTemplate },
  };
}

// An existing components.json (a shadcn project) keeps everything; only the namespace is added.
// An existing @wideset entry is left alone unless the caller asked for a specific registry.
export function withRegistry(config, registryTemplate, { replace = false } = {}) {
  const current = config.registries?.[NAMESPACE];
  if (current === registryTemplate || (current && !replace)) return { config, changed: false };
  return {
    config: { ...config, registries: { ...config.registries, [NAMESPACE]: registryTemplate } },
    changed: true,
  };
}

// ---------------------------------------------------------------------------------------------
// tsconfig `paths`

const indentOf = (text) => text.match(/\n([ \t]+)"/)?.[1] ?? '  ';

export function addPathAlias(text, target) {
  const parsed = parseJsonc(text);
  const existing = parsed.compilerOptions?.paths?.['@/*'];
  if (existing) return { text, changed: false, existing: existing[0] };

  const unit = indentOf(text);
  const entry = `"@/*": ["${target}"]`;
  const insertAfter = (pattern, body, isEmpty) => {
    const match = pattern.exec(text);
    if (!match) return null;
    const at = match.index + match[0].length;
    return text.slice(0, at) + body + (isEmpty ? '' : ',') + text.slice(at);
  };

  let next = null;
  if (parsed.compilerOptions?.paths) {
    const isEmpty = Object.keys(parsed.compilerOptions.paths).length === 0;
    next = insertAfter(/"paths"\s*:\s*\{/, `\n${unit.repeat(3)}${entry}`, isEmpty);
  } else if (parsed.compilerOptions) {
    const isEmpty = Object.keys(parsed.compilerOptions).length === 0;
    next = insertAfter(
      /"compilerOptions"\s*:\s*\{/,
      `\n${unit.repeat(2)}"paths": { ${entry} }`,
      isEmpty,
    );
  } else {
    next = insertAfter(
      /^\s*\{/,
      `\n${unit}"compilerOptions": { "paths": { ${entry} } }`,
      Object.keys(parsed).length === 0,
    );
  }
  if (next === null) return { text, changed: false, manual: true };
  return { text: next, changed: true };
}

// ---------------------------------------------------------------------------------------------
// vite.config `resolve.alias`

export function addViteAlias(text, srcDir) {
  // vite-tsconfig-paths reads the tsconfig alias, so nothing to add.
  if (
    /['"]@['"]\s*:/.test(text) ||
    /find\s*:\s*['"]@['"]/.test(text) ||
    text.includes('vite-tsconfig-paths')
  ) {
    return { text, changed: false };
  }
  const call = /defineConfig\(\s*\{/.exec(text);
  // A `resolve` key we did not write, or a config that is not `defineConfig({ … })`: editing
  // either safely needs a parser, so the user gets the snippet instead.
  if (!call || /\bresolve\s*:/.test(text)) return { text, changed: false, manual: true };

  const semi = /^import .*;\s*$/m.test(text) ? ';' : '';
  const quote = /^import .*"/m.test(text) && !/^import .*'/m.test(text) ? '"' : "'";
  const q = (s) => `${quote}${s}${quote}`;
  const dir = srcDir === '.' ? './' : `./${srcDir}`;
  const at = call.index + call[0].length;
  let next = `${text.slice(0, at)}\n  resolve: { alias: { ${q('@')}: fileURLToPath(new URL(${q(
    dir,
  )}, import.meta.url)) } },${text.slice(at)}`;
  if (!/import\s*\{[^}]*\bfileURLToPath\b[^}]*\}\s*from\s*['"](node:)?url['"]/.test(next)) {
    next = `import { fileURLToPath } from ${q('node:url')}${semi}\n${next}`;
  }
  return { text: next, changed: true };
}

export const viteAliasSnippet = (srcDir) =>
  `import { fileURLToPath } from 'node:url';\n\n` +
  `// inside defineConfig({ … })\n` +
  `resolve: { alias: { '@': fileURLToPath(new URL('./${
    srcDir === '.' ? '' : srcDir
  }', import.meta.url)) } },`;

// ---------------------------------------------------------------------------------------------
// Stylesheet imports in the app entry

export function addStyleImports(text, specifiers) {
  const missing = specifiers.filter((spec) => !text.includes(spec));
  if (!missing.length) return { text, changed: false };

  const semi = /^import .*;\s*$/m.test(text) || !/^import /m.test(text) ? ';' : '';
  const quote = /^import .*"/m.test(text) && !/^import .*'/m.test(text) ? '"' : "'";
  const lines = missing.map((spec) => `import ${quote}${spec}${quote}${semi}`).join('\n');

  // A leading directive ('use client') has to stay the first statement.
  const directive = /^\s*(['"])use \w+\1;?[^\n]*\n/.exec(text);
  const at = directive ? directive[0].length : 0;
  return { text: `${text.slice(0, at)}${lines}\n${text.slice(at)}`, changed: true };
}

// ---------------------------------------------------------------------------------------------
// Pointers to AGENTS.wideset.md, which `wideset skills` owns and overwrites on update.

export const AGENTS_POINTER = 'See AGENTS.wideset.md for Wideset rules.';
export const CLAUDE_IMPORT = '@AGENTS.wideset.md';

const appendLine = (text, line) => {
  if (text.includes(line)) return { text, changed: false };
  const separator = !text ? '' : text.endsWith('\n') ? '\n' : '\n\n';
  return { text: `${text}${separator}${line}\n`, changed: true };
};

export const addAgentsPointer = (text) => appendLine(text, AGENTS_POINTER);
export const addClaudeImport = (text) => appendLine(text, CLAUDE_IMPORT);

// ---------------------------------------------------------------------------------------------
// `wideset info`

const readJson = (path) => {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
};

/** The version node_modules holds, else the range package.json asks for. */
const installedVersion = (cwd, name, range) =>
  readJson(join(cwd, 'node_modules', name, 'package.json'))?.version ?? range ?? null;

/** The library version the installed skills describe, from wideset-setup's frontmatter. */
function skillsInfo(cwd, deps) {
  const paths = ['.agents/skills', '.claude/skills'].filter((dir) =>
    existsSync(join(cwd, dir, 'wideset-setup', 'SKILL.md')),
  );
  const packaged = deps['@wideset/skills'] ? 'node_modules/@wideset/skills/skills' : null;
  const source = paths[0] ?? packaged;
  if (!source) return { installed: false, version: null, paths: [] };
  let version = null;
  try {
    version =
      readFileSync(join(cwd, source, 'wideset-setup', 'SKILL.md'), 'utf8').match(
        /wideset-version:\s*['"]?([^'"\s]+)/,
      )?.[1] ?? null;
  } catch {
    // A dependency declared but not installed yet: known, with no version to read.
  }
  return { installed: true, version, paths: packaged ? [...paths, packaged] : paths };
}

/** What an agent needs before writing code: how this project consumes Wideset, and from where. */
export function projectInfo(cwd) {
  const pkg = readJson(join(cwd, 'package.json'));
  const deps = { ...pkg?.dependencies, ...pkg?.devDependencies };
  const config = readJson(join(cwd, 'components.json'));
  const configured = config?.registries?.[NAMESPACE];
  const registry = typeof configured === 'string' ? configured : (configured?.url ?? null);
  const project = pkg ? detectProject(cwd) : null;
  const scaffolded = project
    ? existsSync(join(cwd, project.srcDir, 'components/ui/wideset'))
    : false;
  const packaged = Boolean(deps['@wideset/react']);
  const tailwind = deps.tailwindcss ? installedVersion(cwd, 'tailwindcss', deps.tailwindcss) : null;

  return {
    mode: packaged ? 'npm' : scaffolded || registry ? 'registry' : 'none',
    version: packaged ? installedVersion(cwd, '@wideset/react', deps['@wideset/react']) : null,
    import: packaged
      ? '@wideset/react'
      : scaffolded || registry
        ? '@/components/ui/wideset/<folder>/<Name>'
        : null,
    registry,
    aliases: config?.aliases ?? null,
    framework: project?.framework ?? null,
    tailwind: { version: tailwind, v4: tailwind ? /^[\^~>=\s]*4(\.|$)/.test(tailwind) : false },
    skills: skillsInfo(cwd, deps),
  };
}
