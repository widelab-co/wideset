import { type Entry, partsOf, relationsOf } from './catalog';
import { examplesFor } from './examples';
import { guidanceMarkdown } from './guidance';
import type { Values } from './playground-kit';
import { tokenUsage, type Use } from './tokenUsage';

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

/** What a reader matches a custom surface to; spacing, type and motion stay in /graph.json. */
const COLOUR = new Set(['background', 'text', 'border', 'focus', 'icon']);
const SHAPE = new Set(['radius', 'shadow']);
const STATE_ORDER = ['default', 'hover', 'pressed', 'focus', 'selected', 'disabled'];
const stateRank = (state: string) => {
  const rank = STATE_ORDER.indexOf(state.split('+')[0]);
  return rank < 0 ? STATE_ORDER.length : rank;
};
const condition = (when: Values[]) =>
  when
    .map((one) =>
      Object.entries(one)
        .map(([key, value]) => `${key}=${value}`)
        .join(', '),
    )
    .join(' or ');

/**
 * The `ws` classes a component paints with, by part, variant and state (src/lib/tokenUsage.ts).
 * A model building something beside the component reads it to match its surfaces, and to see
 * which classes a variant swaps. Short on purpose: the colours for every variant, and the radius
 * and shadow of the default one; everything else is in /graph.json.
 */
export const tokensMarkdown = (id: string) => {
  const usage = tokenUsage().components[id];
  if (!usage) return '';
  const matchesDefaults = (when: Values[]) =>
    when.some((one) =>
      Object.entries(one).every(
        ([key, value]) => !(key in usage.defaults) || usage.defaults[key] === value,
      ),
    );
  const shown = usage.uses.filter(
    (use) => COLOUR.has(use.group) || (SHAPE.has(use.group) && matchesDefaults(use.when)),
  );
  if (!shown.length) return '';

  const keys = new Set(shown.flatMap((use) => use.when.flatMap((one) => Object.keys(one))));
  const defaults = Object.entries(usage.defaults)
    .filter(([key]) => keys.has(key))
    .map(([key, value]) => `${key}=${value}`)
    .join(', ');

  const byPart = new Map<string, Use[]>();
  for (const use of shown) {
    const part = use.internal ? `${use.part} (inside the component)` : use.part;
    if (!byPart.has(part)) byPart.set(part, []);
    byPart.get(part)!.push(use);
  }
  const sections = [...byPart].map(([part, uses]) => {
    const byWhen = new Map<string, Use[]>();
    for (const use of uses) {
      const key = condition(use.when);
      if (!byWhen.has(key)) byWhen.set(key, []);
      byWhen.get(key)!.push(use);
    }
    const lines = [...byWhen]
      .sort(([a], [b]) => (a === '' ? -1 : b === '' ? 1 : a.localeCompare(b)))
      .map(([when, list]) => {
        const byState = new Map<string, string[]>();
        for (const use of [...list].sort((a, b) => stateRank(a.state) - stateRank(b.state))) {
          if (!byState.has(use.state)) byState.set(use.state, []);
          byState.get(use.state)!.push(`\`${use.className}\``);
        }
        const states = [...byState].map(
          ([state, classes]) => `${state}: ${[...new Set(classes)].join(' ')}`,
        );
        return `- **${when || 'Always'}** — ${states.join('; ')}`;
      });
    return `**${part}**\n\n${lines.join('\n')}`;
  });
  return [
    'The colour classes each part paints with, by variant and state, and the radius and shadow of the default variant. Something you build beside the component should use the same ones. Sizes, spacing and type for every variant, and every token with its light and dark value, are in /graph.json.',
    defaults ? `Defaults: ${defaults}.` : '',
    ...sections,
  ]
    .filter(Boolean)
    .join('\n\n');
};

/**
 * A component page as Markdown, for a model's context: usage guidance, install, import, parts,
 * examples, props, relationships and the tokens it paints with — everything a reader gets except the live stage. Served at `/components/<id>.md`
 * and copied by the page's Copy menu.
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

  const relations = relationsOf(entry.id);
  const names = (list: Entry[]) => list.map((item) => item.title).join(', ');
  const relationLines = [
    relations.builtWith.length ? `- Built with: ${names(relations.builtWith)}` : '',
    relations.usedBy.length ? `- Uses ${entry.title}: ${names(relations.usedBy)}` : '',
    relations.appearsWith.length ? `- Appears with: ${names(relations.appearsWith)}` : '',
  ].filter(Boolean);

  return [
    `# ${entry.title}`,
    entry.description ?? '',
    guidanceMarkdown(entry.id) ? `## Usage\n\n${guidanceMarkdown(entry.id)}` : '',
    `## Install\n\n${fence('bash', `npx wideset add ${entry.id}\n# or the package: npm install @wideset/react`)}`,
    `## Import\n\n${fence('tsx', `import { ${parts.map((part) => part.exportName).join(', ')} } from '@wideset/react';`)}`,
    parts.length > 1 ? `## Parts\n\n${partLines.join('\n')}` : '',
    ...examples.map(
      (example) =>
        `## Example: ${example.title}\n\n${example.caption ? `${example.caption}\n\n` : ''}${fence('tsx', example.code)}`,
    ),
    `## Props\n\n${propSections.join('\n\n')}`,
    relationLines.length ? `## Relationships\n\n${relationLines.join('\n')}` : '',
    tokensMarkdown(entry.id) ? `## Tokens\n\n${tokensMarkdown(entry.id)}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');
};
