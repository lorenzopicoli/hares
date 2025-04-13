import { router } from "expo-router";
import React, { type PropsWithChildren } from "react";
import { TouchableOpacity } from "react-native";

/**
 * Temporary until: https://github.com/expo/expo/issues/29489
 */
export default function ThemedLink(props: { path: Parameters<typeof router.push>[0] } & PropsWithChildren) {
  return (
    <TouchableOpacity
      onPressIn={() => {
        router.push(props.path);
      }}
    >
      {props.children}
    </TouchableOpacity>
  );
}
