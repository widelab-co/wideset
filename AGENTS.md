# Wideset — agent instructions

Wideset (`@wideset/react`) is a React component library: Radix primitives + Tailwind CSS v4 +
class-variance-authority, documented in Storybook, tested with Vitest. The repository is a pnpm
workspace run by Turborepo: the library lives in `packages/design-system/`.
Node 22 (`.nvmrc`; pnpm 11 needs ≥ 22.13), pnpm (version pinned in `packageManager`).
Use only pnpm for repository dependencies (`pnpm install`); never `npm install` or another package manager.

These instructions are for anyone or anything editing this repository. Consumer docs live in
[the package README](packages/design-system/README.md) and Storybook; contributor process in
[CONTRIBUTING.md](CONTRIBUTING.md).

## Commands

Run from the repository root. Package tasks run through Turborepo; Prettier uses the shared root config.

```bash
pnpm install         # install
pnpm storybook       # Storybook on http://localhost:6006 (the dev environment)
pnpm test            # Vitest, full suite
pnpm --filter @wideset/react exec vitest run src/components/button/Button.test.tsx   # one file
pnpm typecheck       # tsc --noEmit  (pnpm build does NOT type-check)
pnpm lint            # ESLint, every package (shared rules in the root .eslintrc.json)
pnpm prettier        # Prettier check, the whole workspace (one root config)
pnpm format          # prettier --write + eslint --fix
pnpm build:lib       # library build → packages/design-system/dist/ (check dist/index.d.ts after adding exports)
pnpm changeset       # add a changeset for a consumer-facing change
pnpm build:registry  # shadcn registry → packages/design-system/public/r/ (runs build:lib first; the registry ships dist/*.css)
pnpm test:registry   # install registry items into fresh Vite and Next.js apps, type-check and build
pnpm playground      # build + serve the registry, refresh packages/design-system/playground/, run it on http://localhost:5174
pnpm test:cli        # the wideset CLI (packages/design-system/cli) on fresh create-vite / create-next-app projects
pnpm build:skills    # regenerate packages/skills from the library (part of pnpm build)
pnpm test:skills     # the skills' npm, skills CLI and well-known channels, in fresh projects
```

CI runs lint, prettier, typecheck, build, test and a Storybook build on every PR. Run
`pnpm typecheck && pnpm test` before declaring work done; pre-commit hooks only touch staged files.
`pnpm test` needs `packages/design-system/dist/` (the registry test reads `dist/*.css`, and the
client-boundary test reads the built modules); the registry test runs `pnpm build:lib` itself when
`dist/styles.css` is missing.
After changing build config or exports, run `pnpm build:lib && pnpm test` explicitly: an existing
`dist/` may be stale, and the client-boundary test skips when no build is present.

## Layout

Repository root:

```
packages/design-system/        the library, published as @wideset/react (see below)
packages/skills/               consumer agent skills, @wideset/skills; references are copied from packages/design-system/specs
.claude-plugin/                the Claude Code and Codex plugin marketplace (points at packages/skills)
apps/docs/                     the documentation site (Astro); see apps/docs/README.md
pnpm-workspace.yaml            workspaces, dependency overrides, approved install scripts
turbo.json                     task pipeline (build, typecheck, lint, prettier, test, build:storybook)
.changeset/                    Changesets config and pending changesets
.agents/skills/                contributor agent skills (code review, conventions, Storybook docs)
```

Inside `packages/design-system/`. Every `src/…` and `.storybook/` path in this file, in
the skills and in the docs is relative to this folder:

```
src/components/<kebab-name>/   one folder per component (see structure below)
src/index.ts                   public entry — a component exists only once exported here
src/styles/                    theme entry points, generated tokens and hand-maintained utilities
src/styles/tokens/README.md    Figma export, token generation and manual shadow maintenance guide
src/lib/utils.ts               cn() + tailwind-merge config for custom size tokens
specs/                         agent-facing usage specs: components by group, foundations, tokens, patterns (specs/README.md)
src/__tests__/                 active gates: named exports, built client boundary, examples
src/app/                       local Vite demo (pnpm --filter @wideset/react dev), not the library entry
cli/                           the `wideset` command the package ships (init / add / list over the shadcn CLI), plain ESM
scripts/build-registry.mjs     shadcn registry build (registry.json lists the entry files); playground/ is the demo consumer app
.storybook/                    Storybook config; preview.tsx auto-wires on* props as actions
```

