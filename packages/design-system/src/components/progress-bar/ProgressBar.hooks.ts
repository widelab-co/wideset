import { useCallback, useState } from 'react';

/** The id of a mounted part, so the root only points ARIA at an element that exists. */
export const usePartId = () => {
  const [id, setId] = useState<string>();
  const register = useCallback((partId: string) => {
    setId(partId);
    return () => setId((current) => (current === partId ? undefined : current));
  }, []);
  return [id, register] as const;
};
