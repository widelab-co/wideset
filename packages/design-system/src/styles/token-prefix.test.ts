import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { prefixVariableName, styleForFile } = require('../../prefix-tokens.cjs');

const root = path.resolve(__dirname, '../..');
const stylesDir = path.resolve(root, 'src/styles');

const cssFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return cssFiles(full);
    return entry.name.endsWith('.css') && entry.name !== 'tokens_figma.css' ? [full] : [];
  });

const definedVariables = () =>
  cssFiles(stylesDir).flatMap((file) =>
    Array.from(
      fs.readFileSync(file, 'utf-8').matchAll(/(?<![\w-])(--[a-zA-Z][\w-]*)\s*:/g),
      (m) => ({
        name: m[1],
        file: path.relative(stylesDir, file),
      }),
    ),
  );

const tailwindDefaults = new Set(
  Array.from(
    fs
      .readFileSync(path.resolve(root, 'node_modules/tailwindcss/theme.css'), 'utf-8')
      .matchAll(/(--[\w-]+)\s*:/g),
    (m) => m[1],
  ),
);

/**
 * Wideset tokens must never collide with Tailwind's default theme, shadcn, or a consumer's
 * own variables. See src/styles/tokens/README.md → "The `ws` prefix".
 */
describe('Wideset token prefix', () => {
  it('never redefines a Tailwind default theme variable', () => {
    const collisions = definedVariables().filter(({ name }) => tailwindDefaults.has(name));
    expect(collisions).toEqual([]);
  });

  it('prefixes every token with ws', () => {
    // Semantic tokens carry the prefix inside the name (Tailwind builds the class from it);
    // primitives carry it up front, where a consumer overriding them can read it.
    const unprefixed = definedVariables().filter(({ name, file }) => {
      const style = styleForFile(file);
      const styles = style === 'either' ? ['leading', 'namespace'] : [style];
      return !styles.some((s: string) => prefixVariableName(name, s) === name);
    });
    expect(unprefixed).toEqual([]);
  });

  // Vite's CSS pipeline, as used by Storybook: it also drops @imports that follow other
  // statements, which plain PostCSS would not catch. Runs in a child process because
  // esbuild cannot load inside the jsdom test environment. `inline` adds classes that no
  // component uses, so their compiled rules can be asserted.
  const compile = (entry: string, inline = '') => {
    const script = `
      const { preprocessCSS, resolveConfig } = await import('vite');
      const fs = await import('fs');
      const [root, entry, inline] = process.argv.slice(1);
      const from = root + '/src/styles/' + entry;
      const config = await resolveConfig(
        { root, logLevel: 'silent', css: { postcss: root + '/postcss.config.cjs' } },
        'serve',
      );
      const source =
        fs.readFileSync(from, 'utf-8') +
        (inline ? '\\n@source inline("' + inline + '");\\n' : '');
      const { code } = await preprocessCSS(source, from, config);
      process.stdout.write(code);
    `;
    return execFileSync(
      process.execPath,
      ['--input-type=module', '-e', script, root, entry, inline],
      {
        cwd: root,
        maxBuffer: 64 * 1024 * 1024,
      },
    ).toString();
  };

  it('keeps Tailwind defaults working for unprefixed classes', () => {
    // The point of the prefix: a plain `p-4` means Tailwind's 1rem again, not Wideset's
    // 0.375rem, while the Wideset value lives on `p-ws-4`.
    const css = compile('index.css', 'p-4 p-ws-4 gap-2 gap-ws-2 font-medium font-ws-medium');
    const rule = (cls: string) =>
      css
        .match(new RegExp(`\\n\\s*\\.${cls}\\s*\\{([^}]*)\\}`))?.[1]
        .replace(/\s+/g, ' ')
        .trim();

    // theme(inline) means the default scale is inlined: 0.25rem * 4 is Tailwind's 1rem.
    expect(rule('p-4')).toBe('padding: calc(0.25rem * 4);');
    expect(rule('p-ws-4')).toBe('padding: var(--spacing-ws-4);');
    expect(rule('gap-2')).toBe('gap: calc(0.25rem * 2);');
    expect(rule('gap-ws-2')).toBe('gap: var(--spacing-ws-2);');
    expect(rule('font-medium')).toContain('--tw-font-weight: 500');
    expect(rule('font-ws-medium')).toContain('var(--font-weight-ws-medium)');
  }, 60_000);

  it('emits no Tailwind default variables in the compiled theme layer', () => {
    const css = compile('index.css');

    expect(css).toContain('.bg-ws-dynamic-primary-default');
    const themeLayer = css.match(/@layer theme \{([\s\S]*?)\n\}/)?.[1] ?? '';
    const emitted = Array.from(themeLayer.matchAll(/(--[\w-]+)\s*:/g), (m) => m[1]);
    expect(emitted.filter((name) => !name.startsWith('--ws-') && !name.includes('-ws-'))).toEqual(
      [],
    );

    // Consumers override primitives and semantic tokens directly, so every token must reach
    // :root even when no utility references it (`@theme static` in the theme-*.css files).
    const emittedSet = new Set(Array.from(css.matchAll(/(--[\w-]+)\s*:/g), (m) => m[1]));
    const notEmitted = definedVariables()
      .filter(({ file }) => /(^|\/)theme-.*\.css$/.test(file))
      .map(({ name }) => name)
      .filter((name) => !emittedSet.has(name));
    expect(notEmitted).toEqual([]);
  }, 60_000);

  /**
   * styles.css must not touch the consumer's page: no reset, no font loading, no Tailwind font
   * variables.
   */
  it('keeps preflight and fonts out of styles.css', () => {
    const css = compile('index.css');
    expect(css).not.toContain('googleapis');
    expect(css).not.toMatch(/--font-(sans|serif|mono)\s*:/);
    expect(css).not.toContain(':-moz-ui-invalid'); // preflight marker
    expect(css).toContain('--font-ws-sans');
  }, 60_000);

  it('ships the reset in preflight.css without theme variables', () => {
    const css = compile('preflight.css');
    expect(css).toContain(':-moz-ui-invalid');
    expect(css).not.toContain('--theme(');
    expect(css).not.toMatch(/--[\w-]+\s*:/);
  }, 60_000);

  // Components inherit the page font, so nothing in src/ uses these. Consumers do — README and
  // the Typography docs point at them — so they have to survive tree-shaking into styles.css.
  it('ships the opt-in font classes and their variables', () => {
    const css = compile('index.css', 'font-ws-heading font-ws-body font-ws-sans font-ws-mono');
    for (const name of ['sans', 'heading', 'body', 'mono']) {
      expect(css).toMatch(new RegExp(`\\.font-ws-${name}\\s*\\{[^}]*var\\(--font-ws-${name}\\)`));
      expect(css).toMatch(new RegExp(`--font-ws-${name}\\s*:`));
    }
  }, 60_000);

  // Layer order is fixed by first appearance, so both entries must declare the same list:
  // otherwise importing preflight first pushes Tailwind's `properties` layer past `utilities`.
  it('declares the same layer order in both entries', () => {
    const declared = (entry: string) =>
      fs
        .readFileSync(path.resolve(stylesDir, entry), 'utf-8')
        .match(/@layer\s+([a-z,\s]+);/)?.[1]
        .replace(/\s+/g, ' ');

    expect(declared('index.css')).toBe('properties, theme, base, components, utilities');
    expect(declared('preflight.css')).toBe(declared('index.css'));
  });

  /**
   * theme.css is the Tailwind v4 export: source tokens and utilities a consumer compiles in
   * their own build, with no preflight, no component CSS and no unresolved relative imports.
   */
  it('compiles ws utilities from theme.css alone', () => {
    // How a Tailwind v4 consumer uses the export: their own `tailwindcss` import, then ours.
    const entry = '.theme-consumer.test.css';
    fs.writeFileSync(
      path.resolve(stylesDir, entry),
      "@import 'tailwindcss' source(none);\n@import './theme.css';\n",
    );
    let css: string;
    try {
      css = compile(entry, 'bg-ws-dynamic-primary-default p-ws-4 typography-body-md');
    } finally {
      fs.rmSync(path.resolve(stylesDir, entry));
    }
    expect(css).toContain('.bg-ws-dynamic-primary-default');
    expect(css).toContain('.p-ws-4');
    expect(css).toContain('.typography-body-md');

    // The reset above comes from the consumer's own `tailwindcss` import, never from ours:
    // theme.css pulls in tokens and utilities only.
    const source = fs.readFileSync(path.resolve(stylesDir, 'theme.css'), 'utf-8');
    expect(source).not.toMatch(/@import[^;]*preflight/);
    expect(source).not.toMatch(/@import[^;]*overrides/);
  }, 60_000);
});
