import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SettingsContext } from '../../../core/settings';
import { ConfigurationMode } from '../../../core/settings/settings.interface';
import { getConfigurationNameValidator, getConfigurationValidator } from '../../../core/utils/validators';
import { palette, radius } from '../../../core/theme';
import {
  Button, Choice, FieldLabel, HelperText,
} from '../../core/ui';

export type AddConfigurationsModalProps = {
  visible: boolean;
  onAdd: (name: string, mode: ConfigurationMode) => void;
  onDismiss: () => void;
};

const AddConfigurationsModal: React.FC<AddConfigurationsModalProps> = ({
  visible,
  onAdd,
  onDismiss,
}) => {
  const { settings } = React.useContext(SettingsContext);
  const existsNames = React.useMemo<string[]>(
    () => settings.configurations.map((c) => c.name),
    [settings.configurations],
  );

  const [name, setName] = React.useState('');
  const [touched, setTouched] = React.useState(false);
  const [configMode, setConfigMode] = React.useState<ConfigurationMode>(ConfigurationMode.SIMPLE);

  React.useEffect(() => {
    if (visible) {
      setName('');
      setTouched(false);
      setConfigMode(ConfigurationMode.SIMPLE);
    }
  }, [visible]);

  const nameError = getConfigurationNameValidator(existsNames).validate(name).error?.message;
  const isValid = getConfigurationValidator(existsNames).validate({
    name,
    mode: configMode,
  }).error == null;

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
          <Text style={styles.title}>New profile</Text>
          <Text style={styles.subtitle}>You can change everything later.</Text>

          <FieldLabel label="Name" />
          <TextInput
            value={name}
            onChangeText={(text) => {
              setTouched(true);
              setName(text);
            }}
            placeholder="e.g. Home pool"
            placeholderTextColor={palette.inkSubtle}
            maxLength={30}
            autoFocus
            style={[styles.input, touched && nameError ? styles.inputError : undefined]}
          />
          {touched && nameError ? <HelperText tone="danger">{nameError}</HelperText> : null}

          <FieldLabel label="Editor" />
          <Choice
            layout="cards"
            value={configMode}
            onChange={setConfigMode}
            options={[
              {
                label: 'Simple',
                value: ConfigurationMode.SIMPLE,
                description: 'Guided form for pool, wallet, CPU and algorithms.',
              },
              {
                label: 'Advanced',
                value: ConfigurationMode.ADVANCE,
                description: 'Edit the raw XMRig JSON config yourself.',
              },
            ]}
          />

          <View style={styles.actions}>
            <Button label="Cancel" variant="ghost" onPress={onDismiss} style={styles.flex} />
            <Button
              label="Create profile"
              disabled={!isValid}
              onPress={() => onAdd(name.trim(), configMode)}
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
    fontSize: 13,
    color: palette.inkSubtle,
  },
  input: {
    marginTop: 8,
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: palette.track,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: palette.ink,
  },
  inputError: {
    borderColor: palette.danger,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  flex: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
});

export default AddConfigurationsModal;
