import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import * as JSON5 from 'json5';
import { EditAdvanceCardProps } from './index';
import { palette, radius } from '../../../../../core/theme';
import { Badge, Section } from '../../../../core/ui';

const formatConfig = (data?: string) => {
  try {
    return JSON.stringify(JSON5.parse(data || '{}'), null, 2);
  } catch {
    return data || '{}';
  }
};

const isValidJson = (code: string) => {
  try {
    JSON5.parse(code);
    return true;
  } catch {
    return false;
  }
};

export const EditAdvanceEditorCard: React.FC<EditAdvanceCardProps> = (
  { setLocalState, localState },
) => {
  const [code, setCode] = React.useState<string>(() => formatConfig(localState.config?.toString()));
  const valid = React.useMemo(() => isValidJson(code), [code]);

  return (
    <Section
      title="Config JSON"
      description="Full XMRig config. Pool, CPU and algorithm options all live here."
      action={<Badge label={valid ? 'Valid JSON' : 'Invalid JSON'} tone={valid ? 'success' : 'danger'} />}
      invalid={!valid}
      style={styles.section}
    >
      <TextInput
        multiline
        value={code}
        onChangeText={(text) => {
          setCode(text);
          setLocalState((oldState) => ({ ...oldState, config: text }));
        }}
        autoCorrect={false}
        autoCapitalize="none"
        spellCheck={false}
        textAlignVertical="top"
        scrollEnabled
        style={styles.editor}
      />
    </Section>
  );
};

const styles = StyleSheet.create({
  section: {
    flex: 1,
  },
  editor: {
    flex: 1,
    minHeight: 280,
    marginTop: 8,
    backgroundColor: palette.heroFrom,
    borderRadius: radius.sm,
    padding: 14,
    color: '#E6E3FF',
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
});

export default EditAdvanceEditorCard;
