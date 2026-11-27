#!/usr/bin/env node
// Before/after screenshots of Wideset pages: Storybook stories, the docs site, or any app a command
// serves. Usage and flags: ../SKILL.md, or --help.
// No dependencies: Node 22+ (fetch, WebSocket) drives headless Chrome over the DevTools protocol.
import { execFileSync, spawn } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';

const { values: opt } = parseArgs({
  options: {
    ref: { type: 'string' },
    app: { type: 'string', default: 'storybook' },
    stories: { type: 'string', default: '' },
    ids: { type: 'string' },
    paths: { type: 'string' },
    pages: { type: 'string' },
    cmd: { type: 'string' },
    'ready-path': { type: 'string', default: '/' },
    'full-page': { type: 'boolean', default: false },
    out: { type: 'string' },
    url: { type: 'string' },
    'ref-url': { type: 'string' },
    port: { type: 'string', default: '6106' },
    'ref-port': { type: 'string', default: '6107' },
    theme: { type: 'string', default: 'light' },
    width: { type: 'string', default: '1440' },
    height: { type: 'string', default: '900' },
    parallel: { type: 'string', default: '3' },
    threshold: { type: 'string', default: '0' },
    keep: { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h' },
  },
});

if (opt.help) {
  console.log(`shots.mjs [--ref <git ref>] [--app storybook|docs|custom] [--out <dir>]
  storybook: [--stories <id prefix>] [--ids <file>]
  docs, custom: --paths </a,/b> | --pages <file>  [--full-page]
  custom: --cmd '<command that serves on {port}>' [--ready-path /]
  [--url <running server>] [--ref-url <running server>] [--port 6106] [--ref-port 6107]
  [--theme light|dark|both] [--width 1440] [--height 900] [--parallel 3] [--threshold <pixels>] [--keep]`);
  process.exit(0);
}

// How each kind of app starts, where it answers once ready, and how it stops when killing its
// process group is not enough. The docs generator reads the library's dist/, so a fresh worktree
// builds it first. Astro 7 detaches its dev server when an agent runs it: `astro dev stop` ends it.
const APPS = {
  storybook: {
    cmd: 'pnpm --filter @wideset/react exec storybook dev -p {port} --ci --no-open',
    ready: '/index.json',
  },
  docs: {
    cmd:
      '{ [ -f packages/design-system/dist/styles.css ] || pnpm build:lib; } && ' +
      'pnpm --filter @wideset/docs exec node scripts/generate.mjs && ' +
      'pnpm --filter @wideset/docs exec astro dev --port {port}',
    ready: '/',
    stop: 'pnpm --filter @wideset/docs exec astro dev stop',
  },
  custom: { cmd: opt.cmd, ready: opt['ready-path'] },
};
const app = APPS[opt.app];
if (!app) throw new Error(`--app must be one of ${Object.keys(APPS).join(', ')}.`);
if (opt.app === 'custom' && !opt.cmd && !opt.url)
  throw new Error('--app custom needs --cmd or --url.');
const isStorybook = opt.app === 'storybook';

const CHROME =
  process.env.CHROME ??
  (process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : 'google-chrome');
const W = Number(opt.width);
const H = Number(opt.height);
const themes = opt.theme === 'both' ? ['light', 'dark'] : [opt.theme];
const repo = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
const out = resolve(opt.out ?? join(tmpdir(), 'visual-shots', stamp));
mkdirSync(out, { recursive: true });

const children = [];
const served = []; // directories a server was started in, for app.stop
let worktree;
let chrome;
let cleaned = false;
function cleanup() {
  if (cleaned) return;
  cleaned = true;
  chrome?.kill();
  for (const p of children) {
    try {
      process.kill(-p.pid, 'SIGTERM');
    } catch {}
  }
  for (const dir of app?.stop ? served : []) {
    try {
      execFileSync('sh', ['-c', app.stop], { cwd: dir, stdio: 'ignore', timeout: 30_000 });
    } catch {}
  }
  if (worktree && !opt.keep) {
    try {
      execFileSync('git', ['worktree', 'remove', '--force', worktree], {
        cwd: repo,
        stdio: 'ignore',
      });
    } catch {
      console.warn(
        `Could not remove the worktree ${worktree}; run: git worktree remove --force ${worktree}`,
      );
    }
  }
}
process.on('exit', cleanup);
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(130));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const responds = (url) =>
  fetch(`${url}${app.ready}`)
    .then((r) => r.ok)
    .catch(() => false);

