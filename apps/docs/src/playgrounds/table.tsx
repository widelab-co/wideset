import { playground } from '../lib/playground-kit';

/**
 * Stage and code come from `examples/table/default.tsx`. Size and the separated, striped and
 * interactive looks come from `TableProps`. Hidden: the per-cell layout props the root
 * passes down (`align`, `placement`, `flushMargin`, `truncate`), which the stage's columns
 * set themselves; `selected`, which belongs on `Table.Row`; the sticky options, which need a
 * scrolling container; `hasBackground`, which only matters under sticky parts; and
 * `selectionMode`, which needs selectable rows and otherwise only turns on the same hover as
 * `interactive`.
 */
export default playground({
  from: 'TableProps',
  hide: [
    'align',
    'placement',
    'flushMargin',
    'truncate',
    'selected',
    'stickyHeader',
    'stickyColumn',
    'hasBackground',
    'selectionMode',
  ],
  labels: { interactive: 'Hoverable rows' },
  group: { interactive: 'State' },
});
