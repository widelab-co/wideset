---
name: wideset-component-convention
description: Review components for Widelab DS conventions and DS-readiness (API design, exports, accessibility, Storybook docs, tests). Use when checking refactors, pre-PR review, or when the user asks if a component is design-system ready.
license: Apache-2.0
metadata:
  internal: true
  conventions-summary: AGENTS.md
---

# Refactor Review

Review changes on the current branch to ensure refactored components follow Widelab Design System conventions.

Existing code is not automatically a reference implementation. Check siblings against this
checklist before copying them; do not copy deviations. Preserve public API exceptions until a
separate, authorised API change is agreed.

## When to Use

- Before creating a PR for refactored components
- When validating component structure and patterns
- When assessing if a component is **DS-ready** (API, a11y, exports, docs, tests) before merge or release

## Review Workflow

### Step 1: Identify Changed Files

Run git commands to see what's changed on the current branch:

```bash
git diff --name-only develop...HEAD
git diff develop...HEAD --stat
```

### Step 2: Review Component Structure

Each component folder should follow this structure (paths are relative to
`packages/design-system/`):

```
src/components/component-name/      # folder: kebab-case
├── Component.tsx                   # Main component
├── ComponentSub.tsx                # Subcomponents (if needed) — PascalCase with component prefix
├── Component.types.ts              # TypeScript types
├── Component.variants.ts           # CVA variants (if needed)
├── Component.context.ts           # React Context (if needed)
├── Component.hooks.tsx             # Custom hooks (if needed)
├── Component.logic.ts             # Utils/helpers (if needed)
├── Component.stories.tsx           # Storybook stories
├── Component.test.tsx              # Unit tests
├── examples/<page>/                # docs + Storybook examples (public components only)
│   ├── default.tsx                 # the docs playground's stage
│   ├── <axis>.tsx                  # one example per axis, leading JSDoc = description
│   └── index.ts                    # reading order
└── __snapshots__/
    └── Component.test.tsx.snap
```

### Tokens: `ws` prefix

- [ ] Token classes use the `ws` prefix: `bg-ws-*`, `text-ws-*`, `border-ws-*`, `p-ws-4`, `gap-ws-2`, `size-ws-9`, `rounded-ws-control-md`, `shadow-ws-*`, `font-ws-medium`, `z-ws-modal`. Plain `p-4` is Tailwind's 1rem, not Wideset's 0.375rem.
- [ ] No `@theme` change redefines a Tailwind default name (`--font-weight-medium`, `--spacing-4`, `--font-sans`, …) — a new value is a new `ws` token.
- [ ] Code that parses class names (regexes like `/px-\d+/`, tests matching `bg-…`) accounts for `-ws-`.

### Step 3: Validate Against Conventions

Check each refactored component for:

#### TypeScript Types

- [ ] Types live in separate `Component.types.ts` file (not inline in `.tsx`)
- [ ] Props extend the underlying element/component they render:  
      • Native HTML → `React.XxxHTMLAttributes<HTMLXxxElement>`  
      • Radix / external wrapper → `React.ComponentPropsWithoutRef<typeof Primitive.Root>`
- [ ] Use `Omit<HTMLAttributes<El>, 'conflictingProp'>` when a native prop collides with a CVA variant (e.g. `size`)
- [ ] CVA variant types extracted with `VariantProps<typeof variants>` (never hand-duplicated)
- [ ] Mutually exclusive props modeled as discriminated unions with `never` (e.g. `label` xor `children`)
- [ ] Compound type defined: `XWithSubComponents = React.ForwardRefExoticComponent<...> & { Icon: typeof XIcon; ... }`
- [ ] Props are camelCase even when they take a component: `icon={RiCheckLine}`, not `Icon={RiCheckLine}`; only subcomponents are PascalCase (`Button.Icon`)
- [ ] Icon props are typed as `RemixiconComponentType` from `@remixicon/react`; `*.Icon` subcomponents that spread props onto the icon use `RemixiconProps` from `src/types/icon.types` — never an inline `React.ComponentType<React.SVGProps<SVGSVGElement>>`