async function startServer(dir, port, label) {
  const url = `http://localhost:${port}`;
  if (await responds(url)) {
    throw new Error(
      `Port ${port} already serves something. Pass --${label === 'before' ? 'ref-url' : 'url'} ${url} to use it, or another port.`,
    );
  }
  const log = join(out, `${opt.app}-${label}.log`);
  const fd = openSync(log, 'w');
  served.push(dir);
  children.push(
    spawn('sh', ['-c', app.cmd.replaceAll('{port}', port)], {
      cwd: dir,
      detached: true,
      stdio: ['ignore', fd, fd],
    }),
  );
  for (let t = Date.now(); Date.now() - t < 180_000; await sleep(1000)) {
    if (await responds(url)) return url;
  }
  throw new Error(`${opt.app} (${label}) did not start within 3 minutes; see ${log}`);
}

function prepareWorktree(ref) {
  const dir = mkdtempSync(join(tmpdir(), 'shots-ref-'));
  rmSync(dir, { recursive: true });
  execFileSync('git', ['worktree', 'add', '--detach', dir, ref], { cwd: repo, stdio: 'ignore' });
  worktree = dir;
  console.log(`Installing ${ref} in ${dir} …`);
  try {
    execFileSync('pnpm', ['install', '--offline', '--frozen-lockfile'], {
      cwd: dir,
      stdio: 'ignore',
    });
  } catch {
    execFileSync('pnpm', ['install', '--frozen-lockfile'], { cwd: dir, stdio: 'inherit' });
  }
  return dir;
}

// A shot's id: a story id, or a page path ("/docs/installation"; "/" is the home page).
async function storyIds(url) {
  if (!isStorybook) {
    const list = opt.pages
      ? readFileSync(opt.pages, 'utf8').split('\n')
      : (opt.paths ?? '').split(',');
    const paths = list.map((p) => p.trim()).filter(Boolean);
    if (!paths.length) throw new Error(`--app ${opt.app} needs --paths or --pages.`);
    return paths.map((p) => (p.startsWith('/') ? p : `/${p}`));
  }
  if (opt.ids) return readFileSync(opt.ids, 'utf8').trim().split('\n').filter(Boolean);
  const { entries } = await (await fetch(`${url}/index.json`)).json();
  return Object.entries(entries)
    .filter(([id, e]) => e.type === 'story' && id.startsWith(opt.stories))
    .map(([id]) => id);
}

// ── Chrome over the DevTools protocol ──────────────────────────────────────────
let send;
async function startChrome() {
  const port = 9222 + Math.floor(Math.random() * 500);
  chrome = spawn(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${mkdtempSync(join(tmpdir(), 'shots-chrome-'))}`,
      // Headless Chrome keeps 87 px of the window for its own bar, so a W×H window paints only
      // W×(H−87). The device-metrics override still lays the page out at W×H, and the bottom 87 px
      // of a shot came out stale: a copy of the top band, or blank over a bottom-fixed bar.
      // A taller window gives the page a surface at least H high.
      `--window-size=${W},${H + 200}`,
      'about:blank',
    ],
    { stdio: 'ignore' },
  );
  let version;
  for (let i = 0; i < 100 && !version; i++) {
    await sleep(200);
    version = await fetch(`http://127.0.0.1:${port}/json/version`)
      .then((r) => r.json())
      .catch(() => null);
  }
  if (!version) throw new Error(`Chrome did not start (${CHROME}); set CHROME to its binary.`);
  const ws = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  let seq = 0;
  const pending = new Map();
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m);
      pending.delete(m.id);
    }
  });
  send = (method, params = {}, sessionId) =>
    new Promise((res, rej) => {
      const id = ++seq;
      pending.set(id, (m) =>
        m.error ? rej(new Error(`${method}: ${m.error.message}`)) : res(m.result),
      );
      ws.send(JSON.stringify({ id, method, params, sessionId }));
    });
}

const evaluate = async (expression, s) =>
  (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }, s))
    .result.value;

