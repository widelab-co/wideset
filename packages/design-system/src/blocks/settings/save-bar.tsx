import { Button } from '@wideset/react';

/**
 * The page's one way to save: a bar under the form, shown only while something differs from what
 * is saved. Its buttons end on the form column's right edge; Save submits the form by its id.
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
    <div className="border-ws-static-subtle px-ws-16 py-ws-7 shrink-0 border-t">
      <div className="gap-ws-9 flex max-w-[40rem] items-center justify-between">
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
