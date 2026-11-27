import type React from 'react';
import { useCallback } from 'react';
import { cn } from 'src/lib/utils';

import { Search } from '../search/Search';
import type { SelectSearchProps } from './Select.types';
import { selectSearchVariants } from './Select.variants';

export const SelectSearch = ({ value, onChange, onClear, className }: SelectSearchProps) => {
  const searchRef = useCallback((input: HTMLInputElement | null) => {
    input?.focus();
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const viewport = event.currentTarget.closest('[data-radix-select-viewport]');
      const items = Array.from(
        viewport?.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])') ??
          [],
      );
      if (items.length === 0) return;
      (event.key === 'ArrowDown' ? items[0] : items[items.length - 1]).focus();
      return;
    }
    event.stopPropagation();
  };

  return (
    <Search
      ref={searchRef}
      data-slot="select-search"
      className={cn(selectSearchVariants(), className)}
      value={value}
      size="sm"
      onChange={onChange}
      onClear={onClear}
      onKeyDown={handleKeyDown}
    />
  );
};

SelectSearch.displayName = 'Select.Search';
