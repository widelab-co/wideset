import { RiArrowDownSLine, RiBugLine, RiCloseLine } from '@remixicon/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DropdownMenu } from '../dropdown/DropdownMenu';
import { SplitButton } from './SplitButton';

describe('SplitButton', () => {
  describe('Basic rendering', () => {
    it('should render the main button with label text', () => {
      render(<SplitButton icon={RiArrowDownSLine}>Click me</SplitButton>);
      const button = screen.getByRole('button', { name: 'Click me' });
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });

    it('should render the icon trigger button', () => {
      render(<SplitButton icon={RiArrowDownSLine}>Button</SplitButton>);
      const trigger = screen.getByRole('button', { name: 'More options' });
      expect(trigger).toBeInTheDocument();
      expect(trigger.tagName).toBe('BUTTON');
    });

    it('should render two independent button elements', () => {
      render(<SplitButton icon={RiArrowDownSLine}>Button</SplitButton>);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
    });

    it('should render the icon inside the trigger button', () => {
      render(<SplitButton icon={RiArrowDownSLine}>Button</SplitButton>);
      const trigger = screen.getByRole('button', { name: 'More options' });
      expect(trigger.querySelector('svg')).toBeInTheDocument();
    });

    it('should accept a custom iconAriaLabel', () => {
      render(
        <SplitButton icon={RiArrowDownSLine} iconAriaLabel="Open menu">
          Button
        </SplitButton>,
      );
      expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
    });
  });

  describe('Independent interactions', () => {
    it('should call onClick only when the main button is clicked', async () => {
      const handleClick = vi.fn();
      render(
        <SplitButton icon={RiArrowDownSLine} onClick={handleClick}>
          Click me
        </SplitButton>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Click me' }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should call onOpenChange when the icon trigger is clicked', async () => {
      const handleOpenChange = vi.fn();
      render(
        <SplitButton icon={RiArrowDownSLine} onOpenChange={handleOpenChange}>
          Button
        </SplitButton>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'More options' }));
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });

    it('should not call onClick when the icon trigger is clicked', async () => {
      const handleClick = vi.fn();
      render(
        <SplitButton icon={RiArrowDownSLine} onClick={handleClick}>
          Button
        </SplitButton>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'More options' }));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Independent disabled states', () => {
    it('should disable only the main button when disabled is set', () => {
      render(
        <SplitButton icon={RiArrowDownSLine} disabled>
          Button
        </SplitButton>,
      );
      expect(screen.getByRole('button', { name: 'Button' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'More options' })).not.toBeDisabled();
    });

    it('should disable only the icon button when iconDisabled is set', () => {
      render(
        <SplitButton icon={RiArrowDownSLine} iconDisabled>
          Button
        </SplitButton>,
      );
      expect(screen.getByRole('button', { name: 'Button' })).not.toBeDisabled();
      expect(screen.getByRole('button', { name: 'More options' })).toBeDisabled();
    });

    it('should disable both buttons when both disabled and iconDisabled are set', () => {
      render(
        <SplitButton icon={RiArrowDownSLine} disabled iconDisabled>
          Button
        </SplitButton>,
      );
      expect(screen.getByRole('button', { name: 'Button' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'More options' })).toBeDisabled();
    });
  });

  describe('Sub-components', () => {
    it('should render with SplitButton.Icon sub-component inside the main button', () => {
      render(
        <SplitButton icon={RiArrowDownSLine}>
          <SplitButton.Icon icon={RiCloseLine} />
          Button
        </SplitButton>,
      );
      const mainButton = screen.getByRole('button', { name: /Button/ });
      expect(mainButton.querySelector('svg')).toBeInTheDocument();
    });

    it('should render with SplitButton.TruncatedText sub-component', () => {
      render(
        <SplitButton icon={RiArrowDownSLine}>
          <SplitButton.TruncatedText>
            Long button text that should be truncated
          </SplitButton.TruncatedText>
        </SplitButton>,
      );
      expect(screen.getByText('Long button text that should be truncated')).toBeInTheDocument();
    });

    it('should render with both Icon and TruncatedText sub-components', () => {
      render(
        <SplitButton icon={RiArrowDownSLine}>
          <SplitButton.Icon icon={RiCloseLine} />
          <SplitButton.TruncatedText>Button with icon</SplitButton.TruncatedText>
        </SplitButton>,
      );
      expect(screen.getByText('Button with icon')).toBeInTheDocument();
    });
  });

  describe('Dropdown menu', () => {
    it('should open dropdown menu content when icon trigger is clicked', async () => {
      render(
        <SplitButton icon={RiArrowDownSLine} menuContent={<div role="menuitem">Action one</div>}>
          Button
        </SplitButton>,
      );
      expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', { name: 'More options' }));
      expect(await screen.findByRole('menuitem')).toBeInTheDocument();
    });

    it('should not render dropdown content when menuContent is not provided', async () => {
      render(<SplitButton icon={RiArrowDownSLine}>Button</SplitButton>);
      await userEvent.click(screen.getByRole('button', { name: 'More options' }));
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  describe('Keyboard', () => {
    it('should open with ArrowDown, navigate between items and restore trigger focus after selection', async () => {
      const user = userEvent.setup();
      const handleSelect = vi.fn();

      render(
        <SplitButton
          icon={RiArrowDownSLine}
          menuContent={
            <>
              <DropdownMenu.Item>Action one</DropdownMenu.Item>
              <DropdownMenu.Item onSelect={handleSelect}>Action two</DropdownMenu.Item>
            </>
          }
        >
          Save
        </SplitButton>,
      );

      const menuTrigger = screen.getByRole('button', { name: 'More options' });
      await user.tab();
      await user.tab();
      expect(menuTrigger).toHaveFocus();
      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'Action one' })).toHaveFocus();
      });

      await user.keyboard('{ArrowDown}');
      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'Action two' })).toHaveFocus();
      });

      await user.keyboard('{Enter}');

      expect(handleSelect).toHaveBeenCalledOnce();
      await waitFor(() => {
        expect(screen.queryByRole('menu', { name: 'More options' })).not.toBeInTheDocument();
        expect(menuTrigger).toHaveFocus();
      });
    });

    it.each([
      { key: 'Enter', input: '{Enter}' },
      { key: 'Space', input: ' ' },
    ])('should open the menu with $key and restore trigger focus on Escape', async ({ input }) => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <SplitButton
          icon={RiArrowDownSLine}
          onClick={handleClick}
          menuContent={<DropdownMenu.Item>Action one</DropdownMenu.Item>}
        >
          Save
        </SplitButton>,
      );

      const menuTrigger = screen.getByRole('button', { name: 'More options' });

      await user.tab();
      await user.tab();
      expect(menuTrigger).toHaveFocus();
      await user.keyboard(input);

      await waitFor(() => {
        expect(screen.getByRole('menu', { name: 'More options' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Action one' })).toHaveFocus();
      });
      expect(menuTrigger).toHaveAttribute('aria-expanded', 'true');
      expect(handleClick).not.toHaveBeenCalled();

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('menu', { name: 'More options' })).not.toBeInTheDocument();
        expect(menuTrigger).toHaveFocus();
      });
      expect(menuTrigger).toHaveAttribute('aria-expanded', 'false');
      expect(handleClick).not.toHaveBeenCalled();
    });

    it.each([
      { key: 'Enter', input: '{Enter}' },
      { key: 'Space', input: ' ' },
    ])('should activate the main action with $key without opening the menu', async ({ input }) => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <SplitButton
          icon={RiArrowDownSLine}
          onClick={handleClick}
          menuContent={<DropdownMenu.Item>Action one</DropdownMenu.Item>}
        >
          Save
        </SplitButton>,
      );

      const mainButton = screen.getByRole('button', { name: 'Save' });
      const menuTrigger = screen.getByRole('button', { name: 'More options' });

      await user.tab();
      expect(mainButton).toHaveFocus();
      await user.keyboard(input);

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(menuTrigger).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();

      await user.tab();
      expect(menuTrigger).toHaveFocus();
      await user.tab({ shift: true });
      expect(mainButton).toHaveFocus();
    });

    it.each([
      {
        disabled: true,
        iconDisabled: false,
        enabledButton: 'More options',
        disabledButton: 'Save',
      },
      {
        disabled: false,
        iconDisabled: true,
        enabledButton: 'Save',
        disabledButton: 'More options',
      },
    ])(
      'should skip the disabled $disabledButton button during Tab navigation',
      async ({ disabled, iconDisabled, enabledButton, disabledButton }) => {
        const user = userEvent.setup();

        render(
          <>
            <button type="button">Before split button</button>
            <SplitButton icon={RiArrowDownSLine} disabled={disabled} iconDisabled={iconDisabled}>
              Save
            </SplitButton>
            <button type="button">After split button</button>
          </>,
        );

        const before = screen.getByRole('button', { name: 'Before split button' });
        const after = screen.getByRole('button', { name: 'After split button' });
        const enabled = screen.getByRole('button', { name: enabledButton });

        expect(screen.getByRole('button', { name: disabledButton })).toBeDisabled();
        expect(enabled).not.toBeDisabled();

        await user.tab();
        expect(before).toHaveFocus();
        await user.tab();
        expect(enabled).toHaveFocus();
        await user.tab();
        expect(after).toHaveFocus();

        await user.tab({ shift: true });
        expect(enabled).toHaveFocus();
        await user.tab({ shift: true });
        expect(before).toHaveFocus();
      },
    );
  });
});

