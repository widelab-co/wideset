import { type ReactNode, useEffect, useRef } from 'react';

function reveal(row: HTMLDivElement, tab: HTMLElement) {
  const bounds = row.getBoundingClientRect();
  const item = tab.getBoundingClientRect();
  if (item.left < bounds.left) row.scrollLeft += item.left - bounds.left;
  else if (item.right > bounds.right) row.scrollLeft += item.right - bounds.right;
}

/**
 * The divider spans the reading column. The space below the list keeps the underline inside the
 * scroll area when the tabs overflow.
 */
const TabRow = ({ children, selected }: { children: ReactNode; selected?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const row = ref.current;
    if (!row || !selected) return;
    const tab = row.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
    if (tab) reveal(row, tab);
  }, [selected]);
  return (
    <div
      ref={ref}
      className="docs-tab-row docs-scroll min-w-0 overflow-x-auto pb-px shadow-[inset_0_-1px_0_var(--border-color-ws-static-subtle)]"
      onFocus={(event) => {
        if (event.target.getAttribute('role') === 'tab') reveal(event.currentTarget, event.target);
      }}
    >
      {children}
    </div>
  );
};

export default TabRow;
