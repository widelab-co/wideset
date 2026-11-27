import { RiArrowRightSLine } from '@remixicon/react';
import React from 'react';

import type { BreadcrumbsProps } from './Breadcrumbs.types';
import { BreadcrumbsDivider } from './BreadcrumbsDivider';

export const breadcrumbsDividersByType = {
  slash: <span aria-hidden="true">/</span>,
  arrow: <RiArrowRightSLine aria-hidden="true" focusable="false" />,
};

const isDivider = (node: React.ReactNode): boolean =>
  React.isValidElement(node) && node.type === BreadcrumbsDivider;

const wrapInListItem = (node: React.ReactNode, key: string, isCurrent = false) => (
  <li
    key={key}
    aria-hidden={isDivider(node) ? true : undefined}
    aria-current={isCurrent ? 'page' : undefined}
  >
    {node}
  </li>
);

const flattenBreadcrumbsItems = (
  children: React.ReactNode,
  parentKeys: React.Key[] = [],
): { node: React.ReactNode; key: string }[] =>
  React.Children.toArray(children).flatMap((node, index) => {
    const element = React.isValidElement<{ children?: React.ReactNode }>(node) ? node : undefined;
    const keys = [...parentKeys, element?.key ?? index];

    if (element?.type === React.Fragment) {
      return flattenBreadcrumbsItems(element.props.children, keys);
    }

    return [{ node, key: JSON.stringify(keys) }];
  });

const currentPageProps = { 'aria-current': 'page', 'aria-disabled': true } as const;

export const separateBreadcrumbsItems = (
  children: React.ReactNode,
  separatorType?: BreadcrumbsProps['separator'],
) => {
  const items = flattenBreadcrumbsItems(children);

  return items.reduce((allElements: React.ReactNode[], { node, key }, index) => {
    const isLast = index === items.length - 1;
    const isElement = React.isValidElement<typeof currentPageProps>(node);
    const item = isLast && isElement ? React.cloneElement(node, currentPageProps) : node;

    allElements.push(wrapInListItem(item, `item-${key}`, isLast && !isElement));

    if (!isLast && separatorType) {
      allElements.push(
        wrapInListItem(<BreadcrumbsDivider separator={separatorType} />, `separator-${key}`),
      );
    }

    return allElements;
  }, []);
};
