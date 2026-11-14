// TODO(custom): a drawn preview of a file's shape (a page, a slide, a sheet, a waveform); Wideset has no file preview, and blocks ship no images.
import { cn } from '@wideset/react';

import type { Kind } from './data';

/** Text lines on a page, as widths: a title, then a paragraph that ends short. */
const LINES = ['w-full', 'w-11/12', 'w-full', 'w-4/5', 'w-full', 'w-3/5'];
/** A recording's waveform: bar heights, loud in the middle of the call. */
const WAVE = [
  'h-ws-10',
  'h-ws-13',
  'h-ws-16',
  'h-ws-11',
  'h-ws-18',
  'h-ws-20',
  'h-ws-15',
  'h-ws-21',
  'h-ws-17',
  'h-ws-12',
  'h-ws-19',
  'h-ws-21',
  'h-ws-16',
  'h-ws-20',
  'h-ws-14',
  'h-ws-18',
  'h-ws-11',
  'h-ws-15',
  'h-ws-19',
  'h-ws-13',
  'h-ws-10',
  'h-ws-14',
  'h-ws-9',
];

const PAGE = 'bg-ws-static-foreground border-ws-static-subtle border';
const LINE = 'bg-ws-static-alpha-strong h-ws-2 rounded-ws-control-full';

/** A portrait page, cropped by the tile's bottom edge, with a title and a paragraph. */
function Page({ table }: { table?: boolean }) {
  return (
    <div
      className={cn(
        PAGE,
        'rounded-t-ws-control-md gap-ws-5 px-ws-7 pt-ws-7 bottom-ws-0 absolute inset-x-[22%] top-[18%] flex flex-col border-b-0',
      )}
    >
      <div className={cn(LINE, 'h-ws-3 w-1/2')} />
      {table ? (
        // A sheet: a header row, then rows of cells split by hairlines.
        <div className="bg-ws-static-alpha-base grid grid-cols-3 gap-px">
          {Array.from({ length: 18 }, (_, cell) => (
            <div
              key={cell}
              className={cn(
                'h-ws-5',
                cell < 3 ? 'bg-ws-static-highlight-strong' : 'bg-ws-static-foreground',
              )}
            />
          ))}
        </div>
      ) : (
        <div className="gap-ws-3 flex flex-col">
          {LINES.map((width, line) => (
            <div key={line} className={cn(LINE, width)} />
          ))}
        </div>
      )}
    </div>
  );
}

/** A slide: a title over a block and two lines beside it. */
function Slide() {
  return (
    <div
      className={cn(
        PAGE,
        'rounded-ws-control-md gap-ws-5 p-ws-7 absolute inset-x-[16%] top-1/2 flex aspect-[16/10] -translate-y-1/2 flex-col',
      )}
    >
      <div className={cn(LINE, 'h-ws-3 w-1/2')} />
      <div className="gap-ws-5 flex flex-1">
        <div className="bg-ws-static-alpha-base rounded-ws-control-sm flex-1" />
        <div className="gap-ws-3 flex flex-1 flex-col">
          <div className={cn(LINE, 'w-full')} />
          <div className={cn(LINE, 'w-4/5')} />
          <div className={cn(LINE, 'w-3/5')} />
        </div>
      </div>
    </div>
  );
}

/** A waveform across the middle: what a call recording looks like before it plays. */
function Wave() {
  return (
    <div className="gap-ws-3 inset-ws-0 absolute flex items-center justify-center">
      {WAVE.map((height, bar) => (
        <div
          key={bar}
          className={cn('bg-ws-static-alpha-strong w-ws-3 rounded-ws-control-full', height)}
        />
      ))}
    </div>
  );
}

/**
 * A file's shape drawn in a few grey marks on a neutral ground, so a grid of files reads at a
 * glance without loading anything: documents and PDFs a page, decks a slide, spreadsheets a
 * table, recordings a waveform. Decorative: the name under it says what it is.
 */
export function FilePreview({
  kind,
  className,
}: {
  kind: Exclude<Kind, 'folder'>;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('bg-ws-static-alpha-subtle relative aspect-[16/10] overflow-hidden', className)}
    >
      {kind === 'deck' ? (
        <Slide />
      ) : kind === 'recording' ? (
        <Wave />
      ) : (
        <Page table={kind === 'sheet'} />
      )}
    </div>
  );
}
