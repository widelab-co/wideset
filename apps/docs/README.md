# @wideset/docs

The Wideset documentation site. Astro 7, static output, React only in islands; styled with the
design system's own tokens; component data read from the library at build time.

```bash
pnpm docs:dev        # dev server on http://localhost:4321 (builds the library first)
pnpm docs:build      # static build into apps/docs/dist
pnpm docs:preview    # serve the build
pnpm --filter @wideset/docs test   # the generators' output and the blocks list
pnpm typecheck       # includes `astro check` for this app (run from the repo root)
pnpm lint            # ESLint for this app too (rules shared from the root .eslintrc.json)
pnpm prettier        # one Prettier for the workspace, this app included
```

The site renders the library from its source, one copy for every page: `@wideset/react`
resolves to `packages/design-system/src/index.ts` (`astro.config.mjs`), as it does in Storybook,
Vitest and tsc. Only the stylesheets come from the built package (`@wideset/react/styles`,
`/theme`), which Turborepo builds first.

## The pages

| Address                | What it is                                                                   |
| ---------------------- | ---------------------------------------------------------------------------- |
| `/docs/<name>`         | A guide page (`src/content/docs/<name>.mdx`), with its headings in a rail    |
| `/components`          | Every component as a thumbnail                                               |
| `/components/<id>`     | A component page (below), plus `/components/<id>.md` for models              |
| `/blocks`              | Whole screens to start a product from, by business domain                    |
| `/blocks/<id>`         | One block, live, and its code; `/blocks/<id>.md` and `/blocks.md` for models |
| `/blocks/<id>/preview` | The block alone at the window's size (`?theme=light\|dark`)                  |
| `/docs/playground`     | Redirects old Playground links to the component's Playground tab             |
| `/llms.txt`, `/r/*`    | The docs for models; the shadcn registry                                     |

wideset.co is shared with the landing page: the docs Worker owns only the paths in
`wrangler.jsonc` (`/docs*`, `/components*`, `/blocks*`, …), so Playground sits under
`/docs`. A new top-level path needs a route there, a line in the "Check the deployed host" step of
`.github/workflows/build.yaml` and an exclusion in the zone's Redirect Rule.

**A component page** opens with the title and description and "Copy page" (the page as
Markdown, or handed to a model), then up to four tabs whose content switches in place:

- **Overview:** the component on its stage, with the code for its defaults in the same "View
  code" peek as an example; Installation, one card whose header picks CLI or
  Manual and the package manager; Examples, each a card with the live example and its code; API
  reference, one props table per part; Accessibility, when the component's spec has the section.
- **Code** shows the component's own files from its registry item.
- **Anatomy:** the component drawn 1:1 with each part named beside it, then the parts as a table
  (Part, Renders, Description). Hover highlights the part. Activating its name opens a popup
  with the tokens read from the rendered classes (`src/lib/tokenClasses.ts`) and computed styles.
  Only for a component with two or more parts whose playground does not say `anatomy: false`.
- **Relationships:** the map of what the component is built with and appears beside
  (`gen-graph.mjs`), with a button that widens it to the whole system, then the same as lists:
  "Built with", "Uses <name>", "Appears with". Only for a component the graph links to another.
- **Playground** shows the interactive stage, properties and generated JSX when the component has
  a default example.

A component with only Overview has no tab row. The tab is in the address (`?tab=anatomy`;
Overview has none), set on `html[data-tab]` before first paint, so nothing flashes and Back and
Forward move between tabs. Every panel is in the HTML (`data-tab-panel`, shown by docs.css) and
each tab has its own rail, hidden when the tab has a single section. The page tabs are the only
row of tabs in the page's flow; any other switch sits inside a card or is another control.

## How a page is made

