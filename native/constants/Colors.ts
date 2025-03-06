/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#8A2BE2"; // Bright purple for light mode
const tintColorDark = "#BF5FFF"; // Lighter neon purple for dark mode
export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    secondaryText: "#687076", // Added secondary text color
    input: {
      background: "#F8F9FA",
      border: "#E6E8EB",
      focusedBorder: "#8A2BE2", // Matching tint color
      borderError: "#E53E3E",
      backgroundDisabled: "#F1F3F5",
      text: "#11181C",
      textError: "#E53E3E",
    },
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    secondaryText: "#9BA1A6", // Added secondary text color
    input: {
      background: "#1E2021",
      border: "#2A2D2E",
      focusedBorder: "#BF5FFF", // Matching tint color
      borderError: "#E53E3E",
      backgroundDisabled: "#1A1B1C",
      text: "#ECEDEE",
      textError: "#FF6B6B",
    },
  },
};
