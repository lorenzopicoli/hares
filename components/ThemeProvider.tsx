import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useState, type PropsWithChildren } from "react";

export type ThemedColors = typeof Colors.dark & typeof Colors.light;

type ThemeContextType = {
  colors: ThemedColors;
  theme: "light" | "dark";
  changeTheme: (theme: "light" | "dark") => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

const ThemeProvider = ({ children }: PropsWithChildren) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [colors, setColors] = useState(Colors[theme]);

  const readTheme = useCallback(async () => {
    const result = await AsyncStorage.getItem("theme");

    const newTheme = result ? (result as "light" | "dark") : colorScheme === "light" ? "light" : "dark";
    setTheme(newTheme);
    setColors(Colors[newTheme]);
  }, [colorScheme]);

  const changeTheme = useCallback(
    async (theme: "dark" | "light") => {
      console.log("Set theme", theme);
      await AsyncStorage.setItem("theme", theme);
      await readTheme();
    },
    [readTheme],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    readTheme();
  }, []);

  return <ThemeContext.Provider value={{ colors, theme, changeTheme }}>{children}</ThemeContext.Provider>;
};

interface ColorType {
  colors: ThemedColors;
  setTheme: (theme: "light" | "dark") => void;
  theme: "light" | "dark";
}

const useColors = (): ColorType => {
  const store = useContext(ThemeContext);

  if (!store) {
    throw new Error("useColors must be defined.");
  }

  return {
    colors: store.colors,
    setTheme: store.changeTheme,
    theme: store.theme,
  };
};

export { ThemeContext, ThemeProvider, useColors };
