import { playground } from '../lib/playground-kit';

/** Stage and code come from `examples/link-button/default.tsx`; this file adds the dark stage. */
export default playground({
  from: 'LinkButtonProps',
  stage: (v) => (v.variant === 'inverse' ? 'bg-ws-static-inverse-background' : undefined),
});
