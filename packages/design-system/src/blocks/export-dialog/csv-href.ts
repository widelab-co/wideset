/**
 * A CSV file as a link's target, the way a spreadsheet opens it: every cell quoted, quotes inside
 * doubled. With `download` on the link the browser saves it; nothing is sent anywhere. A real
 * screen links to the file on the server instead.
 */
export const csvHref = (rows: (string | number)[][]) =>
  `data:text/csv;charset=utf-8,${encodeURIComponent(
    rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n'),
  )}`;
