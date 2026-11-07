---
name: wideset-setup
description: Install and configure the Wideset design system in a React app. Use when adding Wideset to a project, choosing between the npm package and the registry, wiring stylesheets, Tailwind v4, Next.js Server Components or fonts, rebranding with --ws-colors-* tokens, or when Wideset imports or styles do not resolve.
license: Apache-2.0
metadata:
  wideset-version: '1.0.0'
---

# Wideset setup

Start by finding out what the project already has:

- `@wideset/react` in `package.json` means package mode. `npx wideset info --json` reports the version, registry, aliases, Tailwind version and installed skills.
- `components/ui/wideset/` in the source, or a `@wideset` entry under `registries` in `components.json`, means registry mode.
- Neither means a new setup.

## Choose a mode

|         | Package (`npm`)                 | Scaffolding (`registry`)                          |
| ------- | ------------------------------- | ------------------------------------------------- |
| Install | `npm install @wideset/react`    | `npx wideset init`, then `npx wideset add button` |
| Code    | In `node_modules`, not editable | Copied into the repo, yours to edit               |
| Updates | Through semver                  | None; the code is yours from then on              |
| Import  | `from '@wideset/react'`         | `from '@/components/ui/wideset/button/Button'`    |

Use the mode the project already uses. Never mix both in one app. For a new project, prefer the package when it should receive fixes, and the registry when it needs heavy custom branding.

## Stylesheets (package mode)

Import once, in the app entry (`main.tsx`, or `app/layout.tsx` in Next.js):

| Export                     | What it is                                                    | When                                       |
| -------------------------- | ------------------------------------------------------------- | ------------------------------------------ |
| `@wideset/react/styles`    | Compiled tokens, component CSS and the classes components use | Always                                     |
| `@wideset/react/preflight` | Tailwind's browser reset                                      | Only when the app does not use Tailwind    |
| `@wideset/react/theme`     | Source `@theme` tokens and `@utility` classes                 | To write `*-ws-*` classes in your own code |

Without Tailwind:

```tsx
import '@wideset/react/styles';
import '@wideset/react/preflight';
```

With Tailwind v4, keep the JS import and add the theme to the entry CSS. This is what makes `p-ws-4` and `bg-ws-static-container` work in your own components:

```css
@import 'tailwindcss';
@import '@wideset/react/theme';
```

The `theme` entry ships tokens and utilities only. To use `radix-*` or `animate-*` variants in your own code, also add the `tailwindcss-radix` and `tailwindcss-animate` plugins.

## Stylesheets (registry mode)

The Wideset CLI sets the project up and copies components through the shadcn CLI; you do not need shadcn's components or theme, or `shadcn init`:

```bash
npx wideset init               # once: components.json, @/* alias, stylesheets and their import
npx wideset add button select  # any components, with what they depend on; `npx wideset list` shows them
```

`init` writes `components.json`, adds the `@/*` alias to `tsconfig.json` (and `vite.config.ts` for Vite), adds `@wideset/styles` (plus `@wideset/preflight` in apps without Tailwind) and imports them in the app entry. In a project that already uses shadcn it keeps `components.json` and only registers the `@wideset` namespace. `add` runs `init` itself the first time. `npx wideset init --dry-run` prints what it would change. When `init` lists a step to do by hand, do it.

### Without the Wideset CLI

Only when `npx wideset` cannot run. Add this `components.json` to the project root (Vite shown; for Next.js use `"rsc": true`, `"css": "app/globals.css"` and `@/` at the project root). The `@/*` alias must exist in `tsconfig.json`, and in `vite.config.ts` for Vite.

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

A project already using shadcn keeps its file and runs `npx shadcn@latest registry add @wideset=https://wideset-docs.widelab.workers.dev/r/{name}.json`.

Then add components with `npx shadcn@latest add @wideset/button`.

Every component brings `styles/wideset.css`. Import it once in the app entry:

```tsx
import '@/styles/wideset.css';
```

Apps without Tailwind also add `@wideset/preflight` and import `@/styles/wideset-preflight.css` first.

### Either way

For your own Tailwind build, add `@wideset/theme` (`npx wideset add theme`) and import `./styles/wideset-theme.css` after `tailwindcss` in the entry CSS.

Shared code comes along with the components that need it. The list of items is `https://wideset-docs.widelab.workers.dev/r/registry.json`.

## Font

Wideset loads no font. It ships `--font-ws-sans` (Inter with a system fallback), and components inherit the font from the page:

```css
body {
  font-family: var(--font-ws-sans);
}
```

Use a variable font: Wideset's weights are not round numbers (`font-ws-medium` is 520), and a static family rounds them to the nearest cut. `@fontsource-variable/inter` or `next/font` both work. Fontsource registers the family as `Inter Variable`.

## Next.js Server Components

Every component module carries `'use client'`, so you can import components straight into a Server Component. Accessing `Card.Header` on a client reference does not work on the server, so **in Server Components use the named export of every subcomponent**:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@wideset/react';

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage</CardTitle>
      </CardHeader>
      <CardContent>12 of 20 seats</CardContent>
    </Card>
  );
}
```

The dotted form (`Card.Header`) is fine in client components. Every member has a named export: `Component` + `Member`.

## Providers

Mount these once, high in the tree, only when needed:

- `ToastProvider`: required before anything calls `useToast()`
- `MotionProvider`: only to turn built-in motion off or on for a subtree

There is no theme provider. Dark mode is the `dark` class on `<html>` or on any wrapper; `useTheme()` reads and sets it.

## Rebranding

Everything visual resolves from CSS variables, so rebrand with a stylesheet loaded after Wideset's:

```css
:root {
  --ws-colors-light-brand-600: #4f46e5;
}
.dark {
  --ws-colors-dark-brand-600: #818cf8;
}
```

Override primitives (`--ws-colors-*`) first: every role and class built on them follows. Use `className` for a one-off instance, and composition to change structure. Check the primitive names at `https://wideset-docs.widelab.workers.dev/docs/theming.md` before overriding.

## Check the result

1. Render one `Button`. It should show the brand fill, not a browser-default button.
2. Add `className="bg-ws-static-container"` to a `div` in your own code. If it has no background, the theme is not imported into your Tailwind build.
3. Toggle `dark` on `<html>`. Surfaces should flip without further code.
4. Run the project's type-check and build.
