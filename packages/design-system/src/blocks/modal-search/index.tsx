import { Button } from '@wideset/react';
import { useState } from 'react';

import { index, QUERY, workspace } from './data';
import { SearchModal } from './search-modal';

/** Search modal: search across the workspace, here over an empty page that reopens it. */
export default function ModalSearchBlock() {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-ws-static-foreground flex h-dvh items-center justify-center">
      <Button variant="secondary" preset="border" onClick={() => setOpen(true)}>
        Open search
      </Button>
      <SearchModal
        index={index}
        workspace={workspace}
        initialQuery={QUERY}
        open={open}
        onOpenChange={setOpen}
        // A starting point has nowhere to go: opening a result closes the search.
        onOpenResult={() => setOpen(false)}
      />
    </div>
  );
}