Generated: `src/styles/tokens/theme-*-semantic.css` by `pnpm generate-semantic-variables`;
`dist/`, `public/r/` and `storybook-static/` by the builds (ignored by Git). Figma exports and
`theme-*-tokens.css` are refreshed through the token guide. Theme entry points and
`src/styles/utilities/*.css` are maintained by hand. Registry copies in `playground/src/` are
generated by `pnpm playground --no-dev` and committed with component changes.

Component folder:

```
Component.tsx              main component, React.forwardRef, displayName set
ComponentSub.tsx           subcomponents, PascalCase with the component prefix
Component.types.ts         all public types + JSDoc on every public prop
Component.variants.ts      CVA variants (never inline in .tsx)
Component.context.tsx      React context when subcomponents need parent state
Component.hooks.tsx / Component.logic.ts   hooks and helpers when needed
Component.stories.tsx      Storybook stories
Component.test.tsx         Vitest + Testing Library; snapshot committed in __snapshots__/
Component.assets.ts        binary assets as data-URL strings (images); never import a .png/.svg file
examples/<page>/           the component's examples: Storybook stories and docs page sections, one
                           file each (see "Storybook and tests"); <page> = kebab of the stories file
```

## Conventions

The full checklist is the `wideset-component-convention` skill. The rules that matter most:

- **API.** Composition over configuration: `<Button><Button.Icon icon={RiCheckLine} /></Button>`,
  not `<Button icon="check" />`. Subcomponents attach as properties **and** are exported by name as `Component` + `Member`
  (`Card.Header` and `CardHeader`): a React Server Component can only use the named form.
  `src/__tests__/named-exports.test.ts` fails when a member has no named export. One public top-level
  component per folder; providers, context and Radix `.Root` stay internal. Names follow siblings
  (`variant`, `size`, `disabled`, `onChange` / `onValueChange`). Props are camelCase even when they
  take a component: `icon={RiCheckLine}`, rendered with `({ icon: Icon }) => <Icon />`. Only
  subcomponents are PascalCase (`Button.Icon`).
- **Types.** Props extend the element or primitive they render
  (`React.ButtonHTMLAttributes<HTMLButtonElement>`, `React.ComponentPropsWithoutRef<typeof Primitive.Root>`).
  Variant types come from `VariantProps<typeof variants>`. Mutually exclusive props are
  discriminated unions.
- **Behaviour.** Forward `ref` and spread `...props` onto the root element. Merge `className` with
  `cn()`. Every rendered part carries `data-slot="<kebab of its export>"` (`TabsList` → `tabs-list`),
  written before `{...props}` so a caller (or a parent part) can override it; the docs anatomy
  picture finds parts by it. Controlled and uncontrolled both work: `isControlled = value !== undefined`, callback
  fires in both modes. Context hooks throw `use{X}Context must be used within a <{X}>`.
- **Styling.** Design tokens only (`bg-ws-dynamic-primary-default`, `text-ws-static-strong`,
  `rounded-ws-control-lg`), never palette classes like `text-gray-900` or raw hex. A Figma value
  with no token means the Figma file needs fixing: report it (see below), do not hardcode it. Radix state via
  `tailwindcss-radix` prefixes (`radix-disabled:`). Raw CSS variables (`bg-(--ws-colors-light-brand-600)`)
  only when no semantic class exists. Confirm custom size tokens are recognised by the `twMerge`
  configuration in `src/lib/utils.ts` (`ws-*` spacing is already covered).
- **`ws` prefix (hard rule).** Never redefine a Tailwind default in `@theme` (`--spacing-4`,
  `--font-weight-medium`, `--font-sans`, `--radius-lg`, …): a consumer's Tailwind config or shadcn
  would silently change. A different value is a new `ws` token. Every token class carries `-ws-`
  (`p-ws-4`, `gap-ws-2`, `z-ws-modal`); plain `p-4` is Tailwind's 1rem, not Wideset's 0.375rem, and no
  Tailwind scale class (`w-64`, `text-sm`, `rounded-lg`) belongs in component code — use a token or
  an arbitrary value. Semantic tokens carry the prefix inside the name so the class reads
  `bg-ws-…`; primitives carry it in front (`--ws-colors-light-brand-600`), which is what consumers
  override. `pnpm prefix-tokens` applies both after pasting from Figma;
  `src/styles/token-prefix.test.ts` fails if a rule is broken.
- **Icons.** No icon files in this repo. Components take an icon _component_ from
  `@remixicon/react` (`icon={RiHeartLine}`); icons size with `text-*` utilities (reset to `1em`) and
  colour with `currentColor`. Never inline an `<svg>` for something Remix already has.
