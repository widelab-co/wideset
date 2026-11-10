# @wideset/skills

[Agent Skills](https://agentskills.io) for building apps with [Wideset](https://wideset-docs.widelab.workers.dev). They tell Claude Code, Codex, Cursor and other agents what component source cannot: which component fits, how components combine, what breaks without an error and what a finished screen should look like.

The patterns, the component group pages and each component's good practices are copied from the library's specs, so they match the version they ship with. Props, foundations and tokens are not copied: agents read component source and the docs site (`https://wideset-docs.widelab.workers.dev/components/<id>.md`, `https://wideset-docs.widelab.workers.dev/docs/tokens.md`), and `wideset-craft` holds the rules from the foundations in short.

## Install

| Channel                        | Command                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------ |
| shadcn registry                | `npx shadcn@latest add https://wideset-docs.widelab.workers.dev/r/skills.json` |
| Skills CLI                     | `npx skills add widelab-co/wideset/packages/skills`                            |
| Skills CLI, from the docs site | `npx skills add https://wideset-docs.widelab.workers.dev`                      |
| Wideset CLI                    | `npx wideset skills`                                                           |
| npm                            | `npm install -D @wideset/skills`, then `npx skills experimental_sync -y`       |

The Wideset CLI adds the skills to `.agents/skills/`, and to `.claude/skills/` when the project uses Claude Code. It writes `AGENTS.wideset.md` and points your `AGENTS.md` at it with one line. Running it again updates the files and changes nothing else. With the shadcn registry, add that line yourself: `See AGENTS.wideset.md for Wideset rules.` For Claude Code, also add `https://wideset-docs.widelab.workers.dev/r/skills-claude.json`, and `@AGENTS.wideset.md` to `CLAUDE.md`.

The plugin channels need the repository to be public, and the npm channel needs the package to be published and Node 22.20 or later.

## What you get

| Skill            | Covers                                                                               |
| ---------------- | ------------------------------------------------------------------------------------ |
| `wideset-setup`  | Package or registry, stylesheets, Tailwind v4, Next.js Server Components, rebranding |
| `wideset-build`  | Choosing components, good practices per component, patterns, what still breaks       |
| `wideset-craft`  | Rules for a designed screen: sizes, spacing, surfaces, defaults, anti-slop list      |
| `wideset-review` | Review with a verdict and fixes, using the two reviewer agents when installed        |

The plugin channels and the `skills-claude` item also install two agents: `wideset-ui-reviewer` and `wideset-theme-reviewer`.

## Contributing

Usage guidance lives in [`packages/design-system/specs`](../design-system/specs/README.md); the foundations, the tokens page and the rest of each component spec there feed the docs site and are not copied into the skill. From a component spec the skill ships only `When to use`, `When not to use`, `Do / Don't` and `Gotchas`, as `references/good-practices/<id>.md`. A change to a foundation's rule also belongs in `skills/wideset-craft/references/foundations.md`, which is written by hand. `skills/wideset-build/references/specs/`, `skills/wideset-build/references/good-practices/`, `skills/wideset-build/references/good-practices.md`, `skills/wideset-build/references/registry-imports.md`, `AGENTS.wideset.md`, `cursor/wideset.mdc` and `agents/` are generated. Run `pnpm build:skills` from the repository root after changing a spec, and edit `templates/` or the `SKILL.md` files for the rest.

```bash
pnpm build:skills     # regenerate
pnpm --filter @wideset/skills test
pnpm --filter @wideset/skills validate   # Agent Skills spec, needs uv
pnpm test:skills      # install through npm, the skills CLI and the docs' well-known endpoint
```

Evals live in `evals/`; see `evals/README.md`.

## License

Apache-2.0, with a `NOTICE` file. Keep `LICENSE` and `NOTICE` with any copy you redistribute.
