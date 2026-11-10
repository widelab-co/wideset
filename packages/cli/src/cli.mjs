/*
  wideset init | add | list | skills | info. A thin layer over the shadcn CLI: it writes
  components.json, sets up the `@/*` alias and the stylesheet imports, and passes `@wideset/<name>`
  addresses to `shadcn add`. It never copies files itself.
*/
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';

import {
  addAgentsPointer,
  addClaudeImport,
  addPathAlias,
  addStyleImports,
  addViteAlias,
  detectProject,
  newComponentsJson,
  projectInfo,
  viteAliasSnippet,
  withRegistry,
} from './project.mjs';
import {
  CliError,
  DEFAULT_REGISTRY,
  fetchIndex,
  isComponent,
  NAMESPACE,
  registryBase,
  registryTemplate,
  suggest,
} from './registry.mjs';
import { runShadcn as defaultRunShadcn } from './shadcn.mjs';

const { version: VERSION } = createRequire(import.meta.url)('../package.json');

const HELP = `wideset ${VERSION} — scaffold Wideset components into your React project

Usage
  npx wideset init                 set up this project (add runs it for you the first time)
  npx wideset add <name...>        add components, e.g. npx wideset add button select
  npx wideset add --all            add every component
  npx wideset list                 show the components you can add
  npx wideset skills               add the Wideset agent skills and rules to this project
  npx wideset info                 show how this project uses Wideset (--json for agents)

Options
  --overwrite         add: replace files that already exist (your edits to them are lost)
  --dry-run           init, skills: print what would change, change nothing
  --no-font           init, add: keep the project's own font instead of adding Inter
  --claude            skills: also install for Claude Code, even with no CLAUDE.md or .claude/
  --json              info: print JSON
  --registry <url>    init, list, skills: use another Wideset registry, e.g. a preview deploy
                      (also WIDESET_REGISTRY); add uses the one init wrote
  --cwd <dir>         run in another directory
  -h, --help          show this help
  -v, --version       show the version
`;

function parseArgs(argv) {
  const opts = {
    positional: [],
    overwrite: false,
    all: false,
    dryRun: false,
    font: true,
    claude: false,
    json: false,
    help: false,
    version: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const value = () => {
      const next = argv[++i];
      if (next === undefined || next.startsWith('-')) throw new CliError(`${arg} needs a value.`);
      return next;
    };
    if (arg === '-h' || arg === '--help') opts.help = true;
    else if (arg === '-v' || arg === '--version') opts.version = true;
    else if (arg === '--overwrite' || arg === '-o') opts.overwrite = true;
    else if (arg === '--all' || arg === '-a') opts.all = true;
    else if (arg === '--dry-run') opts.dryRun = true;
    else if (arg === '--no-font') opts.font = false;
    else if (arg === '--claude') opts.claude = true;
    else if (arg === '--json') opts.json = true;
    else if (arg === '--registry') opts.registry = value();
    else if (arg.startsWith('--registry=')) opts.registry = arg.slice('--registry='.length);
    else if (arg === '--cwd') opts.cwd = value();
    else if (arg.startsWith('--cwd=')) opts.cwd = arg.slice('--cwd='.length);
    else if (arg.startsWith('-')) throw new CliError(`Unknown option ${arg}. See wideset --help.`);
    else opts.positional.push(arg);
  }
  return opts;
}

