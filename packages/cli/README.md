# wideset

The [Wideset](https://github.com/widelab-co/wideset) CLI. It copies Wideset components into your
React project as source you own, and adds the Wideset agent skills and rules. It is a thin layer
over the [shadcn CLI](https://ui.shadcn.com/docs/cli) and works in Vite and Next.js projects with
TypeScript, with or without Tailwind.

```bash
npx wideset init                 # once: components.json, @/* alias, stylesheet import
npx wideset add button select    # any components, with what they depend on
npx wideset list                 # every component you can add
npx wideset skills               # agent skills in .agents/skills, rules in AGENTS.wideset.md
npx wideset info --json          # how this project uses Wideset, for agents
```

`init` writes `components.json`, adds the `@/*` path alias to `tsconfig` (and, for Vite, to
`vite.config.ts`), adds the Wideset stylesheet and imports it in `main.tsx` or `app/layout.tsx`.
It also adds Inter as the page font (`styles/wideset-font.css`, self-hosted through Fontsource);
pass `--no-font` to keep your own, or edit that file later.
In a project that already uses shadcn it keeps your `components.json` and only registers the
`@wideset` namespace. Files land in `components/ui/wideset/`, `lib/wideset/` and `hooks/wideset/`.

`npx wideset --help` lists every option, among them `--dry-run`, `--no-font` and
`--registry <url>`.

Prefer updates through semver to owning the code? Install
[`@wideset/react`](https://www.npmjs.com/package/@wideset/react) instead. The
[CLI guide](https://wideset.co/docs/cli) covers both, and calling the shadcn
CLI yourself.

## License

[Apache License 2.0](LICENSE), with a [`NOTICE`](NOTICE) file to keep with any copy you
redistribute.
