import { useState } from 'react';

import { FILES, OPEN_ON_LOAD } from './files-data';
import { FilesOpenFile } from './files-open-file';
import { FilesTree, type Reveal } from './files-tree';

/**
 * The Files pane: the repository as a tree, and under it the file picked there. They are stacked,
 * not side by side, because the pane is 28rem to 48rem wide and code needs the whole of that;
 * the tree takes what its rows need, up to half the pane, and scrolls past it. The session's
 * changes show in both: marked in the tree, and line by line in the open file's gutter.
 */
export function FilesPane() {
  const [open, setOpen] = useState(OPEN_ON_LOAD);
  const [inConversation, setInConversation] = useState<string[]>([]);
  const [reveal, setReveal] = useState<Reveal>();
  const file = FILES.find((candidate) => candidate.path === open) ?? FILES[0];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <FilesTree files={FILES} active={file.path} onOpen={setOpen} reveal={reveal} />
      <FilesOpenFile
        file={file}
        inConversation={inConversation.includes(file.path)}
        onConversationChange={(added) =>
          setInConversation(
            added
              ? [...inConversation, file.path]
              : inConversation.filter((path) => path !== file.path),
          )
        }
        onReveal={(path) => setReveal({ path, key: (reveal?.key ?? 0) + 1 })}
      />
    </div>
  );
}
