const tintColorLight = "#8A2BE2"; // Bright purple for light mode
const tintColorDark = "#BF5FFF"; // Lighter neon purple for dark mode
export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    secondaryBackground: "#111",
    tint: tintColorLight,
    danger: "rgb(230, 69, 58)",
    darkTint: "#7F65A3",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    secondaryText: "#687076", // Added secondary text color
    border: "#2A2D2E",
    input: {
      background: "#F8F9FA",
      border: "#E6E8EB",
      focusedBorder: "#8A2BE2", // Matching tint color
      borderError: "#E53E3E",
      backgroundDisabled: "#F1F3F5",
      text: "#11181C",
      textError: "#E53E3E",
    },
    toggleButton: {
      background: "#F8F9FA", // Light background matching input background
      border: "#E6E8EB", // Light border matching input border
      selected: {
        background: "#F2E8FA", // Light purple background
        border: "#8A2BE2", // Matching tint color
      },
    },
  },
  dark: {
    text: "#ECEDEE",
    danger: "rgb(190, 30, 30)",
    background: "#151718",
    secondaryBackground: "#151718",
    tint: "#BF5FFF",
    darkTint: "#7F65A3",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#BF5FFF",
    secondaryText: "#9BA1A6",
    border: "#2A2D2E",
    input: {
      background: "#1E2021",
      border: "#2A2D2E",
      focusedBorder: "#BF5FFF",
      borderError: "#E53E3E",
      backgroundDisabled: "#1A1B1C",
      text: "#ECEDEE",
      textError: "#FF6B6B",
    },
    toggleButton: {
      background: "#1E2021",
      border: "#2A2D2E",
      selected: {
        background: "#2D1E33",
        border: "#BF5FFF",
      },
    },
  },
};
