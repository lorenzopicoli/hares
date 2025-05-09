import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native";

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
    text: "#121218",
    background: "#F7F8FA",
    secondaryBackground: "#E4E7ED",
    cardBackground: "#FFFFFF",
    tint: "#9C40D9",
    lightTint: "#C48AE0",
    darkTint: "#6B10A3",
    icon: "#5A6066",
    tabIconDefault: "#5A6066",
    tabIconSelected: "#9C40D9",
    secondaryText: "#5A6066",
    logoBg: "#E0E0E5",
    border: "#D7DAE0",

    input: {
      background: "#EBEEF2",
      border: "#C5C9D3",
      focusedBorder: "#9C40D9",
      borderError: "#E53E3E",
      backgroundDisabled: "#E6E8EC",
      text: "#121218",
      textError: "#E53E3E",
    },

    toggleButton: {
      background: "#E1E4E9",
      border: "#D7DAE0",
      selected: {
        background: "#EFE0FA",
        border: "#9C40D9",
      },
    },

    button: {
      primary: {
        background: "#9C40D9",
        text: "#FFFFFF",
      },
      secondary: {
        background: "#8AC44A",
        text: "#FFFFFF",
      },
      success: {
        background: "#2D9D3A",
        text: "#FFFFFF",
      },
      ghost: {
        text: "#121218",
        background: "transparent",
        border: "#C5C9D3",
      },
      danger: {
        text: "#FFFFFF",
        background: "#E53E3E",
      },
    },
  },
  dark: {
    text: "#F5F6F7",
    secondaryBackground: "#1A1E36",
    cardBackground: "#2A2F4D",
    background: "#161827",
    tint: "#9C5DC5",
    lightTint: "#C48AE0",
    darkTint: "#6A1296",
    icon: "#B8BDC5",
    tabIconDefault: "#B8BDC5",
    tabIconSelected: "#9C5DC5",
    secondaryText: "#A5ABB3",
    logoBg: "#BABBCF",
    border: "#333853",

    input: {
      background: "#272B45",
      border: "#3A3E52",
      focusedBorder: "#9C5DC5",
      borderError: "#E04146",
      backgroundDisabled: "#202336",
      text: "#F5F6F7",
      textError: "#FF7B7B",
    },

    button: {
      primary: {
        background: "#9C5DC5",
        text: "#F5F6F7",
      },
      secondary: {
        background: "#7BBF34",
        text: "#F5F6F7",
      },
      success: {
        background: "#2A8D3A",
        text: "#F5F6F7",
      },
      ghost: {
        text: "#F5F6F7",
        background: "transparent",
        border: "#3A3E52",
      },
      danger: {
        text: "#F5F6F7",
        background: "#E04146",
      },
    },

    toggleButton: {
      background: "#272B45",
      border: "#3A3E52",
      selected: {
        background: "#4A2074",
        border: "#9C5DC5",
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

export const FontsAndWeights = {
  regular: {
    fontFamily: "HaresFontRegular",
    fontWeight: "400" as const,
  },
  medium: {
    fontFamily: "HaresFontMedium",
    fontWeight: "500" as const,
  },
  bold: {
    fontFamily: "HaresSemiBold",
    fontWeight: "600" as const,
  },
  heavy: {
    fontFamily: "HaresFontBold",
    fontWeight: "700" as const,
  },
};

export const Fonts = {
  regular: {
    fontFamily: "HaresFontRegular",
  },
  medium: {
    fontFamily: "HaresFontMedium",
  },
  bold: {
    fontFamily: "HaresSemiBold",
  },
  heavy: {
    fontFamily: "HaresFontBold",
  },
};

export const NavBarColors: Record<string, Theme> = {
  light: {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: colors.frenchViolet,
      background: "#ffffff",
      card: Colors.light.background,
      text: Colors.light.text,
      border: "#e0e0e5",
      notification: colors.auburn,
    },
    fonts: {
      ...FontsAndWeights,
    },
  },
  dark: {
    ...DarkTheme,
    dark: true,
    colors: {
      primary: tintColorDark,
      background: "#1e223a",
      card: Colors.dark.background,
      text: Colors.dark.text,
      border: "#3a3e52",
      notification: "#c33036",
    },
    fonts: {
      ...FontsAndWeights,
    },
  },
};

export const defaultStackNavigationStyling = {
  headerShadowVisible: false,
  headerTitleAlign: "center" as const,
};
