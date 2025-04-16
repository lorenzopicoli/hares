import * as Haptics from "expo-haptics";
import type { ReactNode } from "react";
import { Pressable, type PressableProps } from "react-native";

interface Props extends PressableProps {
  children: ReactNode;
}

export function HapticPressable(props: Props) {
  return (
    <Pressable
      {...props}
      onPressIn={(ev) => {
        if (props.onPressIn) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          props.onPressIn?.(ev);
        }
      }}
      onPress={(ev) => {
        if (props.onPress) {
          if (!props.onPressIn) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          props.onPress?.(ev);
        }
      }}
    />
  );
}
