import { useEffect, useState } from 'react';

import type { ProjectPaths } from '../lib/importSource';
import {
  PLAYGROUNDS,
  setValues,
  subscribeValues,
  useValues,
  withPlayground,
} from '../lib/playground';
import type { Values } from '../lib/playground-kit';
import { useShownCode } from './ComponentCode';
import { Code, SOFT_NAVIGATE } from './parts';
import Playground from './Playground';
import PropertiesPanel from './PropertiesPanel';

const Workbench = withPlayground(
  ({
    component,
    paths,
    tabbed = false,
  }: {
    component: string;
    paths: ProjectPaths;
    tabbed?: boolean;
  }) => {
    const { defaults, groups, code } = PLAYGROUNDS[component];
    const values = useValues(component);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
      const controls = groups.flatMap((group) => group.controls);
      const keys = Object.entries(defaults);
      const active = (query: URLSearchParams) =>
        tabbed ? query.get('tab') === 'playground' : query.get('c') === component;

      let restoring = false;
      const sync = () => {
        const query = new URLSearchParams(location.search);
        if (tabbed) {
          setVisible(active(query));
          if (!active(query)) return;
        }

        const next: Values = { ...defaults };
        if (active(query)) {
          for (const [key, fallback] of keys) {
            const raw = query.get(key);
            if (raw == null) continue;
            const control = controls.find((item) => item.key === key);
            if (typeof fallback === 'boolean') {
              if (raw === 'true' || raw === 'false') next[key] = raw === 'true';
            } else if (
              control?.type !== 'select' ||
              control.options.some((option) => option.value === raw)
            ) {
              next[key] = raw;
            }
          }
        }

        // Navigation restores the address into the store. Only edits go back into the address.
        restoring = true;
        setValues(component, next);
        restoring = false;
      };

      const unsubscribe = subscribeValues(component, (next) => {
        const url = new URL(location.href);
        if (restoring || !active(url.searchParams)) return;
        for (const [key, fallback] of keys) {
          if (next[key] === fallback) url.searchParams.delete(key);
          else url.searchParams.set(key, String(next[key]));
        }
        if (url.href !== location.href) history.replaceState(history.state, '', url);
      });
      sync();
      addEventListener(SOFT_NAVIGATE, sync);
      addEventListener('popstate', sync);
      return () => {
        unsubscribe();
        removeEventListener(SOFT_NAVIGATE, sync);
        removeEventListener('popstate', sync);
      };
    }, [component, defaults, groups, tabbed]);

    const shown = useShownCode(code(values), paths, true);
    if (!visible) return null;
    return (
      <div className="grid gap-ws-14 xl:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="flex min-w-0 flex-col gap-ws-9">
          <Playground component={component} className="min-h-[26rem]" />
          <Code code={shown} />
        </div>
        <div className="docs-properties min-w-0">
          <PropertiesPanel component={component} />
        </div>
      </div>
    );
  },
);

export default Workbench;
