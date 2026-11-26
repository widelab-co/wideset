const fs = require('fs');
const path = require('path');

/**
 * Adds the `ws` prefix to Wideset CSS custom properties, so tokens never collide with
 * Tailwind's default theme, shadcn, or a consumer's own variables.
 *
 * Figma keeps unprefixed names (name parity with the design file); the prefix is added
 * here, after pasting the css2variables export into src/styles/tokens (see src/styles/tokens/README.md).
 *
 * Two placements, because they serve different readers:
 *
 * - `namespace` — semantic tokens in theme-*-semantic.css. Tailwind derives the utility name
 *   from the part after its namespace, so the prefix has to sit inside the name for the class
 *   to read `bg-ws-…`, `p-ws-4`, `font-ws-medium`:
 *   --background-color-dynamic-primary-default → --background-color-ws-dynamic-primary-default
 *   Multi-word groups (`non-semantic`, `z-index`) keep the group together.
 *
 * - `leading` — primitives in theme-*-tokens.css and the hand-written utilities. Nothing derives
 *   a class name from them; they are what a consumer overrides when theming, so the prefix goes
 *   in front where it is easy to read and to search:
 *   --colors-dark-blue-100 → --ws-colors-dark-blue-100, --size-4 → --ws-size-4
 *
 * Both are idempotent: an already prefixed name is returned unchanged.
 */

// Longest first, so `--text-color-*` wins over `--text-*`.
const TAILWIND_NAMESPACES = [
  'text-decoration-color',
  'background-color',
  'outline-color',
  'border-color',
  'border-width',
  'font-weight',
  'inset-shadow',
  'drop-shadow',
  'text-shadow',
  'text-color',
  'perspective',
  'breakpoint',
  'decoration',
  'container',
  'tracking',
  'spacing',
  'leading',
  'animate',
  'radius',
  'shadow',
  'aspect',
  'stroke',
  'color',
  'text',
  'font',
  'fill',
  'blur',
  'ease',
];

const COMPOUND_GROUPS = ['non-semantic', 'z-index'];

const PREFIX = 'ws';

/** Figma export metadata, not tokens. Dropped instead of prefixed. */
const DROPPED_VARIABLES = new Set(['--color', '--colors-test']);

function splitHead(bare) {
  const group =
    TAILWIND_NAMESPACES.find((ns) => bare === ns || bare.startsWith(`${ns}-`)) ||
    COMPOUND_GROUPS.find((g) => bare === g || bare.startsWith(`${g}-`)) ||
    bare.split('-')[0];
  return [group, bare.slice(group.length + 1)];
}

/**
 * Which placement a file's tokens use. Hand-written files (index.css, utilities/*) hold both:
 * namespace tokens that back a class (`--shadow-ws-low` → `shadow-ws-low`) next to primitives
 * behind them (`--ws-elevation-low`), so they accept either.
 */
function styleForFile(file) {
  const name = path.basename(file);
  if (/-semantic\.css$/.test(name)) return 'namespace';
  if (/^theme-.*-tokens\.css$/.test(name)) return 'leading';
  return 'either';
}

function prefixVariableName(name, style = 'namespace') {
  if (!name.startsWith('--') || name.startsWith('--tw-')) return name;
  if (style === 'leading') {
    return name.startsWith(`--${PREFIX}-`) ? name : `--${PREFIX}-${name.slice(2)}`;
  }
  const [head, rest] = splitHead(name.slice(2));
  if (!rest) return name;
  if (rest === PREFIX || rest.startsWith(`${PREFIX}-`)) return name;
  return `--${head}-${PREFIX}-${rest}`;
}

/** Prefixes every definition and `var()`/bare reference of the given names in a CSS string. */
function prefixCss(css, names, style = 'namespace') {
  let out = css;
  // Drop Figma metadata lines (`--color: Light;`).
  out = out.replace(/^[ \t]*(--[\w-]+)\s*:[^;]*;[^\n]*\n/gm, (line, name) =>
    DROPPED_VARIABLES.has(name) ? '' : line,
  );
  const renames = [...names].filter(
    (n) => !DROPPED_VARIABLES.has(n) && prefixVariableName(n, style) !== n,
  );
  if (!renames.length) return out;
  renames.sort((a, b) => b.length - a.length);
  const pattern = new RegExp(
    `(?<![\\w-])(${renames.map((n) => n.replace(/[-]/g, '\\-')).join('|')})(?![\\w-])`,
    'g',
  );
  return out.replace(pattern, (n) => prefixVariableName(n, style));
}

/** All custom properties defined in the given CSS files. */
function collectDefinedVariables(files) {
  const names = new Set();
  for (const file of files) {
    const css = fs.readFileSync(file, 'utf-8');
    for (const m of css.matchAll(/(?<![\w-])(--[a-zA-Z][\w-]*)\s*:/g)) names.add(m[1]);
  }
  return names;
}

function main() {
  const stylesDir = path.join(__dirname, 'src/styles/tokens');
  const files = process.argv.slice(2).length
    ? process.argv.slice(2).map((f) => path.resolve(f))
    : fs
        .readdirSync(stylesDir)
        .filter((f) => /^theme-.*\.css$/.test(f))
        .map((f) => path.join(stylesDir, f));

  const names = collectDefinedVariables(files);
  let changed = 0;
  for (const file of files) {
    const css = fs.readFileSync(file, 'utf-8');
    const next = prefixCss(css, names, styleForFile(file));
    if (next !== css) {
      fs.writeFileSync(file, next, 'utf-8');
      changed++;
      console.log(`✓ ${path.relative(process.cwd(), file)}`);
    }
  }
  console.log(
    changed ? `\nPrefixed tokens in ${changed} file(s).` : 'All tokens already prefixed.',
  );
}

module.exports = {
  prefixVariableName,
  styleForFile,
  prefixCss,
  collectDefinedVariables,
  splitHead,
  TAILWIND_NAMESPACES,
  COMPOUND_GROUPS,
  DROPPED_VARIABLES,
};

if (require.main === module) {
  main();
}
