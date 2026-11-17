import type { ReactNode } from 'react';
import * as React from 'react';

/** `0` is content; `null`, `undefined`, `false` and `''` are not. */
export const hasContent = (node: ReactNode) => node != null && node !== false && node !== '';

/** `Children.toArray` that also unwraps fragments, keeping keys unique. */
export const flattenChildren = (children: ReactNode, keyPrefix = ''): ReactNode[] =>
  React.Children.toArray(children).flatMap((child) => {
    if (!React.isValidElement<{ children?: ReactNode }>(child)) return [child];
    const key = `${keyPrefix}${child.key}`;
    return child.type === React.Fragment
      ? flattenChildren(child.props.children, key)
      : [React.cloneElement(child, { key })];
  });
