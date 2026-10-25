import { isEqual, merge } from 'lodash/fp';
import React from 'react';
import {
  Pressable, StyleSheet, Text, View,
} from 'react-native';
import {
  Algorithems, Algorithm, MoneroOceanOnlyAlgorithms, XMRigFork,
} from '../../../../../core/settings/settings.interface';
import { EditSimpleCardProps } from './index';
import { palette } from '../../../../../core/theme';
import { Button, Section } from '../../../../core/ui';

const allAlgorithms = [...Algorithems].sort();
const originalAlgorithms = allAlgorithms.filter(
  (item) => !MoneroOceanOnlyAlgorithms.includes(item),
);

const EditSimpleAlgorithemsCardBase: React.FC<EditSimpleCardProps> = (
  { setLocalState, localState },
) => {
  const sortedAlgorithms = localState.xmrig_fork === XMRigFork.MONEROOCEAN
    ? allAlgorithms : originalAlgorithms;
  const algos = localState.properties?.algos;
  const isEnabled = (item: Algorithm) => (algos ? algos[item] !== false : true);
  const enabledCount = sortedAlgorithms.filter(isEnabled).length;
  const allEnabled = enabledCount === sortedAlgorithms.length;

  const setAll = (value: boolean) => setLocalState((oldState) => merge(oldState, {
    properties: {
      algos: Object.fromEntries(sortedAlgorithms.map((item) => [item, value])),
    },
  }));

  return (
    <Section
      title="Algorithms"
      description={`${enabledCount} of ${sortedAlgorithms.length} enabled. Turn off any that crash or stall on this device.`}
      action={(
        <Button
          label={allEnabled ? 'Disable all' : 'Enable all'}
          size="sm"
          variant="ghost"
          onPress={() => setAll(!allEnabled)}
        />
      )}
    >
      <View style={styles.chips}>
        {sortedAlgorithms.map((item) => {
          const enabled = isEnabled(item);
          return (
            <Pressable
              key={item}
              onPress={() => setLocalState((oldState) => merge(oldState, {
                properties: { algos: { [item]: !enabled } },
              }))}
              style={[styles.chip, enabled ? styles.chipOn : styles.chipOff]}
            >
              <Text style={[styles.chipText, enabled ? styles.chipTextOn : styles.chipTextOff]}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Section>
  );
};

export const EditSimpleAlgorithemsCard = React.memo(
  EditSimpleAlgorithemsCardBase,
  (prev, next) => isEqual(prev.localState.properties?.algos, next.localState.properties?.algos)
    && prev.localState.xmrig_fork === next.localState.xmrig_fork,
);

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipOn: {
    backgroundColor: palette.accentSoft,
    borderColor: palette.accentSoft,
  },
  chipOff: {
    backgroundColor: palette.surface,
    borderColor: palette.track,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextOn: {
    color: palette.accent,
  },
  chipTextOff: {
    color: palette.inkSubtle,
    textDecorationLine: 'line-through',
  },
});

export default EditSimpleAlgorithemsCard;
