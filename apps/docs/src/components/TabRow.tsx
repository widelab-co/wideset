import { type ReactNode, useEffect, useRef } from 'react';

function reveal(row: HTMLDivElement, tab: HTMLElement) {
  const bounds = row.getBoundingClientRect();
  const item = tab.getBoundingClientRect();
  const styles = getComputedStyle(row);
  const left = bounds.left + parseFloat(styles.paddingLeft);
  const right = bounds.right - parseFloat(styles.paddingRight);
  if (item.left < left) row.scrollLeft += item.left - left;
  else if (item.right > right) row.scrollLeft += item.right - right;
}

/**
 * The scroll area leaves room for the Tabs focus outline and the active underline.
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
      className="docs-tab-row docs-scroll min-w-0 overflow-x-auto"
      onFocus={(event) => {
        if (event.target.getAttribute('role') === 'tab') reveal(event.currentTarget, event.target);
      }}
    >
      {children}
    </div>
  );
};

export default TabRow;
