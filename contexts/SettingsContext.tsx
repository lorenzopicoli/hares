import { ThemedText } from "@/components/ThemedText";
import type { NewSettings, Settings } from "@/db/schema";
import { useSettingsDatabase } from "@/hooks/data/useSettings";
import { createContext, useContext, type PropsWithChildren } from "react";

type SettingsContextType = {
  settings: Settings;
  updateSettings: (settings: NewSettings) => void;
};

export const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const { settings, updateSettings, createSettings } = useSettingsDatabase();

  if (!settings) {
    createSettings();
    return <ThemedText>Loading config</ThemedText>;
  }

  return <SettingsContext.Provider value={{ settings, updateSettings }}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): SettingsContextType => {
  const store = useContext(SettingsContext);

  if (!store) {
    throw new Error("Make sure to use the settings context inside a provider");
  }

  return store;
};
