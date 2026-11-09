import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  staticDirs: ['../public'],
  stories: [
    '../src/**/!(_deprecated)/**/*.mdx',
    '../src/components/!(_deprecated)/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/!(components)/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    'storybook-dark-mode',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    builder: '@storybook/builder-vite',
  },
  // The docs at wideset.co are the pages to find in search; Storybook is the workbench.
  managerHead: (head) => `${head}\n<meta name="robots" content="noindex" />`,
  async viteFinal(config) {
    return mergeConfig(config, {
      css: {
        postcss: resolve(__dirname, '../postcss.config.cjs'),
      },
      resolve: {
        alias: [
          // Examples (src/components/*/examples/) import the library by its package name.
          { find: /^@wideset\/react$/, replacement: resolve(__dirname, '../src/index.ts') },
          { find: '@', replacement: resolve(__dirname, '../src') },
        ],
      },
    });
  },
};
export default config;
