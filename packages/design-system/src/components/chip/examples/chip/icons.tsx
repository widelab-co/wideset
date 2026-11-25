/**
 * Leading icons are decorative. Action and IconButton call consumer handlers independently:
 * this example applies a city through Action and removes values through IconButton. The example
 * owns the list and moves focus to Reset examples after removal.
 */
import { RiMapPinLine } from '@remixicon/react';
import { Button, Chip } from '@wideset/react';
import { useRef, useState } from 'react';

export default function ChipIcons() {
  const [cities, setCities] = useState(['Warsaw', 'Berlin']);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const resetRef = useRef<HTMLButtonElement>(null);
  const removeCity = (city: string) => {
    setCities((current) => current.filter((value) => value !== city));
    setSelectedCity((current) => (current === city ? null : current));
    resetRef.current?.focus();
  };

  return (
    <div className="gap-ws-5 flex flex-col items-start">
      <div className="gap-ws-5 flex flex-wrap items-center">
        <Chip variant="secondary">
          <Chip.Action onClick={() => setSelectedCity('Prague')}>
            <Chip.Icon icon={RiMapPinLine} />
            <Chip.Label>Prague</Chip.Label>
          </Chip.Action>
        </Chip>
        {cities.includes('Warsaw') && (
          <Chip>
            <Chip.Label>Warsaw</Chip.Label>
            <Chip.IconButton aria-label="Remove Warsaw" onClick={() => removeCity('Warsaw')} />
          </Chip>
        )}
        {cities.includes('Berlin') && (
          <Chip variant="secondary" style="border">
            <Chip.Action onClick={() => setSelectedCity('Berlin')}>
              <Chip.Icon icon={RiMapPinLine} />
              <Chip.Label>Berlin</Chip.Label>
            </Chip.Action>
            <Chip.IconButton aria-label="Remove Berlin" onClick={() => removeCity('Berlin')} />
          </Chip>
        )}
      </div>
      <p role="status">{selectedCity ? `Applied city: ${selectedCity}` : 'No city applied'}</p>
      <Button
        ref={resetRef}
        preset="ghost"
        variant="secondary"
        size="xs"
        onClick={() => {
          setCities(['Warsaw', 'Berlin']);
          setSelectedCity(null);
        }}
      >
        Reset examples
      </Button>
    </div>
  );
}
