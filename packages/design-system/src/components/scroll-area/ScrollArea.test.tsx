import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ScrollArea } from './ScrollArea';

const part = (container: HTMLElement, slot: string) =>
  container.querySelector<HTMLElement>(`[data-slot="${slot}"]`);
const bars = (container: HTMLElement) =>
  [...container.querySelectorAll<HTMLElement>('[data-slot="scroll-area-scrollbar"]')].map((bar) =>
    bar.getAttribute('data-orientation'),
  );

describe('ScrollArea', () => {
  describe('Rendering', () => {
    it('renders its children inside the viewport', () => {
      const { container } = render(
        <ScrollArea>
          <p>Release notes</p>
        </ScrollArea>,
      );
      expect(part(container, 'scroll-area-viewport')).toContainElement(
        screen.getByText('Release notes'),
      );
    });

    it('marks each part with data-slot', () => {
      const { container } = render(
        <ScrollArea scrollbarVisibility="always">
          <p>Release notes</p>
        </ScrollArea>,
      );
      expect(container.firstElementChild).toHaveAttribute('data-slot', 'scroll-area');
      expect(part(container, 'scroll-area-viewport')).toBeInTheDocument();
      expect(part(container, 'scroll-area-scrollbar')).toBeInTheDocument();
    });

    it('matches the snapshot', () => {
      const { container } = render(
        <ScrollArea scrollbarVisibility="always" className="h-[16rem]">
          <p>Release notes</p>
        </ScrollArea>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('Props and ref', () => {
    it('merges className and forwards rest props to the root', () => {
      render(
        <ScrollArea data-testid="area" id="notes" aria-label="Release notes" className="h-[16rem]">
          <p>Release notes</p>
        </ScrollArea>,
      );
      const root = screen.getByTestId('area');
      expect(root).toHaveAttribute('id', 'notes');
      expect(root).toHaveAttribute('aria-label', 'Release notes');
      expect(root).toHaveClass('h-[16rem]', 'overflow-hidden');
    });

    it('forwards ref to the viewport, the element that scrolls', () => {
      const ref = createRef<HTMLDivElement>();
      const { container } = render(
        <ScrollArea ref={ref}>
          <p>Release notes</p>
        </ScrollArea>,
      );
      expect(ref.current).toBe(part(container, 'scroll-area-viewport'));
    });
  });

  describe('Orientation', () => {
    it('gives a vertical area one vertical bar', () => {
      const { container } = render(
        <ScrollArea scrollbarVisibility="always">
          <p>Release notes</p>
        </ScrollArea>,
      );
      expect(bars(container)).toEqual(['vertical']);
    });

    it('gives a horizontal area one horizontal bar', () => {
      const { container } = render(
        <ScrollArea orientation="horizontal" scrollbarVisibility="always">
          <p>Release notes</p>
        </ScrollArea>,
      );
      expect(bars(container)).toEqual(['horizontal']);
    });

    it('gives an area that scrolls both ways both bars', () => {
      const { container } = render(
        <ScrollArea orientation="both" scrollbarVisibility="always">
          <p>Release notes</p>
        </ScrollArea>,
      );
      expect(bars(container)).toEqual(['vertical', 'horizontal']);
    });

    it('keeps vertical content as wide as the area, so truncate cuts', () => {
      // Radix wraps the content in `display: table`, which grows with a nowrap line.
      const { container } = render(
        <ScrollArea>
          <p className="truncate">A very long file name that has to be cut.pdf</p>
        </ScrollArea>,
      );
      expect(part(container, 'scroll-area-viewport')).toHaveClass('[&>div]:!block');
    });

    it('lets horizontal content grow wider than the area', () => {
      const { container } = render(
        <ScrollArea orientation="horizontal">
          <p>Release notes</p>
        </ScrollArea>,
      );
      expect(part(container, 'scroll-area-viewport')).not.toHaveClass('[&>div]:!block');
    });
  });

  describe('Gutter', () => {
    it('reserves no space by default: the bar floats over the content', () => {
      const { container } = render(
        <ScrollArea>
          <p>Release notes</p>
        </ScrollArea>,
      );
      expect(part(container, 'scroll-area-viewport')?.className).not.toMatch(/(^|\s)p[xyrlbse]?-/);
    });

    it('reserves the bar on the inline end of a vertical area', () => {
      const { container } = render(
        <ScrollArea scrollbarGutter>
          <p>Release notes</p>
        </ScrollArea>,
      );
      expect(part(container, 'scroll-area-viewport')).toHaveClass('pe-ws-6');
    });

    it('reserves the bar along the bottom of a horizontal area', () => {
      const { container } = render(
        <ScrollArea orientation="horizontal" scrollbarGutter>
          <p>Release notes</p>
        </ScrollArea>,
      );
      expect(part(container, 'scroll-area-viewport')).toHaveClass('pb-ws-6');
    });
  });

  describe('Visibility', () => {
    it('shows no bar while nothing overflows, by default', () => {
      const { container } = render(
        <ScrollArea>
          <p>Release notes</p>
        </ScrollArea>,
      );
      expect(part(container, 'scroll-area-scrollbar')).not.toBeInTheDocument();
    });

    it('keeps a hidden bar mounted, so it can fade, and lets the pointer through', () => {
      const { container } = render(
        <ScrollArea scrollbarVisibility="scroll">
          <p>Release notes</p>
        </ScrollArea>,
      );
      const bar = part(container, 'scroll-area-scrollbar');
      expect(bar).toHaveAttribute('data-state', 'hidden');
      expect(bar).toHaveClass(
        'data-[state=hidden]:opacity-0',
        'data-[state=hidden]:pointer-events-none',
      );
    });

    it('shows the bar while the content scrolls, with scroll', () => {
      const { container } = render(
        <ScrollArea scrollbarVisibility="scroll">
          <p>Release notes</p>
        </ScrollArea>,
      );
      const viewport = part(container, 'scroll-area-viewport')!;
      viewport.scrollTop = 40;
      fireEvent.scroll(viewport);
      expect(part(container, 'scroll-area-scrollbar')).toHaveAttribute('data-state', 'visible');
    });

    it('shows the bar from the start with always', () => {
      const { container } = render(
        <ScrollArea scrollbarVisibility="always">
          <p>Release notes</p>
        </ScrollArea>,
      );
      expect(part(container, 'scroll-area-scrollbar')).toHaveAttribute('data-state', 'visible');
    });

    it('lets the pointer through a bar with no thumb, so clicks reach the content', () => {
      const { container } = render(
        <ScrollArea scrollbarVisibility="always">
          <p>Release notes</p>
        </ScrollArea>,
      );
      const bar = part(container, 'scroll-area-scrollbar');
      expect(bar).toBeEmptyDOMElement();
      expect(bar).toHaveClass('empty:pointer-events-none');
    });

    it('hides the bar with never, and the viewport still scrolls', () => {
      const { container } = render(
        <ScrollArea scrollbarVisibility="never">
          <p>Release notes</p>
        </ScrollArea>,
      );
      expect(part(container, 'scroll-area-scrollbar')).toHaveClass('hidden');
      expect(part(container, 'scroll-area-viewport')).toHaveStyle({ overflowY: 'scroll' });
    });

    it('keeps focus where it is when the bar is pressed, like a native scrollbar', () => {
      const { container } = render(
        <ScrollArea scrollbarVisibility="always">
          <p>Release notes</p>
        </ScrollArea>,
      );
      expect(fireEvent.mouseDown(part(container, 'scroll-area-scrollbar')!)).toBe(false);
    });

    it('drops the fade with defaultMotion={false}', () => {
      const { container } = render(
        <ScrollArea scrollbarVisibility="always" defaultMotion={false}>
          <p>Release notes</p>
        </ScrollArea>,
      );
      expect(part(container, 'scroll-area-scrollbar')?.className).not.toMatch(/transition-/);
    });
  });

  describe('Keyboard', () => {
    // jsdom has no layout: the viewport overflows when the test says so.
    let overflow = false;
    const isViewport = (element: Element) =>
      element.getAttribute('data-slot') === 'scroll-area-viewport';

    beforeEach(() => {
      vi.spyOn(Element.prototype, 'scrollHeight', 'get').mockImplementation(function (
        this: Element,
      ) {
        return isViewport(this) && overflow ? 400 : 0;
      });
      vi.spyOn(Element.prototype, 'clientHeight', 'get').mockImplementation(function (
        this: Element,
      ) {
        return isViewport(this) && overflow ? 100 : 0;
      });
    });

    afterEach(() => {
      overflow = false;
      vi.restoreAllMocks();
    });

    it('makes an overflowing viewport with nothing to tab to a tab stop', () => {
      overflow = true;
      const { container } = render(
        <ScrollArea>
          <p>Terms of service</p>
        </ScrollArea>,
      );
      expect(part(container, 'scroll-area-viewport')).toHaveAttribute('tabindex', '0');
    });

    it('adds no tab stop when the content does not overflow', () => {
      const { container } = render(
        <ScrollArea>
          <p>Terms of service</p>
        </ScrollArea>,
      );
      expect(part(container, 'scroll-area-viewport')).not.toHaveAttribute('tabindex');
    });

    it('adds no tab stop when the content holds a link or a field', () => {
      overflow = true;
      const { container } = render(
        <ScrollArea>
          <a href="#terms">Terms of service</a>
        </ScrollArea>,
      );
      expect(part(container, 'scroll-area-viewport')).not.toHaveAttribute('tabindex');
    });

    it('takes tabIndex for the viewport, to turn the stop off', () => {
      overflow = true;
      const { container } = render(
        <ScrollArea tabIndex={-1}>
          <p>Terms of service</p>
        </ScrollArea>,
      );
      expect(part(container, 'scroll-area-viewport')).toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Right to left', () => {
    it('puts the vertical bar on the left', () => {
      const { container } = render(
        <ScrollArea dir="rtl" scrollbarVisibility="always">
          <p>Release notes</p>
        </ScrollArea>,
      );
      expect(container.firstElementChild).toHaveAttribute('dir', 'rtl');
      expect(part(container, 'scroll-area-scrollbar')).toHaveStyle({ left: '0px' });
    });
  });
});
