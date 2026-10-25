import React from 'react';
import { SettingsCardProps } from '.';
import { ISettings } from '../../../../core/settings/settings.interface';
import { Section, SliderRow } from '../../../core/ui';

const SettingsOthersCard: React.FC<SettingsCardProps<ISettings>> = ({
  settings,
  onUpdate,
}) => (
  <Section title="Miner">
    <SliderRow
      first
      label="Hashrate report interval"
      description="How often XMRig prints a hashrate line to the log."
      value={settings.printTime}
      minimumValue={0}
      maximumValue={300}
      step={10}
      format={(value) => `${value}s`}
      onCommit={(value) => onUpdate({ printTime: value })}
    />
    <SliderRow
      label="Donation level"
      description="Minimum 1%, which is 1 minute in every 100 minutes."
      value={settings.donation}
      minimumValue={1}
      maximumValue={100}
      format={(value) => `${value}%`}
      onCommit={(value) => onUpdate({ donation: value })}
    />
  </Section>
);

export default SettingsOthersCard;
