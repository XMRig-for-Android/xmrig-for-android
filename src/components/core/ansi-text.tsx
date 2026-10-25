import React from 'react';
import {
  StyleProp, Text, TextStyle, View, ViewStyle,
} from 'react-native';
import Anser from 'anser';

type AnsiPart = {
  content: string;
  fg?: string | null;
  bg?: string | null;
  decoration?: string | null;
};

type AnsiTextProps = {
  ansi: string;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

// anser emits bare "r, g, b" triplets for the 16 standard colors; remap them for a dark terminal.
const ansiPalette: Record<string, string> = {
  '0, 0, 0': '#6B7080',
  '187, 0, 0': '#F87171',
  '0, 187, 0': '#4ADE80',
  '187, 187, 0': '#FACC15',
  '0, 0, 187': '#818CF8',
  '187, 0, 187': '#E879F9',
  '0, 187, 187': '#67E8F9',
  '255, 255, 255': '#F4F4F8',
  '85, 85, 85': '#9599AA',
  '255, 85, 85': '#FCA5A5',
  '85, 255, 85': '#86EFAC',
  '255, 255, 85': '#FDE68A',
  '85, 85, 255': '#A5B4FC',
  '255, 85, 255': '#F0ABFC',
  '85, 255, 255': '#A5F3FC',
};

const toColor = (value?: string | null) => {
  if (!value) {
    return undefined;
  }
  return ansiPalette[value] || `rgb(${value})`;
};

const AnsiTextBase: React.FC<AnsiTextProps> = ({
  ansi,
  textStyle = {},
  containerStyle = {},
}) => {
  const parts = React.useMemo(() => Anser.ansiToJson(ansi || '', {
    use_classes: false,
    remove_empty: true,
  }) as AnsiPart[], [ansi]);

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>
        {parts.map((part, index) => (
          <Text
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            style={{
              color: toColor(part.fg),
              backgroundColor: toColor(part.bg),
              fontWeight: part.decoration === 'bold' ? '700' : undefined,
            }}
          >
            {part.content}
          </Text>
        ))}
      </Text>
    </View>
  );
};

export const AnsiText = React.memo(AnsiTextBase);

export default AnsiText;
