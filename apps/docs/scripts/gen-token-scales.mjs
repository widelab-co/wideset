import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { componentsDir, generatedDir, library } from './paths.mjs';
import { isTokenVariable, resolveUtility } from './token-classes.mjs';

/**
 * More keys for src/generated/tokens.json, added to what gen-tokens.mjs wrote (its keys are
 * left as they are). Values are resolved through the `var()` chain to what the CSS ends on:
 * a length for sizes, a primitive colour (`--ws-colors-light-brand-600`) for colours.
 *
 *   spacing    [{ step, name, className, value, primitive }]          the --spacing-ws-<n> scale
 *   sizes      [{ group, name, className, value }]                    control and forms heights
 *   radius     [{ group, name, className, value, primitive }]         container and control
 *   shadows    [{ name, className, kind, paint, variable, light, dark, usedBy }]
 *   reference  [{ family, title, utility (class prefix, e.g. bg-ws), tokens: [{ name, className, light, dark }] }]
 *
 * And src/generated/token-classes.json, what scripts/token-classes.mjs resolves a class with:
 *   variables  { [name]: { alias, light, dark } }        every ws variable, light and dark
 *   utilities  { [class]: { group, reads: [variable] } } named @utility classes, @apply expanded
 *   functional { [prefix]: namespace }                   `@utility x-*` reading `--value(--ns-*)`
 */
const styles = join(library, 'src/styles');
const css = (path) => readFileSync(join(styles, path), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
// Within one file the first declaration wins: later ones are media overrides (reduced motion).
const declarations = (source, into = new Map()) => {
  const seen = new Set();
  for (const [, name, value] of source.matchAll(/(--[\w-]+)\s*:\s*([^;{}]+);/g)) {
    if (seen.has(name)) continue;
    seen.add(name);
    into.set(
      name,
      value
        .replace(/\s+/g, ' ')
        .replace(/var\(\s*(--[\w-]+)\s*\)/g, 'var($1)')
        .trim(),
    );
  }
  return into;
};
const block = (source, selector) =>
  [...source.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, head]) => head.trim() === selector)
    .map(([, , body]) => body)
    .join('\n');

const shadowCss = css('utilities/shadow.css');
const light = new Map();
for (const file of [
  'tokens/theme-base-tokens.css',
  'tokens/theme-light-tokens.css',
  'tokens/theme-light-semantic.css',
  'tokens/theme-desktop-tokens.css',
  'tokens/theme-desktop-semantic.css',
  'utilities/z-index.css',
  'utilities/motion.css',
  'theme.css',
])
  declarations(css(file), light);
declarations(block(shadowCss, ':root'), light);
declarations(block(shadowCss, '@theme'), light);
const dark = new Map();
declarations(css('tokens/theme-dark-tokens.css'), dark);
declarations(css('tokens/theme-dark-semantic.css'), dark);
declarations(block(shadowCss, '.dark'), dark);

// Follow a value that is one whole `var(--x)` until it ends on a literal or a colour primitive.
const PRIMITIVE_COLOUR = /^--ws-colors-(light|dark)-/;
const resolve = (name, theme) => {
  let current = name;
  for (let depth = 0; depth < 20; depth += 1) {
    const value = (theme === 'dark' && dark.get(current)) || light.get(current);
    if (value === undefined) throw new Error(`gen-tokens: ${current} is not declared`);
    const next = /^var\((--[\w-]+)\)$/.exec(value)?.[1];
    if (!next) return { value, primitive: current === name ? null : current };
    if (PRIMITIVE_COLOUR.test(next)) return { value: next, primitive: next };
    current = next;
  }
  throw new Error(`gen-tokens: ${name} does not resolve`);
};
const valueOf = (name, theme = 'light') => resolve(name, theme).value;
const names = (prefix) => [...light.keys()].filter((name) => name.startsWith(prefix));
const by = (pattern) => (name) => pattern.exec(name)?.[1] ?? '';
const SIZE_ORDER = ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'full'];
const sizeOrder = (name) => SIZE_ORDER.indexOf(name.split('-').pop());

// Spacing: the numbered scale. Control and forms sizes share the namespace; listed apart.
const spacing = names('--spacing-ws-')
  .filter((name) => /^--spacing-ws-\d+$/.test(name))
  .map((name) => {
    const step = Number(by(/(\d+)$/)(name));
    const { value } = resolve(name, 'light');
    // the primitive the step stands for: --spacing-ws-4 → --ws-size-4 → --ws-space-150
    let primitive = name;
    while (/^var\((--[\w-]+)\)$/.test(light.get(primitive)))
      primitive = /^var\((--[\w-]+)\)$/.exec(light.get(primitive))[1];
    return { step, name, className: `p-ws-${step}`, value, primitive };
  })
  .sort((a, b) => a.step - b.step);

