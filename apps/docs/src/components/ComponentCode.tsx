import {
  importLines,
  type ImportSource,
  type ProjectPaths,
  setImportSource,
  useImportSource,
  withImportSource,
} from '../lib/importSource';
import { CodeBlock } from './CodeBlock';
import { Pills } from './Pills';

const SOURCES: { value: ImportSource; label: string }[] = [
  { value: 'project', label: 'Local' },
  { value: 'package', label: 'npm' },
];

/** "Import from" in a code block's header: one setting for the whole site. */
export const ImportPick = () => (
  <Pills
    label="Import from"
    options={SOURCES}
    value={useImportSource()}
    onChange={(next) => setImportSource(next as ImportSource)}
  />
);

/** Root component names a JSX snippet uses: `<Button.Icon` → `Button`. */
const namesIn = (code: string, paths: ProjectPaths) =>
  [...code.matchAll(/<([A-Z][A-Za-z0-9]*)/g)].map(([, name]) => name).filter((name) => paths[name]);

/** Every Remix icon a snippet names, in a tag or a prop: `icon={RiArrowRightLine}`. */
const iconsIn = (code: string) => [
  ...new Set([...code.matchAll(/\b(Ri[A-Z][A-Za-z0-9]*)\b/g)].map(([, name]) => name)),
];
const iconImport = (icons: string[]) =>
  icons.length ? [`import { ${icons.sort().join(', ')} } from '@remixicon/react';`] : [];

/** The code as the reader copies it: with its import, from wherever they take components. */
export const useShownCode = (code: string, paths: ProjectPaths, snippet = false) => {
  const source = useImportSource();
  return snippet
    ? [...iconImport(iconsIn(code)), ...importLines(namesIn(code, paths), source, paths), '', code]
        .join('\n')
        .trimStart()
    : withImportSource(code, source, paths);
};

/**
 * Code that uses library components, with its import from wherever the reader takes them:
 * the package, or the files `npx wideset add` wrote. A bare JSX snippet gets its import
 * line added; a whole file has its package import rewritten.
 */
const ComponentCode = ({
  code,
  paths,
  snippet = false,
  className,
}: {
  code: string;
  paths: ProjectPaths;
  /** JSX only, no imports: the import line is added from the tags it uses. */
  snippet?: boolean;
  /** Passed to the code block. */
  className?: string;
}) => {
  const shown = useShownCode(code, paths, snippet);
  return <CodeBlock code={shown} lang="tsx" toolbar={<ImportPick />} className={className} />;
};

export default ComponentCode;
