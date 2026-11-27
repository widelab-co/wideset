import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { LinkButton } from './LinkButton';

describe('LinkButton', () => {
  describe('Basic rendering', () => {
    it('should render an anchor element by default', () => {
      render(<LinkButton href="/test">Click me</LinkButton>);
      const link = screen.getByRole('link', { name: 'Click me' });
      expect(link).toBeInTheDocument();
      expect(link.tagName).toBe('A');
    });

    it('should render children correctly', () => {
      render(<LinkButton href="/test">Test LinkButton</LinkButton>);
      expect(screen.getByText('Test LinkButton')).toBeInTheDocument();
    });

    it('should apply default props', () => {
      render(<LinkButton href="/test">LinkButton</LinkButton>);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/test');
    });
  });

  describe('disabled', () => {
    it('does not call onClick or navigate when disabled', () => {
      const onClick = vi.fn();
      render(
        <LinkButton href="/test" disabled onClick={onClick}>
          Disabled link
        </LinkButton>,
      );
      const link = screen.getByRole('link', { name: 'Disabled link' });
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      fireEvent(link, event);
      expect(onClick).not.toHaveBeenCalled();
      expect(event.defaultPrevented).toBe(true);
    });

    it("does not run the slotted child's onClick when disabled", () => {
      const onClick = vi.fn();
      render(
        <LinkButton asChild disabled>
          <a href="/test" onClick={onClick}>
            Disabled link
          </a>
        </LinkButton>,
      );
      const link = screen.getByRole('link', { name: 'Disabled link' });
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      fireEvent(link, event);
      expect(onClick).not.toHaveBeenCalled();
      expect(event.defaultPrevented).toBe(true);
    });

    it('marks the link aria-disabled', () => {
      render(
        <LinkButton href="/test" disabled>
          Disabled link
        </LinkButton>,
      );
      expect(screen.getByRole('link', { name: 'Disabled link' })).toHaveAttribute(
        'aria-disabled',
        'true',
      );
    });

    it('calls onClick when enabled', () => {
      const onClick = vi.fn();
      render(
        <LinkButton href="/test" onClick={onClick}>
          Link
        </LinkButton>,
      );
      fireEvent.click(screen.getByRole('link', { name: 'Link' }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  // Figma's Link Button (State=Focused): Corner Radius/Control/sm, the variant's Alpha/Default
  // fill, and 8 × 4px padding at both sizes.
  describe('Figma appearance', () => {
    it('draws the shared focus-visible ring', () => {
      render(<LinkButton href="/test">Link</LinkButton>);
      const classes = screen.getByRole('link', { name: 'Link' }).className.split(' ');
      expect(classes).toContain('focus-visible:wds-focus-visible');
    });

    it('rounds the link with Corner Radius/Control/sm', () => {
      render(<LinkButton href="/test">Link</LinkButton>);
      expect(screen.getByRole('link', { name: 'Link' })).toHaveClass('rounded-ws-control-sm');
    });

    it.each(['primary', 'secondary', 'danger', 'success', 'inverse'] as const)(
      'fills the focused %s link with its Alpha/Default fill',
      (variant) => {
        render(
          <LinkButton href="/test" variant={variant}>
            Link
          </LinkButton>,
        );
        expect(screen.getByRole('link', { name: 'Link' })).toHaveClass(
          `focus-visible:bg-ws-dynamic-${variant}-alpha-default`,
        );
      },
    );

    it('pads both sizes the same, so only the label size differs', () => {
      render(
        <>
          <LinkButton href="/a" size="sm">
            Small
          </LinkButton>
          <LinkButton href="/b" size="lg">
            Large
          </LinkButton>
        </>,
      );
      for (const name of ['Small', 'Large']) {
        expect(screen.getByRole('link', { name })).toHaveClass('px-ws-5', 'py-ws-3');
      }
    });
  });

  describe('href attribute', () => {
    it('should render with href attribute', () => {
      render(<LinkButton href="/test">Link</LinkButton>);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/test');
    });

    it('should handle external links', () => {
      render(
        <LinkButton href="https://example.com" target="_blank" rel="noopener noreferrer">
          External Link
        </LinkButton>,
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://example.com');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('asChild prop', () => {
    it('should render as child element when asChild is true', () => {
      render(
        <LinkButton asChild>
          <a href="/test">Link LinkButton</a>
        </LinkButton>,
      );
      const link = screen.getByRole('link', { name: 'Link LinkButton' });
      expect(link).toBeInTheDocument();
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/test');
    });
  });
});

// Snapshot Tests
describe('LinkButton Snapshots', () => {
  const variants: Array<'primary' | 'secondary' | 'danger' | 'success' | 'inverse'> = [
    'primary',
    'secondary',
    'danger',
    'success',
    'inverse',
  ];
  const sizes: Array<'sm' | 'lg'> = ['sm', 'lg'];

  variants.forEach((variant) => {
    describe(`Variant: ${variant}`, () => {
      sizes.forEach((size) => {
        it(`matches snapshot for ${size}`, () => {
          const { container } = render(
            <LinkButton variant={variant} size={size} href="/test">
              Link
            </LinkButton>,
          );
          expect(container.firstChild).toMatchSnapshot();
        });
      });
    });
  });

  describe('With sub-components', () => {
    it('matches snapshot with truncated text', () => {
      const { container } = render(
        <LinkButton variant="primary" size="sm" href="/test">
          <LinkButton.TruncatedText>Long text that should be truncated</LinkButton.TruncatedText>
        </LinkButton>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('asChild prop', () => {
    it('matches snapshot with asChild as anchor', () => {
      const { container } = render(
        <LinkButton asChild variant="primary" size="sm">
          <a href="/test">Link</a>
        </LinkButton>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

describe('LinkButton data-slot', () => {
  it('marks each part with data-slot', () => {
    const { container } = render(
      <LinkButton href="#invoices">
        <LinkButton.TruncatedText>View invoices</LinkButton.TruncatedText>
      </LinkButton>,
    );
    expect(container.querySelector('[data-slot="link-button"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="button-truncated-text"]')).toBeInTheDocument();
  });
});
