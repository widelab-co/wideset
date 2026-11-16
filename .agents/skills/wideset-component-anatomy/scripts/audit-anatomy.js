/**
 * Audit the Anatomy section of every component page, from the browser console of any docs page
 * (`pnpm docs:dev`, http://localhost:4321). Paste this file, then:
 *
 *   await auditAnatomy();                     // every page in the sidebar, at 1280px
 *   await auditAnatomy(['card', 'tabs'], 1440);
 *
 * Each page loads in a hidden iframe of the given width, scrolls to the picture, waits for it to
 * settle and is measured. Keep the tab in front: a background tab throttles timers and pages time
 * out as "not drawn". One line per page:
 *
 *   card  8/8 drawn  zoom 0.81  right: Action  drift: Media +22
 *
 *   n/m drawn   names in the picture / parts in the table
 *   zoom        the drawing's scale (1 is 1:1; below ~0.6 the composition is too wide)
 *   absent      parts the table says are "Renders no element"
 *   overlap     names that touch each other            (must be empty)
 *   on drawing  names over the component                (must be empty)
 *   outside     names cut by the frame                  (must be empty)
 *   above       names in the row above the drawing
 *   right       names in the right column
 *   drift       names more than 4px off their part's first line, "outside" when off the part
 */
async function auditAnatomy(ids, width = 1280) {
  const pages =
    ids ??
    [...new Set([...document.querySelectorAll('a[href^="/components/"]')].map((a) => a.pathname))]
      .map((path) => path.split('/')[2])
      .filter(Boolean);
  const results = [];
  for (const id of pages) {
    const result = await auditPage(id, width);
    console.log(format(result));
    results.push(result);
  }
  return results;
}

async function auditPage(id, width) {
  const frame = document.createElement('iframe');
  frame.style.cssText = `position:fixed;left:0;top:0;width:${width}px;height:900px;opacity:0.01;pointer-events:none;z-index:9999`;
  frame.src = `/components/${id}?tab=anatomy`;
  document.body.append(frame);
  try {
    await new Promise((resolve) => (frame.onload = resolve));
    const page = frame.contentDocument;
    const section = page.getElementById('panel-anatomy');
    if (!section) return { id, error: 'no page' };
    section.scrollIntoView();
    // Wait until the picture is drawn and its names stop moving.
    let picture,
      drawing,
      previous = '',
      stable = 0;
    for (let i = 0; i < 60 && stable < 3; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      picture = section.querySelector('.docs-frame');
      drawing = picture?.querySelector(':scope > [inert]');
      if (!drawing || drawing.style.visibility === 'hidden') {
        drawing = null;
        continue;
      }
      const now =
        [...picture.querySelectorAll(':scope > span')]
          .map((s) => s.style.top + s.style.left)
          .join() +
        picture.style.height +
        drawing.style.transform;
      stable = now === previous ? stable + 1 : 0;
      previous = now;
    }
    const rows = [...page.querySelectorAll('[data-anatomy-row]')];
    const nameOf = (row) => row.firstElementChild.firstChild.textContent.trim();
    if (!drawing) return { id, parts: rows.length, error: picture ? 'not drawn' : 'no picture' };

    const box = picture.getBoundingClientRect();
    const art = drawing.getBoundingClientRect();
    const names = [...picture.querySelectorAll(':scope > span')].map((span) => ({
      name: span.textContent,
      rect: span.getBoundingClientRect(),
    }));
    const hit = (a, b) =>
      a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1;
    const above = names.filter((n) => n.rect.bottom <= art.top + 1).map((n) => n.name);
    const drift = [];
    for (const row of rows) {
      const label = names.find((n) => n.name === nameOf(row));
      const part = drawing.querySelector(`[data-slot="${row.getAttribute('data-anatomy-row')}"]`);
      if (!label || !part || above.includes(label.name)) continue;
      const r = part.getBoundingClientRect();
      const middle = label.rect.top + label.rect.height / 2;
      if (middle < r.top - 2 || middle > r.bottom + 2) {
        drift.push(`${label.name} outside`);
        continue;
      }
      const scale = part.offsetWidth ? r.width / part.offsetWidth : 1;
      const line =
        parseFloat(frame.contentWindow.getComputedStyle(part).lineHeight) * scale || r.height;
      const off = Math.round(middle - (r.top + Math.min(r.height, line) / 2));
      if (Math.abs(off) > 4) drift.push(`${label.name} ${off > 0 ? '+' : ''}${off}`);
    }
    return {
      id,
      parts: rows.length,
      drawn: names.length,
      zoom: +(drawing.style.transform.match(/scale\(([\d.]+)\)/)?.[1] ?? 1),
      absent: rows
        .filter((row) => row.querySelector('[data-anatomy-absent]:not([hidden])'))
        .map(nameOf),
      overlap: names.flatMap((a, i) =>
        names
          .slice(i + 1)
          .filter((b) => hit(a.rect, b.rect))
          .map((b) => `${a.name}/${b.name}`),
      ),
      onDrawing: names.filter((n) => hit(n.rect, art)).map((n) => n.name),
      outside: names
        .filter(
          (n) =>
            n.rect.left < box.left - 1 ||
            n.rect.right > box.right + 1 ||
            n.rect.top < box.top - 1 ||
            n.rect.bottom > box.bottom + 1,
        )
        .map((n) => n.name),
      above,
      right: names.filter((n) => n.rect.left >= art.right - 1).map((n) => n.name),
      drift,
    };
  } catch (error) {
    return { id, error: String(error) };
  } finally {
    frame.remove();
  }
}

function format(r) {
  if (r.error) return `${r.id}  ${r.error}`;
  const list = (label, items) => (items.length ? `  ${label}: ${items.join(', ')}` : '');
  return (
    `${r.id}  ${r.drawn}/${r.parts} drawn  zoom ${r.zoom.toFixed(2)}` +
    list('absent', r.absent) +
    list('OVERLAP', r.overlap) +
    list('ON DRAWING', r.onDrawing) +
    list('OUTSIDE', r.outside) +
    list('above', r.above) +
    list('right', r.right) +
    list('drift', r.drift)
  );
}