#### Component Patterns

- [ ] Uses `React.forwardRef` for components rendering a native element or wrapping a Radix primitive
- [ ] Compound components use `forwardRef(...) as XWithSubComponents` — never object-literal `const X = { Root, Icon }`
- [ ] Pure logic/Provider containers skip `forwardRef` (no DOM node to forward)
- [ ] Pure Radix wrappers may type-assert directly on the primitive: `Primitive.Root as typeof Primitive.Root & { Item: ... }`
- [ ] `displayName` is set on every component file
- [ ] Known props destructured, rest spread via `{...props}` to the base element
- [ ] `ref` forwarded to the base element
- [ ] `className` merged via `cn()` from `src/lib/utils` (never string concat or template literal)
- [ ] Uses composition (children/subcomponents), not configuration props (e.g. `<Button><Button.Icon /></Button>` over `<Button icon="check" />`)
- [ ] Compound subcomponents attached as properties (e.g. `Button.Icon = ButtonIcon`)
- [ ] Public API uses a single top-level component (e.g. `<ComboBox>`), not Radix-style `.Root`. Providers, context, and primitive wrappers are hidden inside — users write `<ComboBox><ComboBox.Trigger /></ComboBox>`, never `<ComboBox.Root>` or `<ComboBox.Provider>`. See `Accordion` for reference.
- [ ] Parent→child data shared via Context in `Component.context.tsx` when subcomponents need parent state
- [ ] Context hook throws with convention: `use{X}Context must be used within a <{X}>`

#### Styling

- [ ] CVA variants live in `Component.variants.ts` (not inline in `.tsx`)
- [ ] The only static properties on a component are its subcomponents (`Button.Icon`); variants
      stay in `.variants.ts` and are never attached (`Button.variants`).
- [ ] Uses `cn()` from `src/lib/utils` for class merging
- [ ] Uses design tokens (e.g. `text-ws-static-strong`), no magic values like `text-gray-900`.
      A Figma value without a token is reported to design, not hardcoded.
- [ ] Long classNames split into logical groups
- [ ] A field or trigger that shows a value on one line (Select, FilterButton, DatePicker, any
      `<button>` holding text) is `text-left whitespace-nowrap`, and the value is
      `min-w-0 flex-1 truncate` in a `min-w-0` flex row: a `<button>` centres and wraps its text
      by default, so a long value next to a prefix breaks onto two centred lines. Its test renders
      a long value with and without a prefix (see `Select.test.tsx` › Long values).
- [ ] A popup whose trigger changes width while it is open (a summary such as "Design, +3") must
      not move with it: anchor it to the trigger as it was when it opened, pinned to the edge
      that stays (see `FilterButton.logic.ts` › `frozenAnchor`). A list sliding under the
      pointer makes the next click land on the wrong option.
- [ ] ESLint + Prettier rules followed

#### Icons

- [ ] No icon files in this repo — icons come from `@remixicon/react`; components accept an icon **component** (`icon={RiHeartLine}`), typed as `RemixiconComponentType`
- [ ] Icons size through `text-*` utilities (the stylesheet resets them to `1em`) and colour through `currentColor` — no hardcoded `size`/`color` props in component code
- [ ] No inline `<svg>` for something Remix already has; a genuinely custom asset (brand mark, animated loader) is a normal component next to its consumer with `width="1em" height="1em" fill="currentColor"`

#### Controlled / Uncontrolled

- [ ] `isControlled = value !== undefined` (never `typeof value !== 'undefined'` or `value !== null`)
- [ ] Internal state named `internalValue` / `internalState`; rendered value named `currentValue` / `currentState`
- [ ] `onChange` / equivalent callback fires in both modes
- [ ] `defaultValue` seeds internal state only

