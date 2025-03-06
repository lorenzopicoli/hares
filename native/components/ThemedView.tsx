import { View, type ViewProps } from 'react-native';
import { useColors } from './ThemeProvider';


export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const { colors }= useColors()

  return <View style={[{ backgroundColor: colors.background }, style]} {...otherProps} />;
}
