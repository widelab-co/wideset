const fs = require('fs');
const path = require('path');

/**
 * Configuration mapping variable name prefixes to their Tailwind semantic prefixes
 * Ordered from most specific to least specific to handle overlapping patterns
 * Based on https://tailwindcss.com/docs/theme
 */
const VARIABLE_PREFIX_CONFIG = [
  // COLORS - based on https://tailwindcss.com/docs/colors
  // Keep the published --decoration-ws-* variables for direct CSS references.
  {
    prefix: '--ws-dynamic-fill',
    tailwindPrefix: ['--background-color-ws-dynamic', '--outline-color-ws-dynamic'],
  },
  {
    prefix: '--ws-dynamic-stroke',
    tailwindPrefix: ['--border-color-ws-dynamic', '--outline-color-ws-dynamic'],
  },
  {
    prefix: '--ws-dynamic-text',
    tailwindPrefix: [
      '--text-color-ws-dynamic',
      '--decoration-ws-dynamic',
      '--text-decoration-color-ws-dynamic',
      '--fill-ws-dynamic',
      '--stroke-ws-dynamic',
    ],
  },
  {
    prefix: '--ws-non-semantic-fill',
    tailwindPrefix: ['--background-color-ws-non-semantic', '--outline-color-ws-non-semantic'],
  },
  {
    prefix: '--ws-non-semantic-stroke',
    tailwindPrefix: ['--border-color-ws-non-semantic', '--outline-color-ws-non-semantic'],
  },
  {
    prefix: '--ws-non-semantic-text',
    tailwindPrefix: [
      '--text-color-ws-non-semantic',
      '--decoration-ws-non-semantic',
      '--text-decoration-color-ws-non-semantic',
      '--fill-ws-non-semantic',
      '--stroke-ws-non-semantic',
    ],
  },
  {
    prefix: '--ws-semantic-fill',
    tailwindPrefix: ['--background-color-ws-semantic', '--outline-color-ws-semantic'],
  },
  {
    prefix: '--ws-semantic-stroke',
    tailwindPrefix: ['--border-color-ws-semantic', '--outline-color-ws-semantic'],
  },
  {
    prefix: '--ws-semantic-text',
    tailwindPrefix: [
      '--text-color-ws-semantic',
      '--decoration-ws-semantic',
      '--text-decoration-color-ws-semantic',
      '--fill-ws-semantic',
      '--stroke-ws-semantic',
    ],
  },
  {
    prefix: '--ws-static-fill',
    tailwindPrefix: ['--background-color-ws-static', '--outline-color-ws-static'],
  },
  {
    prefix: '--ws-static-stroke',
    tailwindPrefix: ['--border-color-ws-static', '--outline-color-ws-static'],
  },
  {
    prefix: '--ws-static-text',
    tailwindPrefix: [
      '--text-color-ws-static',
      '--decoration-ws-static',
      '--text-decoration-color-ws-static',
      '--fill-ws-static',
      '--stroke-ws-static',
    ],
  },
  // --static-shadow-* is deliberately NOT mapped. Those tokens are colours, and
  // --shadow-* is Tailwind's box-shadow namespace: mapping them mints broken
  // `shadow-static-*` utilities that resolve to `box-shadow: <colour>`. The raw
  // tokens are consumed directly by src/styles/utilities/shadow.css instead.
  // --static-scrim-* is the backdrop behind Modal, StatusModal and Sidepanel
  // (Figma: Static/Scrim/Base, 48% in light / 56% in dark). Background only.
  { prefix: '--ws-static-scrim', tailwindPrefix: '--background-color-ws-static-scrim' },

  // FONT
  { prefix: '--ws-font-family', tailwindPrefix: '--font-ws' },
  { prefix: '--ws-font-lineheight', tailwindPrefix: '--leading-ws' },
  { prefix: '--ws-font-size', tailwindPrefix: '--text-ws' },
  { prefix: '--ws-font-spacing', tailwindPrefix: '--tracking-ws' },
  { prefix: '--ws-font-weight', tailwindPrefix: '--font-weight-ws' },

  // BORDER & RADIUS
  { prefix: '--ws-border-width', tailwindPrefix: '--border-width-ws-width' },
  { prefix: '--ws-border', tailwindPrefix: '--border-width-ws' },
  // Desktop `--border-width-ws-*` primitives are already in Tailwind's namespace; keep the
  // `border-width-ws-width-*` semantic aliases they produced before the `ws` prefix.
  { prefix: '--ws-radius-rounded', tailwindPrefix: '--radius-ws' },
  { prefix: '--ws-corner-radius-container', tailwindPrefix: '--radius-ws-container' },
  { prefix: '--ws-corner-radius-control', tailwindPrefix: '--radius-ws-control' },

  // SPACING
  {
    prefix: '--ws-components-control',
    tailwindPrefix: '--spacing-ws-control',
  },
  {
    prefix: '--ws-components-forms',
    tailwindPrefix: '--spacing-ws-forms',
  },
  { prefix: '--ws-size', tailwindPrefix: '--spacing-ws' },

  // MEDIA QUERIES
  { prefix: '--ws-breakpoints', tailwindPrefix: '--breakpoint-ws' },
];

