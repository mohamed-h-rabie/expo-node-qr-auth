import React, { useCallback, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ThemeContext from "./ThemeContext";
import { Theme, ThemePreference } from "@/types/Theme";
import { ThemeProvider as NavThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { DarkTheme, DefaultTheme } from "./theme";

const STORAGE_KEY = "@app/theme-preference";

type Props = {
  children: React.ReactNode;
};

const resolveTheme = (
  preference: ThemePreference,
  systemIsDark: boolean,
): Theme => {
  if (preference === "dark") return DarkTheme;
  if (preference === "light") return DefaultTheme;
  return systemIsDark ? DarkTheme : DefaultTheme;
};

const ThemeProvider = ({ children }: Props) => {
  const systemScheme = useColorScheme();
  const systemIsDark = systemScheme === "dark";

  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [ready, setReady] = useState(false);

  // Load saved preference on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === "light" || saved === "dark" || saved === "system") {
        setPreferenceState(saved);
      }
      setReady(true);
    });
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  }, []);

  const theme = resolveTheme(preference, systemIsDark);

  // Don't render until preference is loaded to avoid flash
  if (!ready) return null;

  return (
    <ThemeContext.Provider value={{ theme, preference, setPreference }}>
      <NavThemeProvider value={theme}>
        <StatusBar style={theme.dark ? "light" : "dark"} />
        {children}
      </NavThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
