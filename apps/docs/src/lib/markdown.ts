import { type Entry, partsOf } from './catalog';
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

/**
 * A component page as Markdown, for a model's context: usage guidance, install, import, parts,
 * examples and props — everything a reader gets except the live stage. Served at `/components/<id>.md`
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
  ]
    .filter(Boolean)
    .join('\n\n');
};
