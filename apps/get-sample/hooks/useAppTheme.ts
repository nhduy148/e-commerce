import { ThemeContext } from "@gsp/contexts";
import { IThemeMode } from "@gsp/types";
import { useContext, useEffect } from "react";

export function useAppTheme(initialAppTheme: IThemeMode) {
  const { setTheme } = useContext(ThemeContext);

  useEffect(() => {
    setTheme(initialAppTheme);
  }, []);
}
