/*
  Do the skills change what agents build? Runs each case in evals/cases with `claude -p` in a fresh
  Vite + Tailwind v4 app that has every Wideset component scaffolded, once without the skills and
  once with `wideset skills`, then grades the result: the app's type-check and build, plus the
  static checks in evals/grade.mjs. Writes evals/results/<name>.json.

    pnpm --filter @wideset/skills evals --case settings-modal --runs 1     # one case, try it first
    pnpm --filter @wideset/skills evals --runs 3 --name release            # the full run
      --model <id>       the Claude model (default: the CLI's)
      --keep             leave the work directory behind, with each agent's stream-json transcript
      --arm with|without run one arm only

  Local only, never in CI: a full run is 26 cases x 2 x 3 runs of a real agent, which costs real
  usage and takes hours. The runs use project settings only, so nothing in your own Claude Code
  setup leaks into a result, and they get a fixed list of tools.
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
  statSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, extname, join, sep } from 'node:path';

import { main as wideset } from '../../cli/src/cli.mjs';
import { buildRegistry } from '../../design-system/scripts/build-registry.mjs';
import { grade, parseCase, toolUsage } from '../evals/grade.mjs';
import { PACKAGE } from './skill-files.mjs';

const CASES = join(PACKAGE, 'evals/cases');
const RESULTS = join(PACKAGE, 'evals/results');
const CREATE_VITE = '9.2.1';
const TOOLS =
  'Read,Edit,Write,Glob,Grep,Skill,Task,Bash(npx tsc:*),Bash(npx --no-install tsc:*),Bash(npx wideset:*),Bash(npx vite:*)';
const RUN_TIMEOUT = 20 * 60 * 1000;

const args = process.argv.slice(2);
const flag = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const log = (message) => console.log(`[evals] ${message}`);

const run = (cmd, cmdArgs, cwd, { timeout = 0 } = {}) =>
  new Promise((done) => {
    const child = spawn(cmd, cmdArgs, {
      cwd,
      env: { ...process.env, CI: 'true', npm_config_yes: 'true', FORCE_COLOR: '0' },
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: process.platform === 'win32',
      timeout,
    });
    let out = '';
    child.stdout.on('data', (chunk) => (out += chunk));
    child.stderr.on('data', (chunk) => (out += chunk));
    child.on('error', (err) => done({ ok: false, out: String(err) }));
    child.on('close', (status) => done({ ok: status === 0, out }));
  });

const must = async (cmd, cmdArgs, cwd) => {
  const result = await run(cmd, cmdArgs, cwd);
  if (!result.ok) throw new Error(`${cmd} ${cmdArgs.join(' ')} failed\n${result.out.slice(-2000)}`);
};

async function serveRegistry(work) {
  const dir = join(work, 'r');
  const server = createServer((req, res) => {
    const file = join(dir, new URL(req.url, 'http://x').pathname.replace(/^\/r\/?/, ''));
    if (!file.startsWith(dir + sep) || !existsSync(file) || extname(file) !== '.json') {
      res.writeHead(404);
      res.end('not found');
      return;
    }
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(readFileSync(file));
  });
  await new Promise((done) => server.listen(0, '127.0.0.1', done));
  const base = `http://127.0.0.1:${server.address().port}/r`;
  buildRegistry({ root: join(PACKAGE, '../design-system'), out: dir, base });
  return { base, close: () => server.close() };
}

const cli = async (argv, cwd) => {
  const code = await wideset(argv, { cwd, env: {}, log: () => {}, error: (line) => log(line) });
  if (code !== 0) throw new Error(`wideset ${argv.join(' ')} failed`);
};

/** One app with Tailwind v4 and every component in it; each run clones it. */
async function scaffold(work, base) {
  log(`scaffolding a Vite app (create-vite@${CREATE_VITE}); this takes a few minutes`);
  await must(
    'npm',
    ['create', `vite@${CREATE_VITE}`, 'app', '--', '--template', 'react-ts', '--no-interactive'],
    work,
  );
  const app = join(work, 'app');
  await must('npm', ['install', '--no-audit', '--no-fund', '--loglevel=error'], app);
  await must(
    'npm',
    ['install', '-D', '--no-audit', '--no-fund', 'tailwindcss@4', '@tailwindcss/vite@4'],
    app,
  );
  const vitePath = join(app, 'vite.config.ts');
  writeFileSync(
    vitePath,
    readFileSync(vitePath, 'utf8')
      .replace(/^/, "import tailwindcss from '@tailwindcss/vite'\n")
      .replace('plugins: [react()]', 'plugins: [react(), tailwindcss()]'),
  );
  await cli(['init', '--registry', base], app);
  await cli(['add', '--all'], app);
  await cli(['add', 'theme'], app);
  writeFileSync(
    join(app, 'src/index.css'),
    '@import "tailwindcss";\n@import "./styles/wideset-theme.css";\n',
  );
  writeFileSync(join(app, 'src/App.css'), '');
  return app;
}

