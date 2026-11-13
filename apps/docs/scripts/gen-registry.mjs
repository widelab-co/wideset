/**
 * The registry items the CLI installs, built by the library's own builder into the docs'
 * generated folder, so the Install section's Manual tab shows exactly the files and
 * packages `npx wideset add` would write. Needs the library's dist/ (the styles item ships
 * dist/*.css), which every docs task builds first.
 *
 * The same items are the public shadcn registry: copied to public/r, the site serves them at
 * `<site>/r/{name}.json` (wideset.co/r in production). REGISTRY_URL is the address this
 * build is served from; the deploy job in build.yaml sets it per environment.
 *
 * Output: src/generated/registry/<item>.json and public/r/<item>.json (both git-ignored)
 */
import { cpSync, rmSync } from 'node:fs';
import { join } from 'node:path';

import {
  buildRegistry,
  resolveBaseUrl,
} from '../../../packages/design-system/scripts/build-registry.mjs';
import { docs, generatedDir, library } from './paths.mjs';

const out = join(generatedDir, 'registry');
const { items } = buildRegistry({ root: library, out, base: resolveBaseUrl() });

const publicDir = join(docs, 'public', 'r');
rmSync(publicDir, { recursive: true, force: true });
cpSync(out, publicDir, { recursive: true });
console.log(`registry: ${items.length} items (${resolveBaseUrl()})`);
