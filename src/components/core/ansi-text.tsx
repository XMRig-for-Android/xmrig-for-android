import React from 'react';
import {
  StyleProp, Text, TextStyle, View, ViewStyle,
} from 'react-native';
import Anser from 'anser';

type AnsiPart = {
  content: string;
  fg?: string;
  bg?: string;
  decoration?: string | null;
};

type AnsiTextProps = {
  ansi: string;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

const toColor = (value?: string) => {
  if (!value) {
    return undefined;
  }
  return value;
};

export const AnsiText: React.FC<AnsiTextProps> = ({
  ansi,
  textStyle = {},
  containerStyle = {},
}) => {
  const parts = Anser.ansiToJson(ansi || '', {
    use_classes: false,
    remove_empty: true,
  }) as AnsiPart[];

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>
        {parts.map((part, index) => (
          <Text
            // eslint-disable-next-line react/no-array-index-key
            key={`${index}-${part.content}`}
            style={{
              color: toColor(part.fg),
              backgroundColor: toColor(part.bg),
              fontWeight: part.decoration === 'bold' ? 'bold' : undefined,
            }}
          >
            {part.content}
          </Text>
        ))}
      </Text>
    </View>
  );
};

export default AnsiText;