- **Public or internal.** A component is public when `src/index.ts` exports it: it then has a
  docs page, a `registry:ui` item and examples. A building block other components are made of
  (FieldLabel, HelperText, Thumbnail) is internal: not exported, `registry:component`
  in `registry.json` (installed with what uses it, not listed), stories under `Helper Components/`.
- **Registry.** Every component also ships as a shadcn registry item, generated from `src/` by
  `scripts/build-registry.mjs`; the build fails rather than ship something broken. So: a new
  component needs an entry in `registry.json` (entry file only, the rest is found by walking
  imports); only `.ts`/`.tsx` files ship, so binaries go in `Component.assets.ts` as data URLs;
  every npm import must be in `dependencies`, not `devDependencies`; stories, examples, tests and
  Figma specs (`*.figma-spec.json`) must not be reachable from an entry file; types are imported
  with `import type`. After changing a component run `pnpm playground --no-dev` and commit the resulting diff in `packages/design-system/playground/`.
- **Accessibility.** Native elements first; correct `role` otherwise; keyboard support; visible
  focus; `aria-label` on icon-only controls; `useId` for aria relationships; `disabled` vs
  `aria-disabled` chosen deliberately.

## Storybook and tests

- Meta: `satisfies Meta<typeof Component>`, `tags: ['autodocs']`, `component` is the top-level
  component, `parameters.docs.description.component` says when to use it and when not to.
  Its first sentence is also the component's description on the documentation site
  (`apps/docs`), so it starts with one plain sentence that stands alone.
- Prop docs default to JSDoc in `Component.types.ts`; avoid duplicating descriptions in stories.
  Use `argTypes.description` for CVA props, inherited props, and props whose JSDoc the current
  Storybook parser cannot read (including union branches and unrecognised component signatures).
  Keep useful JSDoc for IDE consumers even when this requires a manual Storybook description.
  Do not reshape public types or add documentation-only components to work around the parser.
  Every controllable prop has `table.category` (`Appearance` | `Content` | `Behavior` | `Events`).
  Do not add `action:` to event argTypes; `preview.tsx` instruments `on[A-Z]*` automatically.
- Stories: `Default` first (minimal, with `args`, the Controls playground), then one story per
  axis (`Variants`, `Sizes`, `States`), then `Composition` and dev-only stories (controlled,
  edge cases). No `AllVariants` matrices.
- Examples: each axis story shows a file from `examples/<page>/`:
  `export const Sizes: Story = exampleStory(SizesExample, sizesSource)` (`src/stories/example.ts`;
  `sizesSource` is the file imported with `?raw`). The same file is a section of the component's
  docs page, printed verbatim as its code, so it is consumer code: it imports
  `@wideset/react` (resolved to `src/index.ts` in Storybook, Vitest, tsc and the docs; ESLint
  allows that name only in examples), uses realistic content and `ws` tokens, and starts with a
  JSDoc that is its description in both places. `index.ts` lists the examples in reading order;
  `default.tsx` is the docs playground's stage. Dev-only stories stay in the stories file.
  `src/__tests__/examples.test.tsx` checks the layout, the descriptions, that every example is a
  story and that each renders. See the `wideset-component-docs` skill.
- Tests: `describe` blocks per concern, `screen.getByRole(..., { name })` over test IDs, one
  assertion topic per `it`, verify rest props (`data-*`, `aria-*`, `className`) reach the DOM,
  imports from `vitest`.

## React Server Component boundary

The library build preserves modules. `vite.config.ts` adds a `'use client'` banner to emitted
modules with a facade, except `index`, files under `src/lib/` and bundled dependencies. Components,
hooks and motion modules therefore carry the boundary; the entry barrel and `utils` remain
server-safe. Rollup drops directives from source files, so the output banner is authoritative.
Do not add a client boundary to the barrel: that would make a consumer importing one component
bundle the whole library. Server Components use named subcomponent exports (`CardHeader`), since
accessing `Card.Header` on a client reference is unsupported.
`src/__tests__/client-boundary.test.ts` verifies the built modules; after changing config or
exports, run `pnpm build:lib && pnpm test` against a fresh build.

## Usage specs for agents

`packages/design-system/specs/` tells an agent **building with** Wideset when to use each
component, which variant for which job, how parts compose and what not to do; start at
`specs/README.md`, write by `specs/AUTHORING.md`. Facts stay in the code: a spec names only the
props that decide usage and never disagrees with the types. A change to a component's API,
variants or parts updates its spec in the same PR.

## Figma is the source of truth

Wideset ships as a Figma file first; the code matches it. When Figma and code disagree and the
design intent is legible, fix the code and say what changed. Token values come from Figma exports
(`src/styles/tokens/README.md`); do not hand-edit generated token files. A Figma value
without a token does not go into component code: flag it with its node, variant and property, so
design can bind it.

