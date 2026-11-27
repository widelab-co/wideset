/**
 * The API reference, read from the library's types with the TypeScript checker so the
 * props table cannot drift from the implementation.
 *
 * For every `src/components/<dir>/<Name>.types.ts` it resolves the exported `*Props`
 * aliases: `VariantProps<typeof buttonVariants>` comes out as the real
 * `'primary' | 'secondary' | …` union, JSDoc becomes the description, and the `cva`
 * `defaultVariants` give the defaults the type system never exposes. Props inherited
 * from React / Radix are folded into one `inheritsFrom` note.
 *
 * Output: src/generated/props.json
 */
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import ts from 'typescript';

import { componentsDir, generatedDir, library } from './paths.mjs';

const EXTERNAL_SOURCES = [
  { match: /node_modules[\\/]@types[\\/]react[\\/]/, label: 'React' },
  { match: /node_modules[\\/]@radix-ui[\\/]/, label: 'Radix UI' },
  { match: /node_modules[\\/]react-day-picker[\\/]/, label: 'react-day-picker' },
  { match: /node_modules[\\/]cmdk[\\/]/, label: 'cmdk' },
  { match: /node_modules[\\/]react-dropzone[\\/]/, label: 'react-dropzone' },
];
/** cva puts variant props here; they are ours even though the declaration is vendored. */
const CVA_SOURCE = /node_modules[\\/]class-variance-authority[\\/]/;

const typeFiles = [];
const variantFiles = [];
/** The component bodies: defaults written in the destructuring (`size = 'md'`) live there. */
const componentFiles = [];
for (const dir of readdirSync(componentsDir)) {
  const full = join(componentsDir, dir);
  if (!statSync(full).isDirectory()) continue;
  for (const file of readdirSync(full)) {
    if (file.endsWith('.types.ts')) typeFiles.push({ dir, file: join(full, file) });
    if (file.endsWith('.variants.ts')) variantFiles.push(join(full, file));
    if (file.endsWith('.tsx') && !/\.(stories|test)\.tsx$/.test(file))
      componentFiles.push(join(full, file));
  }
}

const configPath = ts.findConfigFile(library, ts.sys.fileExists, 'tsconfig.json');
const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, library);
const program = ts.createProgram(
  [...typeFiles.map((t) => t.file), ...variantFiles, ...componentFiles],
  {
    ...parsed.options,
    noEmit: true,
    skipLibCheck: true,
  },
);
const checker = program.getTypeChecker();

/** `"a" | "b" | undefined | null` → `'a' | 'b'` */
const formatType = (type) =>
  checker
    .typeToString(
      type,
      undefined,
      ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseSingleQuotesForStringLiteralType,
    )
    .split('|')
    .map((part) => part.trim())
    .filter((part) => part !== 'undefined' && part !== 'null')
    .join(' | ');

/** Our own declaration wins over an inherited one, so a documented prop is never folded away. */
const originOf = (symbol) => {
  const declarations = symbol.declarations ?? [];
  if (!declarations.length) return { kind: 'unknown' };
  let fallback = null;
  for (const decl of declarations) {
    const fileName = decl.getSourceFile().fileName;
    if (!fileName.includes('node_modules')) return { kind: 'own' };
    if (CVA_SOURCE.test(fileName)) {
      fallback ??= { kind: 'variant' };
      continue;
    }
    const external = EXTERNAL_SOURCES.find((source) => source.match.test(fileName));
    fallback ??= { kind: 'external', label: external ? external.label : 'dependency' };
  }
  return fallback ?? { kind: 'unknown' };
};

