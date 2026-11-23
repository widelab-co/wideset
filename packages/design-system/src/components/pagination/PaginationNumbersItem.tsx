import { type Ref, useRef } from 'react';
import { Button } from 'src/components/button/Button';
import { ListItem } from 'src/components/list-item/ListItem';
import { Select } from 'src/components/select/Select';
import { cn } from 'src/lib/utils';

import { buttonVariants } from '../button/Button.variants';
import { usePaginationContext } from './Pagination.context';

type PaginationNumbersItemProps = {
  page: number;
  previousPage?: number;
  isActive: boolean;
  onChange: (value: number) => void;
  pageButtonRef: Ref<HTMLButtonElement>;
  onEllipsisClose: (event: Event, selectedPage: number) => void;
  buttonSizeClassName: string;
  defaultMotion: boolean;
};

const PaginationNumbersItem = ({
  page,
  previousPage,
  isActive,
  onChange,
  pageButtonRef,
  onEllipsisClose,
  buttonSizeClassName,
  defaultMotion,
}: PaginationNumbersItemProps) => {
  const { selectPageAriaLabel, ellipsisPlaceholder } = usePaginationContext();
  const selectedPageRef = useRef<number | null>(null);
  const previousOrCurrentPage = previousPage ?? page;
  const gap = page - previousOrCurrentPage;
  const inBetweenPageOptions =
    gap > 1
      ? Array.from({ length: gap - 1 }, (_, index) => {
          const value = previousOrCurrentPage + index + 1;

          return {
            label: `${value}`,
            value: `${value}`,
          };
        })
      : [];

  return (
    <li data-slot="pagination-numbers-item" className="gap-ws-5 flex">
      {inBetweenPageOptions.length > 0 && (
        // Composed rather than passed as `options`, so the overflow list can size to its own
        // content and centre on the trigger. The shorthand form pins the list to the trigger
        // width, which is 32px here — multi-digit page numbers get truncated.
        <Select
          value=""
          onValueChange={(value) => {
            const selectedPage = Number(value);
            selectedPageRef.current = selectedPage;
            onChange(selectedPage);
          }}
          defaultMotion={defaultMotion}
        >
          <Select.Trigger
            aria-label={selectPageAriaLabel(previousOrCurrentPage + 1, page - 1)}
            size="sm"
            hideArrow
            className={cn(
              buttonVariants({ preset: 'ghost', size: 'sm', variant: 'secondary' }),
              buttonSizeClassName,
              'flex items-center justify-center border-0 shadow-none',
              // The trigger looks like a ghost button, so the ellipsis follows the button's
              // text colours instead of the Select placeholder colour.
              'data-[placeholder]:text-ws-dynamic-secondary-default',
              'hover:data-[placeholder]:text-ws-dynamic-secondary-hover',
              'active:data-[placeholder]:text-ws-dynamic-secondary-pressed',
              // Figma renders the ellipsis in its pressed state while the list is open.
              'data-[state=open]:bg-ws-dynamic-secondary-alpha-pressed',
              'data-[state=open]:data-[placeholder]:text-ws-dynamic-secondary-pressed',
              // Focus like the sibling page buttons: restore the outline ring that the
              // Select trigger's `outline-hidden` suppresses, and drop its forms focus shadow.
              'focus-visible:outline-solid focus-visible:not-active:shadow-none',
            )}
          >
            {ellipsisPlaceholder}
          </Select.Trigger>
          {/* Figma pins the page list at 98px — an unbound raw value, so a
              designer can tokenise it later. */}
          <Select.Content
            align="center"
            className="w-[98px]!"
            onCloseAutoFocus={(event) => {
              const selectedPage = selectedPageRef.current;
              selectedPageRef.current = null;

              if (selectedPage !== null) {
                onEllipsisClose(event, selectedPage);
              }
            }}
          >
            {inBetweenPageOptions.map((option) => (
              <Select.Option key={option.value} value={option.value} textValue={option.label}>
                <ListItem.Label>{option.label}</ListItem.Label>
              </Select.Option>
            ))}
          </Select.Content>
        </Select>
      )}
      <Button
        ref={pageButtonRef}
        aria-current={isActive ? 'page' : undefined}
        preset={isActive ? 'filled' : 'ghost'}
        size="sm"
        variant="secondary"
        defaultMotion={defaultMotion}
        onClick={() => onChange(page)}
        className={buttonSizeClassName}
      >
        {page}
      </Button>
    </li>
  );
};

export { PaginationNumbersItem };
