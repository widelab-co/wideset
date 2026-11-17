import { useEffect, useState } from 'react';

import type { ProjectPaths } from '../lib/importSource';
import { PLAYGROUNDS, setValues, useValues, withPlayground } from '../lib/playground';
import type { Values } from '../lib/playground-kit';
import { useShownCode } from './ComponentCode';
import { Code, SOFT_NAVIGATE } from './parts';
import Playground from './Playground';
import PropertiesPanel from './PropertiesPanel';

/**
 * One component on the bench: the stage with the code of its current values under it, and the
 * Properties beside them (no line between). The values are in the URL (`?c=button&variant=danger`:
 * only what differs from the defaults), so a configuration can be shared.
 */
const Workbench = withPlayground(
  ({
    component,
    initial,
    paths,
  }: {
    component: string;
    initial: URLSearchParams | null;
    paths: ProjectPaths;
  }) => {
    const { defaults, groups, code } = PLAYGROUNDS[component];
    const values = useValues(component);
    useEffect(() => {
      if (!initial) return;
      const controls = groups.flatMap((group) => group.controls);
      const patch: Values = {};
      for (const [key, fallback] of Object.entries(defaults)) {
        const raw = initial.get(key);
        if (raw === null) continue;
        const control = controls.find((item) => item.key === key);
        if (typeof fallback === 'boolean') patch[key] = raw === 'true';
        else if (control?.type !== 'select' || control.options.some((o) => o.value === raw))
          patch[key] = raw;
      }
      if (Object.keys(patch).length) setValues(component, patch);
    }, [initial, component, defaults, groups]);
    useEffect(() => {
      const query = new URLSearchParams({ c: component });
      for (const [key, fallback] of Object.entries(defaults))
        if (values[key] !== fallback) query.set(key, String(values[key]));
      history.replaceState(null, '', `?${query}`);
    }, [component, values, defaults]);
    const shown = useShownCode(code(values), paths, true);
    return (
      <div className="grid gap-ws-14 xl:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="flex min-w-0 flex-col gap-ws-9">
          <Playground component={component} className="min-h-[26rem]" />
          <Code code={shown} />
        </div>
        <div className="docs-properties">
          <PropertiesPanel component={component} />
        </div>
      </div>
    );
  },
);

/** The Playground's bench for the component in the URL (`?c=`); the sidebar switches it in place. */
const PlaygroundPage = ({
  items,
  paths,
}: {
  items: { id: string; title: string }[];
  paths: ProjectPaths;
}) => {
  const read = () => {
    const asked = new URLSearchParams(location.search).get('c');
    return items.some((item) => item.id === asked) ? asked! : 'button';
  };
  // The address as of the last navigation (the load, a sidebar switch, Back or Forward): its
  // values go on the bench, not the ones the page opened with.
  const [query, setQuery] = useState(() => new URLSearchParams(location.search));
  const [component, setComponent] = useState(read);
  useEffect(() => {
    const sync = () => {
      setQuery(new URLSearchParams(location.search));
      setComponent(read());
    };
    addEventListener(SOFT_NAVIGATE, sync);
    addEventListener('popstate', sync);
    return () => {
      removeEventListener(SOFT_NAVIGATE, sync);
      removeEventListener('popstate', sync);
    };
    // `read` only reads the address and the page's constant list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Workbench
      key={component}
      component={component}
      initial={component === query.get('c') ? query : null}
      paths={paths}
    />
  );
};

export default PlaygroundPage;
