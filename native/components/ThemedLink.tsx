import { router } from "expo-router";
import React, { type PropsWithChildren } from "react";
import { Pressable } from "react-native";

/**
 * Temporary until: https://github.com/expo/expo/issues/29489
 */
export default function ThemedLink(props: { path: Parameters<typeof router.push>[0] } & PropsWithChildren) {
  return (
    <Pressable
      onPressIn={() => {
        router.push(props.path);
      }}
    >
      {props.children}
    </Pressable>
  );
}
