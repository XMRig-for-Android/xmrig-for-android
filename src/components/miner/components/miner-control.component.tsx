import _ from 'lodash';
import React from 'react';
import { StyleSheet } from 'react-native';
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
      borderRadius={22}
      iconSource={Assets.icons.start}
      style={styles.actionButton}
      iconStyle={styles.startIcon}
    />
  );

  const stopButton = (
    <Button
      size={Button.sizes.small}
      backgroundColor={Colors.$backgroundDangerHeavy}
      onPress={handleStop}
      label="Stop"
      borderRadius={22}
      iconSource={Assets.icons.stop}
      style={styles.actionButton}
      iconStyle={styles.stopIcon}
    />
  );

  return (
    <Card
      enableShadow
      borderRadius={22}
      containerStyle={{
        overflow: 'hidden',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: cardBorderColor,
      }}
    >
      <View row centerV paddingL-18 paddingR-14 paddingV-16>
        <View flex marginR-12>
          {workingState === WorkingState.NOT_WORKING ? (
            <>
              <Text style={styles.eyebrow}>Configuration</Text>
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
              <Text style={styles.eyebrow}>Status</Text>
              <Text style={styles.configName}>{workingState}</Text>
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

const styles = StyleSheet.create({
  eyebrow: {
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '600',
    color: Colors.$textNeutral,
    marginBottom: 2,
  },
  configName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.$textDefault,
  },
  actionButton: {
    minWidth: 96,
  },
  startIcon: {
    width: 8,
    height: 10,
    margin: 5,
    marginRight: 8,
    tintColor: Colors.$iconDefaultLight,
  },
  stopIcon: {
    width: 12,
    height: 12,
    margin: 5,
    marginRight: 8,
    tintColor: Colors.$iconDefaultLight,
  },
});
