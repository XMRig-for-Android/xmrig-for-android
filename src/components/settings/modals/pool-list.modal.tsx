import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { IConfiguratioPropertiesPool } from '../../../core/settings/settings.interface';
import { validateWalletAddress } from '../../../core/utils';
import { palette, radius } from '../../../core/theme';
import { Badge, Button } from '../../core/ui';
import {
  C3Pool,
  Hashcity,
  HashVault,
  IPool,
  IPoolState,
  MineXMR,
  MoneroOcean,
  Nano,
  PredefinedPoolName,
  predefinedPoolsList,
  SupportXMR,
  XMRPoolEU,
} from './pools';

export type PoolListModalProps = {
  visible: boolean;
  onAdd: (pool: IConfiguratioPropertiesPool) => void;
  onDismiss: () => void;
};

const poolForms: Record<PredefinedPoolName, React.FC<IPool>> = {
  [PredefinedPoolName.MoneroOcean]: MoneroOcean,
  [PredefinedPoolName.MineXMR]: MineXMR,
  [PredefinedPoolName.SupportXMR]: SupportXMR,
  [PredefinedPoolName.nanopool]: Nano,
  [PredefinedPoolName.C3Pool]: C3Pool,
  [PredefinedPoolName.XMRPoolEU]: XMRPoolEU,
  [PredefinedPoolName.HashVault]: HashVault,
  [PredefinedPoolName.Hashcity]: Hashcity,
};

const emptyPool: IConfiguratioPropertiesPool = {
  hostname: '',
  port: 0,
  username: '',
  password: '',
  sslEnabled: false,
};

const PoolListModal: React.FC<PoolListModalProps> = ({
  visible,
  onAdd,
  onDismiss,
}) => {
  const [selected, setSelected] = React.useState<PredefinedPoolName>();
  const [pool, setPool] = React.useState<IConfiguratioPropertiesPool>(emptyPool);

  React.useEffect(() => {
    if (visible) {
      setSelected(undefined);
      setPool(emptyPool);
    }
  }, [visible]);

  const onChange = React.useCallback(
    (state: IPoolState) => setPool({ ...state, sslEnabled: false }),
    [],
  );

  const canApply = !!selected && !!pool.hostname && !!pool.port
    && validateWalletAddress(pool.username);

  const PoolForm = selected ? poolForms[selected] : undefined;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior="padding"
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />
        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <Text style={styles.title}>Pool presets</Text>
          <Text style={styles.subtitle}>
            {selected ? 'Enter your wallet to finish.' : 'Pick a pool. Host and port are filled in for you.'}
          </Text>

          <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
            {predefinedPoolsList.map((item) => {
              const isSelected = item.name === selected;
              if (selected && !isSelected) {
                return null;
              }
              return (
                <Pressable
                  key={item.name}
                  onPress={() => {
                    setSelected(isSelected ? undefined : item.name);
                    setPool(emptyPool);
                  }}
                  style={[styles.poolRow, isSelected && styles.poolRowSelected]}
                >
                  <View style={styles.flex}>
                    <Text style={styles.poolName}>{item.info.displayName}</Text>
                    <View style={styles.badges}>
                      <Badge label={`${item.info.fee}% fee`} tone={item.info.fee === 0 ? 'success' : 'neutral'} />
                      <Badge label={item.info.method} />
                      <Badge label={`${item.info.threshold} XMR min`} />
                    </View>
                  </View>
                  <Text style={styles.change}>{isSelected ? 'Change' : '›'}</Text>
                </Pressable>
              );
            })}
            {PoolForm ? (
              <View style={styles.form}>
                <PoolForm onChange={onChange} />
              </View>
            ) : null}
          </ScrollView>

          <View style={styles.actions}>
            <Button label="Cancel" variant="ghost" onPress={onDismiss} style={styles.flex} />
            <Button
              label="Apply preset"
              disabled={!canApply}
              onPress={() => {
                onAdd(pool);
                onDismiss();
              }}
              style={styles.flex2}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(14, 16, 34, 0.45)',
  },
  sheet: {
    maxHeight: '88%',
    backgroundColor: palette.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.track,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: palette.ink,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 2,
    marginBottom: 14,
    fontSize: 13,
    color: palette.inkSubtle,
  },
  scroll: {
    flexGrow: 0,
  },
  poolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: palette.track,
    padding: 14,
    marginBottom: 10,
  },
  poolRowSelected: {
    borderColor: palette.accent,
    backgroundColor: palette.accentSoft,
  },
  poolName: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.ink,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  change: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '700',
    color: palette.accent,
  },
  form: {
    paddingTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  flex: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
});

export default PoolListModal;
