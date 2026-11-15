import { RiArrowLeftSLine } from '@remixicon/react';
import { Button } from '@wideset/react';
import { type ComponentType, useEffect, useState } from 'react';

import { loadBlock } from '../lib/blockLoader';
import { usePageDark } from './parts';

/**
 * The block itself, the whole page of the full-screen route: the library's component at the
 * window's size. Opened on its own it carries a small way back; framed in the block's page it
 * does not.
 */
export const BlockView = ({ id, back }: { id: string; back: string }) => {
  const [Block, setBlock] = useState<ComponentType | null>(null);
  const [framed, setFramed] = useState(true);
  useEffect(() => {
    let live = true;
    setFramed(window.top !== window.self);
    loadBlock(id).then((loaded) => {
      if (live && loaded) setBlock(() => loaded);
    });
    return () => {
      live = false;
    };
  }, [id]);
  return (
    <>
      {Block && <Block />}
      {!framed && (
        <div className="z-ws-toast fixed bottom-ws-7 left-ws-7">
          <Button
            asChild
            size="sm"
            variant="secondary"
            preset="border"
            className="shadow-ws-medium"
          >
            <a href={back}>
              <Button.Icon icon={RiArrowLeftSLine} />
              Back
            </a>
          </Button>
        </div>
      )}
    </>
  );
};

/**
 * A live block on its page: the full-screen route in a frame, so the block has a viewport of its
 * own (its `h-dvh`, its breakpoints). The route reads the theme when it loads, so the frame
 * loads again when the page's theme changes.
 */
export const BlockFrame = ({ id, title }: { id: string; title: string }) => {
  const dark = usePageDark();
  return (
    <iframe
      key={String(dark)}
      title={`${title}, live`}
      src={`/docs/blocks/${id}/full`}
      className="block size-full border-0"
    />
  );
};
