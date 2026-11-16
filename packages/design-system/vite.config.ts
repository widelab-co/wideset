import react from '@vitejs/plugin-react-swc';
import { existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
import { dirname, resolve } from 'path';
import postcss from 'postcss';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

const require = createRequire(import.meta.url);
const tailwindcssPlugin = require('@tailwindcss/postcss');

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const isLibrary = mode === 'library';

  if (isLibrary) {
    return {
      plugins: [
        react(),
        tsconfigPaths(),
        dts({
          insertTypesEntry: true,
          rollupTypes: true,
          exclude: [
            '**/*.test.ts',
            '**/*.test.tsx',
            '**/*.stories.tsx',
            '**/examples/**',
            'src/stories/**',
            '**/__snapshots__/**',
            '**/__tests__/**',
          ],
        }),
        {
          name: 'process-css',
          async writeBundle() {
            try {
              const distDir = resolve(__dirname, 'dist');
              const stylesSrcDir = resolve(__dirname, 'src/styles');
              const tokensSrcDir = resolve(stylesSrcDir, 'tokens');

              const allThemeFiles = [
                'theme-base-tokens.css',
                'theme-light-tokens.css',
                'theme-light-semantic.css',
                'theme-dark-tokens.css',
                'theme-dark-semantic.css',
                'theme-desktop-tokens.css',
                'theme-desktop-semantic.css',
              ];

              const semanticFiles = [
                'theme-light-semantic.css',
                'theme-dark-semantic.css',
                'theme-desktop-semantic.css',
              ];

              const utilityClassNames = new Set<string>();
              const themeFileContents = new Map<string, string>();

              for (const file of allThemeFiles) {
                const filePath = resolve(tokensSrcDir, file);
                if (existsSync(filePath)) {
                  const fileContent = readFileSync(filePath, 'utf-8');
                  themeFileContents.set(file, fileContent);

                  if (semanticFiles.includes(file)) {
                    const colorPatterns = [
                      { pattern: /--background-color-([^:]+):/g, prefix: 'bg-' },
                      { pattern: /--text-color-([^:]+):/g, prefix: 'text-' },
                      { pattern: /--border-color-([^:]+):/g, prefix: 'border-' },
                      { pattern: /--outline-color-([^:]+):/g, prefix: 'outline-' },
                      { pattern: /--fill-([^:]+):/g, prefix: 'fill-' },
                      { pattern: /--stroke-([^:]+):/g, prefix: 'stroke-' },
                      { pattern: /--decoration-([^:]+):/g, prefix: 'decoration-' },
                    ];

                    for (const { pattern, prefix } of colorPatterns) {
                      const matches = Array.from(fileContent.matchAll(pattern));
                      for (const match of matches) {
                        const varName = match[1].trim();
                        utilityClassNames.add(`${prefix}${varName}`);
                      }
                    }
                  }

                  if (file === 'theme-desktop-semantic.css') {
                    const radiusPattern = /--radius-([^:]+):/g;
                    const matches = Array.from(fileContent.matchAll(radiusPattern));
                    for (const match of matches) {
                      const varName = match[1].trim();
                      utilityClassNames.add(`rounded-${varName}`);
                    }
                  }
                }
              }

              const utilitiesDir = resolve(stylesSrcDir, 'utilities');
              if (existsSync(utilitiesDir)) {
                const utilityFiles = readdirSync(utilitiesDir).filter((f) => f.endsWith('.css'));
                for (const file of utilityFiles) {
                  const filePath = resolve(utilitiesDir, file);
                  const fileContent = readFileSync(filePath, 'utf-8');

                  const utilityMatches = Array.from(fileContent.matchAll(/@utility\s+([^\s{]+)/g));
                  for (const match of utilityMatches) {
                    const utilityName = match[1].trim();
                    utilityClassNames.add(utilityName);
                  }
                }
              }

              // Wideset spacing utilities (p-ws-4, gap-ws-control-md, …) for every --spacing-ws-* token.
              // Plain Tailwind spacing (p-4 = 1rem) is deliberately not shipped: it would collide
              // with the consumer's own Tailwind build.
              const desktopSemantic = themeFileContents.get('theme-desktop-semantic.css') ?? '';
              const spacingSuffixes = Array.from(
                desktopSemantic.matchAll(/--spacing-(ws-[^:]+):/g),
                (match) => match[1].trim(),
              );
              for (const suffix of spacingSuffixes) {
                [
                  'p',
                  'px',
                  'py',
                  'pt',
                  'pr',
                  'pb',
                  'pl',
                  'm',
                  'mx',
                  'my',
                  'mt',
                  'mr',
                  'mb',
                  'ml',
                  'space-x',
                  'space-y',
                  'gap',
                ].forEach((util) => {
                  utilityClassNames.add(`${util}-${suffix}`);
                });
              }

              // Tailwind v4: @tailwindcss/postcss ignores the JS `content` option.
              // Inject an @source inline(...) directive so the generated utility classes
              // are included in the output without writing a temporary file.
              // Ship only classes that components use. Classes from stories, tests and docs pages
              // would otherwise land in the package and clash with the consumer's own utilities.
              const nonComponentSources = [
                '../**/*.stories.tsx',
                '../**/*.test.ts',
                '../**/*.test.tsx',
                '../**/__snapshots__',
                '../**/*.figma-spec.json',
                '../**/*.mdx',
                '../stories',
                '../__tests__',
                '../app',
                '../main.tsx',
                '../App.tsx',
              ]
                .map((glob) => `@source not '${glob}';\n`)
                .join('');
              // Opt-in font classes: no component uses them (components inherit the page font),
              // but README and the Storybook docs tell consumers to reach for them.
              utilityClassNames.add('font-ws-sans');
              utilityClassNames.add('font-ws-heading');
              utilityClassNames.add('font-ws-body');
              utilityClassNames.add('font-ws-mono');

              const inlineSource =
                `\n@source inline("${Array.from(utilityClassNames).join(' ')}");\n` +
                nonComponentSources;

              // `extraSources` is appended, never prepended: the entry's own @import statements
              // must stay above every other statement (see the comment at the top of index.css).
              const compile = async (entry: string, extraSources = '') => {
                const from = resolve(stylesSrcDir, entry);
                const { css } = await postcss([tailwindcssPlugin()]).process(
                  readFileSync(from, 'utf-8') + extraSources,
                  { from, to: resolve(distDir, entry) },
                );
                return css;
              };

              // styles.css: tokens, component CSS and used Tailwind classes. No preflight, no font.
              writeFileSync(
                resolve(distDir, 'styles.css'),
                await compile('index.css', inlineSource),
              );

              // preflight.css: Tailwind's browser reset, for consumers without Tailwind.
              writeFileSync(resolve(distDir, 'preflight.css'), await compile('preflight.css'));

              // theme.css: uncompiled @theme / @utility source for consumers on Tailwind v4.
              // Relative imports are inlined so the export is a single file.
              const inlineImports = (file: string, seen: string[] = []): string => {
                if (seen.includes(file)) {
                  throw new Error(`Circular @import in theme.css: ${[...seen, file].join(' -> ')}`);
                }
                return readFileSync(file, 'utf-8').replace(
                  /@import\s+(?:url\()?['"](\.[^'"]+)['"]\)?[^;]*;/g,
                  (_, rel: string) => inlineImports(resolve(dirname(file), rel), [...seen, file]),
                );
              };
              const themeCss = inlineImports(resolve(stylesSrcDir, 'theme.css'));
              // A relative @import left in the published file would 404 for the consumer.
              const leftoverImport = themeCss
                .replace(/\/\*[\s\S]*?\*\//g, '')
                .match(/@import\s+(?:url\()?['"]\.[^'"]+/);
              if (leftoverImport) {
                throw new Error(`theme.css still imports ${leftoverImport[0]} — inlining failed`);
              }
              writeFileSync(resolve(distDir, 'theme.css'), themeCss);

              for (const name of ['styles', 'preflight', 'theme']) {
                writeFileSync(resolve(distDir, `${name}.d.ts`), 'export {};\n');
              }

              const distFiles = readdirSync(distDir);
              for (const file of distFiles) {
                const filePath = resolve(distDir, file);
                if (statSync(filePath).isFile()) {
                  if (['vite.svg', 'logo.svg', 'tokens_figma.css'].includes(file)) {
                    rmSync(filePath);
                  }
                } else {
                  if (file === 'deprecated') {
                    rmSync(filePath, { recursive: true, force: true });
                  }
                }
              }
            } catch (err) {
              console.error('Could not process CSS files:', err);
              throw err;
            }
          },
        },
      ],
      build: {
        lib: {
          entry: {
            index: resolve(__dirname, 'src/index.ts'),
            // Server-safe entry: cn() without the 'use client' boundary of the main bundle.
            utils: resolve(__dirname, 'src/lib/utils.ts'),
          },
          name: 'WidelabDesignSystem',
          formats: ['es', 'cjs'],
        },
        rollupOptions: {
          external: ['react', 'react-dom', 'react/jsx-runtime'],
          // One file per module, so bundlers ship only the components a consumer imports.
          // package.json has "type": "module", so the extension decides how Node loads a file:
          // .mjs is ESM, .cjs is CommonJS. A shared ".js" would make the CJS build unloadable.
          output: (['es', 'cjs'] as const).map((format) => ({
            format,
            preserveModules: true,
            preserveModulesRoot: 'src',
            entryFileNames: (chunk: { name: string }) => {
              // npm pack drops any folder named node_modules; bundled dependencies live in vendor/.
              // pnpm resolves a dependency through its virtual store
              // (node_modules/.pnpm/<name@version>/node_modules/<name>/…), so the module path is
              // taken from the last node_modules/ segment: vendor/<name>/… for every package manager.
              const name = chunk.name
                .replace(/^(?:.*node_modules\/)/, 'vendor/')
                .replace(/^\.\.\//, '');
              return `${name}.${format === 'es' ? 'mjs' : 'cjs'}`;
            },
            // Components use context, state and event handlers, so each one is a client module
            // for React Server Components (Next.js App Router). Rollup drops directives found
            // inside source files; the banner is the supported way to keep one. It goes on leaf
            // modules only: a 'use client' barrel makes every client reference point at the whole
            // barrel, so Next would bundle the entire library for one imported component.
            banner: (chunk: { name: string; facadeModuleId: string | null }) =>
              chunk.facadeModuleId &&
              chunk.name !== 'index' &&
              !/[\\/]src[\\/]lib[\\/]/.test(chunk.facadeModuleId) &&
              !/node_modules/.test(chunk.facadeModuleId)
                ? "'use client';"
                : '',
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
            },
          })),
        },
        // public/ holds Storybook's static assets; none of it is part of the npm package.
        copyPublicDir: false,
        cssCodeSplit: false,
        sourcemap: true,
      },
    };
  }

  return {
    plugins: [react(), tsconfigPaths()],
  };
});
