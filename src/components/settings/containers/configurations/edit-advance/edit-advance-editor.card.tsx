import React from 'react';
import { KeyboardAvoidingView, TextInput, Appearance } from 'react-native';
import * as JSON5 from 'json5';
import {
  Card, View,
} from 'react-native-ui-lib';
import { ScrollView } from 'react-native-gesture-handler';
import { AnsiText } from '../../../../core/ansi-text';
import { useStyledCode } from '../../../../../core/utils/ansi';
import { EditAdvanceCardProps } from './index';

export const EditAdvanceEditorCard: React.FC<EditAdvanceCardProps> = (
  { setLocalState, localState },
) => {
  const [code, setCode] = React.useState<string>('{}');

  const { styledCode, cleanCode } = useStyledCode(code, Appearance.getColorScheme() === 'dark');
  const userEdited = React.useRef(false);

  React.useEffect(() => {
    const data = localState.config?.toString() || '{}';
    try {
      setCode(JSON.stringify(JSON5.parse(data), null, 2));
    } catch (er) {
      console.log(er);
    }
  }, []);

  React.useEffect(() => {
    if (!userEdited.current) {
      return;
    }
    setLocalState((oldState) => ({
      ...oldState,
      config: cleanCode,
    }));
  }, [cleanCode]);

  return (
    <Card style={{ flexGrow: 1 }} useSafeArea>
      <View centerV spread padding-20 paddingB-5>
        <View row>
          <Card.Section
            content={[
              { text: 'Config JSON', text65: true, $textDefault: true },
            ]}
          />
        </View>
      </View>

      <View spread padding-20 paddingT-0 paddingB-20 style={{ flexGrow: 1 }}>
        <ScrollView contentContainerStyle={{ flex: 1, backgroundColor: 'black', borderRadius: 5 }}>
          <KeyboardAvoidingView>
            <AnsiText
              ansi={styledCode}
              textStyle={{
                color: Appearance.getColorScheme() === 'dark' ? 'white' : 'black',
                marginBottom: 8,
              }}
            />
            <TextInput
              multiline
              value={code}
              onChangeText={(text) => {
                userEdited.current = true;
                setCode(text);
              }}
              autoCorrect={false}
              spellCheck={false}
              textAlignVertical="top"
              style={{
                color: 'white',
                minHeight: 240,
                fontSize: 13,
              }}
            />
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </Card>
  );
};

export default EditAdvanceEditorCard;