const sizes = names('--spacing-ws-')
  .filter((name) => /^--spacing-ws-(control|forms)-/.test(name))
  .map((name) => {
    const group = by(/^--spacing-ws-(control|forms)-/)(name);
    const key = name.replace('--spacing-ws-', '');
    return {
      group,
      name,
      className: group === 'forms' ? `h-ws-${key}` : `size-ws-${key}`,
      value: valueOf(name),
    };
  })
  .sort((a, b) => a.group.localeCompare(b.group) || sizeOrder(a.name) - sizeOrder(b.name));

const radius = names('--radius-ws-')
  .map((name) => {
    const group = by(/^--radius-ws-(container|control)-/)(name);
    let primitive = name;
    while (/^var\((--[\w-]+)\)$/.test(light.get(primitive)))
      primitive = /^var\((--[\w-]+)\)$/.exec(light.get(primitive))[1];
    return {
      group,
      name,
      className: name.replace('--radius-ws-', 'rounded-ws-'),
      value: valueOf(name),
      primitive,
    };
  })
  .sort((a, b) => b.group.localeCompare(a.group) || sizeOrder(a.name) - sizeOrder(b.name));

// Which components use a class, from their source (stories, tests and examples left out).
const sources = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'examples' && entry.name !== '__snapshots__') walk(path);
    } else if (/\.tsx?$/.test(entry.name) && !/\.(test|stories)\.tsx?$/.test(entry.name))
      sources.push({ path, text: readFileSync(path, 'utf8') });
  }
};
walk(componentsDir);
const usedBy = (className) => {
  const pattern = new RegExp(`(^|[\\s'"\`:])${className}(?![\\w-])`);
  return [
    ...new Set(
      sources
        .filter((source) => pattern.test(source.text))
        .map((source) => source.path.slice(componentsDir.length + 1).split(/[\\/]/)[0]),
    ),
  ].sort();
};

