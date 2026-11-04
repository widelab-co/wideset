import { RiCloseLine } from '@remixicon/react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Chip } from './Chip';

describe('Chip', () => {
  describe('Basic rendering', () => {
    it('should render chip with children', () => {
      render(<Chip>Test Chip</Chip>);
      expect(screen.getByText('Test Chip')).toBeInTheDocument();
    });

    it('should render with default props', () => {
      render(<Chip>Default</Chip>);
      const chip = screen.getByText('Default');
      expect(chip).toHaveAttribute('tabIndex', '0');
      expect(chip).not.toHaveAttribute('data-disabled');
      expect(chip).not.toHaveAttribute('aria-disabled');
    });

    it('should forward ref to div element', () => {
      const ref = { current: null };
      render(<Chip ref={ref}>Ref Test</Chip>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should render disabled chip', () => {
      render(<Chip disabled>Disabled</Chip>);
      const chip = screen.getByText('Disabled');
      expect(chip).toHaveAttribute('data-disabled');
      expect(chip).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('HTML attributes', () => {
    it('should pass through HTML attributes', () => {
      render(
        <Chip data-testid="custom-chip" aria-label="Custom chip" className="custom-class">
          Chip
        </Chip>,
      );
      const chip = screen.getByTestId('custom-chip');
      expect(chip).toHaveAttribute('aria-label', 'Custom chip');
      expect(chip).toHaveClass('custom-class');
    });
  });

  describe('Chip.Icon', () => {
    it('should render icon inside chip', () => {
      render(
        <Chip>
          <Chip.Icon icon={RiCloseLine} />
          Chip with Icon
        </Chip>,
      );
      const svg = screen.getByText('Chip with Icon').closest('div')?.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(screen.getByText('Chip with Icon')).toBeInTheDocument();
    });

    it('should forward className to icon', () => {
      render(
        <Chip>
          <Chip.Icon icon={RiCloseLine} className="custom-icon-class" />
          Label
        </Chip>,
      );
      const svg = screen.getByText('Label').closest('div')?.querySelector('svg');
      expect(svg).toHaveClass('custom-icon-class');
    });

    it('should throw error when used outside Chip', () => {
      expect(() => render(<Chip.Icon icon={RiCloseLine} />)).toThrow(
        'useChipContext must be used within a Chip',
      );
    });
  });

  describe('Keyboard', () => {
    it('should focus with tab', async () => {
      const user = userEvent.setup();

      render(<Chip>Chip</Chip>);

      const chip = screen.getByRole('button', { name: 'Chip' });
      await user.tab();
      expect(chip).toHaveFocus();
    });

    it('should skip a disabled chip with tab', async () => {
      const user = userEvent.setup();

      render(<Chip disabled>Chip</Chip>);

      await user.tab();
      expect(screen.getByRole('button', { name: 'Chip' })).not.toHaveFocus();
    });

    it.each([
      { key: 'Enter', input: '{Enter}' },
      { key: 'Space', input: ' ' },
    ])('should support $key to activate onClick', async ({ input }) => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(<Chip onClick={onClick}>Chip</Chip>);

      const chip = screen.getByRole('button', { name: 'Chip' });
      await user.tab();

      expect(chip).toHaveFocus();
      await user.keyboard(input);
      expect(onClick).toHaveBeenCalledOnce();
    });

    it('prevents the page from scrolling on Space', () => {
      render(<Chip>Design</Chip>);
      const notCancelled = fireEvent.keyDown(screen.getByRole('button', { name: 'Design' }), {
        key: ' ',
      });
      expect(notCancelled).toBe(false);
    });

    it('does not click when disabled', () => {
      const onClick = vi.fn();
      render(
        <Chip disabled onClick={onClick}>
          Design
        </Chip>,
      );
      const chip = screen.getByRole('button', { name: 'Design' });
      fireEvent.keyDown(chip, { key: 'Enter' });
      fireEvent.keyUp(chip, { key: ' ' });
      expect(onClick).not.toHaveBeenCalled();
    });

    it('still calls onKeyDown and onKeyUp', () => {
      const onKeyDown = vi.fn();
      const onKeyUp = vi.fn();
      render(
        <Chip onKeyDown={onKeyDown} onKeyUp={onKeyUp}>
          Design
        </Chip>,
      );
      const chip = screen.getByRole('button', { name: 'Design' });
      fireEvent.keyDown(chip, { key: 'Enter' });
      fireEvent.keyUp(chip, { key: 'Enter' });
      expect(onKeyDown).toHaveBeenCalledTimes(1);
      expect(onKeyUp).toHaveBeenCalledTimes(1);
    });
  });
});

describe('Chip Snapshots', () => {
  const variants: Array<'primary' | 'secondary'> = ['primary', 'secondary'];
  const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

  it('matches snapshot for default chip', () => {
    const { container } = render(<Chip>Default Chip</Chip>);
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('Variants', () => {
    variants.forEach((variant) => {
      it(`matches snapshot for ${variant} variant`, () => {
        const { container } = render(<Chip variant={variant}>{variant} Chip</Chip>);
        expect(container.firstChild).toMatchSnapshot();
      });
    });
  });

  describe('Sizes', () => {
    sizes.forEach((size) => {
      it(`matches snapshot for ${size} size`, () => {
        const { container } = render(<Chip size={size}>{size} Chip</Chip>);
        expect(container.firstChild).toMatchSnapshot();
      });
    });
  });

  describe('Disabled state', () => {
    it('matches snapshot for disabled chip', () => {
      const { container } = render(<Chip disabled>Disabled Chip</Chip>);
      expect(container.firstChild).toMatchSnapshot();
    });

    variants.forEach((variant) => {
      it(`matches snapshot for disabled ${variant} variant`, () => {
        const { container } = render(
          <Chip variant={variant} disabled>
            Disabled {variant}
          </Chip>,
        );
        expect(container.firstChild).toMatchSnapshot();
      });
    });
  });

  describe('With icon', () => {
    it('matches snapshot for chip with icon', () => {
      const { container } = render(
        <Chip>
          <Chip.Icon icon={RiCloseLine} />
          Chip with Icon
        </Chip>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    variants.forEach((variant) => {
      sizes.forEach((size) => {
        it(`matches snapshot for ${variant} ${size} with icon`, () => {
          const { container } = render(
            <Chip variant={variant} size={size}>
              <Chip.Icon icon={RiCloseLine} />
              {variant} {size}
            </Chip>,
          );
          expect(container.firstChild).toMatchSnapshot();
        });
      });
    });
  });

  describe('Variant and size combinations', () => {
    variants.forEach((variant) => {
      sizes.forEach((size) => {
        it(`matches snapshot for ${variant} variant with ${size} size`, () => {
          const { container } = render(
            <Chip variant={variant} size={size}>
              {variant} {size}
            </Chip>,
          );
          expect(container.firstChild).toMatchSnapshot();
        });
      });
    });
  });
});

describe('Chip data-slot', () => {
  it('marks each part with data-slot', () => {
    const { container } = render(
      <Chip>
        Warsaw
        <Chip.Icon icon={RiCloseLine} />
      </Chip>,
    );
    expect(container.querySelector('[data-slot="chip"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="chip-icon"]')).toBeInTheDocument();
  });
});
