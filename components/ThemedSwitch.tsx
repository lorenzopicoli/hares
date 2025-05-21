import { StyleSheet, type SwitchProps, Switch } from "react-native";
import { useColors, type ThemedColors } from "@/contexts/ThemeContext";

export type ThemedSwitchProps = SwitchProps & {};

export function ThemedSwitch(props: ThemedSwitchProps) {
  const { colors, theme } = useColors();
  //   const { styles } = useStyles(createStyles);

  return (
    <Switch
      {...props}
      trackColor={{ true: colors.tint, false: theme === "dark" ? "#3d4158" : undefined }}
      thumbColor={colors.darkTint}
    />
  );
}

const createStyles = (theme: ThemedColors) => StyleSheet.create({});