## Pull requests and releases

- Branch from `develop`, name it `<type>/<description>` (`feature/…`, `fix/…`, `chore/…`).
- Commits: conventional style, e.g. `feat(button): …`, `fix(modal): …`, `docs: …`, `chore(ci): …`.
- A change to a file that ships (`src/` or `cli/`, minus stories, tests, snapshots, Figma specs
  (`*.figma-spec.json`) and `.mdx`/`.md`) needs a changeset (`pnpm changeset`, one consumer-facing
  line), or
  `pnpm changeset --empty` with the reason when nothing is released. The consumer skills
  (`packages/skills/{skills,agents,cursor,AGENTS.wideset.md,.claude-plugin}`) ship too, Markdown
  included, and their references are copied from `packages/design-system/specs`: a change to a spec
  regenerates them, so it needs a changeset as well. The pre-push hook and CI
  enforce it (`scripts/check-changeset.mjs`). Other files are internal and need none. A breaking change to one component's API is not automatically a `major` bump it could be a `minor` bump with a **Breaking** paragraph and a migration example; `major` is a team decision for the library as a whole. Never edit `CHANGELOG.md` or the version by hand; see [RELEASING.md](RELEASING.md).
- Reviewing a PR or branch: the `wideset-code-review` skill (risk zones, three review axes,
  merge verdict).
- Addressing existing PR feedback: the `wideset-pr-review-resolve` skill (requires a PR URL or
  number; local fixes, decisions and reply drafts; publish replies and resolve eligible threads
  only after approval of the concrete batch).
- Keep entries in `src/index.ts` alphabetical and export public types next to their component.
- Do not commit `dist/`, `storybook-static/`, `*.log`, `.env*`, or personal editor state.

## Boundaries

- Do not push, merge, tag, publish or open PRs unless explicitly asked. Never push directly to
  `main` or `develop`; they change only through pull requests (a pre-push hook enforces it).
- Do not change public APIs, shared utilities (`cn`, focus ring, typography utilities) or token
  files as a side effect of another task; propose the change and its blast radius instead.
- Do not add dependencies without saying why; Radix, clsx, tailwind-merge and CVA are bundled,
  everything else is a deliberate decision.
- Do not run `git commit --no-verify` or skip failing checks; fix the cause.
- Do not paste internal links, tokens or credentials into files that ship or are public.

## Skills

There are two sets. **Consumer skills** (`packages/skills`, published as `@wideset/skills`) teach
agents to build apps _with_ Wideset. Guidance is written once in `packages/design-system/specs/`;
`pnpm build:skills` copies the README, patterns and component group READMEs to
`references/specs/`, and writes `references/good-practices/<id>.md` from each component spec: its
title and its When to use, When not to use, Do / Don't and Gotchas, with an entry point at
`references/good-practices.md`. The other sections of a component spec are not shipped. Links to a
foundation become docs `.md` URLs, and
the docs site renders all of it. Never hand-edit
`references/specs/`, `references/good-practices*`, `AGENTS.wideset.md`, `agents/` or `cursor/`; edit the specs, the `SKILL.md` files
and `templates/` instead. After changing a spec, run `pnpm build:skills` and commit the result; CI
fails when the copies are stale. Do not add prop or token references: agents read those from source. The good-practices files are
the one exception to not shipping component specs, and they carry usage only, never a generated
prop or token list.

**Contributor skills** (this repository's own work) carry `metadata.internal: true`, so the skills
CLI does not offer them to consumers.
Contributor skills live in `.agents/skills/` (Agent Skills format) and are read from there by Codex, Cursor,
Copilot, Gemini CLI, Amp and Junie. Claude Code reads them through the `.claude/skills` symlink.
On Windows enable Developer Mode and `git config core.symlinks true` before cloning, or the symlink
checks out as a plain text file.

| Skill                          | Use it for                                                                             |
| ------------------------------ | -------------------------------------------------------------------------------------- |
| `wideset-code-review`          | reviewing a PR, branch or working tree: safety, standards, intent                      |
| `wideset-pr-review-resolve`    | evaluating PR feedback, fixing locally, drafting replies and publishing after approval |
| `wideset-component-convention` | reviewing a component against the conventions above; DS-readiness                      |
| `wideset-storybook-docs`       | formatting rules for Storybook MDX pages (form only, not content)                      |
| `wideset-component-docs`       | a component's docs page: examples, playground and its tuning                           |
| `wideset-component-anatomy`    | a docs page's Anatomy section: composition, look, audit                                |
