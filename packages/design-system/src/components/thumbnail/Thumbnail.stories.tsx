import { RiFlashlightFill } from '@remixicon/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { exampleStory } from '../../stories/example';
import FileTypesExample from './examples/thumbnail/file-types';
import fileTypesSource from './examples/thumbnail/file-types?raw';
import InATableExample from './examples/thumbnail/in-a-table';
import inATableSource from './examples/thumbnail/in-a-table?raw';
import SizesExample from './examples/thumbnail/sizes';
import sizesSource from './examples/thumbnail/sizes?raw';
import TypesExample from './examples/thumbnail/types';
import typesSource from './examples/thumbnail/types?raw';
import { Thumbnail } from './Thumbnail';
import type { ThumbnailSize, ThumbnailType } from './Thumbnail.types';
import { ThumbnailIcon } from './ThumbnailIcon';
import { ThumbnailImage } from './ThumbnailImage';

const sizes: ThumbnailSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
const types: ThumbnailType[] = [
  'icon',
  'image',
  'logo',
  'text',
  'pdf',
  'spreadsheet',
  'document',
  'video',
  'picture',
];

const PRODUCT_PHOTO =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?&w=128&h=128&dpr=2&q=80&fit=crop';

const meta = {
  title: 'Components/Thumbnail',
  tags: ['autodocs'],
  component: Thumbnail,
  subcomponents: {
    'Thumbnail.Icon': ThumbnailIcon,
    'Thumbnail.Image': ThumbnailImage,
  },
  parameters: {
    docs: {
      description: {
        component: `Thumbnail is a small square tile that stands for a thing next to its name: a file, a project, an integration.
The content follows the prop you pass: \`icon\` for a glyph on the purple tile, \`src\` for a picture, \`type="logo"\` with \`src\` for a logo on a white tile, \`text\` for a letter or two, or \`type\` for one of the five file kinds, which carry their own glyph and hue.

Use Avatar for people, teams and companies. Inside a FileItem use FileItem.Thumbnail, which reads the kind off the file name. For a large preview use Card.Media.

**Optional Composition:**
\`\`\`
<Thumbnail>           — the tile: size, type, background and radius
  <Thumbnail.Icon />  — a glyph with props of its own, instead of \`icon\`
  <Thumbnail.Image /> — a picture with img props of its own, instead of \`src\`
</Thumbnail>
\`\`\``,
      },
    },
  },
  argTypes: {
    size: {
      control: 'radio',
      options: sizes,
      description:
        'Figma `Size`: `xs` 16, `sm` 20, `md` 24, `lg` 32, `xl` 40px. The corner radius, the glyph and the text style step with it.',
      table: {
        category: 'Appearance',
        type: { summary: sizes.map((size) => `'${size}'`).join(' | ') },
        defaultValue: { summary: "'md'" },
      },
    },
    type: {
      control: 'select',
      options: types,
      description:
        'Figma `Type`. Follows the content prop when left out (`src` → `image`, `text` → `text`, otherwise `icon`); required for `logo` and the five file kinds, whose glyph and hue are fixed.',
      table: {
        category: 'Appearance',
        type: { summary: types.map((type) => `'${type}'`).join(' | ') },
        defaultValue: { summary: "'icon'" },
      },
    },
    icon: {
      control: false,
      description:
        'Remix icon drawn on the purple tile, as a component (`icon={RiFolder3Fill}`). Defaults to a bar chart, as in Figma.',
      table: { category: 'Content', type: { summary: 'RemixiconComponentType' } },
    },
    src: {
      control: 'text',
      description:
        'URL of the picture (`image`, cropped to fill the tile) or of the logo (`type="logo"`, drawn at glyph size on a white tile).',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    alt: {
      control: 'text',
      description:
        'Alternative text for `src`. Pass `""` when a name next to the thumbnail already says what it is.',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    text: {
      control: 'text',
      description:
        'The letters drawn on the tile for `type="text"`: an initial or two, never a word.',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    children: {
      control: false,
      description:
        'Replaces the generated content: `Thumbnail.Icon` or `Thumbnail.Image` with props of their own.',
      table: { category: 'Content', type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description: 'Classes merged onto the tile, for layout (margins, alignment) only.',
      table: { category: 'Appearance', type: { summary: 'string' } },
    },
  },
} satisfies Meta<typeof Thumbnail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
    type: 'icon',
  },
};

export const Types: Story = exampleStory(TypesExample, typesSource);

export const FileTypes: Story = exampleStory(FileTypesExample, fileTypesSource);

export const Sizes: Story = exampleStory(SizesExample, sizesSource);

export const InATable: Story = exampleStory(InATableExample, inATableSource);

export const Composition: Story = {
  render: () => (
    <div className="gap-ws-7 flex items-center">
      <Thumbnail size="xl">
        <Thumbnail.Icon icon={RiFlashlightFill} />
      </Thumbnail>
      <Thumbnail size="xl">
        <Thumbnail.Image
          src={PRODUCT_PHOTO}
          alt="Wireless headphones"
          loading="lazy"
          decoding="async"
        />
      </Thumbnail>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Compose the content yourself only when it needs props of its own: `Thumbnail.Image` takes every `img` attribute (`loading`, `srcSet`, `onError`), `Thumbnail.Icon` every SVG one. The tile keeps its size, radius and background, and a composed image gets no purple behind it.',
      },
    },
  },
};
