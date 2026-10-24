import _ from 'lodash';
import React from 'react';
import {
  Picker,
  View,
  Button,
  ViewProps,
  Colors,
  Typography,
  Incubator,
  Card,
  Assets,
  AnimatedScanner,
  Text,
} from 'react-native-ui-lib';
import { useMiner } from '../../../core/hooks/use-miner.hook';
import { SessionDataContext } from '../../../core/session-data/session-data.context';
import { WorkingState } from '../../../core/session-data/session-data.interface';
import { SettingsActionType, SettingsContext } from '../../../core/settings';
import { useToaster } from '../../../core/hooks/use-toaster/use-toaster.hook';

export const MinerControl:React.FC<ViewProps> = () => {
  const toaster = useToaster();

  const { workingState } = React.useContext(SessionDataContext);
  const { startWithSelectedConfiguration, stop: handleStop } = useMiner();

  const { settings, settingsDispatcher } = React.useContext(SettingsContext);
  const [selectedConfiguration, setSelectedConfiguration] = React.useState<string | undefined>(
    settings.selectedConfiguration,
  );

  React.useEffect(() => {
    setSelectedConfiguration(settings.selectedConfiguration);
  }, [settings.selectedConfiguration]);

  const isWorking = React.useMemo<boolean>(
    () => workingState !== WorkingState.NOT_WORKING,
    [workingState],
  );

  const handleStart = React.useCallback(() => {
    console.log(settings.selectedConfiguration);
    if (!settings.selectedConfiguration) {
      if (_.isEmpty(settings.configurations)) {
        toaster({
          message: 'Please add a Configuration from Settings menu',
          position: 'top',
          preset: Incubator.ToastPresets.FAILURE,
        });
      } else {
        toaster({
          message: 'Please select a Configuration to start mining',
          position: 'top',
          preset: Incubator.ToastPresets.FAILURE,
        });
      }
    } else {
      startWithSelectedConfiguration();
    }
  }, [settings]);

  React.useEffect(() => {
    if (selectedConfiguration === settings.selectedConfiguration) {
      return;
    }
    settingsDispatcher({
      type: SettingsActionType.SET_SELECTED_CONFIGURAION,
      value: selectedConfiguration,
    });
  }, [selectedConfiguration, settings.selectedConfiguration]);

  const cardBorderColor = React.useMemo<string>(() => {
    if (!settings.selectedConfiguration) {
      if (_.isEmpty(settings.configurations)) {
        return Colors.$outlineDanger;
      }
      return Colors.$outlineWarning;
    }
    if (workingState === WorkingState.MINING) {
      return Colors.$outlinePrimary;
    }
    if (workingState === WorkingState.PAUSED) {
      return Colors.$outlineWarning;
    }
    return Colors.$outlinePrimary;
  }, [selectedConfiguration, settings, workingState]);

  const startButton = (
    <Button
      size={Button.sizes.small}
      onPress={handleStart}
      label="Start"
      iconSource={Assets.icons.start}
      iconStyle={{
        width: 8,
        height: 10,
        margin: 5,
        marginRight: 10,
        tintColor: Colors.$iconDefaultLight,
      }}
    />
  );

  const stopButton = (
    <Button
      size={Button.sizes.small}
      backgroundColor={Colors.$backgroundDangerHeavy}
      onPress={handleStop}
      label="Stop"
      iconSource={Assets.icons.stop}
      iconStyle={{
        width: 12,
        height: 12,
        margin: 5,
        marginRight: 10,
        tintColor: Colors.$iconDefaultLight,
      }}
    />
  );

  return (
    <Card
      enableShadow
      selected={workingState !== WorkingState.MINING}
      selectionOptions={{
        hideIndicator: true,
        color: cardBorderColor,
      }}
      containerStyle={{ overflow: 'hidden' }}
    >
      <View row centerV paddingL-16 paddingR-12 paddingV-14>
        <View flex marginR-12>
          {workingState === WorkingState.NOT_WORKING ? (
            <>
              <Text text90 $textNeutral marginB-2>Configuration</Text>
              <Picker
                placeholder="Select a configuration"
                topBarProps={{ title: 'Configurations' }}
                value={selectedConfiguration}
                getLabel={
                  (value) => settings.configurations.find((config) => config.id === value)?.name || 'N/A'
                }
                showSearch
                searchPlaceholder="Search configurations"
                onChange={(value) => {
                  setSelectedConfiguration(typeof value === 'string' ? value : undefined);
                }}
                style={{ ...Typography.text60, color: Colors.$textDefault }}
              >
                {_.map(settings.configurations, (item) => (
                  <Picker.Item
                    key={item?.id}
                    value={item?.id || ''}
                    label={item?.name}
                  />
                ))}
              </Picker>
            </>
          ) : (
            <>
              <Text text90 $textNeutral marginB-2>Status</Text>
              <Text text60 $textDefault>{workingState}</Text>
            </>
          )}
        </View>
        <View>
          {isWorking ? stopButton : startButton}
        </View>
      </View>
      {!selectedConfiguration && (
        <AnimatedScanner
          backgroundColor={Colors.$backgroundWarning}
          progress={100}
          duration={3000}
        />
      )}
    </Card>
  );
};
