import * as React from 'react';

/**
 * Whether a node renders anything: `null`, `undefined`, booleans and empty strings do not, so
 * `{false}` or `''` count as absent while `0` and rich nodes count as content.
 */
export const hasContent = (node: React.ReactNode) =>
  React.Children.toArray(node).some((child) => child !== '');
