import { useEffect, useState } from 'react';

import { type CodeLang, highlight } from '../lib/highlight';

export function useHighlightedCode(code: string, lang: CodeLang) {
  const [result, setResult] = useState<{ code: string; lang: CodeLang; html: string }>();
  useEffect(() => {
    let live = true;
    void highlight(code, lang).then(
      (html) => {
        if (live) setResult({ code, lang, html });
      },
      () => {
        // Keep the plain-text preview if highlighting is unavailable.
      },
    );
    return () => {
      live = false;
    };
  }, [code, lang]);
  return result?.code === code && result.lang === lang ? result.html : null;
}
