import { useCallback, useState } from 'react';

/**
 * Holds the id of a mounted part (its own `id` or a generated one), so the root only points ARIA
 * at an element that exists and keeps pointing at it when a caller sets the part's `id`.
 */
export const usePartId = () => {
  const [id, setId] = useState<string>();
  const register = useCallback((partId: string) => {
    setId(partId);
    return () => setId((current) => (current === partId ? undefined : current));
  }, []);
  return [id, register] as const;
};
