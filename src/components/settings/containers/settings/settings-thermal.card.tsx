import React from 'react';
import { SettingsCardProps } from '.';
import { IThermalSettings } from '../../../../core/settings/settings.interface';
import {
  FieldLabel, Section, SliderRow, ToggleRow,
} from '../../../core/ui';

const SettingsThermalCard: React.FC<SettingsCardProps<IThermalSettings>> = ({
  settings,
  onUpdate,
}) => (
  <Section title="Thermal" description="Protect the device by pausing when the CPU runs hot.">
    <FieldLabel label="Pause when" />
    <ToggleRow
      first
      label="CPU overheats"
      value={settings.pauseOnCPUTemperatureOverHeat}
      onValueChange={(value) => onUpdate({ pauseOnCPUTemperatureOverHeat: value })}
    />
    {settings.pauseOnCPUTemperatureOverHeat && (
      <SliderRow
        label="Pause above"
        value={settings.pauseOnCPUTemperatureOverHeatValue}
        minimumValue={10}
        maximumValue={120}
        format={(value) => `${value}°C`}
        onCommit={(value) => onUpdate({ pauseOnCPUTemperatureOverHeatValue: value })}
      />
    )}
    <FieldLabel label="Resume when" />
    <ToggleRow
      first
      label="CPU temperature is normal"
      value={settings.resumeCPUTemperatureNormal}
      onValueChange={(value) => onUpdate({ resumeCPUTemperatureNormal: value })}
    />
    {settings.resumeCPUTemperatureNormal && (
      <SliderRow
        label="Resume below"
        value={settings.resumeCPUTemperatureNormalValue}
        minimumValue={10}
        maximumValue={120}
        format={(value) => `${value}°C`}
        onCommit={(value) => onUpdate({ resumeCPUTemperatureNormalValue: value })}
      />
    )}
  </Section>
);

export default SettingsThermalCard;
