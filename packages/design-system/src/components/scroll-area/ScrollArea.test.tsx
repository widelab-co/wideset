import { fireEvent, render, screen } from '@testing-library/react';
import { createRef, type UIEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { ScrollArea } from './ScrollArea';

describe('ScrollArea', () => {
  describe('Basic rendering', () => {
    it('should render with children', () => {
      render(
        <ScrollArea>
          <div>Test content</div>
        </ScrollArea>,
      );
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should add custom className to the scroll area', () => {
      render(
        <ScrollArea className="custom-class" data-testid="scroll-area">
          <span>Test content</span>
        </ScrollArea>,
      );
      const root = screen.getByTestId('scroll-area');
      expect(root).toHaveClass('custom-class');
      expect(root).toHaveClass('overflow-hidden');
    });
  });

  describe('HTML attributes', () => {
    it('should forward HTML and data attributes', () => {
      render(
        <ScrollArea
          data-testid="scroll-area"
          id="scroll-area"
          aria-label="Scrollable content"
          title="Scroll area"
        >
          <span>Test content</span>
        </ScrollArea>,
      );

      const areaRoot = screen.getByTestId('scroll-area');

      expect(areaRoot).toHaveAttribute('data-testid', 'scroll-area');
      expect(areaRoot).toHaveAttribute('id', 'scroll-area');
      expect(areaRoot).toHaveAttribute('aria-label', 'Scrollable content');
      expect(areaRoot).toHaveAttribute('title', 'Scroll area');
    });
  });
  it('calls onScroll on the viewport and exposes its scroll position', () => {
    const ref = createRef<HTMLDivElement>();
    const onScroll = vi.fn((event: UIEvent<HTMLDivElement>) => ({
      viewport: event.currentTarget,
      scrollTop: event.currentTarget.scrollTop,
      scrollLeft: event.currentTarget.scrollLeft,
    }));
    render(
      <ScrollArea ref={ref} onScroll={onScroll}>
        <div>Test content</div>
      </ScrollArea>,
    );

    fireEvent.scroll(ref.current!, { target: { scrollTop: 120, scrollLeft: 40 } });

    expect(onScroll).toHaveBeenCalledOnce();
    expect(onScroll).toHaveReturnedWith({ viewport: ref.current, scrollTop: 120, scrollLeft: 40 });
  });
});

describe('data-slot', () => {
  it('marks each part with data-slot', () => {
    const { container } = render(
      <ScrollArea data-testid="area">
        <span>Test content</span>
      </ScrollArea>,
    );
    expect(screen.getByTestId('area')).toHaveAttribute('data-slot', 'scroll-area');
    expect(container.querySelector('[data-slot="scroll-area-viewport"]')).toContainElement(
      screen.getByText('Test content'),
    );
  });

  describe('ref', () => {
    it('should forward ref to the scrolling viewport', () => {
      const ref = createRef<HTMLDivElement>();
      const { container } = render(
        <ScrollArea ref={ref}>
          <div>Test content</div>
        </ScrollArea>,
      );
      expect(ref.current).toBe(container.querySelector('[data-slot="scroll-area-viewport"]'));
    });
  });
});
