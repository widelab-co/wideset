// TODO(custom): a toast with two actions (Open folder and Undo); Wideset's Toast renders one Toast.Action, so both sit in the message, laid out as the expanded toast lays out its action row.
import { Toast } from '@wideset/react';

/**
 * What the toast says after a move, for an expanded toast: where the files went, then going there
 * or taking it back. Open folder comes first, since checking the result is the usual next step.
 */
export function MoveToast({
  message,
  onOpenFolder,
  onUndo,
}: {
  message: string;
  onOpenFolder: () => void;
  onUndo: () => void;
}) {
  return (
    <>
      {message}
      <span className="mt-ws-9 gap-ws-7 flex">
        <Toast.Action variant="secondary" onClick={onOpenFolder}>
          Open folder
        </Toast.Action>
        <Toast.Action variant="secondary" preset="ghost" onClick={onUndo}>
          Undo
        </Toast.Action>
      </span>
    </>
  );
}