const cloneApp = (pristine, dest) => {
  const nodeModules = join(pristine, 'node_modules');
  cpSync(pristine, dest, {
    recursive: true,
    filter: (src) => src !== nodeModules && !src.startsWith(nodeModules + sep),
  });
  symlinkSync(nodeModules, join(dest, 'node_modules'), 'junction');
};

/** The files the agent wrote: everything in src/ that the scaffold did not put there. */
function agentSources(app, pristine, dir = 'src') {
  const sources = [];
  for (const entry of readdirSync(join(app, dir))) {
    const path = `${dir}/${entry}`;
    if (statSync(join(app, path)).isDirectory()) {
      if (path === 'src/components/ui/wideset' || path === 'src/lib/wideset') continue;
      sources.push(...agentSources(app, pristine, path));
    } else if (/\.(tsx|ts)$/.test(entry)) {
      const text = readFileSync(join(app, path), 'utf8');
      const original = join(pristine, path);
      if (!existsSync(original) || readFileSync(original, 'utf8') !== text) sources.push(text);
    }
  }
  return sources;
}

async function runOne({ testCase, withSkills, pristine, dest, base, model }) {
  cloneApp(pristine, dest);
  if (withSkills) {
    writeFileSync(join(dest, 'CLAUDE.md'), '# Project\n');
    await cli(['skills', '--registry', base], dest);
  }
  const agent = await run(
    'claude',
    [
      '-p',
      JSON.stringify(`${testCase.prompt} Render it from src/App.tsx.`),
      '--setting-sources',
      'project',
      '--permission-mode',
      'acceptEdits',
      '--allowedTools',
      JSON.stringify(TOOLS),
      '--output-format',
      'stream-json',
      '--verbose',
      ...(model ? ['--model', model] : []),
    ],
    dest,
    { timeout: RUN_TIMEOUT },
  );
  if (args.includes('--keep')) writeFileSync(join(dest, 'agent-stream.jsonl'), agent.out);
  const typecheck = await run('npx', ['tsc', '--noEmit', '-p', 'tsconfig.app.json'], dest);
  const build = await run('npx', ['vite', 'build', '--logLevel', 'error'], dest);
  const graded = grade(agentSources(dest, pristine), testCase.requires, testCase.traps);
  return {
    pass: agent.ok && typecheck.ok && build.ok && graded.pass,
    agentFinished: agent.ok,
    usage: toolUsage(agent.out),
    typecheck: typecheck.ok,
    build: build.ok,
    checks: graded.checks,
    ...(graded.traps ? { traps: graded.traps } : {}),
    ...(typecheck.ok ? {} : { typecheckOutput: typecheck.out.slice(0, 2000) }),
  };
}

