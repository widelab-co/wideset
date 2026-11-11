import { useEffect, useRef, useState } from 'react';

import type { Step, StepKind } from './data';
import type { SequenceKey } from './flow';
import { FlowSequence } from './flow-sequence';
import { ZoomControls, ZOOMS } from './zoom-controls';

/** The space kept around the flow, in px: `p-ws-14` on its frame. */
const ROOM = 32;

/**
 * The canvas: the flow centred at the top of a plain white area that scrolls both ways when the
 * flow outgrows it, and the zoom controls in its lower left corner, away from the panel. No grid
 * or dots: on a white page they were noise around six nodes.
 */
export function WorkflowCanvas({
  flow,
  selectedId,
  onSelect,
  onInsert,
  onDeleteKey,
}: {
  flow: Step[];
  selectedId: string;
  onSelect: (id: string) => void;
  onInsert: (sequence: SequenceKey, index: number, kind: StepKind) => void;
  onDeleteKey: () => void;
}) {
  const [zoom, setZoom] = useState(ZOOMS.findIndex((step) => step.value === 1));
  const scrollerRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);

  // A step selected off screen (a new one, or the one above a deleted one) scrolls into view;
  // not on load, where it would scroll a page that shows this screen among others.
  const loaded = useRef(false);
  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      return;
    }
    const node = document.getElementById(`step-${selectedId}`);
    if (typeof node?.scrollIntoView === 'function') {
      node.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [selectedId]);

  /** The largest step up to 100% at which the whole flow fits the canvas. */
  const fit = () => {
    const scroller = scrollerRef.current;
    const box = flowRef.current?.getBoundingClientRect();
    // Nothing is laid out yet (or in a test DOM): leave the zoom as it is.
    if (!scroller || !box?.width) return;
    const width = box.width / ZOOMS[zoom].value;
    const height = box.height / ZOOMS[zoom].value;
    const roomX = scroller.clientWidth - ROOM * 2;
    const roomY = scroller.clientHeight - ROOM * 2;
    const fits = ZOOMS.map(({ value }, index) => ({ value, index })).filter(
      ({ value }) => value <= 1 && width * value <= roomX && height * value <= roomY,
    );
    setZoom(fits.at(-1)?.index ?? 0);
  };

  return (
    <div className="relative min-h-0 min-w-0 flex-1">
      <div ref={scrollerRef} className="inset-ws-0 absolute overflow-auto">
        <div className="p-ws-14 flex w-max min-w-full justify-center">
          <div ref={flowRef} className={ZOOMS[zoom].className}>
            <FlowSequence
              steps={flow}
              sequence="root"
              selectedId={selectedId}
              onSelect={onSelect}
              onInsert={onInsert}
              onDeleteKey={onDeleteKey}
            />
          </div>
        </div>
      </div>
      <ZoomControls
        zoom={zoom}
        onZoomChange={setZoom}
        onFit={fit}
        className="bottom-ws-9 left-ws-9 absolute"
      />
    </div>
  );
}
