import tokenUsage from '../generated/token-usage.json';
import { type Entry, entryById, partsOf, relationships } from './catalog';
import { examplesFor } from './examples';
import { guidanceMarkdown } from './guidance';

/** The part's JSDoc, minus the `Props for \`X\` —` lead-in; the root falls back to the page's sentence. */
export const describePart = (entry: Entry, index: number) => {
  const parts = partsOf(entry);
  const summary = parts[index].table.summary?.replace(/^Props for `[^`]+`\s*[—–-]\s*/, '');
  const text = summary ?? (index === 0 ? (entry.description ?? '') : '');
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const fence = (lang: string, code: string) => ['```' + lang, code, '```'].join('\n');
/** A table cell on one line: a `|` would start a new column, a line break end the row. */
const cell = (text: string) => text.replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ');

type Use = {
  class: string;
  token: string;
  group: string;
  state: string;
  when: Record<string, string>;
};
const STATE_ORDER = [
  'default',
  'hover',
  'pressed',
  'focus',
  'selected',
  'checked',
  'open',
  'disabled',
];
const stateRank = (state: string) => {
  const rank = STATE_ORDER.indexOf(state.split('+')[0]);
  return rank < 0 ? STATE_ORDER.length : rank;
};
const condition = (when: Record<string, string>) =>
  Object.entries(when)
    .map(([axis, value]) => `${axis}=${value}`)
    .join(', ');

/**
 * The `ws` classes a component paints with, by variant and state, from gen-token-usage. A model
 * building something that sits next to the component reads it to match its surfaces, and to see
 * which classes a variant swaps.
 */
export const tokensMarkdown = (id: string) => {
  const usage = (
    tokenUsage.components as unknown as Record<
      string,
      { defaults: Record<string, string>; uses: Use[] }
    >
  )[id];
  if (!usage) return '';
  const byWhen = new Map<string, Use[]>();
  for (const use of usage.uses) {
    const key = condition(use.when);
    if (!byWhen.has(key)) byWhen.set(key, []);
    byWhen.get(key)!.push(use);
  }
  const lines = [...byWhen]
    .sort(([a], [b]) => (a === '' ? -1 : b === '' ? 1 : a.localeCompare(b)))
    .map(([when, uses]) => {
      const byState = new Map<string, string[]>();
      for (const use of [...uses].sort((a, b) => stateRank(a.state) - stateRank(b.state))) {
        if (!byState.has(use.state)) byState.set(use.state, []);
        byState.get(use.state)!.push(`\`${use.class}\``);
      }
      const states = [...byState].map(
        ([state, classes]) => `${state}: ${[...new Set(classes)].join(' ')}`,
      );
      return `- **${when || 'Always'}** — ${states.join('; ')}`;
    });
  const defaults = condition(usage.defaults);
  return [
    'The `ws` classes this component paints with, by variant and state. Something you build beside it should use the same ones; a variant swaps only the classes listed under it.',
    defaults ? `Defaults: ${defaults}.` : '',
    lines.join('\n'),
  ]
    .filter(Boolean)
    .join('\n\n');
};

/** The graph neighbours: what the component is built from, what is built from it, what it is shown with. */
export const relatedMarkdown = (id: string) => {
  const link = (other: string) => {
    const entry = entryById(other);
    return entry ? `[${entry.title}](${entry.id}.md)` : '';
  };
  const list = (pick: (edge: (typeof relationships.edges)[number]) => string | null) =>
    relationships.edges
      .map(pick)
      .filter((other): other is string => Boolean(other))
      .map(link)
      .filter(Boolean)
      .join(', ');
  const builtWith = list((edge) => (edge.kind === 'uses' && edge.from === id ? edge.to : null));
  const usedIn = list((edge) => (edge.kind === 'uses' && edge.to === id ? edge.from : null));
  const together = list((edge) =>
    edge.kind === 'with' && (edge.from === id || edge.to === id)
      ? edge.from === id
        ? edge.to
        : edge.from
      : null,
  );
  return [
    builtWith ? `- Built with: ${builtWith}` : '',
    usedIn ? `- Used inside: ${usedIn}` : '',
    together ? `- Used together with: ${together}` : '',
  ]
    .filter(Boolean)
    .join('\n');
};

/**
 * A component page as Markdown, for a model's context: usage guidance, install, import, parts,
 * examples, props, the tokens it paints with and its neighbours in the graph — everything a
 * reader gets except the live stage. Served at `/components/<id>.md` and copied by the page's
 * Copy menu.
 */
export const componentMarkdown = (entry: Entry) => {
  const parts = partsOf(entry);
  const examples = examplesFor(entry.id);

  const partLines = parts.map((part, index) => {
    const description = describePart(entry, index);
    const element = part.table.element ? `, renders ${part.table.element}` : '';
    return `- \`${part.part}\` (named export \`${part.exportName}\`)${element}${description ? ` — ${description}` : ''}`;
  });

  const propSections = parts.map((part) => {
    const rows = part.table.props.map(
      (row) =>
        `| \`${row.name}\`${row.required ? ' (required)' : ''} | \`${cell(row.type)}\` | ${row.defaultValue ? `\`${cell(row.defaultValue)}\`` : ''} | ${cell(row.description ?? '')} |`,
    );
    const table = rows.length
      ? ['| Prop | Type | Default | Description |', '| :-- | :-- | :-- | :-- |', ...rows].join('\n')
      : 'No props of its own.';
    const rest = part.table.element ? `\n\nOther props are passed to ${part.table.element}.` : '';
    return `### ${part.part}\n\n${table}${rest}`;
  });

  return [
    `# ${entry.title}`,
    entry.description ?? '',
    guidanceMarkdown(entry.id) ? `## Usage\n\n${guidanceMarkdown(entry.id)}` : '',
    `## Install\n\n${fence('bash', `npx shadcn@latest add https://wideset-docs.widelab.workers.dev/r/${entry.id}.json\n# or the package: npm install @wideset/react`)}`,
    `## Import\n\n${fence('tsx', `import { ${parts.map((part) => part.exportName).join(', ')} } from '@wideset/react';`)}`,
    parts.length > 1 ? `## Parts\n\n${partLines.join('\n')}` : '',
    ...examples.map(
      (example) =>
        `## Example: ${example.title}\n\n${example.caption ? `${example.caption}\n\n` : ''}${fence('tsx', example.code)}`,
    ),
    `## Props\n\n${propSections.join('\n\n')}`,
    tokensMarkdown(entry.id) ? `## Tokens\n\n${tokensMarkdown(entry.id)}` : '',
    relatedMarkdown(entry.id) ? `## Related\n\n${relatedMarkdown(entry.id)}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');
};