async function main() {
  const runs = Number(flag('--runs') ?? 3);
  const only = flag('--case');
  const name = flag('--name') ?? `run-${only ?? 'all'}`;
  const cases = readdirSync(CASES)
    .filter((file) => file.endsWith('.md'))
    .map((file) => parseCase(readFileSync(join(CASES, file), 'utf8')))
    .filter((testCase) => !only || testCase.name === only);
  if (!cases.length) throw new Error(`no case named ${only}`);
  const armFlag = flag('--arm');
  if (armFlag && armFlag !== 'with' && armFlag !== 'without')
    throw new Error(`no arm named ${armFlag}`);
  const arms = armFlag ? [armFlag === 'with'] : [false, true];

  const work = mkdtempSync(join(tmpdir(), 'wideset-evals-'));
  log(`work dir ${work}`);
  const registry = await serveRegistry(work);
  const results = [];
  try {
    const pristine = await scaffold(work, registry.base);
    for (const testCase of cases) {
      for (const withSkills of arms) {
        for (let index = 0; index < runs; index += 1) {
          const label = `${testCase.name} ${withSkills ? 'with' : 'without'} #${index + 1}`;
          const dest = join(work, 'runs', `${testCase.name}-${withSkills}-${index}`);
          mkdirSync(dirname(dest), { recursive: true });
          const result = await runOne({
            testCase,
            withSkills,
            pristine,
            dest,
            base: registry.base,
            model: flag('--model'),
          });
          results.push({ case: testCase.name, withSkills, run: index + 1, ...result });
          log(`${result.pass ? 'pass' : 'FAIL'}  ${label}`);
        }
      }
    }
  } finally {
    registry.close();
    if (!args.includes('--keep')) rmSync(work, { recursive: true, force: true });
  }

  const rate = (withSkills) => {
    const group = results.filter((result) => result.withSkills === withSkills);
    return { runs: group.length, passed: group.filter((result) => result.pass).length };
  };
  /** Per arm: pass rate, and for every case its passes and the traps that fired in its runs. */
  const perCase = (withSkills) =>
    Object.fromEntries(
      cases.map((testCase) => {
        const group = results.filter(
          (result) => result.withSkills === withSkills && result.case === testCase.name,
        );
        const fired = group.flatMap((result) =>
          (result.traps?.fired ?? []).map((problem) => problem.split(':')[0]),
        );
        return [
          testCase.name,
          {
            passed: group.filter((result) => result.pass).length,
            runs: group.length,
            trapFailures: group.filter((result) => result.traps?.fired.length).length,
            trapsFired: [...new Set(fired)],
          },
        ];
      }),
    );
  const summary = {
    with: { ...rate(true), cases: perCase(true) },
    without: { ...rate(false), cases: perCase(false) },
    model: flag('--model') ?? 'default',
  };
  mkdirSync(RESULTS, { recursive: true });
  writeFileSync(
    join(RESULTS, `${name}.json`),
    `${JSON.stringify({ summary, results }, null, 2)}\n`,
  );
  for (const [label, arm] of [
    ['with skills', summary.with],
    ['without    ', summary.without],
  ]) {
    log(
      `${label} ${arm.passed}/${arm.runs} pass (${Math.round((100 * arm.passed) / (arm.runs || 1))}%)`,
    );
    for (const [name, row] of Object.entries(arm.cases))
      log(
        `  ${name.padEnd(24)} ${row.passed}/${row.runs}${
          row.trapsFired.length
            ? `  trap failures ${row.trapFailures}: ${row.trapsFired.join(', ')}`
            : ''
        }`,
      );
  }
  const trapRuns = (arm) => results.filter((r) => r.withSkills === arm && r.traps);
  const trapFail = (arm) => trapRuns(arm).filter((r) => r.traps.fired.length).length;
  log(
    `trap failures: with skills ${trapFail(true)}/${trapRuns(true).length}, without ${trapFail(false)}/${trapRuns(false).length}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
