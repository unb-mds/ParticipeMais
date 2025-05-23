import React from 'react';
import { Text, TextProps, TextStyle, StyleProp } from 'react-native';

interface ThemedTextProps extends TextProps {
  style?: StyleProp<TextStyle>; // ✅ solução correta
}

export function ThemedText({ style, ...rest }: ThemedTextProps) {
  let resolvedFontFamily = 'Raleway_400Regular';

  const styleArray = Array.isArray(style) ? style : [style];

  for (const s of styleArray) {
    if (s && typeof s === 'object' && 'fontWeight' in s && s.fontWeight === 'bold') {
      resolvedFontFamily = 'Raleway_700Bold';
      break;
    }
  }

  return (
    <Text
      {...rest}
      style={[{ fontFamily: resolvedFontFamily }, ...styleArray]}
    />
  );
}
