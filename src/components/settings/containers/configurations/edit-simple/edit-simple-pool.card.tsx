import { merge } from 'lodash/fp';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { EditSimpleCardProps } from './index';
import {
  hostnameValidator, passwordValidator, poolValidator, portValidator, usernameValidator,
} from '../../../../../core/utils/validators';
import { IConfiguratioPropertiesPool } from '../../../../../core/settings/settings.interface';
import PoolListModal from '../../../modals/pool-list.modal';
import {
  Button, FormField, Section, ToggleRow,
} from '../../../../core/ui';

export const EditSimplePoolCard: React.FC<EditSimpleCardProps> = (
  { setLocalState, localState },
) => {
  const pool = localState.properties?.pool;
  const valid = poolValidator.validate(pool || {}).error == null;
  const [showPoolListDialog, setShowPoolListDialog] = React.useState<boolean>(false);

  const updatePool = (value: Partial<IConfiguratioPropertiesPool>) => setLocalState(
    (oldState) => merge(oldState, { properties: { pool: value } }),
  );

  return (
    <>
      <PoolListModal
        onAdd={(preset: IConfiguratioPropertiesPool) => updatePool(preset)}
        onDismiss={() => setShowPoolListDialog(false)}
        visible={showPoolListDialog}
      />
      <Section
        title="Pool"
        description="Where your miner connects and gets paid."
        invalid={!valid}
        action={(
          <Button
            label="Presets"
            size="sm"
            variant="secondary"
            onPress={() => setShowPoolListDialog(true)}
          />
        )}
      >
        <View style={styles.row}>
          <View style={styles.host}>
            <FormField
              label="Hostname"
              placeholder="pool.domain.tld"
              value={pool?.hostname}
              onChangeText={(text) => updatePool({ hostname: text })}
              validate={(value?: string) => hostnameValidator.validate(value).error == null}
              validationMessage={hostnameValidator.validate(pool?.hostname).error?.message}
              validateOnChange
              enableErrors
              maxLength={128}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <View style={styles.port}>
            <FormField
              label="Port"
              placeholder="3333"
              value={pool?.port?.toString() || ''}
              onChangeText={(text) => updatePool({
                port: text.trim() === '' ? undefined : Number(text),
              })}
              validate={(value?: string) => portValidator
                .validate(value === '' ? undefined : Number(value)).error == null}
              validationMessage={portValidator.validate(pool?.port).error?.message}
              validateOnChange
              enableErrors
              maxLength={5}
              keyboardType="numeric"
            />
          </View>
        </View>
        <FormField
          label="Wallet / username"
          placeholder="Your wallet address"
          value={pool?.username}
          onChangeText={(text) => updatePool({ username: text })}
          validate={(value?: string) => usernameValidator.validate(value).error == null}
          validationMessage={usernameValidator.validate(pool?.username).error?.message}
          validateOnChange
          enableErrors
          maxLength={128}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <FormField
          label="Password / worker"
          placeholder="x"
          value={pool?.password}
          onChangeText={(text) => updatePool({ password: text })}
          validate={(value?: string) => passwordValidator.validate(value).error == null}
          validationMessage={passwordValidator.validate(pool?.password).error?.message}
          validateOnChange
          enableErrors
          maxLength={128}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View style={styles.toggle}>
          <ToggleRow
            first
            label="Use SSL / TLS"
            description="Only if your pool supports it on this port."
            value={!!pool?.sslEnabled}
            onValueChange={(value) => updatePool({ sslEnabled: value })}
          />
        </View>
      </Section>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  host: {
    flex: 2.2,
  },
  port: {
    flex: 1,
  },
  toggle: {
    marginTop: 8,
  },
});

export default EditSimplePoolCard;
