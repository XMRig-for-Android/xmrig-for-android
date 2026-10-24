import React from 'react';
import { SettingsCardProps } from '.';
import { IPowerSettings } from '../../../../core/settings/settings.interface';
import { FieldLabel, Section, ToggleRow } from '../../../core/ui';

const SettingsPowerCard: React.FC<SettingsCardProps<IPowerSettings>> = ({
  settings,
  onUpdate,
}) => (
  <Section title="Power" description="Pause and resume mining based on battery and charging.">
    <FieldLabel label="Pause when" />
    <ToggleRow
      first
      label="Charger is disconnected"
      value={settings.pauseOnChargerDisconnected}
      onValueChange={(value) => onUpdate({ pauseOnChargerDisconnected: value })}
    />
    <ToggleRow
      label="Battery is low"
      value={settings.pauseOnLowBattery}
      onValueChange={(value) => onUpdate({ pauseOnLowBattery: value })}
    />
    <FieldLabel label="Resume when" />
    <ToggleRow
      first
      label="Charger is connected"
      description="Only resumes if mining was paused."
      value={settings.resumeOnChargerConnected}
      onValueChange={(value) => onUpdate({ resumeOnChargerConnected: value })}
    />
    <ToggleRow
      label="Battery is OK"
      description="Only resumes if mining was paused."
      value={settings.resumeOnBatteryOk}
      onValueChange={(value) => onUpdate({ resumeOnBatteryOk: value })}
    />
  </Section>
);

export default SettingsPowerCard;
