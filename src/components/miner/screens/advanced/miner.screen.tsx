import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { View, Text, Colors } from 'react-native-ui-lib';
import { Battery } from '@brightlayer-ui/react-native-progress-icons';
import chroma from 'chroma-js';
import { SessionDataContext } from '../../../../core/session-data/session-data.context';
import { XMRigView } from '../../containers/xmrig-view';
import { MinerControl } from '../../components/miner-control.component';
import { PowerContext } from '../../../../core/power/power.context';

const MinerScreen = () => {
  const {
    workingState, minerData, hashrateTotals, CPUTemp,
  } = React.useContext(SessionDataContext);
  const powerContext = React.useContext(PowerContext);

  const battryColor = React.useMemo(() => {
    const cScale = chroma.scale([
      Colors.$backgroundDangerHeavy,
      Colors.$backgroundWarningHeavy,
      Colors.$backgroundSuccessHeavy,
    ]);
    return cScale(powerContext.batteryLevel / 100).hex();
  }, [powerContext.batteryLevel]);

  return (
    <View bg-screenBG flex>
      <View
        paddingV-10
        paddingH-10
      >
        <MinerControl />
      </View>
      <View flex paddingH-10>
        <ScrollView
          nestedScrollEnabled
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          <View row spread centerV marginB-4>
            <Text style={styles.screenTitle}>Overview</Text>
            <View row centerV style={styles.statusChip}>
              <Text style={styles.tempText}>
                {CPUTemp.toFixed(1)}
                °C
              </Text>
              <Battery
                percent={powerContext.batteryLevel}
                size={26}
                color={battryColor}
                charging={powerContext.isPowerConnected}
                outlined={false}
              />
            </View>
          </View>
          <XMRigView
            workingState={workingState}
            minerData={minerData}
            hashrateHistory={hashrateTotals}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.$textDefault,
    letterSpacing: -0.3,
  },
  statusChip: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 6,
    gap: 6,
  },
  tempText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.$textNeutral,
  },
});

export default MinerScreen;
