import * as React from 'react';

import { separateBreadcrumbsItems } from './Breadcrumbs.logic';
import type { BreadcrumbsProps, BreadcrumbsWithSubComponents } from './Breadcrumbs.types';
import { BreadcrumbsDivider } from './BreadcrumbsDivider';
import { BreadcrumbsItem } from './BreadcrumbsItem';

const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ children, className, separator, ...props }, ref) => (
    <nav ref={ref} data-slot="breadcrumbs" aria-label="Breadcrumb" className={className} {...props}>
      <ol className="group gap-ws-3 m-0 flex list-none flex-nowrap items-center p-0">
        {separateBreadcrumbsItems(children, separator)}
      </ol>
    </nav>
  ),
) as BreadcrumbsWithSubComponents;

Breadcrumbs.displayName = 'Breadcrumbs';
Breadcrumbs.Item = BreadcrumbsItem;
Breadcrumbs.Divider = BreadcrumbsDivider;

export { Breadcrumbs };