const readComponentsJson = (cwd) => {
  try {
    return JSON.parse(readFileSync(join(cwd, 'components.json'), 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw new CliError(`components.json is not valid JSON (${err.message}).`);
  }
};

// --registry, then WIDESET_REGISTRY, then the project's components.json, then the default.
function registryFor(opts, env, config) {
  const explicit = opts.registry ?? env.WIDESET_REGISTRY;
  if (explicit) return { base: registryBase(explicit), explicit: true };
  const configured = config?.registries?.[NAMESPACE];
  const url = typeof configured === 'string' ? configured : configured?.url;
  return { base: registryBase(url ?? DEFAULT_REGISTRY), explicit: false };
}

// ---------------------------------------------------------------------------------------------

async function init(ctx, { nested = false } = {}) {
  const { cwd, opts, env, log, runShadcn } = ctx;
  const dryRun = opts.dryRun;
  const project = detectProject(cwd);
  if (!project.tsconfig) {
    throw new CliError(
      'No tsconfig.json found. Wideset components are TypeScript; create the app with a TypeScript template.',
    );
  }
  const manual = [];
  // In a dry run every change reads as "would", so the output is the plan.
  const say = (done, what) => log(`${done ? (dryRun ? 'would:' : '✔') : '·'} ${what}`);
  const write = (path, text) => {
    if (!dryRun) writeFileSync(join(cwd, path), text);
  };

  log(
    `Setting up Wideset in a ${
      project.framework === 'other' ? 'React' : project.framework === 'next' ? 'Next.js' : 'Vite'
    } project\n`,
  );

  // 1. components.json
  const existing = readComponentsJson(cwd);
  const registry = registryFor(opts, env, existing);
  const template = registryTemplate(registry.base);
  if (existing) {
    const { config, changed } = withRegistry(existing, template, { replace: registry.explicit });
    if (changed) write('components.json', `${JSON.stringify(config, null, 2)}\n`);
    say(
      changed,
      `components.json: ${changed ? `added the ${NAMESPACE} registry` : 'already set up'}`,
    );
  } else {
    const config = newComponentsJson(project, template);
    write('components.json', `${JSON.stringify(config, null, 2)}\n`);
    say(true, 'components.json: created');
  }

  // 2. `@/*` in tsconfig
  const aliasTarget = project.srcDir === '.' ? './*' : `./${project.srcDir}/*`;
  const ts = addPathAlias(readFileSync(join(cwd, project.tsconfig), 'utf8'), aliasTarget);
  if (ts.changed) write(project.tsconfig, ts.text);
  if (ts.manual)
    manual.push(
      `Add to compilerOptions in ${project.tsconfig}: "paths": { "@/*": ["${aliasTarget}"] }`,
    );
  else
    say(
      ts.changed,
      `${project.tsconfig}: ${
        ts.changed ? 'added the @/* path alias' : `@/* already maps to ${ts.existing}`
      }`,
    );

  // 3. `@` in vite.config
  if (project.framework === 'vite') {
    if (!project.viteConfig) {
      manual.push(`Add the @ alias to your Vite config:\n${viteAliasSnippet(project.srcDir)}`);
    } else {
      const vite = addViteAlias(
        readFileSync(join(cwd, project.viteConfig), 'utf8'),
        project.srcDir,
      );
      if (vite.changed) write(project.viteConfig, vite.text);
      if (vite.manual)
        manual.push(
          `Add the @ alias to ${project.viteConfig}:\n${viteAliasSnippet(project.srcDir)}`,
        );
      else
        say(
          vite.changed,
          `${project.viteConfig}: ${vite.changed ? 'added the @ alias' : '@ alias already set'}`,
        );
    }
  } else if (project.framework === 'other') {
    manual.push('Make your bundler resolve "@/" to the same folder as the tsconfig alias.');
  }

  // 4. Stylesheets. Apps without Tailwind get Tailwind's reset too; with Tailwind they have it.
  const items = project.hasTailwind ? ['styles'] : ['preflight', 'styles'];

  // --silent: the items' own notes say "import it in main.tsx", which the next step does.
  if (!dryRun) {
    await runShadcn(
      ['add', '--yes', '--overwrite', '--silent', ...items.map((name) => `${NAMESPACE}/${name}`)],
      { cwd },
    );
  }
  say(true, `stylesheets: added ${items.map((name) => `${NAMESPACE}/${name}`).join(' and ')}`);

  const specifiers = items.map((name) =>
    name === 'styles' ? '@/styles/wideset.css' : '@/styles/wideset-preflight.css',
  );
  if (project.entry) {
    const css = addStyleImports(readFileSync(join(cwd, project.entry), 'utf8'), specifiers);
    if (css.changed) write(project.entry, css.text);
    say(
      css.changed,
      `${project.entry}: ${css.changed ? 'imports' : 'already imports'} ${specifiers.join(
        ' and ',
      )}`,
    );
  } else {
    manual.push(
      `Import once, in your app entry:\n${specifiers.map((s) => `import '${s}';`).join('\n')}`,
    );
  }

  // 5. Font. Inter in a project set up for the first time. One that already has a components.json
  //    is left alone, so removing the file or its import sticks; one that brought its own font
  //    keeps it. A registry without the item (an older one, or a deploy in progress) is a warning.
  const fontSpecifier = '@/styles/wideset-font.css';
  const fontPath = `${project.srcDir === '.' ? '' : `${project.srcDir}/`}styles/wideset-font.css`;
  const hasFontFile = existsSync(join(cwd, fontPath));
  if (!opts.font) {
    say(false, 'font: left as it is (--no-font)');
  } else if (existing) {
    say(false, 'font: left as it is');
  } else if (!hasFontFile && project.fontPackages.length) {
    say(false, `font: kept yours (${project.fontPackages.join(', ')})`);
  } else {
    let added = hasFontFile;
    if (!hasFontFile) {
      try {
        if (!dryRun) await runShadcn(['add', '--yes', '--silent', `${NAMESPACE}/font`], { cwd });
        added = true;
        say(true, `font: added ${NAMESPACE}/font (Inter)`);
      } catch (error) {
        log(`! font: could not add ${NAMESPACE}/font (${error.message})`);
        manual.push(
          'Load a variable font yourself:\n' +
            'https://wideset-docs.widelab.workers.dev/docs/installation#4-load-the-font',
        );
      }
    }
    if (!added) {
      // No file to import.
    } else if (project.entry) {
      const css = addStyleImports(readFileSync(join(cwd, project.entry), 'utf8'), [fontSpecifier], {
        last: true,
      });
      if (css.changed) write(project.entry, css.text);
      say(
        css.changed,
        `${project.entry}: ${css.changed ? 'imports' : 'already imports'} ${fontSpecifier}`,
      );
    } else {
      manual.push(`Import once, after your other stylesheets:\nimport '${fontSpecifier}';`);
    }
  }

  if (manual.length) {
    log('\nOne more thing by hand:\n');
    for (const step of manual) log(`  ${step.replace(/\n/g, '\n  ')}\n`);
  }
  if (dryRun) log('\nDry run: nothing was changed.');
  else if (!nested) log(`\nDone. Add a component:\n\n  npx wideset add button\n`);
  return 0;
}

async function add(ctx) {
  const { cwd, opts, log, runShadcn, fetchImpl } = ctx;
  const names = opts.positional.map((name) => name.replace(new RegExp(`^${NAMESPACE}/`), ''));
  if (!names.length && !opts.all) {
    throw new CliError(
      'Name at least one component, e.g. `npx wideset add button`. See `npx wideset list`.',
    );
  }

  // First add in a project that was never set up: do the setup, so two commands are one.
  if (!readComponentsJson(cwd)?.registries?.[NAMESPACE]) {
    log('This project is not set up for Wideset yet; running `wideset init` first.\n');
    await init({ ...ctx, opts: { ...opts, dryRun: false } }, { nested: true });
    log('');
  }

  // shadcn resolves @wideset from components.json, so validate against that same registry.
  const { base } = registryFor({}, {}, readComponentsJson(cwd));
  const index = await fetchIndex(base, fetchImpl);
  const known = index.items.map((item) => item.name);
  const unknown = names.filter((name) => !known.includes(name));
  if (unknown.length) {
    const hints = unknown.map((name) => {
      const hint = suggest(name, known);
      return `  ${name}${hint ? ` — did you mean ${hint}?` : ''}`;
    });
    throw new CliError(
      `Not in the Wideset registry:\n${hints.join('\n')}\nSee \`npx wideset list\`.`,
    );
  }

  const selected = opts.all ? index.items.filter(isComponent).map((item) => item.name) : names;
  log(`Adding ${selected.length === 1 ? selected[0] : `${selected.length} components`}\n`);
  await runShadcn(
    [
      'add',
      '--yes',
      ...(opts.overwrite ? ['--overwrite'] : []),
      ...selected.map((name) => `${NAMESPACE}/${name}`),
    ],
    { cwd },
  );
  return 0;
}

async function list(ctx) {
  const { cwd, opts, env, log, fetchImpl } = ctx;
  const { base } = registryFor(opts, env, readComponentsJson(cwd));
  const index = await fetchIndex(base, fetchImpl);
  const components = index.items.filter(isComponent);
  const width = Math.max(...components.map((item) => item.name.length));
  log(`${components.length} components (npx wideset add <name>):\n`);
  const room = Math.max(20, (ctx.columns ?? 100) - width - 6);
  for (const item of components) {
    const text = item.description ?? item.title ?? '';
    const clipped = text.length > room ? `${text.slice(0, room - 1).trimEnd()}…` : text;
    log(`  ${item.name.padEnd(width)}  ${clipped}`.trimEnd());
  }
  log(`\nShared code (styles, utils, motion, …) comes along with the components that need it.`);
  return 0;
}

// Adds the items by URL: unlike `@wideset/skills`, that needs no components.json, so agent rules
// can go into a project that does not scaffold any components (it uses the npm package).
async function skills(ctx) {
  const { cwd, opts, env, log, runShadcn } = ctx;
  detectProject(cwd); // A clear error outside a project, before anything is written.
  const { base } = registryFor(opts, env, readComponentsJson(cwd));
  const forClaude =
    opts.claude || existsSync(join(cwd, 'CLAUDE.md')) || existsSync(join(cwd, '.claude'));
  const items = forClaude ? ['skills', 'skills-claude'] : ['skills'];
  const dryRun = opts.dryRun;
  const say = (done, what) => log(`${done ? (dryRun ? 'would:' : '✔') : '·'} ${what}`);

  if (!dryRun) {
    await runShadcn(
      ['add', '--yes', '--overwrite', '--silent', ...items.map((name) => `${base}/${name}.json`)],
      { cwd },
    );
  }
  say(true, `skills: ${forClaude ? '.agents/skills and .claude/skills' : '.agents/skills'}`);
  say(true, 'rules: AGENTS.wideset.md and .cursor/rules/wideset.mdc');

  const agentsPath = join(cwd, 'AGENTS.md');
  const agentsExists = existsSync(agentsPath);
  const agents = addAgentsPointer(agentsExists ? readFileSync(agentsPath, 'utf8') : '');
  if (agents.changed && !dryRun) writeFileSync(agentsPath, agents.text);
  const agentsState = !agents.changed
    ? 'already points'
    : agentsExists
      ? 'points'
      : 'created, points';
  say(agents.changed, `AGENTS.md: ${agentsState} to AGENTS.wideset.md`);

  const claudePath = join(cwd, 'CLAUDE.md');
  if (existsSync(claudePath)) {
    const claude = addClaudeImport(readFileSync(claudePath, 'utf8'));
    if (claude.changed && !dryRun) writeFileSync(claudePath, claude.text);
    say(
      claude.changed,
      `CLAUDE.md: ${claude.changed ? 'imports' : 'already imports'} AGENTS.wideset.md`,
    );
  } else if (forClaude) {
    log('· CLAUDE.md: none here; add `@AGENTS.wideset.md` to yours so Claude Code reads the rules');
  }

  if (dryRun) log('\nDry run: nothing was changed.');
  else log('\nDone. Your agent can run `npx wideset info --json` and load the wideset-* skills.');
  return 0;
}

async function info(ctx) {
  const { cwd, opts, log } = ctx;
  const facts = projectInfo(cwd);
  if (opts.json) {
    log(JSON.stringify(facts, null, 2));
    return 0;
  }
  log(`mode       ${facts.mode}${facts.version ? ` (${facts.version})` : ''}`);
  log(`import     ${facts.import ?? '-'}`);
  log(`registry   ${facts.registry ?? '-'}`);
  log(`framework  ${facts.framework ?? '-'}`);
  log(`tailwind   ${facts.tailwind.version ?? '-'}`);
  log(`skills     ${facts.skills.installed ? (facts.skills.version ?? 'installed') : '-'}`);
  return 0;
}

const COMMANDS = { init, add, list, skills, info };

export async function main(
  argv,
  {
    cwd = process.cwd(),
    env = process.env,
    log = (line) => console.log(line),
    error = (line) => console.error(line),
    runShadcn = defaultRunShadcn,
    fetchImpl = globalThis.fetch,
    columns = process.stdout.columns,
  } = {},
) {
  try {
    const opts = parseArgs(argv);
    const [command, ...rest] = opts.positional;
    if (opts.version) {
      log(VERSION);
      return 0;
    }
    if (opts.help || !command) {
      log(HELP);
      return command || opts.help ? 0 : 1;
    }
    const run = COMMANDS[command];
    if (!run) throw new CliError(`Unknown command "${command}". See wideset --help.`);
    return await run({
      cwd: resolve(cwd, opts.cwd ?? '.'),
      opts: { ...opts, positional: rest },
      env,
      log,
      runShadcn,
      fetchImpl,
      columns,
    });
  } catch (err) {
    if (err instanceof CliError) {
      error(`wideset: ${err.message}`);
      return 1;
    }
    throw err;
  }
}
