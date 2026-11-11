import { RiSideBarLine } from '@remixicon/react';
import { Breadcrumbs, cn, IconButton, Toast, ToastProvider, useToast } from '@wideset/react';
import { useEffect, useId, useRef, useState } from 'react';

import { type FileItem, FILES, FOLDER, NOW, OPEN_ON_LOAD } from './data';
import { fileButtonId, FileList } from './file-list';
import { formatSize } from './format';
import { MediaViewer } from './media-viewer';
import type { MoreAction } from './more-menu';
import { PageHeader } from './page-header';
import { MediaViewerSidebar } from './sidebar';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';

/**
 * The screen under the toasts: the folder's page, and the viewer over it while a file is open.
 * It holds the files and which one is open, so the viewer's actions (trash, comments) change the
 * same list the page shows. While the viewer is open the page is inert; when it closes, the
 * focus goes back to the row of the file it showed.
 */
function Screen() {
  const { showToast, dismissToast } = useToast();
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [files, setFiles] = useState(FILES);
  const [openId, setOpenId] = useState<string | null>(OPEN_ON_LOAD);
  const lastShown = useRef<string | null>(null);
  const index = files.findIndex((file) => file.id === openId);
  const open = index >= 0;

  const close = () => {
    lastShown.current = openId;
    setOpenId(null);
  };

  // Once the page is no longer inert, the opener takes the focus back.
  useEffect(() => {
    if (openId === null && lastShown.current) {
      document.getElementById(fileButtonId(lastShown.current))?.focus();
    }
  }, [openId]);

  const copyLink = (file: FileItem) => {
    // Clipboard access can be refused (an iframe, a test); the toast still confirms the action.
    navigator.clipboard?.writeText(`https://orbit.so/f/${file.id}`).catch(() => undefined);
    showToast({ content: `Link to ${file.name} copied. People in the workspace can open it.` });
  };

  const trash = (file: FileItem) => {
    const before = files;
    const at = files.indexOf(file);
    const rest = files.filter((item) => item !== file);
    setFiles(rest);
    // The viewer moves on to the file that took its place, or closes on an empty folder.
    if (rest.length === 0) close();
    else setOpenId(rest[Math.min(at, rest.length - 1)].id);
    const id = showToast({
      content: `Moved ${file.name} to the trash`,
      action: (
        <Toast.Action
          preset="ghost"
          onClick={() => {
            setFiles(before);
            dismissToast(id);
          }}
        >
          Undo
        </Toast.Action>
      ),
    });
  };

  const onMore = (file: FileItem, action: MoreAction) => {
    if (action === 'copy-link') copyLink(file);
    if (action === 'show-in-folder') close();
    if (action === 'trash') trash(file);
  };

  const addComment = (file: FileItem, text: string) =>
    setFiles(
      files.map((item) =>
        item === file
          ? {
              ...item,
              comments: [
                ...item.comments,
                { id: `c${Date.now()}`, by: 'maya', postedAt: NOW, text },
              ],
            }
          : item,
      ),
    );

  return (
    <>
      <div inert={open} className="bg-ws-static-background flex h-dvh">
        <MediaViewerSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
        <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
            {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is
                pulled left so its glyph, not its box, sits 20px from the edge; the crumbs follow
                it. */}
            <div className="gap-ws-5 px-ws-11 flex w-full items-center">
              <IconButton
                icon={RiSideBarLine}
                variant="secondary"
                preset="ghost"
                size="sm"
                iconClassName="text-ws-static-subtle size-ws-9"
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-expanded={!collapsed}
                aria-controls={sidebarId}
                onClick={() => setCollapsed(!collapsed)}
                className="-ml-ws-5"
              />
              <Breadcrumbs separator="arrow">
                <Breadcrumbs.Item asChild>
                  <a href="#files">Files</a>
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>{FOLDER.name}</Breadcrumbs.Item>
              </Breadcrumbs>
            </div>
          </div>

          {/* The page scrolls inside the card, so the card's corners stay put. */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-16 flex flex-col')}>
              <PageHeader />
              <FileList files={files} onOpen={setOpenId} />
            </div>
          </div>
        </main>
      </div>

      {open && (
        <MediaViewer
          files={files}
          index={index}
          onIndexChange={(next) => setOpenId(files[next].id)}
          onClose={close}
          onDownload={(file) =>
            showToast({ content: `Downloading ${file.name} (${formatSize(file.size)})` })
          }
          onShare={copyLink}
          onMore={onMore}
          onComment={addComment}
        />
      )}
    </>
  );
}

/**
 * Media viewer (panel): a file opened full screen over the app. Behind it, a folder of files on
 * an Inset page; the viewer opens on load on the third file, and any row opens it again. It
 * shows the file large with previous and next, zoom under it, its details and comments beside
 * it, and closes back to the row it came from.
 */
export default function MediaViewerBlock() {
  return (
    <ToastProvider>
      <Screen />
    </ToastProvider>
  );
}
