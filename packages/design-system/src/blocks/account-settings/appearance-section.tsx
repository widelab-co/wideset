import { RiComputerLine, RiMoonLine, RiSunLine } from '@remixicon/react';
import { Tile } from '@wideset/react';

import type { Theme } from './data';
import { SettingsSection } from './settings-section';

const THEMES = [
  { value: 'light', title: 'Light', description: 'Always light', icon: RiSunLine },
  { value: 'dark', title: 'Dark', description: 'Always dark', icon: RiMoonLine },
  {
    value: 'system',
    title: 'Match system',
    description: 'Follows this device',
    icon: RiComputerLine,
  },
] as const;

/**
 * The theme as three tiles, one picked. It applies the moment it is picked, like a switch, so it
 * stays out of the save bar; the screen holds it and turns the whole page with it. The tiles
 * leave out `Tile.Indicator`: it is drawn as a switch, which reads as on and off for each theme
 * when only one can be chosen; the picked tile's border says it.
 */
export function AppearanceSection({
  theme,
  onThemeChange,
}: {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}) {
  return (
    <SettingsSection
      title="Appearance"
      description="How Orbit looks on this device. It changes right away."
    >
      <Tile.RadioGroup
        aria-label="Theme"
        orientation="horizontal"
        value={theme}
        onValueChange={(value) => onThemeChange(value as Theme)}
        className="gap-ws-5 grid grid-cols-3"
      >
        {THEMES.map(({ value, title, description, icon }) => (
          <Tile.Radio
            key={value}
            value={value}
            icon={icon}
            title={title}
            description={description}
          />
        ))}
      </Tile.RadioGroup>
    </SettingsSection>
  );
}
