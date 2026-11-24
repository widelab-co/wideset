---
name: wideset-visual-shots
description: Before/after screenshots of anything visual in Wideset — Storybook stories, docs site pages, or any app a command serves — with a pixel-difference report, the working tree against any git ref (a PR's base, develop, an earlier commit), light and/or dark. Use to show what a PR or change looks like, when reviewing or taking over a PR, when asked for screenshots "przed/po", or to check that a refactor changed nothing visually.
license: Apache-2.0
metadata:
  internal: true
---

# Visual shots

Serves the working tree and, with `--ref`, that ref in a temporary `git worktree`, screenshots
each story or page in headless Chrome and writes PNG pairs, a red-on-grey diff picture and an
`index.html` sorted by how much changed. No dependencies: Node 22+ and Google Chrome, found in
its default place on macOS and Linux (`CHROME=/path/to/binary` otherwise). It starts servers
through `sh`, so on Windows run it from WSL.

Run it from the Wideset checkout whose tree is "after" (the PR branch, checked out). Pick the
**app** by what the change touches:

| Change touches                                                    | `--app`     | What to shoot                             |
| ----------------------------------------------------------------- | ----------- | ----------------------------------------- |
| components, tokens, styles, blocks (`packages/design-system/src`) | `storybook` | `--stories <id prefix>` or `--ids <file>` |
| the docs site (`apps/docs`), or specs it renders                  | `docs`      | `--paths /,/docs/cli` or `--pages <file>` |
| anything else that serves pages (a Vite or Next.js app, …)        | `custom`    | `--cmd '<serves on {port}>'` + `--paths`  |

```bash
node .agents/skills/wideset-visual-shots/scripts/shots.mjs \
  --ref origin/develop --stories starting-points-- --out <dir>/shots
node .agents/skills/wideset-visual-shots/scripts/shots.mjs \
  --app docs --ref origin/develop --paths /,/blocks,/components/button --full-page --out <dir>/shots
```

For a docs change, map the changed files to their pages first (`apps/docs/src/content/docs/x.mdx`
→ `/docs/x`, a component's examples → `/components/<page>`, a spec → the page that renders it).
Then read the summary it prints, open `<out>/index.html` for the user, and look at the `diff/`
pictures of the top rows yourself (Read the PNG) before saying what changed.

## Flags

| Flag                            | Default                       | Meaning                                                                |
| ------------------------------- | ----------------------------- | ---------------------------------------------------------------------- |
| `--ref <git ref>`               | none                          | "before" side; without it only the working tree is shot                |
| `--app storybook\|docs\|custom` | `storybook`                   | what to serve and how a shot is addressed                              |
| `--stories <prefix>`            | every story                   | story id prefix, e.g. `starting-points--`, `components-button--`       |
| `--ids <file>`                  |                               | one story id per line, instead of `--stories`                          |
| `--paths <a,b>`                 |                               | `docs`/`custom`: page paths, comma-separated                           |
| `--pages <file>`                |                               | `docs`/`custom`: one page path per line, instead of `--paths`          |
| `--cmd '<command>'`             |                               | `custom`: the command that serves the app; `{port}` is replaced        |
| `--ready-path <path>`           | `/`                           | `custom`: polled until it answers 200                                  |
| `--full-page`                   | off                           | the whole page height instead of the viewport (long docs pages)        |
| `--out <dir>`                   | `$TMPDIR/visual-shots/<time>` | output; a folder outside the repository (an agent's scratchpad)        |
| `--theme light\|dark\|both`     | `light`                       | `prefers-color-scheme` and the `light`/`dark` class on `<html>`        |
| `--width`, `--height`           | `1440`, `900`                 | viewport                                                               |
| `--url`, `--ref-url`            |                               | use a server already running (e.g. `http://localhost:6006`) for a side |
| `--port`, `--ref-port`          | `6106`, `6107`                | ports for the servers it starts                                        |
| `--parallel`                    | `3`                           | tabs at once                                                           |
| `--threshold <pixels>`          | `0`                           | rows with at most this many differing pixels count as unchanged        |
| `--keep`                        | off                           | keep the `--ref` worktree (path is printed) for a faster rerun by hand |

Story ids are in `http://localhost:<port>/index.json`, or derived from the title: `Starting
points/Calendar` → `starting-points--calendar`.

## What it does for stable shots

- Storybook: waits until `body.sb-show-main` and `#storybook-root` has children (up to 60 s, which
  covers Vite's first compile), then `document.fonts.ready` and 2.5 s, and opens
  `iframe.html?id=…&viewMode=story` so the manager UI never appears. A story that never renders is
  listed with "did not render" instead of a screenshot of the spinner.
- Other pages: waits for the load, then until the DOM has been quiet for 500 ms (up to 20 s),
  fonts, and 1 s.
- Everywhere: `prefers-reduced-motion: reduce`, transitions and animations forced to their end
  state, caret hidden, and focus emulated in every tab (otherwise an autofocused field shows its
  ring only in one tab and the pair differs at random).
- A state that needs a click (a menu open, a run stopped) is not shot: say so, or describe it.

## Reading the result

- `pct` and `px`: share and count of pixels whose RGB differs by more than 24 in total.
- **Noise:** a few pixels (≈ 4–30) on an unchanged story is antialiasing; live content (the call
  timer in `starting-points--call`, anything showing "now") differs every run. Check the diff
  picture before reporting it; `--threshold 50` hides it.
- A two-word text change on a 1440×900 screen is ≈ 900 px (0.07 %), so never judge by percent.
- "not in before/after": the story or page exists on one side only (new or removed).
- `size changed`: the screenshots have different dimensions (common with `--full-page` when the
  page grew); compare the two pictures by eye.

## Cost and cleanup

With `--ref`, expect 1–2 minutes before the first shot (`pnpm install --offline` in the worktree,
two servers), then about 1 s per shot per theme with 3 tabs. Both servers, Chrome and the worktree
are removed on exit, also on Ctrl+C; check with `git worktree list` if a run was killed. If a port
is taken, it stops and says so: pass `--url` to use that server or another `--port`. Other
sessions run Storybooks too: pick ports nobody uses, and stop only processes you started.
