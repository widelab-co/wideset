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
  // Cloudflare Web Analytics, in the manager rather than preview-head.html: the preview is the
  // story iframe, which reloads on its own. Only production builds get a token (build.yaml).
  managerHead: (head) => {
    const token = process.env.PUBLIC_CF_ANALYTICS_TOKEN;
    if (!token) return head;
    const beacon = JSON.stringify({ token }).replace(/"/g, '&quot;');
    return `${head}<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon="${beacon}"></script>`;
  },
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
