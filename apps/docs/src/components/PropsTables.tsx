import { RiCornerDownRightLine } from '@remixicon/react';

import type { PropRow } from '../lib/catalog';
import { kebab } from '../lib/kebab';

type PropsPart = {
  part: string;
  element?: string;
  rows: PropRow[];
};

const UNION = /^'[^']*'( \| '[^']*')+$/;

const Chip = ({ children }: { children: React.ReactNode }) => (
  <code className="inline-flex rounded-ws-control-md bg-ws-static-alpha-subtle px-ws-4 py-ws-2 font-mono typography-body-sm [overflow-wrap:anywhere] text-ws-static-base">
    {children}
  </code>
);

/** A union shows each value as written in code (`'primary'`), anything else its type. */
const TypeCell = ({ type }: { type: string }) =>
  UNION.test(type) ? (
    <div className="flex flex-wrap gap-ws-3">
      {type.split(' | ').map((value) => (
        <Chip key={value}>{value}</Chip>
      ))}
    </div>
  ) : (
    <Chip>{type}</Chip>
  );

const HEAD = 'px-ws-9 py-ws-6 text-left typography-caption-strong-md text-ws-static-subtle';
const CELL = 'px-ws-9 py-ws-8 align-top';

/** Everything the part does not list goes to the element it renders: said once, as the table's last row. */
/**
 * The official reference for what a part renders: MDN for an HTML element (`<button>`), the
 * Radix docs for a Radix part (`Radix Dialog.Content`), MDN's global attributes otherwise.
 */
const referenceFor = (element: string) => {
  const tag = element.match(/^<(\w+)>$/)?.[1];
  if (tag && tag !== 'element')
    return {
      label: `MDN: <${tag}>`,
      href: `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/${tag}`,
    };
  const radix = element.match(/^Radix (\w+)\.(\w+)$/);
  if (radix) {
    const page = kebab(radix[1]);
    return {
      label: `Radix ${radix[1]}.${radix[2]}`,
      href: `https://www.radix-ui.com/primitives/docs/components/${page}#${radix[2].toLowerCase()}`,
    };
  }
  return {
    label: 'MDN: global attributes',
    href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes',
  };
};

const PassThrough = ({ element, plain = false }: { element: string; plain?: boolean }) => {
  const reference = referenceFor(element);
  return (
    <div
      className={`flex items-center gap-ws-5 px-ws-9 py-ws-7 typography-body-sm leading-ws-500 text-ws-static-subtle ${plain ? '' : 'bg-ws-static-alpha-subtle'}`}
    >
      <RiCornerDownRightLine className="size-ws-9 shrink-0" aria-hidden="true" />
      <span>
        Every other prop of <Chip>{element}</Chip> is passed through to it. See{' '}
        <a
          href={reference.href}
          target="_blank"
          rel="noreferrer"
          className="text-ws-static-strong underline underline-offset-2"
        >
          {reference.label}
        </a>
        .
      </span>
    </div>
  );
};

const PropsBox = ({ part, plain = false }: { part: PropsPart; plain?: boolean }) => (
  <div className="docs-card overflow-hidden rounded-ws-container-lg border border-ws-static-base">
    {part.rows.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse typography-body-md">
          <thead>
            <tr className="border-b border-ws-static-base">
              <th className={`${HEAD} w-[11rem]`}>Name</th>
              <th className={HEAD}>Description</th>
              <th className={`${HEAD} w-[7rem]`}>Default</th>
            </tr>
          </thead>
          <tbody>
            {part.rows.map((row) => (
              <tr key={row.name} className="border-b border-ws-static-base last:border-b-0">
                <td className={CELL}>
                  <code className="font-mono typography-label-strong-sm text-ws-static-strong">
                    {row.name}
                  </code>
                  {row.required && (
                    <span className="ml-ws-2 text-ws-dynamic-danger-default">*</span>
                  )}
                </td>
                <td className={CELL}>
                  {row.description && (
                    <p className="mb-ws-5 leading-ws-500 text-ws-static-base">{row.description}</p>
                  )}
                  <TypeCell type={row.type} />
                </td>
                <td className={CELL}>
                  {row.defaultValue ? (
                    <Chip>
                      {/^(true|false|\d+)$/.test(row.defaultValue)
                        ? row.defaultValue
                        : `'${row.defaultValue.replace(/^['"]|['"]$/g, '')}'`}
                    </Chip>
                  ) : (
                    <span className="text-ws-static-subtle">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="flex flex-col items-center gap-ws-3 px-ws-9 py-ws-16 text-center">
        <span className="typography-label-strong-sm text-ws-static-strong">
          No props of its own
        </span>
        <span className="typography-body-sm text-ws-static-subtle">
          It takes its content as children{part.element ? '' : ' and nothing else'}.
        </span>
      </div>
    )}
    {part.element && (
      <div className="border-t border-ws-static-base">
        <PassThrough element={part.element} plain={plain} />
      </div>
    )}
  </div>
);

/**
 * The props, one table per part, as Storybook's ArgTypes reads them: the prop as written in
 * code, its description with the type underneath (a union as its literal values), and the
 * default. Every part at once, one after another under its name, so a reader scrolls and searches
 * all the props; the page flow holds no row of tabs. `plain` drops the grey bands and makes the
 * pass-through note a plain last row.
 */
const PropsTables = ({ parts }: { parts: PropsPart[] }) => {
  if (!parts.length) return null;
  if (parts.length === 1) return <PropsBox part={parts[0]} />;
  return (
    <div className="flex flex-col gap-ws-18">
      {parts.map((part) => (
        <section key={part.part} aria-label={part.part} className="flex flex-col gap-ws-7">
          <h3 className="typography-label-strong-sm text-ws-static-strong">{part.part}</h3>
          <div>
            <PropsBox part={part} plain />
          </div>
        </section>
      ))}
    </div>
  );
};

export default PropsTables;
