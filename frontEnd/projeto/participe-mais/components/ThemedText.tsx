import { Text, TextProps, TextStyle } from 'react-native';

interface ThemedTextProps extends TextProps {
  style?: TextStyle | TextStyle[];
}

export function ThemedText({ style, ...rest }: ThemedTextProps) {
  let resolvedFontFamily = 'Raleway_400Regular';

  // Converte para array, mesmo se vier como único objeto
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