async function openTab() {
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  return { targetId, s: sessionId };
}

const READY = `new Promise((res) => { const t0 = Date.now(); (function poll() {
  const ok = document.body?.classList.contains('sb-show-main')
    && document.querySelector('#storybook-root')?.children.length;
  if (ok || Date.now() - t0 > 60000) document.fonts.ready.then(() => setTimeout(() => res(!!ok), 2500));
  else setTimeout(poll, 100); })(); })`;

// Any other page: loaded, fonts in, and the DOM quiet for 500 ms (client rendering, lazy parts),
// at most 20 s; then 1 s more.
const PAGE_READY = `new Promise((res) => { const t0 = Date.now(); let last = Date.now();
  new MutationObserver(() => { last = Date.now(); }).observe(document, { subtree: true, childList: true, attributes: true });
  (function poll() {
    const quiet = document.readyState === 'complete' && Date.now() - last > 500;
    if (quiet || Date.now() - t0 > 20000) document.fonts.ready.then(() => setTimeout(() => res(true), 1000));
    else setTimeout(poll, 100); })(); })`;

const pageUrl = (base, id) =>
  isStorybook ? `${base}/iframe.html?id=${id}&viewMode=story` : `${base}${id}`;
const fileOf = (id) =>
  isStorybook ? id : id.replace(/^\/|\/$/g, '').replace(/[^\w.-]+/g, '-') || 'index';

// Returns a PNG buffer, or null when the story never rendered.
async function shoot(url, id, theme) {
  const { targetId, s } = await openTab();
  try {
    await send(
      'Emulation.setDeviceMetricsOverride',
      { width: W, height: H, deviceScaleFactor: 1, mobile: false },
      s,
    );
    // Every tab acts focused: otherwise an autofocused field shows its ring only in the one tab
    // that happens to have focus, and the pair differs at random.
    await send('Emulation.setFocusEmulationEnabled', { enabled: true }, s);
    await send(
      'Emulation.setEmulatedMedia',
      {
        features: [
          { name: 'prefers-color-scheme', value: theme },
          { name: 'prefers-reduced-motion', value: 'reduce' },
        ],
      },
      s,
    );
    await send('Page.navigate', { url: pageUrl(url, id) }, s);
    const ok = await evaluate(isStorybook ? READY : PAGE_READY, s);
    // Transitions and animations off first, so the theme switch and anything still easing in land
    // on their end state; the caret is hidden because it blinks. Then the theme class:
    // storybook-dark-mode sets it from the manager, which a bare iframe does not have; the docs
    // site reads prefers-color-scheme and sets the same `dark` class. Dev overlays (Astro's
    // toolbar) are hidden: they float over the page and are not part of it.
    await evaluate(
      `(() => { const st = document.createElement('style');
        st.textContent = '*, *::before, *::after { transition: none !important; animation-duration: 0s !important; animation-delay: 0s !important; caret-color: transparent !important; } astro-dev-toolbar, vite-error-overlay { display: none !important; }';
        document.head.append(st);
        const h = document.documentElement; h.classList.remove('light', 'dark'); h.classList.add('${theme}');
        return new Promise((r) => setTimeout(r, 500)); })()`,
      s,
    );
    let shot = { format: 'png' };
    if (opt['full-page']) {
      const { cssContentSize: size } = await send('Page.getLayoutMetrics', {}, s);
      shot = {
        ...shot,
        captureBeyondViewport: true,
        clip: { x: 0, y: 0, width: W, height: Math.ceil(size.height), scale: 1 },
      };
    }
    const { data } = await send('Page.captureScreenshot', shot, s);
    return ok ? Buffer.from(data, 'base64') : null;
  } finally {
    await send('Target.closeTarget', { targetId });
  }
}

