import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SessionDataContext } from '../../../../core/session-data/session-data.context';
import { XMRigView } from '../../containers/xmrig-view';
import { MinerControl } from '../../components/miner-control.component';
import { palette } from '../../../../core/theme';

const MinerScreen = () => {
  const { workingState, minerData, hashrateTotals } = React.useContext(SessionDataContext);

  return (
    <View style={styles.screen}>
      <ScrollView
        nestedScrollEnabled
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <MinerControl />
        <XMRigView
          workingState={workingState}
          minerData={minerData}
          hashrateHistory={hashrateTotals}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
});

export default MinerScreen;
