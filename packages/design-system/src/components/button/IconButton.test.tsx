import { RiBugLine, RiCloseLine } from '@remixicon/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, expectTypeOf, it } from 'vitest';

import { IconButton } from './IconButton';
import type { IconButtonProps } from './IconButton.types';

describe('IconButton', () => {
  it('should render a button element by default', () => {
    render(<IconButton icon={RiCloseLine} aria-label="Close" />);
    const button = screen.getByRole('button', { name: 'Close' });
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('should apply default props', () => {
    render(<IconButton icon={RiCloseLine} aria-label="Close" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).not.toBeDisabled();
  });

  it('should render the provided icon', () => {
    render(<IconButton icon={RiCloseLine} aria-label="Close" />);
    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should make the button square', () => {
    render(<IconButton icon={RiCloseLine} size="lg" aria-label="Close" />);
    const button = screen.getByRole('button');
    const computedStyle = window.getComputedStyle(button);
    expect(computedStyle.width).toBe(computedStyle.height);
  });

  it('requires an accessible name in its props type', () => {
    type IconProps = { icon: typeof RiCloseLine };

    expectTypeOf<IconProps & { 'aria-label': string }>().toExtend<IconButtonProps>();
    expectTypeOf<IconProps & { 'aria-labelledby': string }>().toExtend<IconButtonProps>();
    expectTypeOf<
      IconProps & { 'aria-label': string; 'aria-labelledby': string }
    >().toExtend<IconButtonProps>();
    expectTypeOf<IconProps>().not.toExtend<IconButtonProps>();
    expectTypeOf<
      IconProps & { 'aria-label'?: string; 'aria-labelledby'?: string }
    >().not.toExtend<IconButtonProps>();
  });
});

// Snapshot Tests
describe('IconButton Snapshots', () => {
  const presets: Array<'filled' | 'border' | 'ghost'> = ['filled', 'border', 'ghost'];
  const sizes: Array<'xs' | 'sm' | 'md' | 'lg'> = ['xs', 'sm', 'md', 'lg'];

  describe('Variant: primary', () => {
    presets.forEach((preset) => {
      describe(`Preset: ${preset}`, () => {
        sizes.forEach((size) => {
          it(`matches snapshot for ${preset} ${size}`, () => {
            const { container } = render(
              <IconButton
                variant="primary"
                preset={preset}
                size={size}
                icon={RiBugLine}
                aria-label="Button"
              />,
            );
            expect(container.firstChild).toMatchSnapshot();
          });

          it(`matches snapshot for ${preset} ${size} disabled`, () => {
            const { container } = render(
              <IconButton
                variant="primary"
                preset={preset}
                size={size}
                icon={RiBugLine}
                disabled
                aria-label="Button"
              />,
            );
            expect(container.firstChild).toMatchSnapshot();
          });
        });
      });
    });
  });

  describe('Variant: secondary', () => {
    presets.forEach((preset) => {
      describe(`Preset: ${preset}`, () => {
        sizes.forEach((size) => {
          it(`matches snapshot for ${preset} ${size}`, () => {
            const { container } = render(
              <IconButton
                variant="secondary"
                preset={preset}
                size={size}
                icon={RiBugLine}
                aria-label="Button"
              />,
            );
            expect(container.firstChild).toMatchSnapshot();
          });

          it(`matches snapshot for ${preset} ${size} disabled`, () => {
            const { container } = render(
              <IconButton
                variant="secondary"
                preset={preset}
                size={size}
                icon={RiBugLine}
                disabled
                aria-label="Button"
              />,
            );
            expect(container.firstChild).toMatchSnapshot();
          });
        });
      });
    });
  });

  describe('Variant: danger', () => {
    presets.forEach((preset) => {
      describe(`Preset: ${preset}`, () => {
        sizes.forEach((size) => {
          it(`matches snapshot for ${preset} ${size}`, () => {
            const { container } = render(
              <IconButton
                variant="danger"
                preset={preset}
                size={size}
                icon={RiBugLine}
                aria-label="Button"
              />,
            );
            expect(container.firstChild).toMatchSnapshot();
          });

          it(`matches snapshot for ${preset} ${size} disabled`, () => {
            const { container } = render(
              <IconButton
                variant="danger"
                preset={preset}
                size={size}
                icon={RiBugLine}
                disabled
                aria-label="Button"
              />,
            );
            expect(container.firstChild).toMatchSnapshot();
          });
        });
      });
    });
  });

  describe('Variant: success', () => {
    presets.forEach((preset) => {
      describe(`Preset: ${preset}`, () => {
        sizes.forEach((size) => {
          it(`matches snapshot for ${preset} ${size}`, () => {
            const { container } = render(
              <IconButton
                variant="success"
                preset={preset}
                size={size}
                icon={RiBugLine}
                aria-label="Button"
              />,
            );
            expect(container.firstChild).toMatchSnapshot();
          });

          it(`matches snapshot for ${preset} ${size} disabled`, () => {
            const { container } = render(
              <IconButton
                variant="success"
                preset={preset}
                size={size}
                icon={RiBugLine}
                disabled
                aria-label="Button"
              />,
            );
            expect(container.firstChild).toMatchSnapshot();
          });
        });
      });
    });
  });

  describe('Variant: inverse', () => {
    presets.forEach((preset) => {
      describe(`Preset: ${preset}`, () => {
        sizes.forEach((size) => {
          it(`matches snapshot for ${preset} ${size}`, () => {
            const { container } = render(
              <IconButton
                variant="inverse"
                preset={preset}
                size={size}
                icon={RiBugLine}
                aria-label="Button"
              />,
            );
            expect(container.firstChild).toMatchSnapshot();
          });

          it(`matches snapshot for ${preset} ${size} disabled`, () => {
            const { container } = render(
              <IconButton
                variant="inverse"
                preset={preset}
                size={size}
                icon={RiBugLine}
                disabled
                aria-label="Button"
              />,
            );
            expect(container.firstChild).toMatchSnapshot();
          });
        });
      });
    });
  });
});

describe('IconButton data-slot', () => {
  it('marks each part with data-slot', () => {
    const { container } = render(<IconButton icon={RiBugLine} aria-label="Report issue" />);
    expect(container.querySelector('[data-slot="icon-button"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="button-icon"]')).toBeInTheDocument();
  });
});
