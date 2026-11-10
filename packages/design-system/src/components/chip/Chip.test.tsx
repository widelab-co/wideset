import { RiCloseLine, RiMapPinLine } from '@remixicon/react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Chip } from './Chip';
import ChipIconsExample from './examples/chip/icons';
import ChipStatesExample from './examples/chip/states';

describe('Chip', () => {
  describe('Basic rendering', () => {
    it('renders a passive container and label without an implicit action', () => {
      render(
        <Chip>
          <Chip.Label>Warsaw</Chip.Label>
        </Chip>,
      );
      expect(screen.getByText('Warsaw')).toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('forwards the root ref to a div', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Chip ref={ref}>
          <Chip.Label>Warsaw</Chip.Label>
        </Chip>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('data-slot', 'chip');
    });

    it('forwards refs to the action, label, and removal button', () => {
      const action = createRef<HTMLButtonElement>();
      const label = createRef<HTMLSpanElement>();
      const remove = createRef<HTMLButtonElement>();
      render(
        <Chip>
          <Chip.Action ref={action}>
            <Chip.Label ref={label}>Warsaw</Chip.Label>
          </Chip.Action>
          <Chip.IconButton ref={remove} aria-label="Remove Warsaw" />
        </Chip>,
      );
      expect(action.current).toBe(screen.getByRole('button', { name: 'Warsaw' }));
      expect(label.current).toBe(screen.getByText('Warsaw'));
      expect(remove.current).toBe(screen.getByRole('button', { name: 'Remove Warsaw' }));
    });
  });

  describe('HTML attributes', () => {
    it('passes container and button attributes to their respective elements', () => {
      const { container } = render(
        <Chip className="custom-chip" data-custom="chip">
          <Chip.Action
            type="submit"
            name="filter"
            value="warsaw"
            aria-label="Apply Warsaw"
            className="custom-action"
          >
            <Chip.Label>Warsaw</Chip.Label>
          </Chip.Action>
        </Chip>,
      );
      expect(container.firstChild).toHaveClass('custom-chip');
      expect(container.firstChild).toHaveAttribute('data-custom', 'chip');
      const action = screen.getByRole('button', { name: 'Apply Warsaw' });
      expect(action).toHaveAttribute('type', 'submit');
      expect(action).toHaveAttribute('name', 'filter');
      expect(action).toHaveAttribute('value', 'warsaw');
      expect(action).toHaveClass('custom-action');
    });

    it('defaults both actions to non-submitting buttons', () => {
      render(
        <Chip>
          <Chip.Action>Warsaw</Chip.Action>
          <Chip.IconButton aria-label="Remove Warsaw" />
        </Chip>,
      );
      for (const button of screen.getAllByRole('button'))
        expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Composition', () => {
    it('keeps removal independent from the main action, including leading icon clicks', async () => {
      const user = userEvent.setup();
      const onAction = vi.fn();
      const onRemove = vi.fn();
      render(
        <Chip>
          <Chip.Action onClick={onAction}>
            <Chip.Icon icon={RiCloseLine} />
            <Chip.Label>Warsaw</Chip.Label>
          </Chip.Action>
          <Chip.IconButton aria-label="Remove Warsaw" onClick={onRemove} />
        </Chip>,
      );
      const action = screen.getByRole('button', { name: 'Warsaw' });
      const remove = screen.getByRole('button', { name: 'Remove Warsaw' });
      expect(action.contains(remove)).toBe(false);
      expect(action.parentElement).toBe(remove.parentElement);
      await user.click(action.querySelector('svg')!);
      expect(onAction).toHaveBeenCalledOnce();
      expect(onRemove).not.toHaveBeenCalled();
      await user.click(remove);
      expect(onRemove).toHaveBeenCalledOnce();
      expect(onAction).toHaveBeenCalledOnce();
    });

    it('supports a passive label with only the removal action', async () => {
      const user = userEvent.setup();
      const onRemove = vi.fn();
      render(
        <Chip>
          <Chip.Label>Warsaw</Chip.Label>
          <Chip.IconButton aria-label="Remove Warsaw" onClick={onRemove} />
        </Chip>,
      );
      expect(screen.getAllByRole('button')).toHaveLength(1);
      await user.click(screen.getByText('Warsaw'));
      expect(onRemove).not.toHaveBeenCalled();
      await user.click(screen.getByRole('button', { name: 'Remove Warsaw' }));
      expect(onRemove).toHaveBeenCalledOnce();
    });

    it('disables both actions from the container, including programmatic activation', () => {
      const onAction = vi.fn();
      const onRemove = vi.fn();
      render(
        <Chip disabled>
          <Chip.Action disabled={false} onClick={onAction}>
            Warsaw
          </Chip.Action>
          <Chip.IconButton disabled={false} aria-label="Remove Warsaw" onClick={onRemove} />
        </Chip>,
      );
      for (const button of screen.getAllByRole('button')) {
        expect(button).toBeDisabled();
        (button as HTMLButtonElement).click();
        fireEvent.click(button);
      }
      expect(onAction).not.toHaveBeenCalled();
      expect(onRemove).not.toHaveBeenCalled();
    });

    it('can disable the removal button without activating or disabling the main action', async () => {
      const user = userEvent.setup();
      const onAction = vi.fn();
      const onRemove = vi.fn();
      render(
        <Chip>
          <Chip.Action onClick={onAction}>Warsaw</Chip.Action>
          <Chip.IconButton disabled aria-label="Remove Warsaw" onClick={onRemove} />
        </Chip>,
      );
      const action = screen.getByRole('button', { name: 'Warsaw' });
      const remove = screen.getByRole('button', { name: 'Remove Warsaw' });
      expect(action).toBeEnabled();
      expect(remove).toBeDisabled();

      await user.click(remove);
      expect(onAction).not.toHaveBeenCalled();
      expect(onRemove).not.toHaveBeenCalled();

      await user.click(action);
      expect(onAction).toHaveBeenCalledOnce();
    });
  });

  describe('Chip.Icon', () => {
    it('keeps the leading icon decorative and forwards its class', () => {
      render(
        <Chip>
          <Chip.Action>
            <Chip.Icon icon={RiCloseLine} className="custom-icon" />
            <Chip.Label>Warsaw</Chip.Label>
          </Chip.Action>
        </Chip>,
      );
      const icon = screen.getByRole('button', { name: 'Warsaw' }).querySelector('svg');
      expect(icon).toHaveClass('custom-icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('throws outside Chip', () => {
      expect(() => render(<Chip.Icon icon={RiCloseLine} />)).toThrow(
        'useChipContext must be used within a Chip',
      );
    });
  });

  describe('Keyboard', () => {
    it('tabs between independent actions and skips disabled chips in both directions', async () => {
      const user = userEvent.setup();
      render(
        <>
          <Chip>
            <Chip.Action>Warsaw</Chip.Action>
            <Chip.IconButton aria-label="Remove Warsaw" />
          </Chip>
          <Chip disabled>
            <Chip.Action>Disabled</Chip.Action>
            <Chip.IconButton aria-label="Remove disabled" />
          </Chip>
          <button type="button">After</button>
        </>,
      );
      await user.tab();
      expect(screen.getByRole('button', { name: 'Warsaw' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('button', { name: 'Remove Warsaw' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
      await user.tab({ shift: true });
      expect(screen.getByRole('button', { name: 'Remove Warsaw' })).toHaveFocus();
    });

    it.each(['[Enter]', '[Space]'])('activates the main action with %s', async (input) => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Chip>
          <Chip.Action onClick={onClick}>
            <Chip.Label>Warsaw</Chip.Label>
          </Chip.Action>
        </Chip>,
      );
      await user.tab();
      await user.keyboard(input);
      expect(onClick).toHaveBeenCalledOnce();
    });

    it.each(['[Enter]', '[Space]'])('activates removal independently with %s', async (input) => {
      const user = userEvent.setup();
      const onAction = vi.fn();
      const onRemove = vi.fn();
      render(
        <Chip>
          <Chip.Action onClick={onAction}>Warsaw</Chip.Action>
          <Chip.IconButton aria-label="Remove Warsaw" onClick={onRemove} />
        </Chip>,
      );
      await user.tab();
      await user.tab();
      await user.keyboard(input);
      expect(onRemove).toHaveBeenCalledOnce();
      expect(onAction).not.toHaveBeenCalled();
    });

    it('passes consumer keyboard handlers to the action', () => {
      const onKeyDown = vi.fn();
      const onKeyUp = vi.fn();
      render(
        <Chip>
          <Chip.Action onKeyDown={onKeyDown} onKeyUp={onKeyUp}>
            Warsaw
          </Chip.Action>
        </Chip>,
      );
      const action = screen.getByRole('button', { name: 'Warsaw' });
      fireEvent.keyDown(action, { key: 'Enter' });
      fireEvent.keyUp(action, { key: 'Enter' });
      expect(onKeyDown).toHaveBeenCalledOnce();
      expect(onKeyUp).toHaveBeenCalledOnce();
    });

    it('passes consumer keyboard handlers to the icon button', () => {
      const onKeyDown = vi.fn();
      const onKeyUp = vi.fn();
      render(
        <Chip>
          <Chip.Label>Warsaw</Chip.Label>
          <Chip.IconButton aria-label="Remove Warsaw" onKeyDown={onKeyDown} onKeyUp={onKeyUp} />
        </Chip>,
      );
      const iconButton = screen.getByRole('button', { name: 'Remove Warsaw' });
      fireEvent.keyDown(iconButton, { key: 'Enter' });
      fireEvent.keyUp(iconButton, { key: 'Enter' });
      expect(onKeyDown).toHaveBeenCalledOnce();
      expect(onKeyUp).toHaveBeenCalledOnce();
    });
  });
});

describe('Chip examples', () => {
  it('lets the consumer toggle the filter state', async () => {
    const user = userEvent.setup();
    render(<ChipStatesExample />);

    const action = screen.getByRole('button', { name: 'Remote only' });
    expect(action).toHaveAttribute('aria-pressed', 'false');
    await user.click(action);
    expect(action).toHaveAttribute('aria-pressed', 'true');
    await user.click(action);
    expect(action).toHaveAttribute('aria-pressed', 'false');
  });

  it('lets the consumer apply, remove, and restore cities without losing focus', async () => {
    const user = userEvent.setup();
    render(<ChipIconsExample />);

    await user.click(screen.getByRole('button', { name: 'Berlin' }));
    expect(screen.getByRole('status')).toHaveTextContent('Applied city: Berlin');
    await user.click(screen.getByRole('button', { name: 'Remove Berlin' }));
    expect(screen.queryByRole('button', { name: 'Berlin' })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('No city applied');

    const reset = screen.getByRole('button', { name: 'Reset examples' });
    expect(reset).toHaveFocus();
    await user.click(reset);
    expect(screen.getByRole('button', { name: 'Berlin' })).toBeInTheDocument();
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

  describe('Composition', () => {
    it('matches snapshot for an action with a leading icon and removal button', () => {
      const { container } = render(
        <Chip>
          <Chip.Action>
            <Chip.Icon icon={RiMapPinLine} />
            <Chip.Label>Warsaw</Chip.Label>
          </Chip.Action>
          <Chip.IconButton aria-label="Remove Warsaw" />
        </Chip>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for a passive label with a removal button', () => {
      const { container } = render(
        <Chip>
          <Chip.Label>Warsaw</Chip.Label>
          <Chip.IconButton aria-label="Remove Warsaw" />
        </Chip>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

describe('Chip data-slot', () => {
  it('marks every composed part', () => {
    const { container } = render(
      <Chip>
        <Chip.Action>
          <Chip.Icon icon={RiCloseLine} />
          <Chip.Label>Warsaw</Chip.Label>
        </Chip.Action>
        <Chip.IconButton aria-label="Remove Warsaw" />
      </Chip>,
    );
    for (const slot of ['chip', 'chip-action', 'chip-label', 'chip-icon', 'chip-icon-button']) {
      expect(container.querySelector(`[data-slot="${slot}"]`)).toBeInTheDocument();
    }
  });
});
