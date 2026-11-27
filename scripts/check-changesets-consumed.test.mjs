// Cases for scripts/check-changesets-consumed.sh, in both modes. An empty changeset (front matter
// that @changesets/parse reads as zero releases) is dropped and passes; anything else is listed as
// unconsumed and fails. CI runs it in the `build` job: node --test 'scripts/*.test.mjs'
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, describe, it } from 'node:test';

const script = join(import.meta.dirname, 'check-changesets-consumed.sh');
const root = mkdtempSync(join(tmpdir(), 'changesets-consumed-'));
after(() => rmSync(root, { recursive: true, force: true }));

let n = 0;
/** Runs the script on a .changeset/ holding `files` (name → contents). */
function run(mode, files) {
  const cwd = join(root, String(n++));
  mkdirSync(join(cwd, '.changeset'), { recursive: true });
  writeFileSync(join(cwd, '.changeset', 'README.md'), '# Changesets\n');
  for (const [name, contents] of Object.entries(files)) {
    writeFileSync(join(cwd, '.changeset', name), contents);
  }
  const { status, stdout, stderr } = spawnSync('bash', [script, ...(mode ? [mode] : [])], {
    cwd,
    encoding: 'utf8',
  });
  const kept = (name) => existsSync(join(cwd, '.changeset', name));
  return { status, output: stdout + stderr, kept };
}

const empty = {
  'pnpm changeset --empty': '---\n---\n\nInternal refactor\n',
  'CRLF line endings': '---\r\n---\r\n\r\nInternal refactor\r\n',
  'a blank line': '---\n\n---\n\nInternal refactor\n',
  'an empty mapping': '---\n{}\n---\n\nInternal refactor\n',
  'an empty mapping with spaces': '---\n{ }\n---\n\nInternal refactor\n',
  'an empty mapping with an inline comment':
    '---\n{} # internal-only change\n---\n\nInternal refactor\n',
  'a comment only': '---\n# nothing to release\n---\n\nInternal refactor\n',
  'a YAML null': '---\n~\n---\n\nInternal refactor\n',
  'a YAML null with an inline comment': '---\nnull # nothing\n---\n\nInternal refactor\n',
  'blank lines before the front matter': '\n---\n---\n\nInternal refactor\n',
};

const pending = {
  'a package': '---\n"@wideset/react": patch\n---\n\nFix the focus ring\n',
  'a package with CRLF line endings': '---\r\n"@wideset/react": minor\r\n---\r\n\r\nAdd a size\r\n',
  'a package with an inline comment': '---\n"@wideset/react": patch # focus ring\n---\n\nFix\n',
  'a package after a comment': '---\n# focus ring\n"wideset": patch\n---\n\nFix\n',
  'a package released as none': '---\n"@wideset/react": none\n---\n\nNothing\n',
  'unclosed front matter': '---\n\nInternal refactor\n',
  'no front matter': 'Internal refactor\n',
};

for (const mode of ['pr', 'release']) {
  describe(`check-changesets-consumed.sh ${mode}`, () => {
    for (const [label, contents] of Object.entries(empty)) {
      it(`drops a changeset with ${label} and passes`, () => {
        const r = run(mode, { 'x.md': contents });
        assert.equal(r.status, 0, r.output);
        assert.equal(r.kept('x.md'), false);
      });
    }

    for (const [label, contents] of Object.entries(pending)) {
      it(`fails on a changeset with ${label} and names it`, () => {
        const r = run(mode, { 'x.md': contents });
        assert.equal(r.status, 1, r.output);
        assert.match(r.output, /::error file=\.changeset\/x\.md::/);
      });
    }

    it('drops the empty changesets and lists only the others', () => {
      const r = run(mode, {
        'a.md': empty['pnpm changeset --empty'],
        'b.md': empty['an empty mapping with an inline comment'],
        'c.md': pending['a package'],
      });
      assert.equal(r.status, 1, r.output);
      assert.deepEqual([r.kept('a.md'), r.kept('b.md'), r.kept('c.md')], [false, false, true]);
      assert.match(r.output, /did not consume \(1\)/);
    });

    it('passes when only the README is left', () => {
      assert.equal(run(mode, {}).status, 0);
    });
  });
}

it('exits 2 with the usage when the mode is missing or unknown', () => {
  for (const mode of [undefined, 'main']) {
    const r = run(mode, {});
    assert.equal(r.status, 2);
    assert.match(r.output, /usage: check-changesets-consumed\.sh pr\|release/);
  }
});
