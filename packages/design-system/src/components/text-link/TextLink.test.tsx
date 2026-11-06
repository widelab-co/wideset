import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { TextLink } from './TextLink';

describe('TextLink', () => {
  describe('Rendering', () => {
    it('renders a link named by its text', () => {
      render(<TextLink href="/reset-password">reset your password</TextLink>);
      expect(screen.getByRole('link', { name: 'reset your password' })).toHaveAttribute(
        'href',
        '/reset-password',
      );
    });

    it('marks the link with data-slot', () => {
      render(<TextLink href="/terms">Terms of service</TextLink>);
      expect(screen.getByRole('link', { name: 'Terms of service' })).toHaveAttribute(
        'data-slot',
        'text-link',
      );
    });

    it('forwards the ref to the anchor', () => {
      const ref = createRef<HTMLAnchorElement>();
      render(
        <TextLink ref={ref} href="/terms">
          Terms of service
        </TextLink>,
      );
      expect(ref.current).toBe(screen.getByRole('link', { name: 'Terms of service' }));
    });
  });

  describe('Styling', () => {
    it('adds the primary colour and an underline, and no type of its own', () => {
      render(<TextLink href="/terms">Terms of service</TextLink>);
      const link = screen.getByRole('link', { name: 'Terms of service' });
      expect(link).toHaveClass('text-ws-dynamic-primary-default', 'underline');
      expect(link.className).not.toMatch(/typography-|font-/);
    });

    it('merges className', () => {
      render(
        <TextLink href="/terms" className="custom-class">
          Terms of service
        </TextLink>,
      );
      expect(screen.getByRole('link', { name: 'Terms of service' })).toHaveClass(
        'custom-class',
        'underline',
      );
    });
  });

  describe('Props', () => {
    it('passes anchor, aria and data attributes to the link', () => {
      render(
        <TextLink
          href="https://example.com/privacy"
          target="_blank"
          rel="noreferrer"
          aria-describedby="privacy-note"
          data-testid="privacy"
        >
          Privacy policy
        </TextLink>,
      );
      const link = screen.getByRole('link', { name: 'Privacy policy' });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noreferrer');
      expect(link).toHaveAttribute('aria-describedby', 'privacy-note');
      expect(link).toHaveAttribute('data-testid', 'privacy');
    });

    it('calls onClick', () => {
      const onClick = vi.fn();
      render(
        <TextLink href="#magic-link" onClick={onClick}>
          sign-in link
        </TextLink>,
      );
      fireEvent.click(screen.getByRole('link', { name: 'sign-in link' }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('asChild', () => {
    it('styles the child link instead of rendering a second anchor', () => {
      const { container } = render(
        <TextLink asChild>
          <a href="/terms" className="router-link">
            Terms of service
          </a>
        </TextLink>,
      );
      const link = screen.getByRole('link', { name: 'Terms of service' });
      expect(container.querySelectorAll('a')).toHaveLength(1);
      expect(link).toHaveClass('router-link', 'underline');
      expect(link).toHaveAttribute('data-slot', 'text-link');
    });
  });
});

describe('TextLink Snapshots', () => {
  it('matches snapshot', () => {
    const { container } = render(<TextLink href="/reset-password">reset your password</TextLink>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with asChild', () => {
    const { container } = render(
      <TextLink asChild>
        <a href="/terms">Terms of service</a>
      </TextLink>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
