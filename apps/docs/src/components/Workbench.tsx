import { cn } from '@wideset/react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

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
import { Code } from './parts';
import Playground from './Playground';
import PropertiesPanel from './PropertiesPanel';
import { useAside } from './useAside';

const Workbench = withPlayground(
  ({
    component,
    paths,
    aside,
  }: {
    component: string;
    paths: ProjectPaths;
    /** The id of an element in the page's right rail that takes the Properties from `xl`. */
    aside?: string;
  }) => {
    const { defaults, groups, code } = PLAYGROUNDS[component];
    const values = useValues(component);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
      const controls = groups.flatMap((group) => group.controls);
      const keys = Object.entries(defaults);
      const active = (query: URLSearchParams) => query.get('tab') === 'playground';

      let restoring = false;
      const sync = () => {
        const query = new URLSearchParams(location.search);
        const isActive = active(query);
        setVisible(isActive);
        if (!isActive) return;

        const next: Values = { ...defaults };
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
      addEventListener('popstate', sync);
      return () => {
        unsubscribe();
        removeEventListener('popstate', sync);
      };
    }, [component, defaults, groups]);

    const shown = useShownCode(code(values), paths, true);
    const rail = useAside(aside);
    if (!visible) return null;
    const properties = (
      <div className="docs-properties min-w-0">
        <PropertiesPanel component={component} />
      </div>
    );
    return (
      <div className={cn('grid gap-ws-14', !aside && 'xl:grid-cols-[minmax(0,1fr)_17rem]')}>
        <div className="flex min-w-0 flex-col gap-ws-9">
          <Playground component={component} className="min-h-[26rem]" />
          <Code code={shown} />
        </div>
        {rail ? (
          createPortal(properties, rail)
        ) : (
          // In the page's rail from `xl`: hidden there until it moves, so nothing flashes.
          <div className={cn(aside && 'xl:hidden')}>{properties}</div>
        )}
      </div>
    );
  },
);

export default Workbench;
