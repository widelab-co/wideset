import { RiCalendarLine, RiFileCopyLine, RiSearchLine } from '@remixicon/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { TextInput } from './TextInput';

describe('TextInput', () => {
  describe('data-slot', () => {
    it('marks each part with data-slot', () => {
      const { container } = render(
        <TextInput value="Quarterly report" onChange={() => {}}>
          <TextInput.Prefix>
            <TextInput.Button>All files</TextInput.Button>
          </TextInput.Prefix>
          <TextInput.Prefix inner>
            <TextInput.Icon icon={RiSearchLine} />
          </TextInput.Prefix>
          <TextInput.Input aria-label="Search" />
          <TextInput.Suffix inner>
            <TextInput.ClearButton />
            <TextInput.IconButton icon={RiFileCopyLine} aria-label="Copy" />
          </TextInput.Suffix>
        </TextInput>,
      );
      const slot = (name: string) => container.querySelectorAll(`[data-slot="${name}"]`);
      expect(container.firstChild).toHaveAttribute('data-slot', 'text-input');
      expect(slot('text-input-prefix')).toHaveLength(2);
      expect(slot('text-input-suffix')).toHaveLength(1);
      expect(slot('text-input-icon')).toHaveLength(1);
      expect(screen.getByRole('textbox')).toHaveAttribute('data-slot', 'text-input-input');
      expect(screen.getByRole('button', { name: 'All files' })).toHaveAttribute(
        'data-slot',
        'text-input-button',
      );
      expect(screen.getByRole('button', { name: 'Clear' })).toHaveAttribute(
        'data-slot',
        'text-input-clear-button',
      );
      expect(screen.getByRole('button', { name: 'Copy' })).toHaveAttribute(
        'data-slot',
        'text-input-icon-button',
      );
    });

    it('lets a composing component set the root slot', () => {
      const { container } = render(<TextInput data-slot="search" aria-label="Search" />);
      expect(container.firstChild).toHaveAttribute('data-slot', 'search');
      expect(screen.getByRole('textbox')).toHaveAttribute('data-slot', 'text-input-input');
    });
  });

  describe('Basic rendering', () => {
    it('should render a text input element by default', () => {
      render(<TextInput placeholder="Enter text" />);
      const input = screen.getByPlaceholderText('Enter text');
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe('INPUT');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should apply custom className', () => {
      const { container } = render(<TextInput className="custom-class" placeholder="Input" />);
      const textInput = container.querySelector('.custom-class');
      expect(textInput).toBeInTheDocument();
    });
  });

  describe('Disabled state', () => {
    it('should set data-disabled attribute when disabled', () => {
      const { container } = render(<TextInput disabled placeholder="Disabled" />);
      const textInput = container.firstChild as HTMLElement;
      expect(textInput).toHaveAttribute('data-disabled', 'true');
    });

    it('should not be editable when disabled', async () => {
      const user = userEvent.setup();
      render(<TextInput disabled placeholder="Disabled" value="test" onChange={() => {}} />);
      const input = screen.getByPlaceholderText('Disabled') as HTMLInputElement;
      await user.type(input, 'new text');
      expect(input.value).toBe('test');
    });
  });

  describe('Event handlers', () => {
    it('should call onChange when input value changes', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<TextInput onChange={handleChange} placeholder="Input" />);
      const input = screen.getByPlaceholderText('Input');
      await user.type(input, 'test');
      expect(handleChange).toHaveBeenCalled();
    });

    it('should call onFocus when input is focused', async () => {
      const handleFocus = vi.fn();
      const user = userEvent.setup();
      render(<TextInput onFocus={handleFocus} placeholder="Input" />);
      const input = screen.getByPlaceholderText('Input');
      await user.click(input);
      expect(handleFocus).toHaveBeenCalled();
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to the input', () => {
      const ref = vi.fn();
      render(<TextInput ref={ref} aria-label="Name" />);
      expect(ref).toHaveBeenCalledWith(screen.getByRole('textbox', { name: 'Name' }));
    });

    it('forwards the root ref to the input when composed', () => {
      const ref = createRef<HTMLInputElement>();
      render(
        <TextInput ref={ref}>
          <TextInput.Prefix>$</TextInput.Prefix>
          <TextInput.Input aria-label="Amount" />
        </TextInput>,
      );
      expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Amount' }));
    });

    it('sets the root ref and a ref on TextInput.Input to the same input', () => {
      const rootRef = createRef<HTMLInputElement>();
      const partRef = createRef<HTMLInputElement>();
      render(
        <TextInput ref={rootRef}>
          <TextInput.Input ref={partRef} aria-label="Amount" />
        </TextInput>,
      );
      const input = screen.getByRole('textbox', { name: 'Amount' });
      expect(rootRef.current).toBe(input);
      expect(partRef.current).toBe(input);
    });

    it('keeps affix click-to-focus working when TextInput.Input has its own ref', async () => {
      const user = userEvent.setup();
      const partRef = createRef<HTMLInputElement>();
      render(
        <TextInput>
          <TextInput.Prefix>$</TextInput.Prefix>
          <TextInput.Input ref={partRef} aria-label="Amount" />
        </TextInput>,
      );
      await user.click(screen.getByText('$'));
      expect(screen.getByRole('textbox', { name: 'Amount' })).toHaveFocus();
    });
  });

  describe('HTML attributes', () => {
    it('should pass through HTML and data attributes to input', () => {
      render(
        <TextInput
          placeholder="Input"
          data-testid="custom-input"
          aria-label="Custom input"
          name="test-input"
        />,
      );
      const input = screen.getByPlaceholderText('Input');
      expect(input).toHaveAttribute('name', 'test-input');
      expect(input).toHaveAttribute('data-testid', 'custom-input');
    });

    it('puts aria-describedby and aria-invalid on the input when composed with children', () => {
      render(
        <TextInput aria-describedby="amount-hint" aria-invalid>
          <TextInput.Input aria-label="Amount" />
        </TextInput>,
      );
      const input = screen.getByRole('textbox', { name: 'Amount' });
      expect(input).toHaveAttribute('aria-describedby', 'amount-hint');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input.parentElement).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('Root props in composition', () => {
    it('passes root input props to TextInput.Input', () => {
      render(
        <TextInput
          id="amount"
          name="amount"
          placeholder="0.00"
          aria-describedby="amount-hint"
          data-testid="amount-input"
        >
          <TextInput.Prefix>$</TextInput.Prefix>
          <TextInput.Input aria-label="Amount" />
        </TextInput>,
      );
      const input = screen.getByRole('textbox', { name: 'Amount' });
      expect(input).toHaveAttribute('id', 'amount');
      expect(input).toHaveAttribute('name', 'amount');
      expect(input).toHaveAttribute('placeholder', '0.00');
      expect(input).toHaveAttribute('aria-describedby', 'amount-hint');
      expect(input).toHaveAttribute('data-testid', 'amount-input');
    });

    it('lets a prop on TextInput.Input win over the same prop on the root', () => {
      render(
        <TextInput placeholder="From the root">
          <TextInput.Input placeholder="From the part" aria-label="Field" />
        </TextInput>,
      );
      expect(screen.getByRole('textbox', { name: 'Field' })).toHaveAttribute(
        'placeholder',
        'From the part',
      );
    });

    it('fires root handlers on the composed input', async () => {
      const user = userEvent.setup();
      const handleKeyDown = vi.fn();
      const handleBlur = vi.fn();
      render(
        <TextInput onKeyDown={handleKeyDown} onBlur={handleBlur}>
          <TextInput.Input aria-label="Field" />
        </TextInput>,
      );
      await user.type(screen.getByRole('textbox', { name: 'Field' }), 'a');
      await user.tab();
      expect(handleKeyDown).toHaveBeenCalled();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('keeps input attributes off the wrapper', () => {
      const { container } = render(
        <TextInput className="w-full" data-testid="field" aria-label="Field">
          <TextInput.Input />
        </TextInput>,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('w-full');
      expect(wrapper).toHaveAttribute('data-slot', 'text-input');
      expect(wrapper).not.toHaveAttribute('data-testid');
      expect(wrapper).not.toHaveAttribute('aria-label');
    });
  });

  describe('aria-invalid', () => {
    it('sets aria-invalid on the input in the danger variant', () => {
      render(<TextInput variant="danger" aria-label="Email" />);
      expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute(
        'aria-invalid',
        'true',
      );
    });

    it('sets aria-invalid on a composed input in the danger variant', () => {
      render(
        <TextInput variant="danger">
          <TextInput.Input aria-label="Email" />
        </TextInput>,
      );
      expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute(
        'aria-invalid',
        'true',
      );
    });

    it('leaves aria-invalid unset in the primary variant', () => {
      render(<TextInput variant="primary" aria-label="Email" />);
      expect(screen.getByRole('textbox', { name: 'Email' })).not.toHaveAttribute('aria-invalid');
    });

    it('lets an explicit aria-invalid win', () => {
      render(<TextInput variant="danger" aria-invalid={false} aria-label="Email" />);
      expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute(
        'aria-invalid',
        'false',
      );
    });
  });

  describe('TextInput.ClearButton', () => {
    /** The field is controlled-only, so the harness owns the value. */
    const Clearable = ({
      initialValue = '',
      disabled,
      onClear,
      clearAriaLabel,
    }: {
      initialValue?: string;
      disabled?: boolean;
      onClear?: () => void;
      clearAriaLabel?: string;
    }) => {
      const [value, setValue] = useState(initialValue);
      return (
        <TextInput value={value} onChange={(e) => setValue(e.target.value)} disabled={disabled}>
          <TextInput.Input placeholder="Input" />
          <TextInput.Suffix inner>
            <TextInput.ClearButton onClear={onClear} aria-label={clearAriaLabel} />
          </TextInput.Suffix>
        </TextInput>
      );
    };

    it('does not show clear button when input has no value', () => {
      render(<Clearable />);
      expect(screen.queryByLabelText('Clear')).not.toBeInTheDocument();
    });

    it('shows clear button when input has value', () => {
      render(<Clearable initialValue="some text" />);
      expect(screen.getByLabelText('Clear')).toBeInTheDocument();
    });

    it('gives the clear button the IconButton radius', () => {
      render(<Clearable initialValue="some text" />);
      expect(screen.getByRole('button', { name: 'Clear' })).toHaveClass('rounded-ws-control-lg');
    });

    it('appears with the first typed character and disappears when the value is emptied', async () => {
      const user = userEvent.setup();
      render(<Clearable />);
      const input = screen.getByPlaceholderText('Input');

      expect(screen.queryByLabelText('Clear')).not.toBeInTheDocument();

      await user.type(input, 'a');
      expect(screen.getByLabelText('Clear')).toBeInTheDocument();

      await user.clear(input);
      expect(screen.queryByLabelText('Clear')).not.toBeInTheDocument();
    });

    it('calls onClear when clear button is clicked', async () => {
      const user = userEvent.setup();
      const handleClear = vi.fn();
      render(<Clearable initialValue="some text" onClear={handleClear} />);

      await user.click(screen.getByLabelText('Clear'));

      expect(handleClear).toHaveBeenCalledTimes(1);
    });

    it('runs onChange with an empty value before onClear', async () => {
      const user = userEvent.setup();
      const calls: string[] = [];
      render(
        <TextInput value="some text" onChange={(e) => calls.push(`change:${e.target.value}`)}>
          <TextInput.Input aria-label="Query" />
          <TextInput.Suffix inner>
            <TextInput.ClearButton onClear={() => calls.push('clear')} />
          </TextInput.Suffix>
        </TextInput>,
      );

      await user.click(screen.getByRole('button', { name: 'Clear' }));

      expect(calls).toEqual(['change:', 'clear']);
    });

    it('does not show clear button when disabled', () => {
      render(<Clearable initialValue="some text" disabled />);
      expect(screen.queryByLabelText('Clear')).not.toBeInTheDocument();
    });

    it('clears the value and hides itself', async () => {
      const user = userEvent.setup();
      render(<Clearable initialValue="some text" />);

      await user.click(screen.getByLabelText('Clear'));

      await waitFor(() => {
        expect((screen.getByPlaceholderText('Input') as HTMLInputElement).value).toBe('');
      });
      expect(screen.queryByLabelText('Clear')).not.toBeInTheDocument();
    });

    it('shows and clears in uncontrolled mode', async () => {
      const user = userEvent.setup();
      render(
        <TextInput>
          <TextInput.Input placeholder="Input" />
          <TextInput.Suffix inner>
            <TextInput.ClearButton />
          </TextInput.Suffix>
        </TextInput>,
      );
      const input = screen.getByPlaceholderText('Input') as HTMLInputElement;

      expect(screen.queryByLabelText('Clear')).not.toBeInTheDocument();

      await user.type(input, 'typed');
      expect(input.value).toBe('typed');
      expect(screen.getByLabelText('Clear')).toBeInTheDocument();

      await user.click(screen.getByLabelText('Clear'));

      expect(input.value).toBe('');
      expect(screen.queryByLabelText('Clear')).not.toBeInTheDocument();
    });

    it('reports the cleared value through onChange', async () => {
      const user = userEvent.setup();
      // The value is read inside the handler: a controlled input the parent does not
      // update is restored to its `value` right after the event.
      const seen: string[] = [];
      const handleChange = vi.fn((event: React.ChangeEvent<HTMLInputElement>) => {
        seen.push(event.target.value);
      });
      render(
        <TextInput value="some text" onChange={handleChange}>
          <TextInput.Input placeholder="Input" />
          <TextInput.Suffix inner>
            <TextInput.ClearButton />
          </TextInput.Suffix>
        </TextInput>,
      );

      await user.click(screen.getByLabelText('Clear'));

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(seen).toEqual(['']);
    });

    it('reports a real change event, with the input as its target', async () => {
      const user = userEvent.setup();
      const events: { target: EventTarget; name: string; type: string }[] = [];
      render(
        <TextInput
          name="query"
          value="some text"
          onChange={(event) =>
            events.push({ target: event.target, name: event.target.name, type: event.type })
          }
        >
          <TextInput.Input aria-label="Query" />
          <TextInput.Suffix inner>
            <TextInput.ClearButton />
          </TextInput.Suffix>
        </TextInput>,
      );

      await user.click(screen.getByLabelText('Clear'));

      expect(events).toEqual([
        { target: screen.getByRole('textbox', { name: 'Query' }), name: 'query', type: 'change' },
      ]);
    });

    it('updates a store keyed by event.target.name, as form libraries do', async () => {
      const user = userEvent.setup();
      const NamedField = () => {
        const [values, setValues] = useState<Record<string, string>>({ query: 'some text' });
        return (
          <>
            <TextInput
              name="query"
              value={values.query}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }))
              }
            >
              <TextInput.Input aria-label="Query" />
              <TextInput.Suffix inner>
                <TextInput.ClearButton />
              </TextInput.Suffix>
            </TextInput>
            <output>{JSON.stringify(values)}</output>
          </>
        );
      };
      render(<NamedField />);

      await user.click(screen.getByLabelText('Clear'));

      expect(screen.getByRole('status')).toHaveTextContent('{"query":""}');
    });

    it('fires an onChange set on TextInput.Input', async () => {
      const user = userEvent.setup();
      const handleInputChange = vi.fn();
      render(
        <TextInput value="some text">
          <TextInput.Input aria-label="Query" onChange={handleInputChange} />
          <TextInput.Suffix inner>
            <TextInput.ClearButton />
          </TextInput.Suffix>
        </TextInput>,
      );

      await user.click(screen.getByLabelText('Clear'));

      expect(handleInputChange).toHaveBeenCalledTimes(1);
    });

    it('fires native input listeners', async () => {
      const user = userEvent.setup();
      const handleNativeInput = vi.fn();
      render(<Clearable initialValue="some text" />);
      screen.getByPlaceholderText('Input').addEventListener('input', handleNativeInput);

      await user.click(screen.getByLabelText('Clear'));

      expect(handleNativeInput).toHaveBeenCalledTimes(1);
    });

    it('clears from the keyboard and returns focus to the input', async () => {
      const user = userEvent.setup();
      render(<Clearable initialValue="some text" />);
      const input = screen.getByPlaceholderText('Input') as HTMLInputElement;

      await user.click(input);
      await user.tab();
      expect(screen.getByLabelText('Clear')).toHaveFocus();
      await user.keyboard('{Enter}');

      expect(input.value).toBe('');
      expect(input).toHaveFocus();
    });

    it('does not show on a read-only field', () => {
      render(
        <TextInput value="some text" readOnly>
          <TextInput.Input aria-label="Query" />
          <TextInput.Suffix inner>
            <TextInput.ClearButton />
          </TextInput.Suffix>
        </TextInput>,
      );
      expect(screen.queryByLabelText('Clear')).not.toBeInTheDocument();
    });

    it('passes rest props and its ref to the button', () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <TextInput value="some text" onChange={() => {}}>
          <TextInput.Input aria-label="Query" />
          <TextInput.Suffix inner>
            <TextInput.ClearButton ref={ref} data-testid="clear" title="Clear the query" />
          </TextInput.Suffix>
        </TextInput>,
      );
      const button = screen.getByRole('button', { name: 'Clear' });
      expect(button).toHaveAttribute('data-testid', 'clear');
      expect(button).toHaveAttribute('title', 'Clear the query');
      expect(ref.current).toBe(button);
    });

    it('skips the clear when its onClick prevents default', async () => {
      const user = userEvent.setup();
      const handleClear = vi.fn();
      render(
        <TextInput value="some text" onChange={() => {}}>
          <TextInput.Input aria-label="Query" />
          <TextInput.Suffix inner>
            <TextInput.ClearButton
              onClick={(event) => event.preventDefault()}
              onClear={handleClear}
            />
          </TextInput.Suffix>
        </TextInput>,
      );

      await user.click(screen.getByLabelText('Clear'));

      expect(handleClear).not.toHaveBeenCalled();
    });

    it('focuses input after clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<Clearable initialValue="some text" />);

      await user.click(screen.getByLabelText('Clear'));

      expect(document.activeElement).toBe(screen.getByPlaceholderText('Input'));
    });

    it('renders a custom aria-label', () => {
      render(<Clearable initialValue="some text" clearAriaLabel="Reset" />);
      expect(screen.getByLabelText('Reset')).toBeInTheDocument();
    });
  });

  describe('TextInput.Input', () => {
    it('should render input when using TextInput.Input', () => {
      render(
        <TextInput>
          <TextInput.Input placeholder="Custom input" />
        </TextInput>,
      );
      const input = screen.getByPlaceholderText('Custom input');
      expect(input).toBeInTheDocument();
    });

    it('should apply custom className to TextInput.Input', () => {
      render(
        <TextInput>
          <TextInput.Input className="custom-input-class" placeholder="Input" />
        </TextInput>,
      );
      const input = screen.getByPlaceholderText('Input');
      expect(input).toHaveClass('custom-input-class');
    });
  });

  describe('TextInput.Prefix', () => {
    it('should render prefix', () => {
      render(
        <TextInput>
          <TextInput.Prefix>$</TextInput.Prefix>
          <TextInput.Input placeholder="Input" />
        </TextInput>,
      );
      expect(screen.getByText('$')).toBeInTheDocument();
    });

    it('should focus input when prefix is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TextInput>
          <TextInput.Prefix>$</TextInput.Prefix>
          <TextInput.Input placeholder="Input" />
        </TextInput>,
      );
      const prefix = screen.getByText('$');
      const input = screen.getByPlaceholderText('Input');
      await user.click(prefix);
      expect(input).toHaveFocus();
    });
  });

  describe('TextInput.Prefix onClick', () => {
    it('calls a caller onClick and still focuses the input', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <TextInput>
          <TextInput.Prefix onClick={handleClick}>$</TextInput.Prefix>
          <TextInput.Input aria-label="Amount" />
        </TextInput>,
      );
      await user.click(screen.getByText('$'));
      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('textbox', { name: 'Amount' })).toHaveFocus();
    });

    it('does not focus the input when the onClick prevents default', async () => {
      const user = userEvent.setup();
      render(
        <TextInput>
          <TextInput.Prefix onClick={(event) => event.preventDefault()}>$</TextInput.Prefix>
          <TextInput.Input aria-label="Amount" />
        </TextInput>,
      );
      await user.click(screen.getByText('$'));
      expect(screen.getByRole('textbox', { name: 'Amount' })).not.toHaveFocus();
    });
  });

  describe('TextInput.Suffix', () => {
    it('should render suffix', () => {
      render(
        <TextInput>
          <TextInput.Input placeholder="Input" />
          <TextInput.Suffix>.com</TextInput.Suffix>
        </TextInput>,
      );
      expect(screen.getByText('.com')).toBeInTheDocument();
    });

    it('should focus input when suffix is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TextInput>
          <TextInput.Input placeholder="Input" />
          <TextInput.Suffix>.com</TextInput.Suffix>
        </TextInput>,
      );
      const suffix = screen.getByText('.com');
      const input = screen.getByPlaceholderText('Input');
      await user.click(suffix);
      expect(input).toHaveFocus();
    });
  });

  describe('TextInput.Icon', () => {
    it('should render icon', () => {
      render(
        <TextInput>
          <TextInput.Prefix>
            <TextInput.Icon icon={RiSearchLine} />
          </TextInput.Prefix>
          <TextInput.Input placeholder="Input" />
        </TextInput>,
      );
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('TextInput.IconButton', () => {
    it('should render icon button', () => {
      const handleClick = vi.fn();
      render(
        <TextInput>
          <TextInput.Input placeholder="Input" />
          <TextInput.Suffix>
            <TextInput.IconButton icon={RiFileCopyLine} onClick={handleClick} />
          </TextInput.Suffix>
        </TextInput>,
      );
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should call onClick when icon button is clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(
        <TextInput>
          <TextInput.Input placeholder="Input" />
          <TextInput.Suffix>
            <TextInput.IconButton icon={RiFileCopyLine} onClick={handleClick} />
          </TextInput.Suffix>
        </TextInput>,
      );
      const button = screen.getByRole('button');
      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('TextInput.Button', () => {
    it('should render button', () => {
      render(
        <TextInput>
          <TextInput.Prefix>
            <TextInput.Button>Action</TextInput.Button>
          </TextInput.Prefix>
          <TextInput.Input placeholder="Input" />
        </TextInput>,
      );
      const button = screen.getByRole('button', { name: 'Action' });
      expect(button).toBeInTheDocument();
    });

    it('should call onClick when button is clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(
        <TextInput>
          <TextInput.Prefix>
            <TextInput.Button onClick={handleClick}>Action</TextInput.Button>
          </TextInput.Prefix>
          <TextInput.Input placeholder="Input" />
        </TextInput>,
      );
      const button = screen.getByRole('button', { name: 'Action' });
      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('With sub-components', () => {
    it('should render with prefix and suffix', () => {
      render(
        <TextInput>
          <TextInput.Prefix>$</TextInput.Prefix>
          <TextInput.Input placeholder="Amount" />
          <TextInput.Suffix>USD</TextInput.Suffix>
        </TextInput>,
      );
      expect(screen.getByText('$')).toBeInTheDocument();
      expect(screen.getByText('USD')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument();
    });
  });
});

// Snapshot Tests
describe('TextInput Snapshots', () => {
  const variants: Array<'primary' | 'danger'> = ['primary', 'danger'];
  const presets: Array<'border' | 'ghost'> = ['border', 'ghost'];
  const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

  variants.forEach((variant) => {
    describe(`Variant: ${variant}`, () => {
      presets.forEach((preset) => {
        describe(`Preset: ${preset}`, () => {
          sizes.forEach((size) => {
            it(`matches snapshot for ${preset} ${size}`, () => {
              const { container } = render(
                <TextInput variant={variant} preset={preset} size={size} placeholder="Input" />,
              );
              expect(container.firstChild).toMatchSnapshot();
            });

            it(`matches snapshot for ${preset} ${size} disabled`, () => {
              const { container } = render(
                <TextInput
                  variant={variant}
                  preset={preset}
                  size={size}
                  disabled
                  placeholder="Input"
                />,
              );
              expect(container.firstChild).toMatchSnapshot();
            });

            it(`matches snapshot for ${preset} ${size} with clear button`, () => {
              const { container } = render(
                <TextInput
                  variant={variant}
                  preset={preset}
                  size={size}
                  value="some text"
                  onChange={() => {}}
                >
                  <TextInput.Input placeholder="Input" />
                  <TextInput.Suffix inner>
                    <TextInput.ClearButton />
                  </TextInput.Suffix>
                </TextInput>,
              );
              expect(container.firstChild).toMatchSnapshot();
            });
          });
        });
      });
    });
  });

  describe('With sub-components', () => {
    it('matches snapshot with prefix', () => {
      const { container } = render(
        <TextInput>
          <TextInput.Prefix>$</TextInput.Prefix>
          <TextInput.Input placeholder="Amount" />
        </TextInput>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with suffix', () => {
      const { container } = render(
        <TextInput>
          <TextInput.Input placeholder="Website" />
          <TextInput.Suffix>.com</TextInput.Suffix>
        </TextInput>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with prefix and suffix', () => {
      const { container } = render(
        <TextInput>
          <TextInput.Prefix>$</TextInput.Prefix>
          <TextInput.Input placeholder="Amount" />
          <TextInput.Suffix>USD</TextInput.Suffix>
        </TextInput>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with inner prefix', () => {
      const { container } = render(
        <TextInput>
          <TextInput.Prefix inner>
            <TextInput.Icon icon={RiSearchLine} />
          </TextInput.Prefix>
          <TextInput.Input placeholder="Search" />
        </TextInput>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with inner suffix', () => {
      const { container } = render(
        <TextInput>
          <TextInput.Input placeholder="Date" />
          <TextInput.Suffix inner>
            <TextInput.Icon icon={RiCalendarLine} />
          </TextInput.Suffix>
        </TextInput>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with icon button', () => {
      const { container } = render(
        <TextInput>
          <TextInput.Input placeholder="Input" />
          <TextInput.Suffix>
            <TextInput.IconButton icon={RiFileCopyLine} onClick={vi.fn()} />
          </TextInput.Suffix>
        </TextInput>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with button', () => {
      const { container } = render(
        <TextInput>
          <TextInput.Prefix>
            <TextInput.Button>Action</TextInput.Button>
          </TextInput.Prefix>
          <TextInput.Input placeholder="Input" />
        </TextInput>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with prefix and inner prefix', () => {
      const { container } = render(
        <TextInput>
          <TextInput.Prefix>https://</TextInput.Prefix>
          <TextInput.Prefix inner>
            <TextInput.Icon icon={RiSearchLine} />
          </TextInput.Prefix>
          <TextInput.Input placeholder="Input" />
        </TextInput>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with suffix and inner suffix', () => {
      const { container } = render(
        <TextInput>
          <TextInput.Input placeholder="Input" />
          <TextInput.Suffix inner>
            <TextInput.Icon icon={RiFileCopyLine} />
          </TextInput.Suffix>
          <TextInput.Suffix>.com</TextInput.Suffix>
        </TextInput>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
