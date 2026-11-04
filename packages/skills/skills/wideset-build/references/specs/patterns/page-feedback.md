# Page feedback

> Tell the user what happened, in the right place, with the right weight, and let them act on it.

## Problem

Results of actions, problems with a section, product-wide notices and running tasks each need a
different component and a different place on the screen. Picking the loudest one for everything
trains users to ignore it.

## Choose

| What you need to say                                           | Component                | Where                                         | Stays?                          |
| -------------------------------------------------------------- | ------------------------ | --------------------------------------------- | ------------------------------- |
| One field is wrong                                             | `FormField` `errorText`  | Under the field                               | Until fixed                     |
| A section or form has a problem, or a note about it            | `InlineAlert`            | Top of that section / form                    | Until fixed or dismissed        |
| The whole product or page is affected (outage, billing, trial) | `SystemAlert`            | First thing in the page column                | Until dismissed or resolved     |
| An action just finished (saved, sent, deleted, with Undo)      | `Toast` via `useToast()` | Screen corner, from `ToastProvider`           | A few seconds (default 5000 ms) |
| A task is running and its progress is known                    | `ProgressBar`            | Where the task lives (upload area, row, card) | While running, then result      |
| The user must decide or acknowledge before going on            | `Modal` / `StatusModal`  | Over the page                                 | Until answered                  |
| State of a record (Paid, Failed)                               | `StatusBadge`            | On the record                                 | Part of the data                |

Rules of thumb: closer to the cause beats louder. If the message is about one section, it is
an `InlineAlert` there, not a `SystemAlert`. If the user must act before continuing, it is not a
`Toast`: toasts disappear.

## Status names differ per component

| Meaning      | InlineAlert | SystemAlert | Toast     | StatusModal   | ProgressBar `status` | StatusBadge |
| ------------ | ----------- | ----------- | --------- | ------------- | -------------------- | ----------- |
| Failure      | `error`     | `negative`  | `error`   | `error`       | `error`              | `negative`  |
| Warning      | `warning`   | `notice`    | —         | `notice`      | —                    | `notice`    |
| Success      | `success`   | `positive`  | `success` | `positive`    | `success`            | `positive`  |
| Information  | `info`      | `info`      | `info`    | `information` | —                    | `info`      |
| No judgement | —           | `neutral`   | `neutral` | `neutral`     | `default`            | `neutral`   |

## Structure

```
ToastProvider (app root)                       — see app-shell
main
├ SystemAlert status emphasis message           — page-wide, first
├ header
└ section
  ├ InlineAlert status title message            — about this section, at its top
  │ └ InlineAlert.Action
  ├ ProgressBar value                            — the running task, in place
  │ ├ ProgressBar.Header > Label, Value
  │ ├ ProgressBar.Track
  │ └ ProgressBar.Description
  └ form > FormField errorText                   — field-level
```

## Example

```tsx
import { Button, InlineAlert, ProgressBar, SystemAlert, useToast } from '@wideset/react';

export function ImportPage({
  progress,
  failedRows,
}: {
  progress: number | null;
  failedRows: number;
}) {
  const { showToast } = useToast();

  return (
    <div className="gap-ws-12 p-ws-12 flex flex-col">
      <SystemAlert status="notice" message="Imports are paused on Sunday from 02:00 to 04:00.">
        <SystemAlert.Action>Learn more</SystemAlert.Action>
      </SystemAlert>

      <section className="gap-ws-9 flex flex-col">
        <h2 className="typography-subtitle-sm text-ws-static-strong">Import contacts</h2>
        {failedRows > 0 && (
          <InlineAlert
            status="warning"
            persistent
            title={`${failedRows} rows were skipped`}
            message="They have no email address. Fix them in the file and import again."
          >
            <InlineAlert.Action>Download skipped rows</InlineAlert.Action>
          </InlineAlert>
        )}
        {progress !== null && (
          <ProgressBar value={progress}>
            <ProgressBar.Header>
              <ProgressBar.Label>Importing contacts</ProgressBar.Label>
              <ProgressBar.Value />
            </ProgressBar.Header>
            <ProgressBar.Track />
            <ProgressBar.Description>You can leave this page.</ProgressBar.Description>
          </ProgressBar>
        )}
        <Button onClick={() => showToast({ content: 'Import settings saved', status: 'success' })}>
          Save settings
        </Button>
      </section>
    </div>
  );
}
```

`useToast()` throws outside `ToastProvider`; mount the provider once, high in the tree.

## Variants

- **Toast with Undo.** `showToast({ content: 'Project archived', action: <Toast.Action
onClick={undo}>Undo</Toast.Action> })`. Use for reversible actions instead of a confirmation.
- **Long-running toast.** `variant: 'expanded'` with `description` and `footer`, `duration: 0`
  to keep it until dismissed.
- **Alerts from code.** `useInlineAlert()` returns `ref` and `showInlineAlert`; mount
  `<InlineAlert.Outlet ref={ref} />` where the alerts should appear.
- **InlineAlert layout.** `orientation="vertical"` for long copy, several actions or a narrow
  column (side panel); `horizontal` (default) for one short line.
- **Blocking problem.** `SystemAlert emphasis="high"` for something that blocks work (failed
  payment); keep it rare.
- **Compact progress.** `ProgressBar type="circle"` in a table row or file list; name the task
  in the text beside it and in `aria-label`. On completion switch `status` to `success` or `error` and say what
  happened in `description`.
- **Failure that needs a decision.** `StatusModal status="error"` with a Retry button.

## Accessibility

- `error` / `negative` alerts and error toasts get `role="alert"` and are read at once; the rest
  are `role="status"`, read when the screen reader is idle. Don't add your own live regions
  around them.
- Make alerts `persistent` (InlineAlert) or non-`dismissible` (SystemAlert) while the
  condition still holds; closing them would only hide the problem.
- Toasts disappear. Never put the only copy of an error, or the only way to act, in a toast.
- `ProgressBar.Label` names the bar; the circle has no label, so give it `aria-label` and name the
  task in the text beside it.
- The message says what happened and what to do; colour and icons only back it up.

## Anti-patterns

- A `SystemAlert` for a form error, or a `Toast` for a validation error.
- Stacking several alerts of the same status; merge them into one with a list.
- A success `InlineAlert` that stays forever after a save; use a `Toast`.
- `ProgressBar` as a loading spinner with a made-up value. Wideset has no indeterminate
  progress or skeleton; show "Loading…" text and `aria-busy` (see
  [list-and-filters](list-and-filters.md)).
- Passing one component's status name to another (`<Toast status="positive">`, `<InlineAlert
status="negative">`): check the table above.
