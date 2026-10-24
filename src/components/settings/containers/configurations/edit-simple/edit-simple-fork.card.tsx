import { merge } from 'lodash/fp';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { EditSimpleCardProps } from './index';
import { ISimpleConfiguration, XMRigFork } from '../../../../../core/settings/settings.interface';
import { palette, radius } from '../../../../../core/theme';
import { Choice, Section } from '../../../../core/ui';

export const EditSimpleForkCard: React.FC<EditSimpleCardProps> = (
  { setLocalState, localState },
) => (
  <Section
    title="Miner"
    description="Original XMRig, or MoneroOcean's fork that switches algorithms automatically."
  >
    <Choice
      value={localState.xmrig_fork}
      onChange={(value: XMRigFork) => setLocalState(
        (oldState: ISimpleConfiguration) => merge(oldState, { xmrig_fork: value }),
      )}
      options={[
        { label: 'XMRig', value: XMRigFork.ORIGINAL },
        { label: 'MoneroOcean', value: XMRigFork.MONEROOCEAN },
      ]}
    />
    {localState.xmrig_fork === XMRigFork.MONEROOCEAN && (
      <View style={styles.warning}>
        <Text style={styles.warningTitle}>Benchmarking may get stuck on some algorithms</Text>
        <Text style={styles.warningText}>
          Disable problematic ones in the Algorithms section below, or use an Advanced profile.
        </Text>
      </View>
    )}
  </Section>
);

const styles = StyleSheet.create({
  warning: {
    marginTop: 12,
    backgroundColor: palette.warningSoft,
    borderRadius: radius.sm,
    padding: 12,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8A5A06',
  },
  warningText: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 17,
    color: '#8A5A06',
  },
});

export default EditSimpleForkCard;
