#!/usr/bin/env node
// Fails when a branch changes code that ships to consumers and adds no changeset.
// Used by CI (PRs into develop) and by the pre-push hook, so both apply the same rule.
//
//   node scripts/check-changeset.mjs <base> [head]     e.g. origin/develop HEAD
//
// "Ships to consumers" = a file under packages/design-system/src/ or packages/cli/src/ (the CLI)
// that is not a story, test, snapshot, Figma spec or docs page (those never reach dist/ or the
// registry); packages/cli/package.json, since the CLI reads its shadcn pin from it at runtime;
// or the consumer skills in packages/skills, Markdown included: that is their content.
// Anything else (CI, docs/, scripts, tooling, contributor skills in .agents/) is internal and
// needs nothing.
//
// A shipping change with no release on purpose (refactor with identical output, a test helper
// under src/) still needs a changeset, an empty one: `pnpm changeset --empty`, with the reason in
// its body. It releases nothing and keeps the decision in the PR.
import { execFileSync } from 'node:child_process';

const [base, head = 'HEAD'] = process.argv.slice(2);
if (!base) {
  console.error('usage: check-changeset.mjs <base> [head]');
  process.exit(2);
}

const SHIPPING = /^packages\/(design-system|cli)\/src\//;
// The CLI's package.json ships in its tarball and pins the shadcn version `wideset add` runs.
const SHIPPING_FILES = /^packages\/cli\/package\.json$/;
const SHIPPING_SKILLS =
  /^packages\/skills\/(skills\/|agents\/|cursor\/|AGENTS\.wideset\.md$|\.claude-plugin\/)/;
const NOT_SHIPPING = [
  /\.stories\.tsx?$/,
  /\.test\.tsx?$/,
  /\.snap$/,
  /\/__tests__\//,
  /\/__snapshots__\//,
  /\.figma-spec\.json$/,
  // Examples (docs + Storybook) and Storybook's own helpers: never reachable from an entry.
  /\/examples\//,
  /^packages\/design-system\/src\/stories\//,
  /\.mdx?$/,
];

const diff = (filter) =>
  execFileSync(
    'git',
    // --no-renames: a move out of src/ must count as a removal of a shipping file, not only as
    // the new (possibly non-shipping) path.
    ['diff', '--name-only', '--no-renames', `--diff-filter=${filter}`, `${base}...${head}`],
    {
      encoding: 'utf8',
    },
  )
    .split('\n')
    .filter(Boolean);

const shipping = diff('ACMD').filter(
  (f) =>
    SHIPPING_FILES.test(f) ||
    SHIPPING_SKILLS.test(f) ||
    (SHIPPING.test(f) && !NOT_SHIPPING.some((re) => re.test(f))),
);
const changesets = diff('A').filter(
  (f) => /^\.changeset\/[^/]+\.md$/.test(f) && !f.endsWith('README.md'),
);

if (shipping.length === 0 || changesets.length > 0) process.exit(0);

const shown = shipping.slice(0, 10).map((f) => `  ${f}`);
if (shipping.length > 10) shown.push(`  … and ${shipping.length - 10} more`);
console.error(
  [
    '✖ No changeset. These files ship to consumers:',
    ...shown,
    '',
    '  Consumer-facing change:  pnpm changeset            (one line for the changelog)',
    '  Nothing to release:      pnpm changeset --empty    (write why in the file body)',
    '',
    '  Commit the file in .changeset/ and push again. See RELEASING.md.',
  ].join('\n'),
);
process.exit(1);
