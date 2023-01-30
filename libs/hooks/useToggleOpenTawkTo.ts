import { useMemo } from "react";

export function useToggleOpenTawkTo(open: boolean) {
  if (typeof window === "undefined") return;
  return useMemo(() => {
    if (open) {
      // @ts-ignore
      window?.Tawk_API &&
        // @ts-ignore
        typeof window.Tawk_API.hideWidget === "function" &&
        // @ts-ignore
        window.Tawk_API.hideWidget();
    } else {
      // @ts-ignore
      window?.Tawk_API &&
        // @ts-ignore
        typeof window.Tawk_API.hideWidget === "function" &&
        // @ts-ignore
        window.Tawk_API.showWidget();
    }
  }, [open]);
}
