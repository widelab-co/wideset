import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Shortcut } from './Shortcut';
import type { ShortcutProps } from './Shortcut.types';

const emphases: ShortcutProps['emphasis'][] = ['strong', 'weak'];

describe('Shortcut', () => {
  describe('Rendering', () => {
    it('renders the shortcut and each key as kbd elements', () => {
      const { container } = render(
        <Shortcut>
          <Shortcut.Key>⌘</Shortcut.Key>
          <Shortcut.Key>K</Shortcut.Key>
        </Shortcut>,
      );

      const root = container.firstElementChild;
      expect(root?.tagName).toBe('KBD');
      expect([...(root?.children ?? [])].map((key) => key.tagName)).toEqual(['KBD', 'KBD']);
    });

    it('forwards ref to the root element', () => {
      const ref = createRef<HTMLElement>();
      render(
        <Shortcut ref={ref}>
          <Shortcut.Key>K</Shortcut.Key>
        </Shortcut>,
      );

      expect(ref.current?.tagName).toBe('KBD');
    });

    it('forwards ref to Shortcut.Key', () => {
      const ref = createRef<HTMLElement>();
      render(
        <Shortcut>
          <Shortcut.Key ref={ref}>K</Shortcut.Key>
        </Shortcut>,
      );

      expect(ref.current).toHaveTextContent('K');
    });

    it('forwards additional props to the root element', () => {
      render(
        <Shortcut className="custom-class" data-testid="shortcut" aria-describedby="search-hint">
          <Shortcut.Key>K</Shortcut.Key>
        </Shortcut>,
      );

      const shortcut = screen.getByTestId('shortcut');
      expect(shortcut).toHaveClass('custom-class');
      expect(shortcut).toHaveAttribute('aria-describedby', 'search-hint');
    });

    it('forwards additional props to Shortcut.Key', () => {
      render(
        <Shortcut>
          <Shortcut.Key className="custom-class" data-testid="key" title="Escape">
            Esc
          </Shortcut.Key>
        </Shortcut>,
      );

      const key = screen.getByTestId('key');
      expect(key).toHaveClass('custom-class');
      expect(key).toHaveAttribute('title', 'Escape');
    });
  });

  describe('Accessibility', () => {
    it('reads the modifier glyphs as their names', () => {
      render(
        <button type="button">
          <Shortcut>
            <Shortcut.Key>⌃</Shortcut.Key>
            <Shortcut.Key>⌥</Shortcut.Key>
            <Shortcut.Key>⇧</Shortcut.Key>
            <Shortcut.Key>⌘</Shortcut.Key>
          </Shortcut>
        </button>,
      );

      expect(screen.getByRole('button')).toHaveAccessibleName(
        /^Control\s?Option\s?Shift\s?Command$/,
      );
    });

    it('reads letters and named keys as written', () => {
      render(
        <button type="button">
          <Shortcut>
            <Shortcut.Key>Esc</Shortcut.Key>
          </Shortcut>
        </button>,
      );

      expect(screen.getByRole('button', { name: 'Esc' })).toBeInTheDocument();
    });
  });

  describe('Keys', () => {
    it.each(['⌘', '⇧', '⌥'])('draws %s at the wide minimum width', (glyph) => {
      render(
        <Shortcut>
          <Shortcut.Key data-testid="key">{glyph}</Shortcut.Key>
        </Shortcut>,
      );

      expect(screen.getByTestId('key')).toHaveClass('min-w-ws-9');
    });

    it.each(['⌃', 'K', 'Esc'])('draws %s at the narrow minimum width', (key) => {
      render(
        <Shortcut>
          <Shortcut.Key data-testid="key">{key}</Shortcut.Key>
        </Shortcut>,
      );

      expect(screen.getByTestId('key')).toHaveClass('min-w-ws-8');
    });
  });

  describe('Snapshots', () => {
    it.each(emphases)('should match snapshot for emphasis="%s"', (emphasis) => {
      const { container } = render(
        <Shortcut emphasis={emphasis}>
          <Shortcut.Key>⌘</Shortcut.Key>
          <Shortcut.Key>K</Shortcut.Key>
        </Shortcut>,
      );

      expect(container).toMatchSnapshot();
    });
  });
});

describe('Shortcut data-slot', () => {
  it('marks each part with data-slot', () => {
    const { container } = render(
      <Shortcut>
        <Shortcut.Key>K</Shortcut.Key>
      </Shortcut>,
    );

    expect(container.querySelector('[data-slot="shortcut"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="shortcut-key"]')).toBeInTheDocument();
  });

  it("lets a caller's data-slot win", () => {
    const { container } = render(
      <Shortcut data-slot="menu-shortcut">
        <Shortcut.Key data-slot="menu-shortcut-key">K</Shortcut.Key>
      </Shortcut>,
    );

    expect(container.querySelector('[data-slot="menu-shortcut"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="menu-shortcut-key"]')).toBeInTheDocument();
  });
});
