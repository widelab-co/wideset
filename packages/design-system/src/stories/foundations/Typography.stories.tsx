import type { Meta, StoryObj } from '@storybook/react-vite';

const MONO = 'ui-monospace, "SFMono-Regular", monospace';

const SAMPLE = 'The quick brown fox jumps over the lazy dog';

// Real utility classes generated from the type scale (src/styles/utilities/typography.css).
const GROUPS: { title: string; description: string; sample?: string; variants: string[] }[] = [
  {
    title: 'Title',
    description:
      'The page heading and key figures: lg the figure a page is about, md the page heading and KPI figures, sm a large part of a page or a tight bar.',
    variants: ['typography-title-lg', 'typography-title-md', 'typography-title-sm'],
  },
  {
    title: 'Subtitle',
    description:
      'Titles close to their content, sized by the container: side panel, modal, card and section.',
    variants: ['typography-subtitle-md', 'typography-subtitle-sm', 'typography-subtitle-xs'],
  },
  {
    title: 'Label',
    description: 'UI element labels — Normal and Strong weights.',
    sample: 'Due date · Assignee · Priority',
    variants: [
      'typography-label-lg',
      'typography-label-md',
      'typography-label-sm',
      'typography-label-strong-lg',
      'typography-label-strong-md',
      'typography-label-strong-sm',
    ],
  },
  {
    title: 'Body',
    description: 'Paragraphs and long-form content.',
    variants: [
      'typography-body-lg',
      'typography-body-md',
      'typography-body-sm',
      'typography-body-strong-lg',
      'typography-body-strong-md',
      'typography-body-strong-sm',
    ],
  },
  {
    title: 'Number',
    description: 'Numerical data and tabular figures.',
    sample: '1,234,567.89',
    variants: [
      'typography-number-lg',
      'typography-number-md',
      'typography-number-sm',
      'typography-number-xs',
      'typography-number-strong-lg',
      'typography-number-strong-md',
      'typography-number-strong-sm',
      'typography-number-strong-xs',
    ],
  },
  {
    title: 'Caption',
    description: 'Auxiliary metadata and helper text.',
    sample: 'Last updated · 28 Mar 2025 · by Jane Doe',
    variants: [
      'typography-caption-md',
      'typography-caption-sm',
      'typography-caption-strong-md',
      'typography-caption-strong-sm',
    ],
  },
];

function Specimen({ variant, sample }: { variant: string; sample: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 260px',
        gap: 24,
        alignItems: 'baseline',
        padding: '14px 0',
        borderBottom: '1px solid var(--ws-static-stroke-subtle)',
      }}
    >
      <div className={variant} style={{ color: 'var(--ws-static-text-strong)' }}>
        {sample}
      </div>
      <span style={{ fontFamily: MONO, fontSize: 12, color: 'var(--ws-static-text-subtle)' }}>
        {variant}
      </span>
    </div>
  );
}

function TypographyPage() {
  return (
    <div
      style={{
        fontFamily: 'var(--font-ws-body, Inter, system-ui, sans-serif)',
        display: 'flex',
        flexDirection: 'column',
        gap: 44,
        maxWidth: 980,
      }}
    >
      <div>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            margin: '0 0 6px',
            color: 'var(--ws-static-text-strong)',
          }}
        >
          Typography
        </h2>
        <p
          style={{
            fontSize: 13,
            color: 'var(--ws-static-text-subtle)',
            margin: 0,
            lineHeight: 1.5,
            maxWidth: 620,
          }}
        >
          Six semantic type categories. Apply them with utility classes — e.g.{' '}
          <code style={{ fontFamily: MONO, fontSize: 12 }}>{'className="typography-body-md"'}</code>{' '}
          — which bundle font size, line height, weight and letter spacing from the design tokens.
        </p>
      </div>

      {GROUPS.map((group) => (
        <section key={group.title}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 12,
              paddingBottom: 10,
              marginBottom: 4,
              borderBottom: '2px solid var(--ws-static-stroke-base)',
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--ws-static-text-strong)' }}>
              {group.title}
            </span>
            <span style={{ fontSize: 13, color: 'var(--ws-static-text-subtle)' }}>
              {group.description}
            </span>
          </div>
          {group.variants.map((variant) => (
            <Specimen key={variant} variant={variant} sample={group.sample ?? SAMPLE} />
          ))}
        </section>
      ))}
    </div>
  );
}

