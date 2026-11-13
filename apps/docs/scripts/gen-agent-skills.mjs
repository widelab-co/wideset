/**
 * The Agent Skills discovery endpoint, so `npx skills add https://wideset.co` works without a
 * public repository. Same shape as gen-registry: built from packages/skills on every docs build,
 * and never committed. Uses the per-file index the skills CLI reads: `{ skills: [{ name,
 * description, files }] }`, with each file served next to it.
 *
 * Output: public/.well-known/agent-skills/index.json and <skill>/<file> (git-ignored)
 */
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { listSkills, SKILLS_DIR } from '../../../packages/skills/scripts/skill-files.mjs';
import { docs } from './paths.mjs';

/** Writes the endpoint into `out`, the `agent-skills` folder itself. */
export function writeAgentSkills(out) {
  const skills = listSkills();
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  for (const { name } of skills)
    cpSync(join(SKILLS_DIR, name), join(out, name), { recursive: true });
  writeFileSync(join(out, 'index.json'), `${JSON.stringify({ skills }, null, 2)}\n`);
  return skills;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const skills = writeAgentSkills(join(docs, 'public', '.well-known', 'agent-skills'));
  console.log(`agent skills: ${skills.length} skills`);
}
