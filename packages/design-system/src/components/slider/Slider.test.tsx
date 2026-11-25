import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Slider } from './Slider';

describe('Slider', () => {
  describe('Basic rendering', () => {
    it('should render slider', () => {
      render(<Slider />);

      expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('should render single slider with one thumb by default', () => {
      render(<Slider />);

      expect(screen.getAllByRole('slider')).toHaveLength(1);
    });

    it('should render range slider with two thumbs', () => {
      render(<Slider type="range" />);

      expect(screen.getAllByRole('slider')).toHaveLength(2);
    });

    it('should render with custom min and max values', () => {
      render(<Slider min={10} max={50} />);

      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemin', '10');
      expect(slider).toHaveAttribute('aria-valuemax', '50');
    });
  });

  describe('Labels', () => {
    it('should render labels at bottom position', () => {
      render(<Slider min={0} max={100} labels="bottom" />);

      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('should render label on left side only', () => {
      render(<Slider min={0} max={100} labels="left" />);

      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.queryByText('100')).not.toBeInTheDocument();
    });

    it('should render label on right side only', () => {
      render(<Slider min={0} max={100} labels="right" />);

      expect(screen.queryByText('0')).not.toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('should render labels on both sides', () => {
      render(<Slider min={0} max={100} labels="side" />);

      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  describe('Controlled and uncontrolled modes', () => {
    it('should work as uncontrolled component with defaultValue', () => {
      render(<Slider defaultValue={[50]} />);

      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '50');
    });

    it('should work as controlled component with value', () => {
      render(<Slider value={[75]} />);

      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '75');
    });

    it('should call onValueChange when value changes', async () => {
      const handleValueChange = vi.fn();
      const user = userEvent.setup();

      render(<Slider defaultValue={[50]} onValueChange={handleValueChange} />);

      const slider = screen.getByRole('slider');
      slider.focus();
      await user.keyboard('{ArrowRight}');

      expect(handleValueChange).toHaveBeenCalled();
    });
  });

  describe('States', () => {
    it('should render disabled slider', () => {
      render(<Slider disabled />);

      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('data-disabled', '');
    });

    it('should not allow interaction when disabled', async () => {
      const handleValueChange = vi.fn();
      const user = userEvent.setup();

      render(<Slider disabled defaultValue={[50]} onValueChange={handleValueChange} />);

      const slider = screen.getByRole('slider');
      slider.focus();
      await user.keyboard('{ArrowRight}');

      expect(handleValueChange).not.toHaveBeenCalled();
    });
  });

  describe('HTML attributes', () => {
    it('should pass through HTML attributes to the slider element', () => {
      render(<Slider data-testid="custom-slider" data-tracking="volume" />);

      const slider = screen.getByTestId('custom-slider');
      expect(slider).toHaveAttribute('data-tracking', 'volume');
    });

    it('should merge className onto the root element', () => {
      const { container } = render(<Slider className="custom-class" />);

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});

describe('Slider Snapshots', () => {
  it('should match snapshot for default single slider', () => {
    const { container } = render(<Slider defaultValue={[50]} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for range slider', () => {
    const { container } = render(<Slider type="range" defaultValue={[25, 75]} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for slider with bottom labels', () => {
    const { container } = render(<Slider min={0} max={100} labels="bottom" defaultValue={[50]} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for slider with side labels', () => {
    const { container } = render(<Slider min={0} max={100} labels="side" defaultValue={[50]} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for slider with left label', () => {
    const { container } = render(<Slider min={0} max={100} labels="left" defaultValue={[50]} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for slider with right label', () => {
    const { container } = render(<Slider min={0} max={100} labels="right" defaultValue={[50]} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for disabled slider', () => {
    const { container } = render(<Slider disabled defaultValue={[50]} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for slider with tooltip', () => {
    const { container } = render(<Slider defaultValue={[50]} showTooltipValue />);

    const thumb = screen.getByRole('slider');
    thumb.focus();

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('Thumbs', () => {
  it('renders one thumb per value without type', () => {
    render(<Slider defaultValue={[20, 80]} aria-label="Price" />);

    expect(screen.getByRole('slider', { name: 'Minimum Price' })).toHaveAttribute(
      'aria-valuenow',
      '20',
    );
    expect(screen.getByRole('slider', { name: 'Maximum Price' })).toHaveAttribute(
      'aria-valuenow',
      '80',
    );
  });

  it('follows a controlled value', () => {
    render(<Slider value={[10, 90]} />);

    expect(screen.getAllByRole('slider')).toHaveLength(2);
  });
});

describe('Children', () => {
  it('renders children inside the slider', () => {
    render(
      <Slider data-testid="slider">
        <span data-testid="tick" />
      </Slider>,
    );

    expect(screen.getByTestId('slider')).toContainElement(screen.getByTestId('tick'));
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });
});

describe('data-slot', () => {
  it('marks each part with data-slot', () => {
    const { container } = render(<Slider type="range" defaultValue={[20, 80]} labels="side" />);

    expect(container.firstChild).toHaveAttribute('data-slot', 'slider');
    screen
      .getAllByRole('slider')
      .forEach((thumb) => expect(thumb).toHaveAttribute('data-slot', 'slider-thumb'));
    expect(screen.getByText('0')).toHaveAttribute('data-slot', 'slider-label');
    expect(screen.getByText('100')).toHaveAttribute('data-slot', 'slider-label');
  });
});

describe('Accessible names', () => {
  it('names the thumb from aria-label instead of the wrapper', () => {
    render(<Slider aria-label="Volume" data-testid="root" />);

    expect(screen.getByRole('slider', { name: 'Volume' })).toBeInTheDocument();
    expect(screen.getByTestId('root')).not.toHaveAttribute('aria-label');
  });

  it('names a single thumb from aria-labelledby', () => {
    render(
      <>
        <span id="volume-label">Volume</span>
        <Slider aria-labelledby="volume-label" />
      </>,
    );

    expect(screen.getByRole('slider', { name: 'Volume' })).toBeInTheDocument();
  });

  it('tells range thumbs apart when they share aria-labelledby', () => {
    render(
      <>
        <span id="price-label">Price</span>
        <Slider type="range" aria-labelledby="price-label" />
      </>,
    );

    expect(screen.getByRole('slider', { name: 'Price Minimum' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Price Maximum' })).toBeInTheDocument();
  });

  it('tells range thumbs apart when they share aria-label', () => {
    render(<Slider type="range" aria-label="Price" />);

    expect(screen.getByRole('slider', { name: 'Minimum Price' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Maximum Price' })).toBeInTheDocument();
  });

  it('names each thumb with thumbAriaLabels', () => {
    render(<Slider type="range" thumbAriaLabels={['Minimum price', 'Maximum price']} />);

    expect(screen.getByRole('slider', { name: 'Minimum price' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Maximum price' })).toBeInTheDocument();
  });

  it('combines aria-labelledby with thumbAriaLabels', () => {
    render(
      <>
        <span id="price-label">Price</span>
        <Slider
          type="range"
          aria-labelledby="price-label"
          thumbAriaLabels={['minimum', 'maximum']}
        />
      </>,
    );

    expect(screen.getByRole('slider', { name: 'Price minimum' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Price maximum' })).toBeInTheDocument();
  });

  it('does not use the "Slider thumb" fallback when the slider is named', () => {
    render(<Slider aria-label="Volume" />);

    expect(screen.queryByLabelText('Slider thumb')).toBeNull();
  });

  it('leaves the thumb unnamed when nothing names it', () => {
    render(<Slider />);

    expect(screen.getByRole('slider')).not.toHaveAttribute('aria-label');
  });
});
