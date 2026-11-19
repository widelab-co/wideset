import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { isDark, onAppearanceChange } from '../lib/theme';

/** The page's theme, following the toggle in the top bar. Light on the server. */
const usePageTheme = () => {
  const [dark, setDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
  );
  useEffect(() => onAppearanceChange((value) => setDark(isDark(value))), []);
  return dark ? 'dark' : 'light';
};

/**
 * True while the element is on screen or within a quarter of a screen of it, and has been for
 * 200 ms, so a fast scroll past a card does not load its block. False again once it leaves.
 */
const useNearScreen = (node: React.RefObject<HTMLElement | null>) => {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const element = node.current;
    if (!element) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          clearTimeout(timer);
          if (entry.isIntersecting) timer = setTimeout(() => setNear(true), 200);
          else setNear(false);
        }
      },
      { rootMargin: '25% 0px' },
    );
    observer.observe(element);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [node]);
  return near;
};

/**
 * A block's preview page in an iframe, drawn at its design size (1440 × 960) and scaled to the
 * width it is given: a picture of the real thing, which the gallery card crops to its top left
 * and edges. The frame exists only while the card is near the screen: a gallery of
 * live blocks keeps a handful of documents alive, not one per block. It takes the page's theme
 * and loads again when that changes; until it loads, the card's own surface shows.
 */
export default function BlockPreviewFrame({ id, title }: { id: string; title: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useLayoutEffect(() => {
    const node = box.current;
    if (!node) return;
    const update = () => setScale(node.clientWidth / 1440);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const near = useNearScreen(box);
  const theme = usePageTheme();
  return (
    <div ref={box} className="relative aspect-[3/2] w-full overflow-hidden">
      {scale > 0 && near && (
        <iframe
          key={theme}
          src={`/blocks/${id}/preview?theme=${theme}`}
          title={`${title} preview`}
          tabIndex={-1}
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 h-[60rem] w-[90rem] origin-top-left border-0"
          style={{ transform: `scale(${scale})` }}
        />
      )}
    </div>
  );
}

/**
 * A block live on its page: the preview route at the frame's own size, so the block has a
 * viewport of its own (its `h-dvh`, its breakpoints), and clickable (`live`: the route stays
 * interactive in a frame). It takes the page's theme and loads again when that changes.
 */
export const BlockLiveFrame = ({ id, title }: { id: string; title: string }) => {
  const theme = usePageTheme();
  return (
    <iframe
      key={theme}
      src={`/blocks/${id}/preview?theme=${theme}&live`}
      title={`${title}, live`}
      className="block size-full border-0"
    />
  );
};
