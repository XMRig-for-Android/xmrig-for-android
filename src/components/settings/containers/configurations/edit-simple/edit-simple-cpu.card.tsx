import { merge } from 'lodash/fp';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { EditSimpleCardProps } from './index';
import {
  cpuValidator,
  maxThreadsHintValidator, priorityValidator,
} from '../../../../../core/utils/validators';
import { IConfiguratioPropertiesCPU, RandomXMode } from '../../../../../core/settings/settings.interface';
import { palette } from '../../../../../core/theme';
import {
  Choice, FieldLabel, FormField, HelperText, Section, ToggleRow,
} from '../../../../core/ui';

export const EditSimpleCPUCard: React.FC<EditSimpleCardProps> = (
  { setLocalState, localState },
) => {
  const cpu = localState.properties?.cpu;
  const valid = cpuValidator.validate(cpu || {}).error == null;

  const updateCPU = (value: Partial<IConfiguratioPropertiesCPU>) => setLocalState(
    (oldState) => merge(oldState, { properties: { cpu: value } }),
  );

  return (
    <Section title="CPU" description="Balance hashrate against heat and responsiveness." invalid={!valid}>
      <ToggleRow
        first
        label="Yield"
        description="On keeps the phone responsive. Off squeezes out maximum hashrate."
        value={!!cpu?.yield}
        onValueChange={(value) => updateCPU({ yield: value })}
      />

      <FieldLabel label="RandomX mode" />
      <Choice
        value={cpu?.random_x_mode}
        onChange={(value: RandomXMode) => updateCPU({ random_x_mode: value })}
        options={[
          { label: 'Auto', value: RandomXMode.AUTO },
          { label: 'Fast', value: RandomXMode.FAST },
          { label: 'Light', value: RandomXMode.LIGHT },
        ]}
      />
      <HelperText>Fast needs about 2 GB of memory, Light about 256 MB.</HelperText>

      <FormField
        label="Max threads"
        placeholder="100"
        value={cpu?.max_threads_hint?.toString() || ''}
        onChangeText={(text) => updateCPU({
          max_threads_hint: text.trim() === '' ? undefined : Number(text),
        })}
        validate={(value?: string) => maxThreadsHintValidator
          .validate(value === '' ? undefined : Number(value)).error == null}
        validationMessage={maxThreadsHintValidator.validate(cpu?.max_threads_hint).error?.message}
        validateOnChange
        enableErrors
        maxLength={3}
        keyboardType="numeric"
        trailingAccessory={<Text style={styles.suffix}>% of cores</Text>}
      />
      <HelperText>On a 4-core CPU, useful values are 25, 50, 75 and 100.</HelperText>

      <FormField
        label="Thread priority"
        placeholder="Unchanged"
        value={cpu?.priority?.toString() || ''}
        onChangeText={(text) => updateCPU({
          priority: text.trim() === '' ? undefined : Number(text),
        })}
        validate={(value?: string) => !value
          || priorityValidator.validate(Number(value)).error == null}
        validationMessage={priorityValidator.validate(cpu?.priority).error?.message}
        validateOnChange
        enableErrors
        maxLength={1}
        keyboardType="numeric"
      />
      <HelperText>1 (lowest) to 5 (highest). Leave empty to keep the system default.</HelperText>
    </Section>
  );
};

const styles = StyleSheet.create({
  suffix: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.inkSubtle,
  },
});

export default EditSimpleCPUCard;
