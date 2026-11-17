// TODO(custom): a full-screen file viewer (a dialog over the whole window: bar, file, previous / next, zoom, details); Wideset's Modal is a fixed 600px card and cannot go full screen, and there is no viewer.
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCloseLine,
  RiDownloadLine,
  RiInformationLine,
  RiShareLine,
} from '@remixicon/react';
import { Button, cn, IconButton } from '@wideset/react';
import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react';

import type { FileItem } from './data';
import { FileDetails } from './file-details';
import { FileIcon } from './file-icon';
import { FilePreview, NATURAL } from './file-preview';
import { type MoreAction, MoreMenu } from './more-menu';
import { useElementSize } from './use-element-size';
import { type Zoom, ZoomControls } from './zoom-controls';

/** Room around the file at Fit: wide enough at the sides for the previous and next arrows. */
const GUTTER = { x: 128, y: 40 };
const FOCUSABLE =
  'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [href], [tabindex]:not([tabindex="-1"])';

type MediaViewerProps = {
  files: FileItem[];
  /** The file on screen, as an index into `files`. */
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  onDownload: (file: FileItem) => void;
  onShare: (file: FileItem) => void;
  onMore: (file: FileItem, action: MoreAction) => void;
  onComment: (file: FileItem, text: string) => void;
};

/**
 * A file opened over the whole app. It is a modal dialog drawn by hand: the page behind is made
 * inert by the screen, Tab cycles inside, Escape closes, and the left and right arrows move to
 * the previous and next file (not while typing a comment). It is a dark island (`dark` on its
 * root, as the lesson's video is), opaque so nothing on the page competes with the file: the
 * scrim token is 56% and lets the page's text show through.
 *
 * The bar names the file and its place in the folder and holds its actions: Share is the one
 * filled button. The file fits the window by default; zooming past it scrolls the stage.
 */
export function MediaViewer({
  files,
  index,
  onIndexChange,
  onClose,
  onDownload,
  onShare,
  onMore,
  onComment,
}: MediaViewerProps) {
  const dialog = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [zoom, setZoom] = useState<Zoom>('fit');
  const [details, setDetails] = useState(true);
  const [stageRef, stage] = useElementSize<HTMLDivElement>();
  const file = files[index];
  const natural = NATURAL[file.kind];
  const fit = Math.max(
    0.1,
    Math.min(
      (stage.width - GUTTER.x * 2) / natural.width,
      (stage.height - GUTTER.y * 2) / natural.height,
    ),
  );
  const scale = zoom === 'fit' ? fit : zoom;

  // The dialog takes the focus when it opens, so the arrows and Escape work at once.
  useEffect(() => dialog.current?.focus(), []);

  const go = (step: number) => {
    const next = index + step;
    if (next < 0 || next >= files.length) return;
    setZoom('fit');
    onIndexChange(next);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const root = dialog.current;
    // A menu opened from the bar renders outside the dialog; its keys are its own.
    if (!root || !root.contains(event.target as Node)) return;
    const typing = (event.target as HTMLElement).closest('input, textarea');

    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    } else if (event.key === 'ArrowLeft' && !typing) {
      go(-1);
    } else if (event.key === 'ArrowRight' && !typing) {
      go(1);
    } else if (event.key === 'Tab') {
      const items = [...root.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const first = items[0];
      const last = items.at(-1);
      const at = document.activeElement;
      if (event.shiftKey && (at === first || at === root)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && at === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  };

  const arrow = 'absolute top-1/2 -translate-y-1/2';

  return (
    // The dialog's own keys (Escape, the arrows, Tab) are handled on it, as Radix's dialogs do.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className="dark bg-ws-static-background text-ws-static-strong z-ws-modal fixed inset-0 flex flex-col outline-hidden"
    >
      {/* A line under the bar, edge to edge: the details' line starts on it, so neither line
          ends in the air. */}
      <header className="h-ws-20 px-ws-11 gap-ws-7 border-ws-static-subtle flex shrink-0 items-center border-b">
        <FileIcon kind={file.kind} />
        <div className="gap-ws-5 flex min-w-0 flex-1 items-baseline">
          <h2 id={titleId} className="typography-label-strong-md truncate">
            {file.name}
          </h2>
          <p className="typography-label-sm text-ws-static-subtle shrink-0 tabular-nums">
            {index + 1} of {files.length}
          </p>
        </div>
        <div className="gap-ws-3 flex items-center">
          <IconButton
            icon={RiDownloadLine}
            variant="secondary"
            preset="ghost"
            size="sm"
            aria-label={`Download ${file.name}`}
            onClick={() => onDownload(file)}
          />
          <MoreMenu name={file.name} onAction={(action) => onMore(file, action)} />
          <IconButton
            icon={RiInformationLine}
            variant="secondary"
            preset="ghost"
            size="sm"
            aria-label="Details"
            aria-pressed={details}
            onClick={() => setDetails(!details)}
          />
          <Button size="sm" onClick={() => onShare(file)} className="mx-ws-3">
            <Button.Icon icon={RiShareLine} />
            Share
          </Button>
          <IconButton
            icon={RiCloseLine}
            variant="secondary"
            preset="ghost"
            size="sm"
            aria-label="Close"
            aria-keyshortcuts="Escape"
            onClick={onClose}
            className="-mr-ws-3"
          />
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="relative min-h-0 flex-1">
            {/* The stage scrolls when the file is zoomed past the window; it takes the focus for
                that, so the keyboard can scroll it too. */}
            <div
              ref={stageRef}
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrolling region must be reachable by keyboard
              tabIndex={0}
              role="region"
              aria-label="File"
              className="focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default h-full overflow-auto focus-visible:-outline-offset-4"
            >
              <div className="px-ws-20 py-ws-16 flex min-h-full w-max min-w-full items-center justify-center">
                <FilePreview file={file} scale={scale} />
              </div>
            </div>
            <IconButton
              icon={RiArrowLeftSLine}
              variant="secondary"
              preset="border"
              aria-label="Previous file"
              aria-keyshortcuts="ArrowLeft"
              disabled={index === 0}
              onClick={() => go(-1)}
              className={cn(arrow, 'left-ws-11')}
            />
            <IconButton
              icon={RiArrowRightSLine}
              variant="secondary"
              preset="border"
              aria-label="Next file"
              aria-keyshortcuts="ArrowRight"
              disabled={index === files.length - 1}
              onClick={() => go(1)}
              className={cn(arrow, 'right-ws-11')}
            />
          </div>
          <div className="h-ws-20 flex shrink-0 items-center justify-center">
            <ZoomControls zoom={zoom} scale={scale} onZoomChange={setZoom} />
          </div>
        </div>

        {details && <FileDetails file={file} onComment={(text) => onComment(file, text)} />}
      </div>
    </div>
  );
}
