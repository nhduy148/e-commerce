import { ThemeContext } from "@nestle/contexts";
import { IThemeMode } from "@nestle/types";
import { useContext, useEffect } from "react";

export function useAppTheme(initialAppTheme: IThemeMode) {
  const { setTheme } = useContext(ThemeContext);

  useEffect(() => {
    setTheme(initialAppTheme);
  }, []);
}
