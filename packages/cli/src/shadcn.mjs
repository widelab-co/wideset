/*
  Runs the shadcn CLI at the version this package's devDependencies pin: the one the registry is
  smoke-tested against, so `wideset add` never picks up a shadcn release nobody has tested. shadcn
  is fetched by npx only when the CLI runs, so apps that use the library never install it.
*/
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

import { CliError } from './registry.mjs';

export const SHADCN_VERSION = createRequire(import.meta.url)('../package.json').devDependencies
  .shadcn;

// Item names come from the registry (`add --all`), and on Windows npx runs through a shell, so
// anything outside this grammar could be read as shell syntax. Names, flags and `@scope/name`
// addresses all fit it.
const SAFE_ARG = /^[A-Za-z0-9@][A-Za-z0-9@._/=:-]*$|^--?[a-z][a-z-]*$/;

export function assertSafeArgs(args) {
  const unsafe = args.filter((arg) => !SAFE_ARG.test(arg));
  if (unsafe.length) {
    throw new CliError(`Refusing to pass unexpected characters to shadcn: ${unsafe.join(' ')}`);
  }
}

export function runShadcn(args, { cwd }) {
  assertSafeArgs(args);
  return new Promise((done, reject) => {
    // When this CLI itself runs through npx, npx leaves its own package list in the environment
    // (npm_config_package) and a nested `npx shadcn@x` would read it and look for a command named
    // "shadcn@x". Name the package explicitly and drop the inherited setting.
    const env = { ...process.env };
    delete env.npm_config_package;
    delete env.npm_config_call;
    const child = spawn(
      'npx',
      ['--yes', `--package=shadcn@${SHADCN_VERSION}`, '--', 'shadcn', ...args],
      {
        cwd,
        env,
        stdio: 'inherit',
        // npx is npx.cmd on Windows, which only runs through a shell.
        shell: process.platform === 'win32',
      },
    );
    child.on('error', reject);
    child.on('close', (status) =>
      // shadcn has already printed what went wrong; no stack trace on top of it.
      status === 0 ? done() : reject(new CliError(`shadcn ${args[0]} failed (see above).`)),
    );
  });
}
