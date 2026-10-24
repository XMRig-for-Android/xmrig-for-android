import isEqual from 'lodash/fp/isEqual';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ISettings, SettingsActionType, SettingsContext } from '../../../core/settings';
import { IPowerSettings, IThermalSettings } from '../../../core/settings/settings.interface';
import { palette } from '../../../core/theme';
import { SaveBar, ScreenHeader } from '../../core/ui';
import SettingsPowerCard from '../containers/settings/settings-power.card';
import SettingsThermalCard from '../containers/settings/settings-thermal.card';
import SettingsOthersCard from '../containers/settings/settings-others.card';

type SettingsDraft = Pick<ISettings, 'power' | 'thermal' | 'donation' | 'printTime'>;

const toDraft = (settings: ISettings): SettingsDraft => ({
  power: settings.power,
  thermal: settings.thermal,
  donation: settings.donation,
  printTime: settings.printTime,
});

const SettingsScreen: React.FC = () => {
  const { settings, settingsDispatcher } = React.useContext(SettingsContext);
  const saved = React.useMemo(
    () => toDraft(settings),
    [settings.power, settings.thermal, settings.donation, settings.printTime],
  );
  const [draft, setDraft] = React.useState<SettingsDraft>(saved);
  const dirty = !isEqual(draft, saved);

  const updatePower = React.useCallback((power: Partial<IPowerSettings>) => setDraft(
    (current) => ({ ...current, power: { ...current.power, ...power } }),
  ), []);
  const updateThermal = React.useCallback((thermal: Partial<IThermalSettings>) => setDraft(
    (current) => ({ ...current, thermal: { ...current.thermal, ...thermal } }),
  ), []);
  const updateOther = React.useCallback((value: Partial<ISettings>) => setDraft(
    (current) => ({ ...current, ...value }),
  ), []);

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Settings" subtitle="Power, thermal and miner behaviour" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SettingsPowerCard settings={draft.power} onUpdate={updatePower} />
        <SettingsThermalCard settings={draft.thermal} onUpdate={updateThermal} />
        <SettingsOthersCard settings={draft as ISettings} onUpdate={updateOther} />
      </ScrollView>
      <SaveBar
        dirty={dirty}
        onDiscard={() => setDraft(saved)}
        onSave={() => settingsDispatcher({ type: SettingsActionType.UPDATE, value: draft })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});

export default SettingsScreen;
