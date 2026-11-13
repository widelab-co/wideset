# Wideset

This project builds UI with the Wideset design system, version <!-- generated:version -->. These rules apply to every UI change. This file is generated and overwritten on update; put your own rules elsewhere.

## First

Find out how this project consumes Wideset. With `@wideset/react` in `package.json` (mode `npm`) import from it, and `npx wideset info --json` reports the version and setup. With `components/ui/wideset/` in the source (mode `registry`) import from `@/components/ui/wideset/...`.

Before writing UI, load the `wideset-build` skill. Its specs say which component fits and what breaks without an error; component source says only what props exist. Before using a component, read its file, listed in the skill's `references/good-practices.md`.

## Hard rules

1. **Choose before you generate.** Pick each component from the index below by what it does, not by how it looks. Never guess a prop or token: read the component's source or `https://wideset.co/components/<id>.md`. Anything missing there does not exist.
2. **Tokens only.** Every token class carries `-ws-`: `p-ws-4`, `gap-ws-7`, `rounded-ws-control-md`. `p-4` is Tailwind's, with a different value. No palette classes, raw hex, Tailwind scale classes or `dark:` variants: tokens flip in dark mode on their own.
3. **Compose, do not rebuild.** Use Wideset's components and subcomponents (`Card.Header`, `Modal.Content`) before writing your own. Overlay triggers use `asChild`. In Next.js Server Components use named exports (`CardHeader`).
4. **Icons are Remix components passed as props**, from `@remixicon/react`: `<IconButton icon={RiAddLine} aria-label="Add" />`. No inline `<svg>`, no other icon library.
5. **One primary action per view.** Hierarchy comes from type and space, colour carries meaning, and cards do not nest.
6. **Forms: two things that compile and fail.** `FormField errorText={…}` does not turn the control red: also set `variant={error ? 'danger' : 'primary'}` on it. A `CheckboxGroup` or `RadioButtonGroup` has no name: `<FormField label="Notify me by" id="notify" WrapperComponent="fieldset"><CheckboxGroup aria-labelledby="notify">`.
7. **The screen holds the state.** Components own only open, hover and focus. Data, selection, filters and pages live in the screen, and `open` does not reset what is inside an overlay.

## Tokens

Surfaces `bg-ws-static-background` `bg-ws-static-container` `bg-ws-static-overlay`; text `text-ws-static-strong` `text-ws-static-base` `text-ws-static-subtle`; borders `border-ws-static-subtle` `border-ws-static-base` `border-ws-static-strong`.

Type is one class: `typography-title-md`, `typography-body-md`, `typography-label-sm`, `typography-number-md`. Spacing: `ws-3` 0.25rem, `ws-5` 0.5rem, `ws-7` 0.75rem, `ws-9` 1rem, `ws-12` 1.5rem, `ws-14` 2rem. Your own `ws` classes need `@import '@wideset/react/theme'` in your Tailwind entry CSS.

Font: the page font is variable Inter, set through `--font-ws-sans`; `wideset init` adds it as `styles/wideset-font.css`. Text that looks heavier than the design means no variable font is loaded: load `wideset-setup`.

## Components

<!-- generated:component-index -->

## Skills

<!-- generated:skill-index -->

Docs: https://wideset.co/docs. Registry: https://wideset.co/r.
