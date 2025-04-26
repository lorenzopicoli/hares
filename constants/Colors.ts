import { DarkTheme, DefaultTheme } from "@react-navigation/native";

export const colors = {
  frenchViolet: "#8614cc",
  pistachio: "#92c156",
  spaceCadet: "#292d43",
  auburn: "#aa1d22",
  dartmouthGreen: "#21612b",
};

const tintColorLight = colors.frenchViolet;
const tintColorDark = "#a43be2";
const errorColor = colors.auburn;
const successColor = colors.dartmouthGreen;

export const Colors = {
  light: {
    text: "#1e1e24",
    background: "#ffffff",
    secondaryBackground: colors.spaceCadet,
    tint: tintColorLight,
    darkTint: "#6b10a3",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    secondaryText: "#687076",
    border: "#e0e0e5",
    input: {
      background: "#F8F9FA",
      border: "#E6E8EB",
      focusedBorder: colors.frenchViolet,
      borderError: errorColor,
      backgroundDisabled: "#F1F3F5",
      text: "#1e1e24",
      textError: errorColor,
    },
    toggleButton: {
      background: "#F8F9FA",
      border: "#E6E8EB",
      selected: {
        background: "#f2e6fa",
        border: colors.frenchViolet,
      },
    },
    button: {
      primary: {
        background: tintColorLight,
        text: "#ECEDEE",
      },
      secondary: {
        background: colors.pistachio,
        text: "#ECEDEE",
      },
      success: {
        backgrond: successColor,
        text: "#ECEDEE",
      },
      ghost: {
        text: "#1e1e24",
        background: "transparent",
        border: colors.spaceCadet,
      },
      danger: {
        text: "#ECEDEE",
        background: errorColor,
      },
    },
  },
  dark: {
    text: "#ECEDEE",
    background: colors.spaceCadet,
    secondaryBackground: "#1e223a",
    tint: tintColorDark,
    darkTint: "#7213ab",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    secondaryText: "#9BA1A6",
    border: "#3a3e52",
    input: {
      background: "#323549",
      border: "#3a3e52",
      focusedBorder: tintColorDark,
      borderError: "#c33036",
      backgroundDisabled: "#252a3d",
      text: "#ECEDEE",
      textError: "#ff6b6b",
    },
    button: {
      primary: {
        background: tintColorDark,
        text: "#ECEDEE",
      },
      secondary: {
        background: "#a2d266",
        text: "#ECEDEE",
      },
      success: {
        backgrond: "#2a7d37",
        text: "#ECEDEE",
      },
      ghost: {
        text: "#ECEDEE",
        background: "transparent",
        border: "#3a3e52",
      },
      danger: {
        text: "#ECEDEE",
        background: "#c33036",
      },
    },
    toggleButton: {
      background: "#323549",
      border: "#3a3e52",
      selected: {
        background: "#471d6e",
        border: tintColorDark,
      },
    },
  },

  semantic: {
    warning: "#d4ab00",
    info: "#0072c6",
    success: colors.dartmouthGreen,
    error: colors.auburn,
    accent: colors.pistachio,
  },
};

export const NavBarColors = {
  light: {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: colors.frenchViolet,
      background: "#ffffff",
      card: "#f8f8f8",
      text: "#1e1e24",
      border: "#e0e0e5",
      notification: colors.auburn,
    },
  },
  dark: {
    ...DarkTheme,
    dark: true,
    colors: {
      primary: tintColorDark,
      background: "#1e223a",
      card: "#1e223a",
      text: "#ECEDEE",
      border: "#3a3e52",
      notification: "#c33036",
    },
  },
};
