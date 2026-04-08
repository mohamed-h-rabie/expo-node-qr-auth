import { useContext } from "react";
import ThemeContext from "@/constants/ThemeContext";
import { ThemeContextValue } from "@/types/Theme";

const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return ctx;
};

export default useTheme;
