import { useMemo } from 'react';
import { Select } from 'src/components/select/Select';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { usePaginationContext } from './Pagination.context';
import type { PaginationRowsPerPageProps } from './Pagination.types';

const PaginationRowsPerPage = ({
  className,
  label,
  options,
  defaultMotion,
  ...props
}: PaginationRowsPerPageProps) => {
  const {
    localItemsPerPage,
    rowsPerPageOptions,
    rowsPerPageLabel,
    onItemsPerPageChange,
    motion: paginationMotion,
  } = usePaginationContext();
  const motion = useDefaultMotion(defaultMotion ?? paginationMotion);

  const rowsPerPageSelectOptions = useMemo(
    () =>
      (options ?? rowsPerPageOptions).map((option) => ({
        label: `${option}`,
        value: `${option}`,
      })),
    [options, rowsPerPageOptions],
  );

  if (!(options ?? rowsPerPageOptions).length) return null;

  return (
    <div
      data-slot="pagination-rows-per-page"
      className={cn('gap-ws-7 flex items-center', className)}
      {...props}
    >
      <div className="text-ws-static-base typography-label-sm whitespace-nowrap">
        {label ?? rowsPerPageLabel}
      </div>
      <Select
        className="w-ws-22"
        options={rowsPerPageSelectOptions}
        value={localItemsPerPage.toString()}
        onValueChange={onItemsPerPageChange}
        size="sm"
        defaultMotion={motion}
      />
    </div>
  );
};

PaginationRowsPerPage.displayName = 'Pagination.RowsPerPage';

export { PaginationRowsPerPage };
