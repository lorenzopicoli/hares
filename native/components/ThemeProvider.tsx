import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";

export type ThemedColors = typeof Colors.dark & typeof Colors.light;

type ThemeContextType = {
  colors: ThemedColors;
  applyColors: (colors: ThemedColors) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [colors, setColors] = useState(Colors.light);

  const applyColors = (colorTheme: ThemedColors) => {
    setColors(colorTheme);
  };

  return <ThemeContext.Provider value={{ applyColors, colors }}>{children}</ThemeContext.Provider>;
};

interface ColorType {
  colors: ThemedColors;
  applyColors: (colors: ThemedColors) => void;
}

const useColors = (): ColorType => {
  const store = useContext(ThemeContext);
  const colorScheme = useColorScheme();

  if (!store) {
    throw new Error("useColors must be defined.");
  }

  useEffect(() => {
    store.applyColors(colorScheme === "dark" ? Colors.dark : Colors.light);
  }, [store.applyColors, colorScheme]);

  return {
    applyColors: store.applyColors,
    colors: store.colors,
  };
};

export { ThemeContext, ThemeProvider, useColors };
