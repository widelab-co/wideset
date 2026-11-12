'use client';

import { useLayoutEffect, useState } from 'react';

export type TabsIndicator = {
  x: number;
  width: number;
  visible: boolean;
  animate: boolean;
};

const isSameIndicator = (a: TabsIndicator, b: TabsIndicator) =>
  (Object.keys(a) as (keyof TabsIndicator)[]).every((key) => a[key] === b[key]);

export const useTabsIndicator = (enabled: boolean) => {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [indicator, setIndicator] = useState<TabsIndicator | null>(null);

  useLayoutEffect(() => {
    if (!enabled || !node) return;

    const controller = new AbortController();
    const { signal } = controller;
    let lastActive: HTMLElement | null = null;

    const resizeObserver = new ResizeObserver(() => measure());

    const measure = () => {
      node.querySelectorAll('[role="tab"]').forEach((item) => resizeObserver.observe(item));

      const active =
        node.querySelector<HTMLElement>('[data-active]') ??
        node.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
      if (!active) {
        setIndicator((previous) => previous && { ...previous, visible: false });
        return;
      }

      const moved = lastActive !== null && lastActive !== active;
      lastActive = active;

      const next: TabsIndicator = {
        x: active.offsetLeft,
        width: active.offsetWidth,
        visible: !active.hasAttribute('data-disabled'),
        animate: moved,
      };
      setIndicator((previous) => (previous && isSameIndicator(previous, next) ? previous : next));
    };

    const mutationObserver = new MutationObserver(measure);

    measure();
    resizeObserver.observe(node);
    mutationObserver.observe(node, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['data-state', 'data-active', 'data-disabled'],
    });
    document.fonts?.ready.then(() => !signal.aborted && measure());

    return () => {
      controller.abort();
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [enabled, node]);

  return { ref: setNode, indicator };
};
