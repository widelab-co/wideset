// TODO(custom): shimmering text for work in progress ("Thinking"); Wideset has no shimmer keyframes and a block cannot add CSS, so the sweep runs on the Web Animations API.
import { type ReactNode, useEffect, useRef } from 'react';

/** A CSS time ("400ms", "0.4s") in milliseconds. */
const toMs = (value: string) => parseFloat(value) * (/\ds$/.test(value.trim()) ? 1000 : 1);

/**
 * Text a light passes over while something is still running: greys only, from the subtle text
 * colour to the strong one and back. One pass takes four `slow` beats of the motion tokens, at
 * their linear easing. Under reduced motion the tokens drop to 1ms, and where there is no Web
 * Animations API (a test) nothing runs: the text then stands still in the subtle colour.
 */
export function Shimmer({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof node.animate !== 'function') return;
    const tokens = getComputedStyle(node);
    const beat = toMs(tokens.getPropertyValue('--ws-motion-duration-slow'));
    if (!(beat > 1)) return;
    // The gradient is two texts wide and repeats, so moving it by its own width loops unseen.
    const sweep = node.animate(
      { backgroundPosition: ['200% 0', '0% 0'] },
      {
        duration: beat * 4,
        iterations: Infinity,
        easing: tokens.getPropertyValue('--ws-motion-ease-linear').trim() || 'linear',
      },
    );
    return () => sweep.cancel();
  }, []);

  return (
    <span
      ref={ref}
      className="bg-[linear-gradient(90deg,var(--ws-static-text-subtle)_35%,var(--ws-static-text-strong)_50%,var(--ws-static-text-subtle)_65%)] bg-[length:200%_100%] bg-clip-text bg-[position:130%_0] text-transparent"
    >
      {children}
    </span>
  );
}
