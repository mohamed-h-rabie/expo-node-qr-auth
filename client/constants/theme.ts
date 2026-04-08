/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Theme, ThemeFonts } from "@/types/Theme";
import { Platform } from "react-native";

// ─── Core palette ────────────────────────────────────────────────────────────

export const Colors = {
  light: {
    // Backgrounds
    background: {
      primary: "#FFFFFF", // Screen background
      surface: "#F7F7F7", // Input / card background
    },
    // Borders & dividers
    border: {
      default: "#E5E5E5",
    },
    // Text
    text: {
      primary: "#1A1A1A", // Headings, body
      secondary: "#808080", // Placeholders, hints
      link: "#1A1A1A", // Underlined links
    },
    // Interactive states
    interactive: {
      disabled: "#CCCCCC",
      disabledText: "#FFFFFF",
    },
    // Primary CTA button
    button: {
      primaryBg: "#1A1A1A",
      primaryText: "#FFFFFF",
    },
    // Icons (eye, chevron, etc.)
    icon: {
      default: "#333333",
    },
  },

  dark: {
    // Backgrounds
    background: {
      primary: "#141414", // Screen background
      surface: "#1F1F1F", // Input / card background
    },
    // Borders & dividers
    border: {
      default: "#2E2E2E",
    },
    // Text
    text: {
      primary: "#F0F0F0", // Headings, body
      secondary: "#7A7A7A", // Placeholders, hints
      link: "#E0E0E0", // Underlined links
    },
    // Interactive states
    interactive: {
      disabled: "#2E2E2E",
      disabledText: "#606060",
    },
    // Primary CTA button — inverted in dark mode
    button: {
      primaryBg: "#F0F0F0",
      primaryText: "#141414",
    },
    // Icons
    icon: {
      default: "#C0C0C0",
    },
  },
};

export const AppFonts: ThemeFonts = {
  regular: {
    fontFamily: Platform.select({ ios: "generalReqular", android: "generalReqular", default: "sans-serif" }),
    fontWeight: "400",
  },
  medium: {
    fontFamily: Platform.select({ ios: "generalMedium", android: "generalMedium", default: "sans-serif-medium" }),
    fontWeight: "500",
  },
  bold: {
    fontFamily: Platform.select({ ios: "generalSemiBold", android: "generalSemiBold", default: "sans-serif" }),
    fontWeight: "600",
  },
  heavy: {
    fontFamily: Platform.select({ ios: "generalSemiBold", android: "generalSemiBold", default: "sans-serif" }),
    fontWeight: "700",
  },
};

// ─── Navigation themes (React Navigation / Expo Router) ──────────────────────

export const DefaultTheme: Theme = {
  dark: false,
  colors: {
    primary: "#1A1A1A",
    background: Colors.light.background.primary,
    card: Colors.light.background.surface,
    text: Colors.light.text.primary,
    border: Colors.light.border.default,
    notification: "rgb(255, 59, 48)",
  },
  fonts: AppFonts,
};

export const DarkTheme: Theme = {
  dark: true,
  colors: {
    primary: Colors.dark.button.primaryBg,
    background: Colors.dark.background.primary,
    card: Colors.dark.background.surface,
    text: Colors.dark.text.primary,
    border: Colors.dark.border.default,
    notification: "rgb(255, 69, 58)",
  },
  fonts: AppFonts,
};

// ─── Tab bar (legacy — kept for backward compat) ─────────────────────────────

export const TabColors = {
  light: {
    icon: Colors.light.icon.default,
    tabIconDefault: Colors.light.text.secondary,
    tabIconSelected: Colors.light.text.primary,
  },
  dark: {
    icon: Colors.dark.icon.default,
    tabIconDefault: Colors.dark.text.secondary,
    tabIconSelected: Colors.dark.text.primary,
  },
};

// ─── Fonts ───────────────────────────────────────────────────────────────────

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
