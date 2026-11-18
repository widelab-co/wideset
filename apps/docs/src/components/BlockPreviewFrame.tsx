import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { isDark, onAppearanceChange } from '../lib/theme';

/**
 * A block's preview page in an iframe, drawn at its design size (1440 × 960) and scaled to the
 * width it is given, so a card shows the whole screen as a picture of the real thing. The card
 * draws the edge; the gallery frames a block this way until it has a screenshot.
 */
export default function BlockPreviewFrame({
  id,
  title,
  theme,
}: {
  id: string;
  title: string;
  theme?: 'light' | 'dark';
}) {
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
  const src = `/blocks/${id}/preview${theme ? `?theme=${theme}` : ''}`;
  return (
    <div ref={box} className="relative aspect-[3/2] w-full overflow-hidden">
      {scale > 0 && (
        <iframe
          src={src}
          title={`${title} preview`}
          loading="lazy"
          tabIndex={-1}
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
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => onAppearanceChange((value) => setDark(isDark(value))), []);
  const theme = dark ? 'dark' : 'light';
  return (
    <iframe
      key={theme}
      src={`/blocks/${id}/preview?theme=${theme}&live`}
      title={`${title}, live`}
      className="block size-full border-0"
    />
  );
};
