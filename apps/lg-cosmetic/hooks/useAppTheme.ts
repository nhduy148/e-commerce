import { ThemeContext } from "@lc/contexts";
import { IThemeMode } from "@lc/types";
import { useContext, useEffect } from "react";

export function useAppTheme(initialAppTheme: IThemeMode) {
  const { setTheme } = useContext(ThemeContext);

  useEffect(() => {
    setTheme(initialAppTheme);
  }, []);
}
