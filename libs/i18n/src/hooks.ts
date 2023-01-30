import { Options } from "intl-messageformat";
import { MessageDescriptor, useIntl } from "react-intl";
import { useContext } from "react";
import { I18nContext } from "./provider";

export type PrimitiveType = string | number | boolean | null | undefined | Date;

export type FormatXMLElementFn<T, R = string | T | Array<string | T>> = (
  parts: Array<string | T>,
) => R;

export type FormatMessage = (
  descriptor: MessageDescriptor,
  values?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>>,
  opts?: Options,
) => string;

export function useI18n() {
  return useContext(I18nContext);
}

export function useFormatter() {
  const { formatMessage } = useIntl();

  return {
    __: formatMessage,
    __c: () => {
      throw new Error("Please implement this feature (format currency)");
    },
    __n: () => {
      throw new Error("Please implement this feature (format number)");
    },
  };
}
