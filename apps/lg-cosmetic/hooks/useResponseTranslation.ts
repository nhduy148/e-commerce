import { IResponseLanguage } from "@hera/types";
import { useRouter } from "next/router";

export function useResponseTranslation() {
  const { locale } = useRouter();

  const translate = (content: IResponseLanguage, fallback?: string) => {
    return content?.[locale] || fallback || null;
  };

  return { translate };
}
