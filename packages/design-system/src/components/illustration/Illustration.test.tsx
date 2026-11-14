import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Illustration } from './Illustration';
import { ILLUSTRATION_ART } from './Illustration.art';

const NAMES = ['calendar', 'computer', 'folder'] as const;
const SIZES = ['lg', 'sm'] as const;

describe('Illustration', () => {
  describe('Rendering', () => {
    it.each(NAMES.flatMap((name) => SIZES.map((size) => [name, size] as const)))(
      'draws %s at %s from its own art',
      (name, size) => {
        const { container } = render(<Illustration illustration={name} size={size} />);
        const svg = container.querySelector('svg')!;
        const art = ILLUSTRATION_ART[name][size];
        expect(svg).toHaveAttribute('viewBox', `0 0 ${art.box} ${art.box}`);
        expect(svg.querySelectorAll('path')).toHaveLength(art.paths.length);
      },
    );

    it('is 240px at lg (the default) and 140px at sm, as in Figma', () => {
      const { container, rerender } = render(<Illustration illustration="folder" />);
      expect(container.querySelector('svg')).toHaveClass('size-[15rem]');
      rerender(<Illustration illustration="folder" size="sm" />);
      expect(container.querySelector('svg')).toHaveClass('size-[8.75rem]');
    });
  });

  describe('Colour', () => {
    it('draws its lines in the text colour and its accent in the primary fill', () => {
      const { container } = render(<Illustration illustration="computer" />);
      const svg = container.querySelector('svg')!;
      expect(svg).toHaveClass('text-ws-static-strong');
      const classes = [...svg.querySelectorAll('path')].map((path) => path.getAttribute('class'));
      expect(classes).toContain('fill-current');
      expect(classes).toContain('fill-(--ws-dynamic-fill-primary-default)');
      expect(classes.every((name) => !/#|rgb/.test(name ?? ''))).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('is decorative by default', () => {
      const { container } = render(<Illustration illustration="calendar" />);
      expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('is an image named by its title when it has one', () => {
      render(<Illustration illustration="calendar" title="An empty calendar" />);
      expect(screen.getByRole('img', { name: 'An empty calendar' })).toBeInTheDocument();
    });

    it('is an image named by aria-label when it has no title', () => {
      const { container } = render(
        <Illustration illustration="folder" aria-label="No files yet" />,
      );
      expect(screen.getByRole('img', { name: 'No files yet' })).toBeInTheDocument();
      expect(container.querySelector('svg')).not.toHaveAttribute('aria-hidden');
    });
  });

  describe('Props', () => {
    it('marks its slot, merges className and spreads rest props', () => {
      const { container } = render(
        <Illustration illustration="folder" className="text-ws-static-base" data-testid="art" />,
      );
      const svg = container.querySelector('svg')!;
      expect(svg).toHaveAttribute('data-slot', 'illustration');
      expect(svg).toHaveAttribute('data-testid', 'art');
      expect(svg).toHaveClass('text-ws-static-base');
    });
  });

  describe('Snapshots', () => {
    it('matches snapshot for folder at sm', () => {
      const { container } = render(<Illustration illustration="folder" size="sm" />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
