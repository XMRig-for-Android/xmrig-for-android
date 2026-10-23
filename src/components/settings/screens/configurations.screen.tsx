import React from 'react';
import {
  Assets, Button, ButtonProps, Colors, FloatingButton, Text, View,
} from 'react-native-ui-lib';
import { SettingsActionType, SettingsContext } from '../../../core/settings';
import { ConfigurationsListView } from '../containers/configurations/list-view';
import AddConfigurationsModal from '../modals/add-configuration.modal';

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

const ConfigurationsScreen: React.FC = () => {
  const { settings, settingsDispatcher } = React.useContext(SettingsContext);
  const [showAddNewDialogVisible, setShowAddNewDialogVisible] = React.useState<boolean>(false);
  React.useEffect(() => setActionVisible(false), [showAddNewDialogVisible]);

  const [selected, setSelected] = React.useState<string[]>([]);

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
        backgroundColor: selected.length > 0
          ? Colors.$backgroundDangerHeavy : Colors.$backgroundPrimaryHeavy,
      });
    } else {
      setActionButtonProps({
        ...actionsButtonDefault,
        backgroundColor: selected.length > 0
          ? Colors.$backgroundDangerHeavy : Colors.$backgroundPrimaryHeavy,
      });
    }
  }, [actionsVisible, selected]);

  return (
    <View bg-screenBG flex>
      <AddConfigurationsModal
        onAdd={(name, mode) => {
          console.log('onAdd', name, mode);
          settingsDispatcher({
            type: SettingsActionType.ADD_CONFIGURATION,
            value: {
              name,
              mode,
            },
          });
          setShowAddNewDialogVisible(false);
        }}
        onDismiss={() => setShowAddNewDialogVisible(false)}
        visible={showAddNewDialogVisible}
      />
      <View
        row
        spread
        paddingV-10
        paddingH-10
        centerV
      >
        <View row centerV>
          <Text text60>Configuration Profiles</Text>
        </View>
        <Button
          size={Button.sizes.small}
          onPress={() => setActionVisible(!actionsVisible)}
          animateLayout
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...actionsButtonProps}
        />
      </View>
      <View
        flex
        paddingH-10
        paddingB-10
        useSafeArea
        style={{ zIndex: 0 }}
      >
        <ConfigurationsListView
          configurations={settings.configurations}
          onSelected={setSelected}
        />
      </View>
      <FloatingButton
        duration={500}
        visible={actionsVisible}
        button={{
          size: Button.sizes.large,
          onPress: () => setShowAddNewDialogVisible(true),
          backgroundColor: Colors.$backgroundPrimaryHeavy,
          label: 'Add Configuration',
          iconSource: Assets.icons.clipboard,
          iconStyle: {
            display: 'flex',
            width: 16,
            height: 20,
            tintColor: Colors.$iconDefaultLight,
          },
        }}
        secondaryButton={{
          size: Button.sizes.medium,
          label: `Delete (${selected.length}) Selected`,
          onPress: () => {
            settingsDispatcher({
              type: SettingsActionType.DELETE_CONFIGURATIONS,
              value: selected,
            });
            setSelected([]);
            setActionVisible(false);
          },
          backgroundColor: Colors.$backgroundDangerHeavy,
          link: false,
          animateLayout: true,
          iconSource: Assets.icons.trash,
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

export default ConfigurationsScreen;
