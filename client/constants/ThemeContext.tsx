import { ThemeContextValue } from "@/types/Theme";
import React from "react";

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined,
);
ThemeContext.displayName = "ThemeContext";

export default ThemeContext;
