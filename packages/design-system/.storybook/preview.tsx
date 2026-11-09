import React from 'react';
import { create, themes } from 'storybook/theming/create';
import type { Preview } from '@storybook/react-vite';
import {
  Controls,
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
} from '@storybook/addon-docs/blocks';

import { InstallCommand } from './InstallCommand';

import '../src/styles/preflight.css';
import '../src/styles/index.css';
import './storybook-preview-overrides.css';

// Can't use variables for the create() function below - it runs before any CSS is parsed
const darkColors = {
  'dark-brand-400': '#7d70f1',
  'dark-brand-500': '#5A4ECF',
  'dark-neutral-0': '#ffffff',
  'dark-neutral-300': '#c2c2c2',
  'dark-neutral-600': '#858585',
  'dark-neutral-700': '#525252',
  'dark-neutral-800': '#383838',
  'dark-neutral-900': '#292929',
  'static-fill-foreground': '#141414',
  'static-fill-background': '#0a0a0a',
};

const lightColors = {
  'light-brand-500': '#7e74dc',
  'light-brand-600': '#4e3ee0',
  'light-neutral-0': '#ffffff',
  'light-neutral-100': '#f5f5f5',
  'light-neutral-300': '#dbdbdb',
  'light-neutral-700': '#6e6e6e',
  'light-neutral-1000': '#1a1a1a',
};

// `convert()` opacify's `appBorderColor`; `themes.dark` + overrides avoids partial themes (e.g. from sb-addon-themes-3 in localStorage) crashing Polished.
const darkControlsTheme = create({
  ...themes.dark,
  base: 'dark',
  brandImage: '/logo.svg',
  brandTitle: 'Wideset Design System',
  brandUrl: 'https://www.wideset.co/',
  brandTarget: '_self',
  colorPrimary: darkColors['dark-brand-500'],
  colorSecondary: darkColors['dark-brand-400'],

  // Backgrounds
  appBg: darkColors['static-fill-foreground'],
  appContentBg: darkColors['static-fill-foreground'],
  appPreviewBg: darkColors['static-fill-foreground'],
  appBorderColor: darkColors['dark-neutral-700'],

  // Text
  textColor: darkColors['dark-neutral-300'],
  textInverseColor: darkColors['dark-neutral-900'],
  textMutedColor: darkColors['dark-neutral-600'],

  // Toolbar
  barBg: darkColors['static-fill-foreground'],
  barTextColor: darkColors['dark-neutral-300'],
  barSelectedColor: darkColors['dark-brand-500'],
  barHoverColor: darkColors['dark-neutral-0'],

  // Inputs
  inputBg: darkColors['dark-neutral-800'],
  inputBorder: darkColors['dark-neutral-700'],
  inputTextColor: darkColors['dark-neutral-300'],
});

const lightControlsTheme = create({
  ...themes.light,
  base: 'light',
  brandImage: '/logo.svg',
  brandTitle: 'Wideset Design System',
  brandUrl: 'https://www.wideset.co/',
  brandTarget: '_self',
  colorPrimary: lightColors['light-brand-600'],
  colorSecondary: lightColors['light-brand-500'],

  // Backgrounds
  appBg: lightColors['light-neutral-100'],
  appContentBg: lightColors['light-neutral-0'],
  appPreviewBg: lightColors['light-neutral-0'],
  appBorderColor: lightColors['light-neutral-300'],

  // Text
  textColor: lightColors['light-neutral-1000'],
  textInverseColor: lightColors['light-neutral-0'],
  textMutedColor: lightColors['light-neutral-700'],

  // Toolbar
  barBg: lightColors['light-neutral-0'],
  barTextColor: lightColors['light-neutral-1000'],
  barSelectedColor: lightColors['light-brand-600'],
  barHoverColor: lightColors['light-neutral-1000'],

  // Inputs
  inputBg: lightColors['light-neutral-0'],
  inputBorder: lightColors['light-neutral-300'],
  inputTextColor: lightColors['light-neutral-1000'],
});

// Whole screens (`parameters.bleed`) fill the window to its edges; everything else gets air.
const withThemeWrapper = (
  Story: React.ComponentType,
  { parameters }: { parameters: { bleed?: boolean } },
) =>
  parameters.bleed ? (
    <Story />
  ) : (
    <div
      style={{
        padding: 'var(--spacing-ws-11)',
      }}
    >
      <Story />
    </div>
  );

const preview: Preview = {
  decorators: [withThemeWrapper],
  parameters: {
    layout: 'fullscreen',
    docs: {
      // "On this page" navigation on every docs page (guides and autodocs alike).
      toc: { headingSelector: 'h2, h3', title: 'On this page' },
      // Storybook's default autodocs page plus the install command for the component.
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <InstallCommand />
          <Primary />
          <Controls />
          <Stories />
        </>
      ),
    },
    // storybook-dark-mode addon settings
    darkMode: {
      dark: darkControlsTheme,
      light: lightControlsTheme,
      darkClass: 'dark',
      lightClass: 'light',
      classTarget: 'html',
      stylePreview: true,
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        order: [
          'Foundation',
          ['Colors', 'Typography', 'Icons', 'Z-Index'],
          'Components',
          'Helper Components',
          '*',
        ],
        method: 'alphabetical',
      },
    },
  },
};

export default preview;
