import { RiAttachment2 } from '@remixicon/react';
import { Select } from '@wideset/react';
import { useState } from 'react';

import { ContextMeter } from './context-meter';
import { context, permissions } from './data';
import { IconAction } from './icon-action';

/**
 * Code's tools in the composer: attach, how much the agent may do in the repository without
 * asking, and how full the context is. The permission is three fixed choices in a `Select`, so
 * the current one is always in view with its chevron; a session whose plan was approved goes on
 * in Accept edits, where edits go through and a command still asks.
 */
export function CodeTools({ defaultPermission = permissions[0] }: { defaultPermission?: string }) {
  const [permission, setPermission] = useState(defaultPermission);

  return (
    <>
      <IconAction label="Attach files" icon={RiAttachment2} />
      <Select
        size="sm"
        aria-label="Permission mode"
        className="w-[11.5rem]"
        options={permissions.map((value) => ({ value, label: value }))}
        value={permission}
        onValueChange={setPermission}
      />
      <ContextMeter {...context} />
    </>
  );
}
