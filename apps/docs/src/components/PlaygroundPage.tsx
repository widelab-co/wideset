import { useEffect, useState } from 'react';

import type { ProjectPaths } from '../lib/importSource';
import { SOFT_NAVIGATE } from './parts';
import Workbench from './Workbench';

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
  const [component, setComponent] = useState(read);
  useEffect(() => {
    const sync = () => {
      const id = read();
      const url = new URL(location.href);
      if (url.searchParams.get('c') !== id) {
        url.search = new URLSearchParams({ c: id }).toString();
        history.replaceState(history.state, '', url);
      }
      setComponent(id);
    };
    sync();
    addEventListener(SOFT_NAVIGATE, sync);
    addEventListener('popstate', sync);
    return () => {
      removeEventListener(SOFT_NAVIGATE, sync);
      removeEventListener('popstate', sync);
    };
    // `read` only reads the address and the page's constant list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Workbench key={component} component={component} paths={paths} />;
};

export default PlaygroundPage;