```
scripts/generate.mjs           runs before dev, build, typecheck and test → src/generated/* (git-ignored)
  gen-catalog.mjs              one entry per public component's *.stories.tsx (TypeScript API, not regexes)
  gen-props.mjs                prop tables from the TypeScript types (cva unions, defaults, JSDoc),
                               and controls.json: the unions and booleans the playgrounds switch
  gen-graph.mjs                which components use or appear with which (from imports)
  gen-guidance.mjs             from packages/design-system/specs: the usage sections of the
                               Markdown for models, and the Accessibility notes the page shows
  gen-registry.mjs             the registry items `npx wideset add` installs (Install → Manual)
  gen-light-scope.mjs          the light tokens as a `.docs-light` scope (a stage in the other theme)
  gen-tokens.mjs, gen-token-scales.mjs   the foundation pages' token tables
  generate.test.mjs            node:test checks on what the generators wrote
src/lib/catalog.ts             the generated data as the pages read it
src/lib/sidebar.ts             each page's own sidebar rows (docs, components, blocks)
src/pages/components/[id].astro   one page per catalogue entry
src/lib/examples.ts            a page's examples: the library's examples/<id>/ files, in index.ts order
src/lib/playground.tsx         the playgrounds: the library's examples/<id>/default.tsx + src/playgrounds/<id>.tsx
src/playgrounds/<id>.tsx       optional tuning of a playground (labels, hidden props, dark stage, …)
src/content/docs/*.mdx         guide pages; the file name is the URL (/docs/<name>)
src/lib/blocks.ts              the blocks: the library's manifest (src/blocks/index.ts), their files, the categories
```

A component has a page when `src/index.ts` exports it and it has a stories file. Everything a
page shows is in the library: the title and description (the first sentence of the stories meta's
`parameters.docs.description.component`), the stage, the examples, the props and the install
files; the docs add only playground tuning. The components changed most recently in git carry a
mark in the sidebar. The `wideset-component-docs` skill (`.agents/skills/`) walks through it.

## Examples

Every example is a file in the library,
`packages/design-system/src/components/<folder>/examples/<id>/<name>.tsx`, and the same file is a
story in Storybook (`exampleStory()` in the stories file). The page renders it and prints it as
written; its leading JSDoc is the description; `index.ts` next to it lists the examples in
reading order. `src/lib/examples.ts` fails the build on an example missing from `index.ts`, a
name without a file or a file without a description, and the library's
`src/__tests__/examples.test.tsx` checks the same in CI, plus that each renders and is a story.

**Which subjects:** the visual axes, side by side (only the ones the component has). The
playground shows one value at a time; an example shows them all at once, so the reader can
compare. Code patterns (`asChild`, routing, a form around it) and dev cases are stories of their
own in Storybook, not examples.

**Descriptions:** they must say what the title and preview do not: the rule behind the picture,
when to pick which, what happens that you cannot see (keyboard, screen readers, layout), or
where to go instead. Never a sentence that repeats the title or describes what is visible.

## Playgrounds

A playground is the component's `examples/<id>/default.tsx` (one typical instance whose root
takes `{...props}`) with controls: every string-literal union and boolean of the root props type
in `src/generated/controls.json`, with the component's own default, so a new variant shows up
without touching anything. The Overview stage and the gallery thumbnail show the defaults, and
the stage's code is `code(defaults)`. The component's Playground tab (`?tab=playground`) contains
the workbench. The Properties panel sets the props, the code shows the resulting JSX, and the
address saves changed values. The component's own files are under Installation › Manual; an old
`?tab=code` address opens there.

`src/playgrounds/<id>.tsx` is optional tuning: `playground({...})` from
`src/lib/playground-kit.ts` with `hide`, `labels` (`preset` is already "Style"), `order`,
`optional` (a "None" choice), `defaults`, `stage(values)` (the dark stage for `inverse`),
`preview()` (an overlay drawn open for the thumbnail), `anatomy()` (a composition with every
part, for the Anatomy tab; the `wideset-component-anatomy` skill), or its own `render(values, { props })` /
`code(values, { attrs })` with `content` controls when the stage needs more than the types say.

The Properties panel picks each control from its definition (`src/components/PropertiesPanel.tsx`):
an on/off is a Switch on its row; a choice of two or three short options is a SegmentedControl
(two named alternatives are segmented, never a switch); four or more, or any long label, is a
Select. Options keep the definition's order.

The stage renders on the server at the defaults, so a page opens on it before any JavaScript;
`clientOnly: true` draws it only in the browser, for a component that reads `document` while
rendering or opens on today's date (Calendar). The browser loads only the playgrounds a page names
with `data-playground` (the component page's stage, each gallery card), and every island that
reads one waits for them before it hydrates. Do not suspend during hydration instead:
`@astrojs/react` calls `root.render` straight after `hydrateRoot`, which makes React drop the
server HTML of a suspended boundary and draw it again, and React streams a boundary with a large
stage out of line; both make the stage blink.

## Blocks

A block is a whole screen (or a panel that opens over one) in the library,
`packages/design-system/src/blocks/<id>/`, listed in the manifest beside them (`blocks/index.ts`:
`BLOCKS`, `PANELS`, the directions and navigations). `src/lib/blocks.ts` reads the manifest and
the package source excerpts for Markdown. `src/lib/registry.ts` reads the installable files,
and the browser loads only the block a page shows. Only blocks in the manifest are listed: one in an open pull request appears once it
is merged.

- `/blocks/<id>/preview` renders the block alone at the window's size (`BlockFrame`, with an error
  and a retry when its code fails to load), in `?theme=light|dark` or the saved theme. Framed, it
  is inert, a picture, unless the frame asks for `?live`.
