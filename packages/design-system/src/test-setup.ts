import '@testing-library/jest-dom';

import { configure } from '@testing-library/react';
import { vi } from 'vitest';

// Render in StrictMode, as apps do in development, so stale state and leaky effects fail here.
configure({ reactStrictMode: true });

// Mock scrollIntoView for jsdom (used by Radix primitives)
Element.prototype.scrollIntoView = vi.fn();

// Mock pointer capture methods for Radix UI (used by select, dropdown, etc.)
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = vi.fn().mockReturnValue(false);
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = vi.fn();
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = vi.fn();
}

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
}
