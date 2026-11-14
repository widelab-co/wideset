// TODO(custom): unsaved-changes bar (count, Cancel, Save); ActionBar is for selections only.
import { Button } from '@wideset/react';

/**
 * The page's one way to save: a bar along the card's foot, under the scrolling page, shown only
 * while something differs from what is saved. It runs on the page's column, so its buttons end
 * where the controls do; Save submits the form by its id.
 */
export function SaveBar({
  form,
  changes,
  onCancel,
}: {
  form: string;
  changes: number;
  onCancel: () => void;
}) {
  return (
    <div className="border-ws-static-base py-ws-7 shrink-0 border-t">
      <div className="gap-ws-9 px-ws-14 mx-auto flex w-full max-w-[80rem] items-center justify-between">
        <p role="status" className="typography-body-md text-ws-static-base">
          {changes === 1 ? '1 unsaved change' : `${changes} unsaved changes`}
        </p>
        <div className="gap-ws-5 flex">
          <Button size="sm" variant="secondary" preset="border" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" type="submit" form={form}>
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