// Share of pixels that differ visibly, and a picture with them in red over a faded "after".
async function compare(a, b) {
  const { targetId, s } = await openTab();
  try {
    return await evaluate(
      `(async () => {
        const load = async (b64) => { const i = new Image(); i.src = 'data:image/png;base64,' + b64; await i.decode(); return i; };
        const [x, y] = await Promise.all([load(${JSON.stringify(a.toString('base64'))}), load(${JSON.stringify(b.toString('base64'))})]);
        if (x.width !== y.width || x.height !== y.height) return { pct: 100, px: -1, png: null };
        const c = document.createElement('canvas'); c.width = x.width; c.height = x.height;
        const g = c.getContext('2d');
        g.drawImage(x, 0, 0); const p = g.getImageData(0, 0, c.width, c.height);
        g.drawImage(y, 0, 0); const q = g.getImageData(0, 0, c.width, c.height);
        const d = q.data; let n = 0;
        for (let i = 0; i < d.length; i += 4) {
          const diff = Math.abs(p.data[i] - d[i]) + Math.abs(p.data[i + 1] - d[i + 1]) + Math.abs(p.data[i + 2] - d[i + 2]);
          if (diff > 24) { n++; d[i] = 230; d[i + 1] = 30; d[i + 2] = 30; d[i + 3] = 255; }
          else { const v = 255 - (255 - (d[i] + d[i + 1] + d[i + 2]) / 3) * 0.25; d[i] = d[i + 1] = d[i + 2] = v; }
        }
        g.putImageData(q, 0, 0);
        return { pct: (100 * n) / (d.length / 4), px: n, png: n ? c.toDataURL('image/png').split(',')[1] : null };
      })()`,
      s,
    );
  } finally {
    await send('Target.closeTarget', { targetId });
  }
}

// ── Run ────────────────────────────────────────────────────────────────────────
const afterUrl = opt.url ?? (await startServer(repo, opt.port, 'after'));
let beforeUrl = opt['ref-url'];
if (!beforeUrl && opt.ref)
  beforeUrl = await startServer(prepareWorktree(opt.ref), opt['ref-port'], 'before');

const afterIds = await storyIds(afterUrl);
const beforeIds = beforeUrl ? await storyIds(beforeUrl) : [];
const ids = [...new Set([...afterIds, ...beforeIds])].sort();
if (!ids.length) throw new Error(`No story id starts with "${opt.stories}".`);
console.log(
  `${ids.length} ${isStorybook ? 'stories' : 'pages'} × ${themes.length} theme(s) → ${out}`,
);

await startChrome();
const sides = beforeUrl ? ['before', 'after'] : ['after'];
for (const side of sides) mkdirSync(join(out, side), { recursive: true });
if (beforeUrl) mkdirSync(join(out, 'diff'), { recursive: true });

const jobs = ids.flatMap((id) =>
  themes.map((theme) => ({
    id,
    theme,
    file: themes.length > 1 ? `${fileOf(id)}.${theme}.png` : `${fileOf(id)}.png`,
  })),
);
const rows = [];
const queue = [...jobs];
let done = 0;
await Promise.all(
  Array.from({ length: Number(opt.parallel) }, async () => {
    while (queue.length) {
      const job = queue.shift();
      const row = { ...job, notes: [] };
      const shots = {};
      for (const side of sides) {
        const url = side === 'before' ? beforeUrl : afterUrl;
        const has = (side === 'before' ? beforeIds : afterIds).includes(job.id);
        if (!has) {
          row.notes.push(`not in ${side}`);
          continue;
        }
        try {
          // Vite reloads a page once while it optimises dependencies on the first visit: retry once.
          const png = await shoot(url, job.id, job.theme).catch((e) =>
            /navigated or closed|context was destroyed/.test(e.message)
              ? shoot(url, job.id, job.theme)
              : Promise.reject(e),
          );
          if (!png) row.notes.push(`${side} did not render`);
          else {
            shots[side] = png;
            writeFileSync(join(out, side, job.file), png);
          }
        } catch (e) {
          row.notes.push(`${side}: ${e.message}`);
        }
      }
      row.has = Object.keys(shots);
      if (shots.before && shots.after) {
        const { pct, px, png } = await compare(shots.before, shots.after);
        row.pct = pct;
        row.px = px;
        if (png) writeFileSync(join(out, 'diff', job.file), Buffer.from(png, 'base64'));
        row.diff = !!png;
      }
      rows.push(row);
      process.stdout.write(`\r${++done}/${jobs.length}`);
    }
  }),
);
process.stdout.write('\n');