#### Testing

- [ ] Has `Component.test.tsx` file
- [ ] Tests grouped in `describe` blocks (e.g. `describe('Rendering')`, `describe('Interaction')`)
- [ ] Queries prefer `screen.getByRole(..., { name })` over text/testId
- [ ] Snapshot test present and snapshot committed under `__snapshots__/`
- [ ] One aspect per `it` (don't mix render + interaction assertions)
- [ ] Rest-props spread is verified (e.g. `data-*`, `aria-*`, `className` merging onto the root element)
- [ ] A component that shows user text in a fixed width has a long-value test: it truncates
      with an ellipsis on one line, never wraps or clips.
- [ ] Imports: `describe, expect, it, vi` from `vitest` (not `@jest/globals`)

#### Exports (`src/index.ts`)

- [ ] Component exported: `export { Component } from './components/component-name/Component'`
- [ ] Public types exported: `export type { ComponentProps } from './components/component-name/Component.types'`
- [ ] Consumer-facing hooks/providers exported when part of the public API (e.g. `useToast`, `ToastProvider`) — not only the visual component
- [ ] Internal files (`*.context.tsx`, `*.hooks.tsx`, `*.logic.tsx`) are NOT re-exported unless intentionally public
- [ ] Package entry (`src/index.ts`) matches what Storybook/docs show as the import path consumers should use

#### Changesets (`.changeset/*.md`)

- [ ] Every user-visible change ships with a changeset
- [ ] **A breaking change to a component's API is a `minor` bump, not `major`.** Renamed props, removed props, a component split into a compound, a renamed export — all `minor`, with a **Breaking** paragraph and a migration example in the changeset body. `major` is a team decision for the library as a whole, never something one component's change triggers on its own
- [ ] Component names must not shadow browser globals (`File`, `Text`, `Image`, `Option`, `Selection`, `Event`, `Range`…) — an import of the component hides the DOM type in the same module (`new File(...)` then resolves to the component). Prefer a suffix (`FileItem`)

#### DS Ready — API design

- [ ] Public API is **minimal and predictable** — no leaked internals (`.Root`, `.Provider`, context objects) unless explicitly documented as public
- [ ] **Sensible defaults** — works out of the box without requiring many props (`variant`, `size`, `disabled`, etc. have defaults aligned with DS patterns)
- [ ] **Composition over configuration** — prefer children/subcomponents over prop bags (`icon`, `title`, `footer` all-in-one)
- [ ] **Consistent naming** with sibling components (`variant`, `size`, `disabled`, `onChange` / `onValueChange`, not one-off synonyms)
- [ ] **Discriminated unions** for mutually exclusive options (`variant: 'basic' | 'expanded'` with `footer?: never` on basic) — TypeScript should prevent invalid combinations, unless discriminated unions are too complex to be practical or are preventing from defining a JSDoc for the prop (e.g. `VariantProps<typeof cva>`)
- [ ] **`className` is for layout/context overrides only** — visual meaning goes through `variant` / `status` / tokens, not ad-hoc classes in consumer code
- [ ] **No magic behavior props** — boolean flags like `duration={0}` for persistence should be obvious or replaced with explicit API (`persistent`, `autoDismiss`) when confusing
- [ ] Stateful components support **controlled + uncontrolled** with the same callback contract
- [ ] Callbacks fire in both modes and use stable, conventional names (`onChange`, `onOpenChange`, `onDismiss`)
- [ ] Imperative/context APIs (`showToast`, providers) are **safe to call from any descendant** — no race conditions, lost events, or required mount-order hacks
- [ ] API is **framework and application-agnostic at the boundary** — no app-specific domain types, routes, or product copy baked into the component

#### DS Ready — Documentation coverage

- [ ] **All consumer-facing public props** are documented (JSDoc in `.types.ts` or `argTypes` for CVA-only props)
- [ ] Docs cover **behavioral semantics**, not only types — e.g. what `duration={0}` means, when `disabled` vs `aria-disabled`, what happens on dismiss
- [ ] **Most important props** for typical usage appear in `Default` story `args` and Controls (variant, size, disabled, value, children/content, key callbacks)
- [ ] Compound/subcomponent APIs are documented (`subcomponents` in meta + Composition story shows real assembly)
- [ ] Provider/hook APIs documented when public (`ToastProvider`, `useToast`) — mount location, return values, error when used outside provider
- [ ] `description.component` explains **when to use / when NOT to use** and points to the right sibling component (Button vs LinkButton, Toast vs InlineAlert, etc.)

#### DS Ready — Accessibility

- [ ] Uses **native semantics** where possible (`<button>`, `<a href>`, `<input>`, `<label>`) instead of div-onClick
- [ ] Correct **`role`** when not native (`role="alert"` for urgent errors, `role="status"` for non-critical feedback, dialog patterns for modals)
- [ ] **Keyboard support**: focusable, operable with Enter/Space; Escape closes overlays; arrow keys for menus/lists/tabs where applicable
- [ ] **Focus management** for overlays: focus trap in modal, restore focus on close, portal does not break tab order
- [ ] **Visible focus** — focus ring/token styles present; not removed without an accessible alternative
- [ ] **Accessible names**: icon-only controls have `aria-label`; inputs have associated labels (`FieldLabel`, `aria-labelledby`, or visible label)
- [ ] **`disabled` vs `aria-disabled`** used intentionally — `disabled` removes from tab order; `aria-disabled` only when focus must stay
- [ ] **Live regions** for dynamic messages (toasts/alerts) use appropriate politeness (`alert` vs `status`)
- [ ] Tests verify at least: correct `role`, keyboard activation, and that `aria-*` / `data-*` rest props reach the DOM

#### DS Ready — Robustness & integration

- [ ] **Design tokens only** — no raw hex/gray/z-index magic numbers outside the token system
- [ ] **SSR-safe** where portals/timers/document are used (`typeof document` guards or client-only boundaries)
- [ ] **IDs** generated safely for aria relationships (`useId`, not `Math.random()` for a11y-critical links)
- [ ] Timers/listeners/subscriptions **cleaned up** on unmount (auto-dismiss, animation frames, bus listeners)
- [ ] No **silent failures** — context hooks throw clear errors when used outside provider
- [ ] Component tolerates **empty/loading/error states** without layout break (empty children, long text, truncated labels)
- [ ] Stories and tests cover **disabled** and at least one non-default variant/state — not only the happy path

#### Storybook — Meta

- [ ] `import type { Meta, StoryObj }` (type-only)
- [ ] Meta uses `satisfies Meta<typeof Component>` (not `: Meta<...>` or `as Meta<...>`)
- [ ] Meta has `component: Component` — the single top-level component that hides providers/context (e.g. `Accordion`), never an internal `.Root` wrapper
- [ ] Meta has `tags: ['autodocs']`
- [ ] Meta has `parameters.docs.description.component` with a short prose description of what the component does and when to use it. For compound components, append a fenced `**Composition:**` block (when composition is the only usage pattern) or `**Optional Composition:**` block (when the component also works standalone) showing the component tree with inline comments — follow the Accordion / StatusBadge examples.
- [ ] Compound components list `subcomponents: { 'X.Sub': XSub }` in meta — **only for subcomponents with their own meaningful, documented props** (e.g. `Table.Cell` with `align`/`placement`, `ActionTile.Entity` with `icon`). **NEVER list thin wrappers** — subcomponents whose only props are `children` and/or `className` (e.g. `Tile.Title`, `Tile.Description`, `Modal.Header`, `Sidepanel.Content`). Thin wrappers render an empty autodocs table with no useful information. When in doubt: if the subcomponent's prop table would be empty or show only `children`/`className`, do NOT list it in `subcomponents`.
- [ ] `type Story = StoryObj<typeof meta>` (from meta, not from component)

#### Storybook — Prop documentation (JSDoc vs argTypes)

- [ ] Prefer one source for prop descriptions: do not duplicate JSDoc in `argTypes.description` when the current Storybook parser reads it correctly
- [ ] Default: JSDoc on props in `Component.types.ts` (Storybook reads these into Controls/Docs and IDE IntelliSense)
- [ ] Exception: use `argTypes.description` for CVA props, inherited props, and props whose JSDoc the current Storybook parser cannot read (union branches or unrecognised component signatures). Preserve useful JSDoc for IDE consumers even when a manual Storybook description duplicates it. Do not reshape public types or introduce documentation-only components for the parser.
- [ ] Every public prop is documented in Docs — `control: false` does not mean "skip documentation"
- [ ] Own non-CVA props need JSDoc for IDE consumers; inherited props can be documented in `argTypes.description` without redeclaring their types (flag missing documentation even if control is disabled)

#### Storybook — argTypes

- [ ] Every controllable public prop has `table.category`: `'Appearance'` | `'Content'` | `'Behavior'` | `'Events'`
- [ ] Typed/defaulted props have `table.type.summary` and `table.defaultValue.summary`
- [ ] CVA/variant props (where JSDoc is not possible) have `argTypes.description` explaining type, default, and purpose
- [ ] Short control form: `control: 'radio'` — object form only for `number` with min/max/step
- [ ] Events: do NOT add `action:` to event argTypes — `preview.tsx` already auto-instruments all `on[A-Z]*` props via `actions: { argTypesRegex: '^on[A-Z].*' }`. Adding `action:` manually is redundant. This is a review convention; ESLint does not remove it automatically.
- [ ] Non-controllable props use `control: false`; internal props use `table: { disable: true }`
- [ ] Props only valid in a specific configuration use `if: { arg: 'propName', eq: 'value' }` to hide the control when inapplicable (e.g. `footer` only when `variant === 'expanded'`) — keeps Controls/Docs honest about discriminated-union APIs

#### Storybook — Stories

- [ ] Every story typed as `Story` (no untyped `export const X = () => ...`)
- [ ] Every story has a description — for an axis story, the example file's leading JSDoc (`exampleStory()`); otherwise `parameters.docs.description.story` — what the option/axis is, when to use it (English)
- [ ] First story is `Default` — minimal working example with active controls and explicit `args` for controlled props
- [ ] Later stories spread `...Default.args` instead of duplicating
- [ ] **One story per props axis** — e.g. `Variants`, `Sizes`, `Presets`, `States` (PascalCase, named after the axis), each `exampleStory(XExample, xSource)` of a file in `examples/<page>/` that imports `@wideset/react` like a consumer (see the `wideset-component-docs` skill)
- [ ] Every rendered part sets `data-slot="<kebab of its export>"` before `{...props}`, and the test asserts it
- [ ] **`Composition`** story — realistic composed usage (subcomponents, slots, common product patterns)
- [ ] **No `AllVariants` / mega-matrix stories** — too much duplication and noise; prefer separate axis stories
- [ ] Controlled props passed via `args`, not hardcoded in `render` (exception: axis showcase stories that intentionally compare values)
- [ ] Implicit return `() => (...)` for stateless; block body only when hooks/state are needed
- [ ] PascalCase names; avoid `Test`, `Demo`, component-name prefixes, lowercase
- [ ] Order: `Default` → axis stories (`Variants`, `Sizes`, …) → `States` → `Composition`
- [ ] Stories are copy-paste ready — no helper functions, no hidden wrappers (`exampleStory()` is the one helper: Storybook's "Show code" prints the example file itself)

## Review Output Format

Provide feedback using these categories:

- 🔴 **Critical**: Must fix before merge (convention violations, missing tests, a11y blockers, broken public API)
- 🟡 **Suggestion**: Should consider (improvements, better patterns, docs gaps)
- 🟢 **Nice to have**: Optional enhancements

End each component review with a **DS Ready verdict**:

- ✅ **DS Ready** — conventions met; API, exports, docs, a11y, and tests are sufficient for library use
- ⚠️ **DS Ready with fixes** — usable but list required follow-ups before treating as stable
- ❌ **Not DS Ready** — blocking issues in API design, accessibility, exports, or missing tests/docs

When giving the verdict, explicitly call out gaps in: **API**, **exports**, **documentation**, **accessibility**, **tests**.

## Example Review Checklist

```markdown
## Component: Button

### Structure

- [x] Correct folder structure
- [x] Types in separate file
- [x] CVA variants file exists

### Patterns

- [x] Composition pattern used
- [x] Compound components (Button.Icon)
- [x] Ref forwarding
- [ ] 🟡 Consider adding aria-label support

### Styling

- [x] Design tokens used
- [x] CVA for variants
- [ ] 🔴 Found magic value `text-gray-900` - use token

### Testing

- [x] Unit tests present
- [x] Snapshot tests
- [ ] 🟢 Could add edge case tests

### DS Ready

- [x] Public API minimal, no leaked internals
- [ ] 🔴 `duration={0}` magic — consider explicit `persistent` prop
- [ ] 🔴 `showToast` can fire before subscriber mounts (imperative API race)
- [x] Exported from `src/index.ts` with public types
- [ ] 🟡 `useToast` not exported but used in docs

### Accessibility

- [x] Native `<button>` / correct roles
- [ ] 🔴 Icon-only dismiss without overridable `aria-label`
- [ ] 🟡 No keyboard test for Escape on overlay

### Storybook

- [x] Uses `satisfies Meta<typeof Component>`
- [x] `description.component` with when to use / when NOT to use
- [x] Prop docs in JSDoc (`.types.ts`), not duplicated in argTypes
- [ ] 🔴 `footer` has `control: false` but no JSDoc — undocumented public prop
- [ ] 🔴 `AllVariants` story — use axis stories instead
- [ ] 🟡 Missing `Composition` story
- [ ] 🟡 `Default` story uses block body but has no state - use `() => (<Component />)`
- [ ] 🔴 Missing `args` in Default story for default control values
- [ ] 🔴 Uses `renderAllSizes` helper - stories should be copy-paste ready
```

### Example meta with argTypes

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';

// JSDoc on ComponentProps in Component.types.ts documents most props.
// argTypes.description is only for CVA props (variant) where JSDoc cannot live on the type.

const meta = {
  title: 'Components/Component',
  tags: ['autodocs'],
  component: Component,
  parameters: {
    docs: {
      description: {
        component: `Component role, when to use, when NOT to use.`,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['primary', 'secondary'],
      description:
        'Visual variant — CVA prop; document here because JSDoc cannot attach to VariantProps.',
      table: {
        category: 'Appearance',
        type: { summary: "'primary' | 'secondary'" },
        defaultValue: { summary: "'primary'" },
      },
    },
    children: {
      control: 'text',
      table: { category: 'Content', type: { summary: 'ReactNode' } },
    },
    disabled: {
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onClick: {
      description: 'Fired on click.',
      table: { category: 'Events', type: { summary: '() => void' } },
    },
    asChild: { table: { disable: true } },
  },
} satisfies Meta<typeof Component>;

type Story = StoryObj<typeof meta>;
```

## Additional Resources

- Repository rules for people and agents: `AGENTS.md`
- Process (branches, PRs, changesets): `CONTRIBUTING.md`
- Rendered conventions walkthrough: Storybook → Contributing (`src/stories/Contribution.mdx`)
- Tokens and styling pipeline: `src/styles/tokens/README.md`
