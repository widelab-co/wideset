import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Count } from './Count';

describe('Count', () => {
  describe('Rendering', () => {
    it('renders its children as text', () => {
      render(<Count>12</Count>);

      expect(screen.getByText('12')).toBeInTheDocument();
    });

    it('renders a span', () => {
      render(<Count>12</Count>);

      expect(screen.getByText('12').tagName).toBe('SPAN');
    });

    it('has no role, so it is read with its label', () => {
      render(
        <h3>
          Active <Count>3</Count>
        </h3>,
      );

      expect(screen.getByRole('heading', { name: 'Active 3' })).toBeInTheDocument();
    });
  });

  describe('data-slot', () => {
    it('marks the root with data-slot="count"', () => {
      render(<Count>12</Count>);

      expect(screen.getByText('12')).toHaveAttribute('data-slot', 'count');
    });

    it('lets a caller override the slot', () => {
      render(<Count data-slot="tabs-count">12</Count>);

      expect(screen.getByText('12')).toHaveAttribute('data-slot', 'tabs-count');
    });
  });

  describe('Props', () => {
    it('forwards ref to the span', () => {
      const ref = createRef<HTMLSpanElement>();
      render(<Count ref={ref}>12</Count>);

      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it('passes rest props to the root', () => {
      render(
        <Count data-testid="count" aria-label="12 unread" id="unread">
          12
        </Count>,
      );

      const count = screen.getByTestId('count');
      expect(count).toHaveAttribute('aria-label', '12 unread');
      expect(count).toHaveAttribute('id', 'unread');
    });

    it('merges className with its own classes', () => {
      render(<Count className="ml-ws-3">12</Count>);

      const count = screen.getByText('12');
      expect(count).toHaveClass('ml-ws-3');
      expect(count).toHaveClass('tabular-nums');
    });
  });

  describe('contained', () => {
    it('is plain text by default, with no border or pill', () => {
      render(<Count>12</Count>);

      const count = screen.getByText('12');
      expect(count).not.toHaveClass('border');
      expect(count).not.toHaveClass('rounded-ws-control-full');
    });

    it('draws an outlined pill when contained', () => {
      render(<Count contained>12</Count>);

      const count = screen.getByText('12');
      expect(count).toHaveClass('border', 'border-ws-static-strong', 'rounded-ws-control-full');
      expect(count).toHaveClass('h-ws-12', 'min-w-ws-12', 'px-ws-5');
    });

    it('keeps the same type and colour in both looks', () => {
      render(
        <>
          <Count>1</Count>
          <Count contained>2</Count>
        </>,
      );

      for (const text of ['1', '2'])
        expect(screen.getByText(text)).toHaveClass('typography-label-sm', 'text-ws-static-subtle');
    });
  });

  describe('Snapshots', () => {
    it('matches snapshot', () => {
      const { container } = render(<Count>12</Count>);

      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot when contained', () => {
      const { container } = render(<Count contained>12</Count>);

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