// ── Report ─────────────────────────────────────────────────────────────────────
const threshold = Number(opt.threshold);
rows.sort(
  (a, b) =>
    b.notes.length - a.notes.length || (b.pct ?? -1) - (a.pct ?? -1) || a.id.localeCompare(b.id),
);
const changed = rows.filter((r) => r.notes.length || (r.px ?? 0) > threshold || r.px === -1);
const same = rows.filter((r) => !changed.includes(r));
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const img = (side, r) =>
  r.has?.includes(side) || (side === 'diff' && r.diff)
    ? `<a href="${side}/${esc(r.file)}"><img loading="lazy" src="${side}/${esc(r.file)}" alt="${side}"></a>`
    : `<div class="none">—</div>`;
const row = (r) => `<section>
  <h2><code>${esc(r.id)}</code>${themes.length > 1 ? ` · ${r.theme}` : ''}
    <span class="pct">${r.pct === undefined ? '' : r.px === -1 ? 'size changed' : `${r.pct.toFixed(3)}% · ${r.px} px`}</span>
    ${r.notes.map((n) => `<span class="note">${esc(n)}</span>`).join('')}</h2>
  <div class="cols">${sides.map((s) => `<figure><figcaption>${s}</figcaption>${img(s, r)}</figure>`).join('')}${
    beforeUrl ? `<figure><figcaption>diff</figcaption>${img('diff', r)}</figure>` : ''
  }</div></section>`;
writeFileSync(
  join(out, 'index.html'),
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Visual shots</title>
<style>
  :root { color-scheme: light dark; --bg: #fafafa; --fg: #18181b; --muted: #71717a; --line: #e4e4e7; --warn: #b45309; }
  @media (prefers-color-scheme: dark) { :root { --bg: #18181b; --fg: #fafafa; --muted: #a1a1aa; --line: #3f3f46; --warn: #fbbf24; } }
  body { margin: 0; padding: 24px 16px; background: var(--bg); color: var(--fg); font: 14px/1.5 system-ui, sans-serif; }
  h1 { font-size: 20px; margin: 0 0 4px; } p { color: var(--muted); margin: 0 0 24px; }
  section { border-top: 1px solid var(--line); padding: 16px 0; }
  h2 { font-size: 14px; font-weight: 600; margin: 0 0 8px; display: flex; gap: 12px; align-items: baseline; flex-wrap: wrap; }
  .pct { font-variant-numeric: tabular-nums; } .note { color: var(--warn); }
  .cols { display: grid; grid-template-columns: repeat(${sides.length + (beforeUrl ? 1 : 0)}, minmax(0, 1fr)); gap: 8px; }
  figure { margin: 0; } figcaption { color: var(--muted); font-size: 12px; } img { width: 100%; border: 1px solid var(--line); display: block; }
  .none { aspect-ratio: ${W} / ${H}; border: 1px dashed var(--line); display: grid; place-items: center; color: var(--muted); }
  details > summary { cursor: pointer; margin: 24px 0 8px; font-weight: 600; }
</style>
<h1>Visual shots · ${esc(opt.app)}</h1>
<p>${beforeUrl ? `before: ${esc(opt.ref ?? beforeUrl)} · after: working tree` : 'working tree'} · ${W}×${H} · ${esc(themes.join(', '))} ·
${changed.length} changed or with notes, ${same.length} unchanged (≤ ${threshold} differing pixels)</p>
${changed.map(row).join('\n')}
${same.length ? `<details><summary>${same.length} unchanged</summary>${same.map(row).join('\n')}</details>` : ''}
</html>`,
);
writeFileSync(
  join(out, 'results.json'),
  JSON.stringify(
    rows.map(({ id, theme, file, pct, px, notes }) => ({ id, theme, file, pct, px, notes })),
    null,
    2,
  ),
);

console.log(`${changed.length} changed or with notes, ${same.length} unchanged`);
for (const r of changed.slice(0, 20))
  console.log(
    `  ${r.pct === undefined ? '–'.padStart(16) : `${r.pct.toFixed(3).padStart(7)}% ${String(r.px).padStart(6)}px`}  ${r.id}${themes.length > 1 ? ` (${r.theme})` : ''}${r.notes.length ? `  ${r.notes.join('; ')}` : ''}`,
  );
console.log(`Report: ${join(out, 'index.html')}`);
process.exit(0);
