import { Pagination } from '@wideset/react';

import { options, playground } from '../lib/playground-kit';

/**
 * `type` comes from `PaginationProps`; the page counts are numbers, so they are written here.
 * Seven numbered pages (the component default) plus the arrows are wider than the gallery
 * card, so the playground starts at five; the rail switches back to seven.
 */
export default playground({
  from: 'PaginationProps',
  content: [
    {
      key: 'visible',
      label: 'Visible pages',
      type: 'select',
      options: options('5', '7'),
      default: '5',
    },
    { key: 'rowsPerPage', label: 'Rows per page', type: 'switch', default: false },
  ],
  render: (v, { props }) => (
    <Pagination
      // Uncontrolled: remount so the stage starts again on page 3.
      key={JSON.stringify(v)}
      className={v.rowsPerPage ? 'w-[30rem] max-w-full' : undefined}
      {...props()}
      pagesCount={12}
      defaultActivePage={3}
      maxVisiblePages={Number(v.visible)}
      rowsPerPageOptions={v.rowsPerPage ? [10, 25, 50] : false}
    />
  ),
  code: (v, { attrs }) => {
    const props = [
      attrs().trim(),
      'pagesCount={12}',
      'defaultActivePage={3}',
      v.type === 'numbers' && v.visible !== '7' && `maxVisiblePages={${v.visible}}`,
      v.rowsPerPage && 'rowsPerPageOptions={[10, 25, 50]}',
    ].filter(Boolean);
    return `<Pagination\n${props.map((p) => `  ${p}`).join('\n')}\n/>`;
  },
  // Numbers and Overflow are the two `type`s, not parts of one bar: no Anatomy section.
  anatomy: false,
});
