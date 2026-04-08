export type ThemePreference = "light" | "dark" | "system";

export type ThemeColors = {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
};

export type ThemeFonts = {
  regular: { fontFamily: string; fontWeight: "400" | "normal" | "500" | "600" | "700" | "800" | "900" | "bold" | "100" | "200" | "300" };
  medium: { fontFamily: string; fontWeight: "400" | "normal" | "500" | "600" | "700" | "800" | "900" | "bold" | "100" | "200" | "300" };
  bold: { fontFamily: string; fontWeight: "400" | "normal" | "500" | "600" | "700" | "800" | "900" | "bold" | "100" | "200" | "300" };
  heavy: { fontFamily: string; fontWeight: "400" | "normal" | "500" | "600" | "700" | "800" | "900" | "bold" | "100" | "200" | "300" };
};

export type Theme = {
  dark: boolean;
  colors: ThemeColors;
  fonts: ThemeFonts;
};

export type ThemeContextValue = {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};
