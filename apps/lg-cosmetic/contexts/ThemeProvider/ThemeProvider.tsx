import { getTheme } from "@lc/themes";
import { IThemeMode } from "@lc/types";
import { ThemeProvider as MUIThemeProvider } from "@mui/material";
import Cookie from "js-cookie";
import { useState } from "react";
import { ThemeContext } from "./ThemeContext";

export const ThemeProvider = ({ children, initialAppTheme }) => {
  // State to hold selected theme
  const [themeName, _setThemeName] = useState<IThemeMode>(initialAppTheme);

  // Retrieve theme object by theme name
  const theme = getTheme(themeName);

  // Wrap setThemeName to store new theme names as cookie.
  const setThemeName = (name: IThemeMode) => {
    Cookie.set("appTheme", name);
    _setThemeName(name);
  };

  const contextValue = {
    appTheme: themeName,
    setTheme: setThemeName,
  };
  return (
    <ThemeContext.Provider value={contextValue}>
      <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
    </ThemeContext.Provider>
  );
};