/**
 * Extracts the suffix from a variable name and returns the Tailwind prefix(es)
 * Returns an array of { tailwindPrefix, suffix } or empty array if no match
 */
function extractVariableInfo(varName) {
  for (const config of VARIABLE_PREFIX_CONFIG) {
    if (config.prefix === null) {
      continue; // Skip catch-all, check it last
    }

    if (varName.startsWith(config.prefix)) {
      const suffix = varName.substring(config.prefix.length);
      const tailwindPrefixes = Array.isArray(config.tailwindPrefix)
        ? config.tailwindPrefix
        : [config.tailwindPrefix];

      return tailwindPrefixes.map((tailwindPrefix) => ({
        tailwindPrefix,
        suffix,
      }));
    }
  }

  return [];
}

/**
 * Parses a CSS file and extracts variables grouped by comment type
 */
function parseThemeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return parseThemeFileContent(content);
}

/**
 * Parses CSS content and extracts variables
 */
function parseThemeFileContent(content) {
  const lines = content.split('\n');

  const variables = [];
  let inThemeBlock = false;
  let inDarkLayer = false;
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Skip commented lines
    if ((line.startsWith('/*') && line.endsWith('*/')) || line.startsWith('//')) {
      continue;
    }

    // Count braces to track nesting
    const openBraces = (rawLine.match(/{/g) || []).length;
    const closeBraces = (rawLine.match(/}/g) || []).length;
    braceDepth += openBraces - closeBraces;

    // Check if we're entering a @theme block
    if (line.startsWith('@theme')) {
      inThemeBlock = true;
      continue;
    }

    // Check if we're entering a @layer base .dark block
    if (line.startsWith('@layer base')) {
      inDarkLayer = true;
      continue;
    }

    // Check if we're exiting blocks
    if (braceDepth <= 0 && (inThemeBlock || inDarkLayer)) {
      if (inDarkLayer) {
        inDarkLayer = false;
      }
      if (inThemeBlock) {
        inThemeBlock = false;
      }
    }

    // Skip if not in a relevant block
    if (!inThemeBlock && !inDarkLayer) {
      continue;
    }

    // Extract CSS variable declarations (skip if line is commented)
    if (!line.startsWith('/*') && !line.startsWith('//')) {
      const varMatch = line.match(/^--([^:]+):\s*(.+);?$/);

      if (varMatch) {
        const varName = `--${varMatch[1]}`;
        const varValue = varMatch[2].trim().replace(/;$/, '');

        variables.push({
          name: varName,
          value: varValue,
          line: i + 1,
        });
      }
    }
  }

  return variables;
}

/**
 * Checks if a variable name should be skipped (would create a duplicate)
 */
function shouldSkipVariable(
  semanticName,
  originalName,
  existingVariableNames,
  currentFileVariableNames,
) {
  // Skip if the semantic name equals the original variable name (self-reference)
  if (semanticName === originalName) {
    return true;
  }

  // Skip if the semantic name already exists as a variable in the base theme
  if (existingVariableNames.has(semanticName)) {
    return true;
  }

  // Skip if the semantic name already exists in the current file being processed
  if (currentFileVariableNames.has(semanticName)) {
    return true;
  }

  return false;
}

/**
 * Font weights are not sizes: Tailwind's scale reads `medium`/`semibold`, so `font-ws-medium`
 * must stay `medium` rather than being shortened to `md` like Components/Forms/Medium is.
 */
const NO_SIZE_TRANSFORM = ['--ws-font-weight'];

/**
 * Transforms size names in the suffix to Tailwind conventions
 */
function transformSizeNames(suffix) {
  return suffix
    .replace(/xsmall/g, 'xs')
    .replace(/small/g, 'sm')
    .replace(/medium/g, 'md')
    .replace(/xlarge/g, 'xl')
    .replace(/large/g, 'lg');
}