// Shadows: the `shadow-ws-*` theme keys plus the two `drop-shadow-ws-*` filter utilities.
// `paint` is what the class applies; `variable` the --ws-elevation-* it reads, if any, with
// its light and dark values (dark null when .dark does not change it).
const drops = [
  ...shadowCss.matchAll(/\.(drop-shadow-ws-[\w-]+)\s*\{\s*filter:\s*var\((--[\w-]+)\);/g),
];
const shadow = (className, kind, paint) => {
  const variable = /^var\((--ws-elevation-[\w-]+)\)$/.exec(paint)?.[1] ?? null;
  const lightValue = variable ? light.get(variable) : paint;
  const darkValue = variable ? (dark.get(variable) ?? null) : null;
  return {
    name: kind === 'box' ? className.replace('shadow-ws-', '--shadow-ws-') : variable,
    className,
    kind,
    paint,
    variable,
    light: lightValue,
    dark: darkValue === lightValue ? null : darkValue,
    usedBy: usedBy(className),
  };
};
const shadows = [
  ...names('--shadow-ws-').map((name) =>
    shadow(name.replace('--shadow-ws-', 'shadow-ws-'), 'box', light.get(name)),
  ),
  ...drops.map(([, className, variable]) => shadow(className, 'drop', `var(${variable})`)),
];

// The reference: every family of tokens a class reads, with its light and dark value. Colours
// end on a primitive name; dark is null where it resolves to the same value as light.
const family = (familyName, title, utility, prefix, classPrefix) => ({
  family: familyName,
  title,
  utility,
  tokens: names(prefix).map((name) => {
    const lightValue = valueOf(name, 'light');
    const darkValue = valueOf(name, 'dark');
    const same =
      darkValue === lightValue ||
      (PRIMITIVE_COLOUR.test(lightValue) &&
        PRIMITIVE_COLOUR.test(darkValue) &&
        light.get(lightValue) === light.get(darkValue));
    return {
      name,
      className:
        classPrefix === null
          ? null
          : typeof classPrefix === 'function'
            ? classPrefix(name)
            : name.replace(prefix, classPrefix),
      light: lightValue,
      dark: same ? null : darkValue,
    };
  }),
});
const reference = [
  family('background', 'Background colour', 'bg-ws', '--background-color-ws-', 'bg-ws-'),
  family('text', 'Text colour', 'text-ws', '--text-color-ws-', 'text-ws-'),
  family('border', 'Border colour', 'border-ws', '--border-color-ws-', 'border-ws-'),
  family('outline', 'Outline colour', 'outline-ws', '--outline-color-ws-', 'outline-ws-'),
  family('fill', 'SVG fill', 'fill-ws', '--fill-ws-', 'fill-ws-'),
  family('stroke', 'SVG stroke', 'stroke-ws', '--stroke-ws-', 'stroke-ws-'),
  family(
    'decoration',
    'Text decoration colour',
    'decoration-ws',
    '--text-decoration-color-ws-',
    'decoration-ws-',
  ),
  // The scale as padding; control and forms sizes as the class components use them.
  family(
    'spacing',
    'Spacing and sizes',
    'p-ws',
    '--spacing-ws-',
    (name) =>
      sizes.find((size) => size.name === name)?.className ?? name.replace('--spacing-ws-', 'p-ws-'),
  ),
  family('radius', 'Radius', 'rounded-ws', '--radius-ws-', 'rounded-ws-'),
  family('border-width', 'Border width', 'border-ws-width', '--border-width-ws-', 'border-ws-'),
  family('font-size', 'Font size', 'text-ws', '--text-ws-', 'text-ws-'),
  family('line-height', 'Line height', 'leading-ws', '--leading-ws-', 'leading-ws-'),
  family('letter-spacing', 'Letter spacing', 'tracking-ws', '--tracking-ws-', 'tracking-ws-'),
  family('font-weight', 'Font weight', 'font-ws', '--font-weight-ws-', 'font-ws-'),
  family('font-family', 'Font family', 'font-ws', '--font-ws-', 'font-ws-'),
  {
    family: 'shadow',
    title: 'Shadow',
    utility: 'shadow-ws',
    tokens: shadows.map((item) => ({
      name: item.variable ?? item.name,
      className: item.className,
      light: item.light,
      dark: item.dark,
    })),
  },
  family('z-index', 'Z-index', 'z-ws', '--ws-z-index-', 'z-ws-'),
  family('motion', 'Motion', null, '--ws-motion-', null),
];
for (const [label, list] of Object.entries({ spacing, sizes, radius, shadows, reference })) {
  if (list.length === 0) throw new Error(`gen-tokens: no ${label} tokens found in the library CSS`);
}
for (const item of reference) {
  if (item.tokens.length === 0) throw new Error(`gen-tokens: no ${item.family} tokens found`);
}

// Class → token data. A colour ends on its primitive, anything else on its literal value.
const variables = {};
for (const name of new Set([...light.keys(), ...dark.keys()])) {
  if (!isTokenVariable(name) || PRIMITIVE_COLOUR.test(name)) continue;
  let alias = null;
  for (let current = name, depth = 0; depth < 20; depth += 1) {
    const next = /^var\((--[\w-]+)\)$/.exec(light.get(current) ?? '')?.[1];
    if (!next || PRIMITIVE_COLOUR.test(next)) break;
    if (next.startsWith('--ws-')) {
      alias = next;
      break;
    }
    current = next;
  }
  variables[name] = { alias, light: valueOf(name, 'light'), dark: valueOf(name, 'dark') };
}
const utilityCss = readdirSync(join(styles, 'utilities'))
  .filter((name) => name.endsWith('.css'))
  .map((name) => css(join('utilities', name)))
  .join('\n');
const functional = {};
for (const [, prefix, body] of utilityCss.matchAll(/@utility\s+([\w-]+)-\*\s*\{([^{}]*)\}/g)) {
  const namespace = /--value\(\s*(--[\w-]+-)\*\s*\)/.exec(body)?.[1];
  if (!namespace) throw new Error(`gen-tokens: @utility ${prefix}-* reads no --value() namespace`);
  functional[prefix] = namespace;
}
const GROUPS = [
  [/^typography-/, 'type'],
  [/^z-/, 'layer'],
  [/shadow/, 'shadow'],
  [/^wds-focus/, 'focus'],
];
const utilities = {};
const data = { variables, utilities, functional };
for (const [, name, body] of [
  ...utilityCss.matchAll(/@utility\s+([\w-]+)\s*\{([^{}]*)\}/g),
  ...utilityCss.matchAll(/\.([\w-]+-ws-[\w-]+)\s*\{([^{}]*)\}/g),
]) {
  const reads = [...body.matchAll(/var\(\s*(--[\w-]+)/g)]
    .map(([, variable]) => variable)
    .filter(isTokenVariable);
  for (const [, list] of body.matchAll(/@apply\s+([^;]+);/g))
    for (const cls of list.trim().split(/\s+/)) {
      const tokens = resolveUtility(data, cls);
      if (tokens === null)
        throw new Error(`gen-tokens: @utility ${name} applies ${cls}, which reads no token`);
      reads.push(...(tokens ?? []).map((token) => token.name));
    }
  for (const variable of reads)
    if (!variables[variable])
      throw new Error(`gen-tokens: @utility ${name} reads ${variable}, which is not declared`);
  utilities[name] = {
    group: GROUPS.find(([re]) => re.test(name))?.[1] ?? 'other',
    reads: [...new Set(reads)],
  };
}
writeFileSync(join(generatedDir, 'token-classes.json'), `${JSON.stringify(data, null, 2)}\n`);

const file = join(generatedDir, 'tokens.json');
const tokens = JSON.parse(readFileSync(file, 'utf8'));
writeFileSync(
  file,
  `${JSON.stringify({ ...tokens, spacing, sizes, radius, shadows, reference }, null, 2)}\n`,
);