const docOf = (symbol) => {
  const text = ts
    .displayPartsToString(symbol.getDocumentationComment(checker))
    .replace(/\s+/g, ' ')
    .trim();
  const defaultTag = symbol
    .getJsDocTags(checker)
    .find((tag) => tag.name === 'default' || tag.name === 'defaultValue');
  const defaultValue = defaultTag
    ? ts
        .displayPartsToString(defaultTag.text)
        .replace(/^['"`]|['"`]$/g, '')
        .trim()
    : undefined;
  return { description: text || undefined, defaultValue };
};

const literalOf = (node) => {
  // `'button' as const`
  if (ts.isAsExpression(node)) return literalOf(node.expression);
  if (ts.isStringLiteralLike(node)) return node.text;
  if (ts.isNumericLiteral(node)) return node.text;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return 'true';
  if (node.kind === ts.SyntaxKind.FalseKeyword) return 'false';
  return undefined;
};

const objectLiteralOf = (node) => {
  if (ts.isObjectLiteralExpression(node)) return node;
  if (ts.isAsExpression(node)) return objectLiteralOf(node.expression);
  if (ts.isIdentifier(node)) {
    let symbol = checker.getSymbolAtLocation(node);
    if (symbol && symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
    const declaration = symbol?.declarations?.[0];
    if (declaration && ts.isVariableDeclaration(declaration) && declaration.initializer) {
      return objectLiteralOf(declaration.initializer);
    }
  }
  return undefined;
};

/** `{ buttonVariants: { variant: 'primary', preset: 'filled', size: 'md' } }` */
const defaultsByVariantsConst = {};
for (const file of variantFiles) {
  const source = program.getSourceFile(file);
  if (!source) continue;
  const visit = (node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      ts.isCallExpression(node.initializer) &&
      ts.isIdentifier(node.initializer.expression) &&
      node.initializer.expression.text === 'cva'
    ) {
      const config = node.initializer.arguments[1];
      const configObject = config && objectLiteralOf(config);
      const defaultsProperty = configObject?.properties.find(
        (property) =>
          ts.isPropertyAssignment(property) && property.name.getText() === 'defaultVariants',
      );
      const defaultsObject = defaultsProperty && objectLiteralOf(defaultsProperty.initializer);
      if (defaultsObject) {
        const defaults = {};
        for (const property of defaultsObject.properties) {
          if (!ts.isPropertyAssignment(property)) continue;
          const value = literalOf(property.initializer);
          if (value !== undefined) defaults[property.name.getText()] = value;
        }
        if (Object.keys(defaults).length) defaultsByVariantsConst[node.name.text] = defaults;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

/**
 * `{ SearchProps: { preset: 'border', showClearButton: 'true' } }`: the defaults a component
 * writes in its parameter destructuring, keyed by the props type the parameter is typed with
 * (`({ size = 'md' }: XProps)` or `forwardRef<El, XProps>(({ size = 'md' }) => …)`).
 */
const destructuredDefaults = {};
const collectDefaults = (typeName, pattern) => {
  const defaults = (destructuredDefaults[typeName] ??= {});
  for (const element of pattern.elements) {
    if (!element.initializer) continue;
    const key = (element.propertyName ?? element.name).getText();
    const value = literalOf(element.initializer);
    if (value !== undefined) defaults[key] ??= value;
  }
};
for (const file of componentFiles) {
  const source = program.getSourceFile(file);
  if (!source) continue;
  const visit = (node) => {
    if (
      ts.isArrowFunction(node) ||
      ts.isFunctionExpression(node) ||
      ts.isFunctionDeclaration(node)
    ) {
      const param = node.parameters[0];
      let typeName = param?.type?.getText();
      const call = node.parent;
      if (!typeName && call && ts.isCallExpression(call) && call.typeArguments?.length === 2)
        typeName = call.typeArguments[1].getText();
      if (param && typeName && /^\w+Props$/.test(typeName)) {
        if (ts.isObjectBindingPattern(param.name)) collectDefaults(typeName, param.name);
        // `(props, ref) => { const { size = 'md' } = props; … }`
        if (ts.isIdentifier(param.name) && node.body && ts.isBlock(node.body)) {
          for (const statement of node.body.statements) {
            if (!ts.isVariableStatement(statement)) continue;
            for (const decl of statement.declarationList.declarations) {
              if (
                ts.isObjectBindingPattern(decl.name) &&
                decl.initializer &&
                ts.isIdentifier(decl.initializer) &&
                decl.initializer.text === param.name.text
              )
                collectDefaults(typeName, decl.name);
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

/** `HTMLDivElement` → `div`: the tag names whose interface name does not say it. */
const TAGS = {
  Anchor: 'a',
  Paragraph: 'p',
  UList: 'ul',
  OList: 'ol',
  LI: 'li',
  Heading: 'h2',
  Image: 'img',
  TableRow: 'tr',
  TableCell: 'td',
  TableSection: 'tbody',
  TableHeaderCell: 'th',
  '': 'element',
};
/**
 * What a part renders, read off its props type: the HTML element whose attributes it
 * extends (`<button>`), or the Radix part it wraps (`Radix Dialog.Content`).
 */
const elementOf = (text, fileText) => {
  const radix = text.match(/typeof\s+(\w+)\.(\w+)/);
  const from =
    radix && fileText.match(new RegExp(`\\* as ${radix[1]} from '@radix-ui/react-([\\w-]+)'`));
  if (radix && from) {
    const name = from[1].replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());
    return `Radix ${name}.${radix[2]}`;
  }
  const html = text.match(/HTML(\w*)Element\b/);
  if (html) return `<${TAGS[html[1]] ?? html[1].toLowerCase()}>`;
  // `ComponentPropsWithoutRef<'div'>` names the tag outright.
  const tag = text.match(/ComponentProps(?:WithoutRef|WithRef)?<'([a-z][a-z0-9]*)'>/);
  if (tag) return `<${tag[1]}>`;
  return undefined;
};

/** The cva defaults of `<name>Variants`, and of every `typeof xVariants` the type mentions. */
const variantDefaultsFor = (propTypeName, declarationText) => {
  const base = propTypeName.replace(/Props$/, '');
  const names = [
    `${base.charAt(0).toLowerCase()}${base.slice(1)}Variants`,
    ...[...declarationText.matchAll(/typeof\s+(\w+Variants)\b/g)].map((match) => match[1]),
  ];
  return Object.assign({}, ...names.reverse().map((n) => defaultsByVariantsConst[n] ?? {}));
};

/**
 * The choices a prop offers when it is a string-literal union, read from the checker so a
 * named alias (`TooltipSize`, `NonNullable<VariantProps<…>['status']>`) resolves too.
 */
const literalsOf = (type) => {
  const parts = checker.getNonNullableType(type);
  const members = parts.isUnion() ? parts.types : [parts];
  if (members.length < 2 || !members.every((member) => member.isStringLiteral())) return undefined;
  return members.map((member) => member.value);
};

const result = {};
for (const { dir, file } of typeFiles) {
  const source = program.getSourceFile(file);
  const moduleSymbol = source && checker.getSymbolAtLocation(source);
  if (!moduleSymbol) continue;

  for (const exported of checker.getExportsOfModule(moduleSymbol)) {
    const name = exported.getName();
    if (!name.endsWith('Props')) continue;
    const declaration = exported.declarations?.[0];
    if (!declaration) continue;

    const type = checker.getDeclaredTypeOfSymbol(exported);
    const summary = ts.displayPartsToString(exported.getDocumentationComment(checker)).trim();
    const element = elementOf(declaration.getText(), source.getFullText());
    const variantDefaults = variantDefaultsFor(name, declaration.getText());
    const bodyDefaults = destructuredDefaults[name] ?? {};
    const props = [];
    const inheritsFrom = new Set();

    for (const prop of checker.getPropertiesOfType(type)) {
      const origin = originOf(prop);
      if (origin.kind === 'external') {
        inheritsFrom.add(origin.label);
        continue;
      }
      if (origin.kind === 'unknown') continue;
      const propType = checker.getTypeOfSymbolAtLocation(prop, declaration);
      const { description, defaultValue: documentedDefault } = docOf(prop);
      const defaultValue =
        documentedDefault ?? bodyDefaults[prop.getName()] ?? variantDefaults[prop.getName()];
      const values = literalsOf(propType);
      props.push({
        name: prop.getName(),
        type: formatType(propType),
        required: (prop.flags & ts.SymbolFlags.Optional) === 0,
        source: origin.kind,
        ...(description ? { description } : {}),
        ...(defaultValue ? { defaultValue } : {}),
        ...(values ? { values } : {}),
      });
    }
    if (!props.length && !inheritsFrom.size) continue;

    const rank = (p) => (p.required ? 0 : p.source === 'variant' ? 1 : 2);
    props.sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
    result[name] = {
      component: dir,
      file: file.replace(library, '').replace(/\\/g, '/').replace(/^\//, ''),
      ...(summary ? { summary } : {}),
      ...(element ? { element } : {}),
      props,
      inheritsFrom: [...inheritsFrom].sort(),
    };
  }
}

if (!existsSync(generatedDir)) mkdirSync(generatedDir, { recursive: true });
writeFileSync(
  join(generatedDir, 'props.json'),
  JSON.stringify(result, (key, value) => (key === 'values' ? undefined : value), 2) + '\n',
);
const total = Object.values(result).reduce((sum, entry) => sum + entry.props.length, 0);
console.log(`props: ${Object.keys(result).length} prop types, ${total} props`);

/**
 * The part of props.json a playground can switch: string-literal unions become selects,
 * booleans become switches, each with the component's default when the types know it.
 * Kept small and separate because every playground ships to the browser; which of these a
 * page shows, and under what name, is decided in src/examples/<id>/playground.tsx (src/lib/playground-kit.ts).
 *
 * Output: src/generated/controls.json
 */
const controls = {};
for (const [name, entry] of Object.entries(result)) {
  const rows = [];
  for (const prop of entry.props) {
    if (!/^[a-z]/.test(prop.name) || prop.name.startsWith('data-')) continue;
    if (prop.type === 'boolean') {
      rows.push({
        name: prop.name,
        type: 'switch',
        ...(prop.defaultValue ? { default: prop.defaultValue === 'true' } : {}),
      });
    } else if (prop.values) {
      rows.push({
        name: prop.name,
        type: 'select',
        values: prop.values,
        ...(prop.defaultValue ? { default: prop.defaultValue } : {}),
      });
    }
  }
  if (rows.length) controls[name] = rows;
}
writeFileSync(join(generatedDir, 'controls.json'), JSON.stringify(controls, null, 2) + '\n');
