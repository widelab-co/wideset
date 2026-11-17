type Box = { left: number; right: number; top: number; width: number; height: number };

/**
 * Where the open list anchors while the trigger's summary changes width: the trigger as it was
 * when the list opened, pinned to whichever side has not moved since. In a right-aligned toolbar
 * the trigger grows leftwards, so the right edge holds; in a left-aligned one the left edge does.
 */
export function frozenAnchor(start: Box, live: Box): Box {
  const rightStayed = Math.abs(live.right - start.right) < Math.abs(live.left - start.left);
  const left = rightStayed ? live.right - start.width : live.left;
  return {
    left,
    right: left + start.width,
    top: live.top,
    width: start.width,
    height: live.height,
  };
}
