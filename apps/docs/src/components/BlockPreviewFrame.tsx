import { useLayoutEffect, useRef, useState } from 'react';

/**
 * A block's preview page in an iframe, drawn at its design size (1440 × 960) and scaled to the
 * width it is given, so a card shows the whole screen as a picture of the real thing.
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
    <div
      ref={box}
      className="relative aspect-[3/2] w-full overflow-hidden rounded-ws-container-md border border-ws-static-base"
    >
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
