import fs from 'node:fs';
import path from 'node:path';
import { compile } from 'tailwindcss';
import { describe, expect, it } from 'vitest';

import {
  extractVariableInfo,
  generateSemanticCSS,
  generateSemanticVariables,
  parseThemeFileContent,
  shouldSkipVariable,
  transformSizeNames,
} from './generate-semantic-variables.cjs';

// Type definitions for the imported functions
interface ParsedVariable {
  name: string;
  value: string;
  line: number;
}

interface SemanticVariable {
  name: string;
  value: string;
  originalName: string;
}

describe('generate-semantic-variables', () => {
  it('compiles text decoration utilities and preserves CSS variables in both themes', async () => {
    const semanticCss = ['light', 'dark'].map((theme) =>
      fs.readFileSync(
        path.join(__dirname, `src/styles/tokens/theme-${theme}-semantic.css`),
        'utf-8',
      ),
    );
    const compiler = await compile(`${semanticCss.join('\n')}\n@tailwind utilities;`);
    const css = compiler.build([
      'decoration-ws-semantic-negative',
      'decoration-ws-semantic-notice',
    ]);

    for (const color of ['negative', 'notice']) {
      expect(css).toContain(
        `.decoration-ws-semantic-${color} {\n  text-decoration-color: var(--text-decoration-color-ws-semantic-${color});`,
      );
      for (const theme of semanticCss) {
        expect(theme).toContain(
          `--text-decoration-color-ws-semantic-${color}: var(--ws-semantic-text-${color});`,
        );
        expect(theme).toContain(
          `--decoration-ws-semantic-${color}: var(--ws-semantic-text-${color});`,
        );
      }
    }
  });

  describe('extractVariableInfo', () => {
    it('should extract info for semantic-fill variables (generates 2 prefixes)', () => {
      const result = extractVariableInfo('--ws-semantic-fill-primary-default');
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        tailwindPrefix: '--background-color-ws-semantic',
        suffix: '-primary-default',
      });
      expect(result[1]).toEqual({
        tailwindPrefix: '--outline-color-ws-semantic',
        suffix: '-primary-default',
      });
    });

    it('should extract info for semantic-text variables (generates 5 prefixes)', () => {
      const result = extractVariableInfo('--ws-semantic-text-primary-default');
      expect(result).toHaveLength(5);
      expect(result.map((r) => r.tailwindPrefix)).toEqual([
        '--text-color-ws-semantic',
        '--decoration-ws-semantic',
        '--text-decoration-color-ws-semantic',
        '--fill-ws-semantic',
        '--stroke-ws-semantic',
      ]);
      expect(result[0].suffix).toBe('-primary-default');
    });

    it('should extract info for single-prefix variables', () => {
      const result = extractVariableInfo('--ws-font-size-small');
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        tailwindPrefix: '--text-ws',
        suffix: '-small',
      });
    });

    it('should handle all color variants (dynamic, non-semantic, static)', () => {
      expect(extractVariableInfo('--ws-dynamic-fill-primary')).toHaveLength(2);
      expect(extractVariableInfo('--ws-non-semantic-stroke-primary')).toHaveLength(2);
      expect(extractVariableInfo('--ws-static-text-primary')).toHaveLength(5);
    });

    it('should return empty array for unknown prefixes', () => {
      expect(extractVariableInfo('--unknown-variable')).toEqual([]);
      expect(extractVariableInfo('--random-prefix-value')).toEqual([]);
    });

    it('should handle variables with no suffix', () => {
      const result = extractVariableInfo('--ws-font-size');
      expect(result).toHaveLength(1);
      expect(result[0].suffix).toBe('');
    });
  });

  describe('transformSizeNames', () => {
    it('should transform all size names correctly', () => {
      expect(transformSizeNames('-xsmall')).toBe('-xs');
      expect(transformSizeNames('-small')).toBe('-sm');
      expect(transformSizeNames('-medium')).toBe('-md');
      expect(transformSizeNames('-large')).toBe('-lg');
      expect(transformSizeNames('-xlarge')).toBe('-xl');
    });

    it('should preserve non-size parts', () => {
      expect(transformSizeNames('-primary-default')).toBe('-primary-default');
      expect(transformSizeNames('-danger-hover')).toBe('-danger-hover');
    });

    it('should handle empty suffix', () => {
      expect(transformSizeNames('')).toBe('');
    });

    it('should handle suffix without leading dash', () => {
      expect(transformSizeNames('small')).toBe('sm');
    });
  });

  describe('shouldSkipVariable', () => {
    it('should skip when semantic name equals original name', () => {
      expect(
        shouldSkipVariable(
          '--ws-semantic-fill-primary',
          '--ws-semantic-fill-primary',
          new Set(),
          new Set(),
        ),
      ).toBe(true);
    });

    it('should skip when semantic name exists in existing variables', () => {
      const existing = new Set(['--background-color-ws-semantic-primary']);
      expect(
        shouldSkipVariable(
          '--background-color-ws-semantic-primary',
          '--ws-semantic-fill-primary',
          existing,
          new Set(),
        ),
      ).toBe(true);
    });

    it('should skip when semantic name exists in current file variables', () => {
      const current = new Set(['--background-color-ws-semantic-primary']);
      expect(
        shouldSkipVariable(
          '--background-color-ws-semantic-primary',
          '--ws-semantic-fill-primary',
          new Set(),
          current,
        ),
      ).toBe(true);
    });

    it('should not skip when semantic name is unique', () => {
      expect(
        shouldSkipVariable(
          '--background-color-ws-semantic-primary',
          '--ws-semantic-fill-primary',
          new Set(),
          new Set(),
        ),
      ).toBe(false);
    });
  });

  describe('parseThemeFileContent', () => {
    it('should parse variables from @theme block', () => {
      const content = `@theme {
  --ws-semantic-fill-primary: #ffffff;
  --ws-semantic-text-primary: #000000;
}`;

      const result = parseThemeFileContent(content);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        name: '--ws-semantic-fill-primary',
        value: '#ffffff',
        line: 2,
      });
      expect(result[1]).toEqual({
        name: '--ws-semantic-text-primary',
        value: '#000000',
        line: 3,
      });
    });

    it('should parse variables from @layer base .dark block', () => {
      const content = `@layer base {
  .dark {
    --ws-semantic-fill-primary: #ffffff;
  }
}`;

      const result = parseThemeFileContent(content);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('--ws-semantic-fill-primary');
      expect(result[0].value).toBe('#ffffff');
    });

    it('should skip variables outside @theme or @layer base blocks', () => {
      const content = `--ws-semantic-fill-primary: #ffffff;

@theme {
  --ws-semantic-text-primary: #000000;
}`;

      const result = parseThemeFileContent(content);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('--ws-semantic-text-primary');
    });

    it('should skip commented lines', () => {
      const content = `@theme {
  /* comment */
  --ws-semantic-fill-primary: #ffffff;
  // another comment
  --ws-semantic-text-primary: #000000;
}`;

      const result = parseThemeFileContent(content);
      expect(result).toHaveLength(2);
    });

    it('should handle variables with var() values', () => {
      const content = `@theme {
  --ws-semantic-fill-primary: var(--colors-primary-500);
}`;

      const result = parseThemeFileContent(content);
      expect(result[0].value).toBe('var(--colors-primary-500)');
    });

    it('should handle variables with semicolons', () => {
      const content = `@theme {
  --ws-semantic-fill-primary: #ffffff;
}`;

      const result = parseThemeFileContent(content);
      expect(result[0].value).toBe('#ffffff');
    });

    it('should handle nested blocks correctly', () => {
      const content = `@theme {
  --ws-semantic-fill-primary: #ffffff;
  .nested {
    --another-var: #000000;
  }
  --ws-semantic-text-primary: #333333;
}`;

      const result = parseThemeFileContent(content);
      expect(result).toHaveLength(3);
      expect(result[1].name).toBe('--another-var');
    });

    it('should track line numbers correctly', () => {
      const content = `@theme {
  --var1: value1;
  --var2: value2;
}`;

      const result = parseThemeFileContent(content);
      expect(result[0].line).toBe(2);
      expect(result[1].line).toBe(3);
    });
  });

  describe('generateSemanticVariables', () => {
    it('should generate semantic variables from semantic-fill', () => {
      const variables: ParsedVariable[] = [
        { name: '--ws-semantic-fill-primary-default', value: '#ffffff', line: 1 },
      ];

      const result = generateSemanticVariables(variables);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('--background-color-ws-semantic-primary-default');
      expect(result[0].value).toBe('var(--ws-semantic-fill-primary-default)');
      expect(result[1].name).toBe('--outline-color-ws-semantic-primary-default');
    });

    it('should transform size names in generated variables', () => {
      const variables: ParsedVariable[] = [
        { name: '--ws-font-size-small', value: '14px', line: 1 },
      ];

      const result = generateSemanticVariables(variables);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('--text-ws-sm');
      expect(result[0].value).toBe('var(--ws-font-size-small)');
    });

    it('should skip variables that would create duplicates', () => {
      const variables: ParsedVariable[] = [
        { name: '--background-color-ws-semantic-primary', value: '#ffffff', line: 1 },
      ];

      const result = generateSemanticVariables(variables);

      // Should skip because semantic name equals original name
      expect(result).toHaveLength(0);
    });

    it('should skip variables that exist in existingVariableNames', () => {
      const variables: ParsedVariable[] = [
        { name: '--ws-semantic-fill-primary', value: '#ffffff', line: 1 },
      ];
      const existing = new Set(['--background-color-ws-semantic-primary']);

      const result = generateSemanticVariables(variables, existing);

      expect(result).toHaveLength(1); // Only outline-color, background-color is skipped
      expect(result[0].name).toBe('--outline-color-ws-semantic-primary');
    });

    it('should handle multiple variables and prevent duplicates', () => {
      const variables: ParsedVariable[] = [
        { name: '--ws-semantic-fill-primary', value: '#ffffff', line: 1 },
        { name: '--ws-semantic-stroke-primary', value: '#000000', line: 2 },
      ];

      const result = generateSemanticVariables(variables);

      // Both generate --outline-color-ws-semantic-primary, but only one should be kept
      const outlineVars = result.filter((v) => v.name === '--outline-color-ws-semantic-primary');
      expect(outlineVars).toHaveLength(1);
    });

    it('should skip variables that do not match any prefix', () => {
      const variables: ParsedVariable[] = [
        { name: '--unknown-variable', value: '#ffffff', line: 1 },
        { name: '--ws-semantic-fill-primary', value: '#000000', line: 2 },
      ];

      const result = generateSemanticVariables(variables);

      expect(result).toHaveLength(2); // Only semantic-fill generates variables
      expect(result.every((v) => v.originalName === '--ws-semantic-fill-primary')).toBe(true);
    });

    it('should handle complex size transformations', () => {
      const variables: ParsedVariable[] = [
        { name: '--ws-font-size-xsmall', value: '12px', line: 1 },
        { name: '--ws-font-size-small', value: '14px', line: 2 },
        { name: '--ws-font-size-medium', value: '16px', line: 3 },
        { name: '--ws-font-size-large', value: '18px', line: 4 },
        { name: '--ws-font-size-xlarge', value: '20px', line: 5 },
      ];

      const result = generateSemanticVariables(variables);

      expect(result.map((v) => v.name)).toEqual([
        '--text-ws-xs',
        '--text-ws-sm',
        '--text-ws-md',
        '--text-ws-lg',
        '--text-ws-xl',
      ]);
    });
  });

  describe('generateSemanticCSS', () => {
    it('should generate CSS for light theme (@theme block)', () => {
      const semanticVars: SemanticVariable[] = [
        {
          name: '--background-color-ws-semantic-primary',
          value: 'var(--ws-semantic-fill-primary)',
          originalName: '--ws-semantic-fill-primary',
        },
      ];

      const result = generateSemanticCSS(semanticVars, false);

      expect(result).toBe(`@theme static {
  --background-color-ws-semantic-primary: var(--ws-semantic-fill-primary);
}
`);
    });

    it('should generate CSS for dark theme (@layer base .dark block)', () => {
      const semanticVars: SemanticVariable[] = [
        {
          name: '--background-color-ws-semantic-primary',
          value: 'var(--ws-semantic-fill-primary)',
          originalName: '--ws-semantic-fill-primary',
        },
      ];

      const result = generateSemanticCSS(semanticVars, true);

      expect(result).toBe(`@layer base {
  .dark {
    --background-color-ws-semantic-primary: var(--ws-semantic-fill-primary);
  }
}
`);
    });

    it('should handle multiple variables', () => {
      const semanticVars: SemanticVariable[] = [
        {
          name: '--background-color-ws-semantic-primary',
          value: 'var(--ws-semantic-fill-primary)',
          originalName: '--ws-semantic-fill-primary',
        },
        {
          name: '--text-color-ws-semantic-primary',
          value: 'var(--ws-semantic-text-primary)',
          originalName: '--ws-semantic-text-primary',
        },
      ];

      const result = generateSemanticCSS(semanticVars, false);

      expect(result).toContain('--background-color-ws-semantic-primary');
      expect(result).toContain('--text-color-ws-semantic-primary');
      expect(result.split('\n').filter((line) => line.trim().length > 0)).toHaveLength(4); // @theme, 2 vars, }
    });

    it('should handle empty variables array', () => {
      const result = generateSemanticCSS([], false);
      expect(result).toBe(`@theme static {
}
`);
    });

    it('should use correct indentation for dark theme', () => {
      const semanticVars: SemanticVariable[] = [
        {
          name: '--background-color-ws-semantic-primary',
          value: 'var(--ws-semantic-fill-primary)',
          originalName: '--ws-semantic-fill-primary',
        },
      ];

      const result = generateSemanticCSS(semanticVars, true);
      const lines = result.split('\n');

      expect(lines[2]).toBe(
        '    --background-color-ws-semantic-primary: var(--ws-semantic-fill-primary);',
      );
    });
  });

  describe('Integration: Full workflow', () => {
    it('should process a complete theme file and generate semantic CSS', () => {
      const content = `@theme {
  --ws-semantic-fill-primary-default: #ffffff;
  --ws-semantic-text-primary-default: #000000;
  --ws-font-size-small: 14px;
}`;

      const variables = parseThemeFileContent(content);
      const semanticVars = generateSemanticVariables(variables);
      const css = generateSemanticCSS(semanticVars, false);

      expect(variables).toHaveLength(3);
      expect(semanticVars.length).toBeGreaterThan(0);
      expect(css).toContain('@theme');
      expect(css).toContain('--background-color-ws-semantic-primary-default');
      expect(css).toContain('--text-ws-sm');
    });

    it('should handle real-world scenario with multiple color variants', () => {
      const variables: ParsedVariable[] = [
        { name: '--ws-semantic-fill-primary-default', value: '#ffffff', line: 1 },
        { name: '--ws-semantic-fill-primary-hover', value: '#f0f0f0', line: 2 },
        { name: '--ws-semantic-fill-primary-pressed', value: '#e0e0e0', line: 3 },
        { name: '--ws-semantic-text-primary-default', value: '#000000', line: 4 },
      ];

      const result = generateSemanticVariables(variables);

      // Should generate 2 variables per fill (background + outline) and 4 per text
      expect(result.length).toBeGreaterThanOrEqual(6);
      expect(result.some((v) => v.name.includes('primary-default'))).toBe(true);
      expect(result.some((v) => v.name.includes('primary-hover'))).toBe(true);
      expect(result.some((v) => v.name.includes('primary-pressed'))).toBe(true);
    });
  });
});
