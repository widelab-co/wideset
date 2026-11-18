// TODO(custom): a toast drawn inside the viewer; ToastProvider portals its stack to the body and takes no container, so it cannot sit in the viewer's dark scope.
import { Toast } from '@wideset/react';
import { useEffect } from 'react';

export type ViewerToastData = {
  /** Changes with every toast, so a new one starts its own clock. */
  key: number;
  message: string;
  /** Takes the action back; the toast then offers Undo. */
  onUndo?: () => void;
};

/** How long it stays, as the library's toasts do. */
const DURATION = 5000;

/**
 * What the viewer says after an action (link copied, download started, file trashed), in its
 * bottom right corner. It is drawn inside the viewer and not by `ToastProvider`: there it sits in
 * the viewer's `dark` scope, so it is the light toast of the dark theme in both themes instead of
 * a dark toast on the dark viewer, and Tab reaches Undo from inside the dialog. One at a time: a
 * new one takes the place of the last.
 */
export function ViewerToast({
  toast,
  onDismiss,
}: {
  toast: ViewerToastData;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, DURATION);
    return () => clearTimeout(timer);
  }, [toast.key, onDismiss]);

  return (
    <div className="right-ws-9 bottom-ws-9 z-ws-notification absolute w-full max-w-[24rem]">
      <Toast onDismiss={onDismiss}>
        <Toast.Message>{toast.message}</Toast.Message>
        {toast.onUndo && (
          <Toast.Action
            preset="ghost"
            onClick={() => {
              toast.onUndo?.();
              onDismiss();
            }}
          >
            Undo
          </Toast.Action>
        )}
      </Toast>
    </div>
  );
}