- `/blocks/<id>` has two tabs. Preview frames that route live (`BlockLiveFrame` in
  `BlockPreviewFrame.tsx`): clickable, in the page's theme, loaded again when the theme changes,
  with the block's direction and navigation in one line. Code (`?tab=code`, `RegistryCode.tsx`)
  shows the install command and the installed files, grouped as Entry, Parts and Data. On narrow
  screens use the file picker. The address keeps the selected file (`&file=Header.tsx`).
  "Open full screen" opens the preview route.
- `/blocks` lists the manifest by business domain, from `src/data/block-categories.json` (kept by
  hand). The list names every block the manifest has (`scripts/blocks.test.mjs` fails otherwise),
  so a pull request that adds a block gives it its category in the same change. A block the list
  does not name would land under "Other" and a panel under "Panels".
- A card frames the preview route at 1440 × 960, scaled down and cropped to its top left
  (`BlockPreviewFrame`), in the page's theme. The frame loads once the card has been near the
  screen for 200 ms and is removed when it leaves, so scrolling the gallery keeps a handful of
  blocks alive, not all of them; nothing to regenerate when a block changes.

## Adding things

- **A guide page:** `src/content/docs/<name>.mdx` with `title`, `description`, `order` in the
  frontmatter. It appears in the sidebar by `order`, or under its `section`.
- **A component page:** export the component, give it a stories file, then its
  `examples/<id>/` folder (see the skill).
- **A page in the top bar:** the links in `TopNav` (`src/components/parts.tsx`) and `PAGES` in the
  layout, plus a page under `src/pages/` whose layout names its `area`.

## Chrome

- `src/layouts/DocsLayout.astro` — the one frame: a full-width top bar (the app icon, the pages,
  GitHub, the theme, "Get started"), then a centred container with the page's own sidebar at its
  left edge, the rail at its right edge and a 760px reading column centred between them. A page
  without a rail (`broad`) takes the whole column; a page without sidebar rows has no sidebar; a
  block's page spans the window (`full`). On a narrow window the bar's menu button opens the pages
  and the sidebar. The theme is applied before first paint from `localStorage`
  (`src/lib/theme.ts`).
- `src/components/` — islands and Astro parts: `PageHead` (every page's title, description and
  actions), `parts.tsx` (the bar, the sidebar, the rail, the page tabs, the code block, the
  example card, Installation, "Copy page", breadcrumbs), `SearchPalette` (⌘K, on the system's `Modal` +
  `Search`), `Thumbnail`, `Playground` + `Workbench` + `PropertiesPanel` (one shared store),
  `PropsTables`, `AnatomyDiagram`, `RelationshipGraph`, `BlockFrame` (a block on its
  preview route) and `BlockPreviewFrame` (that route in a frame).
- `src/styles/docs.css` — Tailwind plus `@import '@wideset/react/theme'`, so the chrome is
  written in `ws` classes (`bg-ws-static-container`, `text-ws-static-subtle`, …) and follows
  light and dark with the system. Inter from `@fontsource-variable/inter`.

## Rules

- No component library code is copied here. Use `@wideset/react`; if the docs need something
  the system lacks, that is a library issue first.
- Chrome uses `ws` token classes only (same rule as the library); no raw palette classes.
- Islands cannot receive React components as props (they do not serialise). Pass a key and look
  the thing up on the client (`ExampleCard` and `Playground` do this). Parts that read a parent's
  context (`Button.Icon`, `Breadcrumbs.Item`) are composed in one React file, not in the `.astro`.
- `src/generated/` is never committed; the generators are the contract with the library. When
  a story or a type changes shape, fix the generator, not the page.
- Nothing in the build may depend on a local server or a file outside the repository.

## Automation hooks

- **CI:** the root `pnpm typecheck`, `pnpm prettier`, `pnpm build` and `pnpm test` run this app
  through Turborepo, so a broken generator, page or example fails the PR.
- **Hosting:** static output in `dist/`, served by a Cloudflare Worker (`wrangler.jsonc`) and
  deployed by the `deploy` job in `.github/workflows/build.yaml`. See `RELEASING.md`.
