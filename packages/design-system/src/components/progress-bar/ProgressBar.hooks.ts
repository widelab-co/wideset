import { useCallback, useEffect, useState } from 'react';

import { warnInvalidMax, warnInvalidValue } from './ProgressBar.logic';

/** The id of the latest mounted part, so the root only points ARIA at an element that exists. */
export const usePartId = () => {
  const [ids, setIds] = useState<string[]>([]);
  const register = useCallback((partId: string) => {
    setIds((current) => [...current, partId]);
    return () =>
      setIds((current) => {
        const index = current.lastIndexOf(partId);
        return index === -1 ? current : current.filter((_, i) => i !== index);
      });
  }, []);
  return [ids[ids.length - 1], register] as const;
};

/** Warns once per invalid `value` or `max` instead of on every render. */
export const useInvalidPropWarnings = (value?: number, max?: number) => {
  useEffect(() => warnInvalidValue(value), [value]);
  useEffect(() => warnInvalidMax(max), [max]);
};
