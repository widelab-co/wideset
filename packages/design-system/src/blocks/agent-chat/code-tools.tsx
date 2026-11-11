import { RiAttachment2 } from '@remixicon/react';
import { Select } from '@wideset/react';
import { useState } from 'react';

import { permissions } from './data';
import { IconAction } from './icon-action';

/**
 * Code's tools in the composer: attach, then how much the agent may do in the repository without
 * asking. Three fixed choices in a `Select`, so the current one is always in view with its
 * chevron.
 */
export function CodeTools() {
  const [permission, setPermission] = useState(permissions[0]);

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
    </>
  );
}