// Snapshot Tests
describe('SplitButton Snapshots', () => {
  const presets: Array<'filled' | 'border'> = ['filled', 'border'];
  const sizes: Array<'xs' | 'sm' | 'md' | 'lg'> = ['xs', 'sm', 'md', 'lg'];

  describe('Variant: primary', () => {
    presets.forEach((preset) => {
      describe(`Preset: ${preset}`, () => {
        sizes.forEach((size) => {
          it(`matches snapshot for ${preset} ${size}`, () => {
            const { container } = render(
              <SplitButton variant="primary" preset={preset} size={size} icon={RiArrowDownSLine}>
                Button
              </SplitButton>,
            );
            expect(container.firstChild).toMatchSnapshot();
          });

          it(`matches snapshot for ${preset} ${size} disabled`, () => {
            const { container } = render(
              <SplitButton
                variant="primary"
                preset={preset}
                size={size}
                icon={RiArrowDownSLine}
                disabled
              >
                Button
              </SplitButton>,
            );
            expect(container.firstChild).toMatchSnapshot();
          });

          it(`matches snapshot for ${preset} ${size} iconDisabled`, () => {
            const { container } = render(
              <SplitButton
                variant="primary"
                preset={preset}
                size={size}
                icon={RiArrowDownSLine}
                iconDisabled
              >
                Button
              </SplitButton>,
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
              <SplitButton variant="secondary" preset={preset} size={size} icon={RiArrowDownSLine}>
                Button
              </SplitButton>,
            );
            expect(container.firstChild).toMatchSnapshot();
          });

          it(`matches snapshot for ${preset} ${size} disabled`, () => {
            const { container } = render(
              <SplitButton
                variant="secondary"
                preset={preset}
                size={size}
                icon={RiArrowDownSLine}
                disabled
              >
                Button
              </SplitButton>,
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
              <SplitButton variant="danger" preset={preset} size={size} icon={RiArrowDownSLine}>
                Button
              </SplitButton>,
            );
            expect(container.firstChild).toMatchSnapshot();
          });

          it(`matches snapshot for ${preset} ${size} disabled`, () => {
            const { container } = render(
              <SplitButton
                variant="danger"
                preset={preset}
                size={size}
                icon={RiArrowDownSLine}
                disabled
              >
                Button
              </SplitButton>,
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
              <SplitButton variant="success" preset={preset} size={size} icon={RiArrowDownSLine}>
                Button
              </SplitButton>,
            );
            expect(container.firstChild).toMatchSnapshot();
          });

          it(`matches snapshot for ${preset} ${size} disabled`, () => {
            const { container } = render(
              <SplitButton
                variant="success"
                preset={preset}
                size={size}
                icon={RiArrowDownSLine}
                disabled
              >
                Button
              </SplitButton>,
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
              <SplitButton variant="inverse" preset={preset} size={size} icon={RiArrowDownSLine}>
                Button
              </SplitButton>,
            );
            expect(container.firstChild).toMatchSnapshot();
          });

          it(`matches snapshot for ${preset} ${size} disabled`, () => {
            const { container } = render(
              <SplitButton
                variant="inverse"
                preset={preset}
                size={size}
                icon={RiArrowDownSLine}
                disabled
              >
                Button
              </SplitButton>,
            );
            expect(container.firstChild).toMatchSnapshot();
          });
        });
      });
    });
  });

  describe('With sub-components', () => {
    it('matches snapshot with icon', () => {
      const { container } = render(
        <SplitButton variant="primary" preset="filled" icon={RiArrowDownSLine}>
          <SplitButton.Icon icon={RiBugLine} />
          Button
        </SplitButton>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with truncated text', () => {
      const { container } = render(
        <SplitButton variant="primary" preset="filled" icon={RiArrowDownSLine}>
          <SplitButton.TruncatedText>Long text that should be truncated</SplitButton.TruncatedText>
        </SplitButton>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with icon and truncated text', () => {
      const { container } = render(
        <SplitButton variant="primary" preset="filled" icon={RiArrowDownSLine}>
          <SplitButton.Icon icon={RiBugLine} />
          <SplitButton.TruncatedText>Button with icon and truncated text</SplitButton.TruncatedText>
        </SplitButton>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

describe('SplitButton data-slot', () => {
  it('marks each part with data-slot', () => {
    const { container } = render(
      <SplitButton icon={RiArrowDownSLine}>
        <SplitButton.Icon icon={RiBugLine} />
        <SplitButton.TruncatedText>Publish</SplitButton.TruncatedText>
      </SplitButton>,
    );
    expect(container.querySelector('[data-slot="split-button"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="button-icon"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="button-truncated-text"]')).toBeInTheDocument();
  });
});