/**
 * Generates semantic theme variables
 */
function generateSemanticVariables(variables, existingVariableNames = new Set()) {
  const semanticVars = [];
  const seenNames = new Set(); // Track duplicates

  // Create a set of variable names from the current file being processed
  const currentFileVariableNames = new Set();
  for (const variable of variables) {
    currentFileVariableNames.add(variable.name);
  }

  for (const variable of variables) {
    const variableInfos = extractVariableInfo(variable.name);

    if (variableInfos.length === 0) {
      // Skip variables that don't match known patterns
      continue;
    }

    for (const { tailwindPrefix, suffix } of variableInfos) {
      const transformedSuffix = NO_SIZE_TRANSFORM.some((p) => variable.name.startsWith(p))
        ? suffix
        : transformSizeNames(suffix);
      const semanticName = `${tailwindPrefix}${transformedSuffix}`;

      // Skip if it would create a duplicate (semantic name equals original or already exists)
      if (
        shouldSkipVariable(
          semanticName,
          variable.name,
          existingVariableNames,
          currentFileVariableNames,
        )
      ) {
        continue;
      }

      // Skip duplicates within the same generation
      if (seenNames.has(semanticName)) {
        continue;
      }
      seenNames.add(semanticName);

      semanticVars.push({
        name: semanticName,
        value: `var(${variable.name})`,
        originalName: variable.name,
      });
    }
  }

  return semanticVars;
}

/**
 * Generates the semantic CSS file content
 */
function generateSemanticCSS(semanticVars, isDark = false) {
  const lines = [];

  if (isDark) {
    lines.push('@layer base {');
    lines.push('  .dark {');
  } else {
    // `static`: emit every token even when no utility references it. Consumers override
    // primitives and semantic tokens directly (see Theming docs), so they must exist on :root.
    lines.push('@theme static {');
  }

  for (const variable of semanticVars) {
    const indent = isDark ? '    ' : '  ';

    lines.push(`${indent}${variable.name}: ${variable.value};`);
  }

  if (isDark) {
    lines.push('  }');
    lines.push('}');
  } else {
    lines.push('}');
  }

  return lines.join('\n') + '\n';
}

/**
 * Extracts all variable names from a theme file to check for duplicates
 */
function extractExistingVariableNames(filePath) {
  if (!fs.existsSync(filePath)) {
    return new Set();
  }

  const variables = parseThemeFile(filePath);
  const variableNames = new Set();

  for (const variable of variables) {
    variableNames.add(variable.name);
  }

  return variableNames;
}

/**
 * Main function
 */
function main() {
  const stylesDir = path.join(__dirname, 'src', 'styles', 'tokens');

  // Load base theme variables to check for duplicates
  const baseThemePath = path.join(stylesDir, 'theme-base-tokens.css');
  const existingVariableNames = extractExistingVariableNames(baseThemePath);
  console.log(
    `Loaded ${existingVariableNames.size} existing variables from base theme for duplicate checking\n`,
  );

  const themeFiles = [
    { input: 'theme-light-tokens.css', output: 'theme-light-semantic.css', isDark: false },
    { input: 'theme-dark-tokens.css', output: 'theme-dark-semantic.css', isDark: true },
    { input: 'theme-desktop-tokens.css', output: 'theme-desktop-semantic.css', isDark: false },
  ];

  for (const themeFile of themeFiles) {
    const inputPath = path.join(stylesDir, themeFile.input);
    const outputPath = path.join(stylesDir, themeFile.output);

    console.log(`Processing ${themeFile.input}...`);

    if (!fs.existsSync(inputPath)) {
      console.warn(`Warning: ${inputPath} not found, skipping...`);
      continue;
    }

    const variables = parseThemeFile(inputPath);
    console.log(`  Found ${variables.length} variables`);

    const semanticVars = generateSemanticVariables(variables, existingVariableNames);
    console.log(`  Generated ${semanticVars.length} semantic variables`);

    const semanticCSS = generateSemanticCSS(semanticVars, themeFile.isDark);

    fs.writeFileSync(outputPath, semanticCSS, 'utf-8');
    console.log(`  Written to ${themeFile.output}`);
  }

  console.log('\nDone!');
}

// Export functions for testing
module.exports = {
  extractVariableInfo,
  transformSizeNames,
  shouldSkipVariable,
  parseThemeFile,
  parseThemeFileContent,
  generateSemanticVariables,
  generateSemanticCSS,
  extractExistingVariableNames,
};

// Only run main if this file is executed directly
if (require.main === module) {
  main();
}
