import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useBottomTabOverflow() {
  if (Platform.OS !== "ios") {
    return 0;
  }
  //   const tabHeight = useBottomTabBarHeight();
  const { bottom } = useSafeAreaInsets();
  return bottom;
}
