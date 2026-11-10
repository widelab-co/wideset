# Wideset — Widelab Design System

A React component library for building consistent, accessible products.

**[Documentation →](https://wideset-docs.widelab.workers.dev)** · **[Storybook →](https://wideset-storybook.widelab.workers.dev)**

The documentation site covers the same setup in more depth, plus theming, the foundations (colour,
type, spacing, radius, elevation, motion), every component with a live playground, and working
with AI assistants (`/llms.txt`, the shadcn MCP server).

**[Questions → GitHub Discussions](https://github.com/widelab-co/wideset/discussions)** · **[Bugs → GitHub Issues](https://github.com/widelab-co/wideset/issues)**

---

## Two ways to use Wideset

|          | **Package** ([A](#option-a-install-the-package)) | **Scaffolding** ([B](#option-b-scaffold-with-the-wideset-cli))   |
| -------- | ------------------------------------------------ | ---------------------------------------------------------------- |
| Install  | `pnpm add @wideset/react`                        | `npx wideset init`, `npx wideset add button` (no auth / package) |
| Code     | in `node_modules`, not editable                  | copied into your repo, fully editable                            |
| Updates  | automatic, via semver                            | none — your code from then on                                    |
| Best for | long-lived products that need fixes and support  | prototypes, client projects with heavy custom branding           |

---

## Option A: Install the package

### Prerequisites

- **React 18 or 19** — declared as a peer dependency, your app provides it

### 1. Install the package

```bash
pnpm add @wideset/react
# or
npm install @wideset/react
```

### 2. Import the styles

The package ships three stylesheets. Import them once at your app's entry point (e.g. `main.tsx`).

| Export                     | What it is                                                                           | When                                                         |
| -------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| `@wideset/react/styles`    | Compiled: tokens, component CSS and the Tailwind classes components use.             | **ALWAYS**                                                   |
| `@wideset/react/preflight` | Browser reset (Tailwind's preflight: zeroed margins, `box-sizing: border-box`, etc.) | Only if your app does **not** use Tailwind. Skip if it does. |
| `@wideset/react/theme`     | Source `@theme` tokens and `@utility` classes for your own Tailwind v4 build         | If you want to use wideset `*-ws-*` classes in your code     |

**Without Tailwind**

```tsx
import '@wideset/react/styles';
import '@wideset/react/preflight';
```

**With Tailwind v4** — your Tailwind already includes the reset, so skip `preflight`:

```tsx
import '@wideset/react/styles';
```

**To use Wideset classes in your own components** (`bg-ws-dynamic-primary-default`, `p-ws-4`, `typography-body-md`), add the theme to your Tailwind entry CSS:

```css
@import 'tailwindcss';
@import '@wideset/react/theme';
```

Every Wideset token class is `ws`-prefixed (`bg-ws-dynamic-primary-default`, `p-ws-4`, `rounded-ws-control-md`), so the stylesheets sit next to your own Tailwind setup or shadcn without overriding them.

Pure `styles` defines no Tailwind variable (`--font-sans`, `--spacing`, …) and carries no page reset. The only element rules it sets are the two components depend on: font smoothing on `body`, and `1em` sizing for Remix icons (they render `width`/`height` attributes that no class can override).

#### Radix and animate plugins

`theme` ships **tokens and utility classes only** — without the `tailwindcss-radix` & `tailwindcss-animate` plugins Wideset builds with, so if you want to use `radix-*` and `animate-*` variants in your own code, you need those plugins in your Tailwind setup.

### 3. Load the font

Wideset does not load a font by itself. It ships a `--font-ws-sans` variable (Inter with a system fallback), and components inherit the font from the page. Load Inter one of these ways, then apply it:

```css
body {
  font-family: var(--font-ws-sans);
}
```

Or use your own brand font — `body { font-family: … }`.

> **Use a variable font.** Wideset's weights come straight from Figma and are not round numbers — `font-ws-medium` is 520, `font-ws-normal` is 480. A variable font renders them exactly; a static family rounds each one to its nearest cut (400, 500, 600 …), so 520 shows up as semibold. The Fontsource and `next/font` options below both give you variable Inter.

**Fontsource** (self-hosted, works with any bundler):

```bash
pnpm add @fontsource-variable/inter
```

```tsx
import '@fontsource-variable/inter';
```

Fontsource registers the family as `Inter Variable`, so add it to the token:

```css
:root {
  --font-ws-sans: 'Inter Variable', ui-sans-serif, system-ui, sans-serif;
}
```

**Next.js** (`next/font`) — the `variable` option sets `--font-ws-sans` for you; keep the `body` rule above in your global CSS:

```tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-ws-sans' });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

**`<link>`** in your `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
/>
```

---

## Option B: Scaffold with the Wideset CLI

Every component is published as a [shadcn registry](https://ui.shadcn.com/docs/registry) item, and
the `wideset` CLI installs them. The source lands in your repo, fully editable, though no automatic
updates. Works in Vite and Next.js projects with TypeScript, with or without Tailwind.

```bash
npx wideset init              # once: components.json, @/* alias, stylesheet import
npx wideset add button select # any components; `npx wideset list` shows them all
```

`init` writes `components.json`, adds the `@/*` path alias to `tsconfig` (and, for Vite, to
`vite.config.ts`), adds the Wideset stylesheet and imports it in `main.tsx` or `app/layout.tsx`;
apps without Tailwind also get Tailwind's reset. Already using shadcn? `init` keeps your
`components.json` and only registers the `@wideset` namespace. Files land in
`components/ui/wideset/`, `lib/wideset/` and `hooks/wideset/`:

```tsx
import { Button } from '@/components/ui/wideset/button/Button';
```

### Without the Wideset CLI

The CLI runs the shadcn CLI underneath; you can call shadcn yourself. Wideset does not use shadcn's
components, theme or `cn`, so you do **not** need `shadcn init`.

**1. Create `components.json`** in your project root. It tells the CLI where files go and which
registry `@wideset` means. Vite (sources in `src/`):

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",
  "tsx": true,
  "rsc": false,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks",
    "utils": "@/lib/utils"
  },
  "registries": { "@wideset": "https://wideset-docs.widelab.workers.dev/r/{name}.json" }
}
```

Next.js App Router: `"rsc": true`, `"css": "app/globals.css"`, and `@/` pointing at the project
root (`"@/*": ["./*"]`). The `@/*` alias has to exist in `tsconfig.json` (`paths`) and, for Vite, in
`vite.config.ts` (`resolve.alias`). Already using shadcn? Keep your `components.json` and only
register the namespace:

```bash
npx shadcn@latest registry add @wideset=https://wideset-docs.widelab.workers.dev/r/{name}.json
```

**2. Add components.** Sub-components and dependencies come along; the item list is `/r/registry.json`.

```bash
npx shadcn@latest add @wideset/button @wideset/select
```

**3. Import the stylesheet once.** Every component pulls `styles/wideset.css` with it:

```tsx
import '@/styles/wideset.css';
```

Apps without Tailwind also add `@wideset/preflight` and import it first. Tailwind v4 apps can add `@wideset/theme` so their
own build compiles the `ws` utility classes from the installed sources — it ships tokens and
utilities only, without the element rules `styles` carries (font smoothing, `1em` Remix Icon
sizing), so keep importing `styles` unless you reproduce those yourself.

The `wideset` CLI pins the shadcn version CI tests the registry against on every change; CI also
runs the registry against `shadcn@latest` weekly, so `@latest` is what we recommend when calling
shadcn yourself.

---

## Usage

### Components

```tsx
import { Button, Accordion } from '@wideset/react';
import type { ButtonProps } from '@wideset/react';

function App() {
  return (
    <>
      <Button size="lg" preset="filled">
        Click me
      </Button>

      <Accordion>
        <Accordion.Item value="item-1">
          <Accordion.Trigger>Item 1</Accordion.Trigger>
          <Accordion.Content>Content here</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
```

### Icons

The design system does not ship its own icons. It uses **[Remix Icon](https://remixicon.com)** — 3,200+ tree-shakable icons — which you install alongside the package:

```bash
pnpm add @remixicon/react
# or
npm install @remixicon/react
```

Components take the icon _component_, so any `Ri*` export can be passed straight through:

```tsx
import { RiHeartLine } from '@remixicon/react';
import { IconButton } from '@wideset/react';

<RiHeartLine className="text-ws-600 text-ws-static-strong" />;
<IconButton icon={RiHeartLine} />;
```

- **Sizing** — Remix renders hardcoded `width`/`height` attributes; the design system's stylesheet resets every icon to `1em`, so a `text-<size>` utility scales it like text. Prefer that over the `size` prop, which takes raw pixels and escapes the type scale. An explicit `size-ws-11` / `h-ws-11 w-ws-11` still wins over the `1em` default.
- **Colour** — icons render `fill="currentColor"`, so set colour with a text utility (e.g. `text-ws-static-strong`) rather than a hard-coded value or the `color` prop, so they follow the theme.
- **Custom icons** — icon props accept any component matching the Remix shape (takes `className`, no extra required props), so brand assets don't have to come from Remix. Give them `width="1em" height="1em"` and `fill="currentColor"` to size and colour like the rest.

See **Foundation → Icons** in Storybook for live examples.

### Next.js and React Server Components

Wideset components are Client Components: they use context, state and event handlers. Every
component module starts with `'use client'`, so you can import them straight into a Server Component
(an App Router file without `'use client'`), and only the components you import end up in the client
bundle. Two rules apply there.

**1. Use the named export, not the dot form.** A Server Component only receives a client module's
named exports, so `Card.Header` is `undefined` on the server. Every sub-component is also exported
as `Component` + `Member`:

```tsx
// app/page.tsx — a Server Component
import { Card, CardContent, CardHeader, CardTitle } from '@wideset/react';

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
      </CardHeader>
      <CardContent>…</CardContent>
    </Card>
  );
}
```

`<Card.Header>` keeps working in any file that is itself a Client Component. With scaffolded code the
named import comes from the sub-component's own file, for example
`import { CardHeader } from '@/components/ui/wideset/card/CardHeader'`.

**2. Icons and handlers need a Client Component.** React does not pass functions from the server to
the client, and an icon prop (`icon={RiHeartLine}`, `<Button.Icon icon={RiCheckLine} />`) is a
function, like `onClick`. Put that piece in a file that starts with `'use client'`.

`cn` works in Server Components from the main entry. `@wideset/react/utils` exports it alone,
for code that needs the helper and nothing else.

### Theming

Components read CSS variables, so theming is overriding them in a stylesheet loaded after
Wideset's. Dark mode is the `.dark` class on `<html>` or any wrapper. To re-brand, replace both
brand ramps, `--ws-colors-light-brand-*` and `--ws-colors-dark-brand-*` (steps 100–1100),
or dark mode keeps the old colour; the tinted backgrounds come from `*-brand-opacity-*` tokens,
which are fixed colours, so derive them with `color-mix()`. The full recipe, and the other ways
to customise (one role, `className`, composition), are on
[wideset-docs.widelab.workers.dev/docs/theming](https://wideset-docs.widelab.workers.dev/docs/theming).

### Notes

- Radix UI, clsx, tailwind-merge, and class-variance-authority are **bundled** — you don't need to install them separately
- TypeScript types ship with the package
- The package is tree-shakeable: it ships one file per module with `sideEffects: false`, so your bundle contains only the components you import
- Component modules start with `'use client'` for React Server Components. Bundlers that do not know the directive (Vite, Rollup, webpack outside Next.js) may log "Module level directives cause errors when bundled … was ignored"; it is harmless

---

## Contributing

Wideset is built by the Widelab frontend team. Setup, branch and PR flow, changesets and the
component checklist are in [CONTRIBUTING.md](../../CONTRIBUTING.md); coding conventions (for people and
AI agents) are in [AGENTS.md](../../AGENTS.md); releases in [RELEASING.md](../../RELEASING.md).

From the repository root:

```bash
pnpm install      # install
pnpm storybook    # http://localhost:6006
pnpm test         # Vitest
```

---

## Support

- Questions and ideas: [GitHub Discussions](https://github.com/widelab-co/wideset/discussions)
- Bugs: [GitHub Issues](https://github.com/widelab-co/wideset/issues/new/choose)
- Security issues: [report privately](https://github.com/widelab-co/wideset/security/advisories/new), see [SECURITY.md](https://github.com/widelab-co/wideset/blob/develop/SECURITY.md)

Before you report:

- Check the [Storybook](https://wideset-storybook.widelab.workers.dev/) to confirm the behaviour isn't intentional
- Include your package version (`npm list @wideset/react`) and – if it's a bug – a minimal reproduction

---

## Package info

|            |                                 |
| ---------- | ------------------------------- |
| Package    | `@wideset/react`, CLI `wideset` |
| Registry   | npm                             |
| Repository | `widelab-co/wideset`            |
| License    | Apache-2.0, with `NOTICE`       |

**Outputs after `pnpm build:lib`:**

- `dist/index.mjs` — ESM bundle
- `dist/index.cjs` — CommonJS bundle
- `dist/index.d.ts` — TypeScript types
- `dist/styles.css` — compiled stylesheet (tokens + component CSS)
- `dist/preflight.css` — browser reset for apps without Tailwind
- `dist/theme.css` — `@theme` / `@utility` source of wideset tokens for Tailwind v4 apps