const meta: Meta = {
  title: 'Foundation/Typography',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Wideset type scale — six semantic categories (Title, Subtitle, Label, Body, Number, Caption), each with size steps and Normal / Strong weights. Use the utility classes shown next to each specimen. They set size, line height, letter spacing and weight — never the typeface.\n\n**Font:** components inherit the page font, so `body { font-family: … }` sets the typeface for all Wideset text. The `font-ws-heading` / `font-ws-body` classes (both backed by `--font-ws-sans`) pin Wideset’s own stack on elements that should keep it regardless of the page.\n\n**Weights are Figma’s exact values** (Strong is 520, Normal 480). A variable font renders them literally; a static family rounds each to its nearest cut (400, 500, 600 …), so 520 looks semibold.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Scale: Story = {
  name: 'Type Scale',
  render: () => <TypographyPage />,
};

export const FontVariables: Story = {
  name: 'Font Variables',
  render: () => (
    <div
      style={{
        fontFamily: 'var(--font-ws-body, Inter, system-ui, sans-serif)',
        maxWidth: 980,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <p
        style={{ fontSize: 13, color: 'var(--ws-static-text-subtle)', margin: 0, lineHeight: 1.5 }}
      >
        Components inherit the page font, so <code style={{ fontSize: 12 }}>body</code> decides the
        typeface. These four custom properties back the{' '}
        <code style={{ fontSize: 12 }}>font-ws-*</code> classes, for text that should keep
        Wideset&rsquo;s own stack; override them at <code style={{ fontSize: 12 }}>:root</code>{' '}
        after importing the design system.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          {
            token: '--font-ws-sans',
            default: "'Inter', ui-sans-serif, system-ui, …",
            applies: 'Base for --font-ws-heading and --font-ws-body',
          },
          {
            token: '--font-ws-heading',
            default: 'var(--font-ws-sans)',
            applies: 'The font-ws-heading class',
          },
          {
            token: '--font-ws-body',
            default: 'var(--font-ws-sans)',
            applies: 'The font-ws-body class',
          },
          {
            token: '--font-ws-mono',
            default: "'IBM Plex Mono', ui-monospace, SFMono-Regular, …",
            applies: 'The font-ws-mono class, for code',
          },
        ].map(({ token, default: def, applies }) => (
          <div
            key={token}
            style={{
              display: 'grid',
              gridTemplateColumns: '200px 280px 1fr',
              gap: 12,
              alignItems: 'center',
              fontSize: 13,
              padding: '8px 12px',
              background: 'var(--ws-static-fill-alpha-subtle)',
              borderRadius: 6,
              border: '1px solid var(--ws-static-stroke-subtle)',
            }}
          >
            <code style={{ fontSize: 12, color: 'var(--ws-static-text-strong)' }}>{token}</code>
            <span style={{ color: 'var(--ws-static-text-subtle)', fontFamily: MONO, fontSize: 11 }}>
              {def}
            </span>
            <span style={{ color: 'var(--ws-static-text-subtle)' }}>{applies}</span>
          </div>
        ))}
      </div>
      <div>
        <p style={{ fontSize: 12, color: 'var(--ws-static-text-subtle)', margin: '0 0 6px' }}>
          Example overrides:
        </p>
        <pre
          style={{
            fontSize: 12,
            margin: 0,
            padding: '12px 14px',
            background: 'var(--ws-static-fill-alpha-base)',
            borderRadius: 6,
            color: 'var(--ws-static-text-base)',
            lineHeight: 1.7,
            border: '1px solid var(--ws-static-stroke-subtle)',
          }}
        >{`/* Change every Wideset component's font: set the page font */
body { font-family: 'Brand Font', sans-serif; }

/* Keep Wideset's own stack on some elements: use the classes */
<h1 className="typography-title-md font-ws-heading">…</h1>

/* Repoint the stack those classes use */
:root { --font-ws-sans: 'Brand Font', sans-serif; }
:root {
  --font-ws-heading: 'Playfair Display', serif;
  --font-ws-body: 'Source Sans Pro', sans-serif;
}`}</pre>
      </div>
    </div>
  ),
};
