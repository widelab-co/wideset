import { Tabs } from '@wideset/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { loadExample } from '../lib/exampleLoader';
import type { ProjectPaths } from '../lib/importSource';
import { useFrameTheme } from '../lib/useFrameTheme';
import ComponentCode from './ComponentCode';
import FrameThemeButton from './FrameThemeButton';
import TabRow from './TabRow';

/**
 * An example on the card's stage, centred at its own width. When it needs more than the card has (two fixed-width cards
 * side by side, a row of selects), it is laid out at its natural size and drawn smaller to
 * fit, so nothing overlaps or runs off the card.
 */
export const Fit = ({ children }: { children: React.ReactNode }) => {
  const box = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = box.current;
    const stage = el?.parentElement;
    if (!el || !stage) return;
    const measure = () => {
      const style = getComputedStyle(stage);
      const room =
        stage.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      if (zoom === null) {
        if (el.scrollWidth > el.clientWidth + 1 || el.offsetWidth > room + 1)
          setZoom(Math.min(1, room / el.scrollWidth));
        return;
      }
      const next = Math.min(1, room / el.offsetWidth);
      if (Math.abs(next - zoom) > 0.01) setZoom(next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    // The story can grow after it mounts (images, fonts, a lazy part).
    observer.observe(el);
    return () => observer.disconnect();
  }, [zoom]);
  return (
    <div
      ref={box}
      // The transform makes this box the one a `position: fixed` story (Action Bar) sits in.
      className={`[transform:translateZ(0)] ${zoom === null ? 'max-w-full min-w-0' : ''}`}
      style={zoom === null ? undefined : { width: 'max-content', zoom }}
    >
      {children}
    </div>
  );
};

/** A caption's `code` spans as inline code; the rest as text. */
const Prose = ({ text }: { text: string }) => (
  <>
    {text.split(/(`[^`]+`)/).map((part, index) =>
      part.startsWith('`') ? (
        <code
          key={index}
          className="rounded-ws-control-md bg-ws-static-alpha-subtle px-ws-3 py-ws-2 font-mono typography-body-sm text-ws-static-strong"
        >
          {part.slice(1, -1)}
        </code>
      ) : (
        part
      ),
    )}
  </>
);

/**
 * One example as one card, preview always in view: the title, the live component, and under
 * it Description (the file's leading JSDoc) and Code (the file) as tabs. The
 * text comes from the server; the component loads in the browser (a component cannot travel
 * to the client as a prop), only the one this card shows.
 */
const Example = ({
  file,
  title,
  caption,
  code,
  paths,
}: {
  /** The example file, as src/lib/exampleLoader.ts globs it. */
  file: string;
  title: string;
  caption?: string;
  code: string;
  paths: ProjectPaths;
}) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  useEffect(() => {
    let live = true;
    loadExample(file).then((loaded) => {
      if (live && loaded) setComponent(() => loaded);
    });
    return () => {
      live = false;
    };
  }, [file]);
  const mounted = Component !== null;
  // Each example can show the other theme than the page; it follows the page until switched.
  const theme = useFrameTheme(mounted);

  return (
    <div className="docs-card overflow-hidden rounded-ws-container-lg border border-ws-static-base">
      <div className={`docs-frame relative min-h-[20rem] ${theme.frameClass}`}>
        <h3 className="absolute top-ws-8 left-ws-9 typography-label-strong-sm text-ws-static-strong">
          {title}
        </h3>
        <FrameThemeButton dark={theme.dark} onToggle={theme.toggle} />
        <div className="grid min-h-[20rem] place-items-center px-ws-14 pt-ws-16 pb-ws-14 text-ws-static-base">
          {Component && (
            <Fit>
              <Component />
            </Fit>
          )}
        </div>
      </div>
      <Tabs defaultValue={caption ? 'description' : 'code'} divider={false} size="sm">
        <div className="docs-card-rule border-t border-ws-static-base px-ws-9">
          <TabRow>
            <Tabs.List>
              {caption && (
                <Tabs.Item value="description">
                  <Tabs.Label>Description</Tabs.Label>
                </Tabs.Item>
              )}
              <Tabs.Item value="code">
                <Tabs.Label>Code</Tabs.Label>
              </Tabs.Item>
            </Tabs.List>
          </TabRow>
        </div>
        {caption && (
          <Tabs.Content value="description" className="p-ws-9">
            <p className="typography-body-md leading-ws-600 text-ws-static-base">
              <Prose text={caption} />
            </p>
          </Tabs.Content>
        )}
        <Tabs.Content value="code" className="p-ws-7">
          <ComponentCode code={code} paths={paths} />
        </Tabs.Content>
      </Tabs>
    </div>
  );
};

export default Example;
