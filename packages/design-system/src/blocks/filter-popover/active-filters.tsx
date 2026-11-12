import { RiCloseLine } from '@remixicon/react';
import { Chip } from '@wideset/react';
import { Fragment } from 'react';

import { describe, type Filter } from './conditions';

/**
 * The filter on the list, in words, between the toolbar and the table: one chip per condition,
 * the join word between them, each chip removing its condition. The chips are the summary; the
 * Filter button carries no count.
 */
export function ActiveFilters({
  filter,
  onChange,
}: {
  filter: Filter;
  onChange: (filter: Filter) => void;
}) {
  if (filter.conditions.length === 0) return null;

  return (
    <div
      role="group"
      aria-label="Filters on the list"
      className="gap-ws-5 flex flex-wrap items-center"
    >
      {filter.conditions.map((condition, index) => {
        const words = describe(condition);
        return (
          <Fragment key={condition.id}>
            {index > 0 && (
              <span className="typography-label-sm text-ws-static-subtle">{filter.join}</span>
            )}
            <Chip
              variant="secondary"
              aria-label={`Remove filter: ${words}`}
              onClick={() =>
                onChange({
                  ...filter,
                  conditions: filter.conditions.filter((c) => c.id !== condition.id),
                })
              }
            >
              {words}
              <Chip.Icon icon={RiCloseLine} />
            </Chip>
          </Fragment>
        );
      })}
    </div>
  );
}
