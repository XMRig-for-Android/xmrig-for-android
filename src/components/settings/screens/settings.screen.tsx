import isEqual from 'lodash/fp/isEqual';
import merge from 'lodash/fp/merge';
import React from 'react';
import { ScrollView } from 'react-native';
import {
  Assets, Button, ButtonProps, Colors, FloatingButton, Text, View,
} from 'react-native-ui-lib';
import { ISettings, SettingsActionType, SettingsContext } from '../../../core/settings';
import { IPowerSettings, IThermalSettings } from '../../../core/settings/settings.interface';

const SettingsPowerCard = React.lazy(() => import('../containers/settings/settings-power.card'));
const SettingsThermalCard = React.lazy(() => import('../containers/settings/settings-thermal.card'));
const SettingsOthersCard = React.lazy(() => import('../containers/settings/settings-others.card'));

const actionsButtonDefault: ButtonProps = {
  label: 'Menu',
  iconSource: Assets.icons.barsOpen,
  iconStyle: {
    width: 22,
    height: 22,
    margin: 0,
    tintColor: Colors.$iconDefaultLight,
  },
};

const SettingsScreen: React.FC = () => {
  const { settings, settingsDispatcher } = React.useContext(SettingsContext);

  const [localSettings, setLocalSettings] = React.useState<ISettings>(settings);
  const skipSettingsCompare = React.useRef(true);

  const [changesCount, setChangesCount] = React.useState<number>(0);

  React.useEffect(() => {
    if (skipSettingsCompare.current) {
      skipSettingsCompare.current = false;
      return;
    }
    setChangesCount(isEqual(localSettings, settings) ? 0 : 1);
  }, [localSettings, settings]);

  const handleUpdate = (data: Partial<ISettings>) => {
    settingsDispatcher({
      type: SettingsActionType.UPDATE,
      value: data,
    });
  };

  const handleLocalUpdate = (data: Partial<ISettings>) => {
    setLocalSettings((prevState) => merge(prevState, data));
  };

  const handlePowerUpdate = (data: Partial<IPowerSettings>) => {
    handleLocalUpdate({
      power: merge(localSettings?.power, data),
    });
  };

  const handleThermalUpdate = (data: Partial<IThermalSettings>) => {
    handleLocalUpdate({
      thermal: merge(localSettings?.thermal, data),
    });
  };

  const [actionsVisible, setActionVisible] = React.useState<boolean>(false);
  const [actionsButtonProps, setActionButtonProps] = React.useState<ButtonProps>({
    ...actionsButtonDefault,
  });
  React.useEffect(() => {
    if (actionsVisible) {
      setActionButtonProps({
        iconSource: Assets.icons.barsClose,
        iconStyle: {
          width: 15,
          height: 15,
          margin: 8,
          tintColor: Colors.$iconDefaultLight,
        },
        backgroundColor: Colors.$backgroundPrimaryHeavy,
      });
    } else {
      setActionButtonProps({
        ...actionsButtonDefault,
        backgroundColor: Colors.$backgroundPrimaryHeavy,
      });
    }
  }, [actionsVisible]);

  return (
    <View bg-screenBG flex>
      <View
        row
        spread
        paddingV-10
        paddingH-10
        centerV
      >
        <View row centerV>
          <Text text60>Settings</Text>
        </View>
        <Button
          size={Button.sizes.small}
          onPress={() => setActionVisible(!actionsVisible)}
          animateLayout
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...actionsButtonProps}
        />
      </View>
      {changesCount > 0 && (
        <View paddingV-10 paddingT-0 center>
          <Text text90 $textDanger>
            Please save changes (
            {changesCount}
            ) using the Menu button
          </Text>
        </View>
      )}
      <View
        flex
        paddingH-10
        paddingB-10
        useSafeArea
        style={{ zIndex: 0 }}
      >
        <ScrollView>
          <SettingsPowerCard settings={localSettings?.power} onUpdate={handlePowerUpdate} />
          <View height={10} />
          <SettingsThermalCard settings={localSettings?.thermal} onUpdate={handleThermalUpdate} />
          <View height={10} />
          <SettingsOthersCard settings={localSettings} onUpdate={handleLocalUpdate} />
        </ScrollView>
      </View>
      <FloatingButton
        duration={500}
        visible={actionsVisible}
        button={{
          size: Button.sizes.large,
          disabled: changesCount === 0,
          onPress: () => {
            if (localSettings) {
              handleUpdate(localSettings);
              setChangesCount(0);
            }
            setActionVisible(false);
          },
          backgroundColor: Colors.$backgroundPrimaryHeavy,
          label: `Save ${changesCount} Changes`,
          iconSource: Assets.icons.save,
          iconStyle: {
            display: 'flex',
            width: 16,
            height: 20,
            tintColor: Colors.$iconDefaultLight,
          },
        }}
      />
    </View>
  );
};

export default SettingsScreen;
