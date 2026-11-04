import { useLayoutEffect, useState } from 'react';

export type SelectionPill = {
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  animate: boolean;
};

const isSamePill = (a: SelectionPill, b: SelectionPill) =>
  (Object.keys(a) as (keyof SelectionPill)[]).every((key) => a[key] === b[key]);

export const useSelectionPill = (enabled: boolean) => {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [pill, setPill] = useState<SelectionPill | null>(null);

  useLayoutEffect(() => {
    if (!enabled || !node) return;

    const controller = new AbortController();
    const { signal } = controller;
    let lastSelected: HTMLElement | null = null;

    const resizeObserver = new ResizeObserver(() => measure());

    const measure = () => {
      node
        .querySelectorAll(':scope > [role="radio"]')
        .forEach((item) => resizeObserver.observe(item));

      const selected = node.querySelector<HTMLElement>(':scope > [data-state="checked"]');
      if (!selected) {
        setPill((previous) => previous && { ...previous, visible: false });
        return;
      }

      const moved = lastSelected !== null && lastSelected !== selected;
      lastSelected = selected;

      const next: SelectionPill = {
        x: selected.offsetLeft,
        y: selected.offsetTop,
        width: selected.offsetWidth,
        height: selected.offsetHeight,
        visible: !selected.hasAttribute('data-disabled'),
        animate: moved,
      };
      setPill((previous) => (previous && isSamePill(previous, next) ? previous : next));
    };

    const mutationObserver = new MutationObserver(measure);

    measure();
    resizeObserver.observe(node);
    mutationObserver.observe(node, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['data-state', 'data-disabled'],
    });
    document.fonts?.ready.then(() => !signal.aborted && measure());

    return () => {
      controller.abort();
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [enabled, node]);

  return { ref: setNode, pill };
};
