import { execFileSync } from 'child_process';
import path from 'path';

const root = path.resolve(__dirname, '../..');

/**
 * Compiles a theme entry in src/styles/ through Vite's CSS pipeline, as Storybook does: it also
 * drops @imports that follow other statements, which plain PostCSS would not catch. Runs in a
 * child process because esbuild cannot load inside the jsdom test environment. `inline` adds
 * classes (space-separated) that no component uses, so their compiled rules can be asserted.
 */
export const compileCss = (entry: string, inline = '') => {
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
