import React, { createContext } from "react";

import * as config from "@hera/config";
import { Locale } from "@hera/i18n";
import { IntlProvider, MessageFormatElement } from "react-intl";
import { flattenMessages } from "./flattenMessage";

export type Messages =
  | Record<string, string>
  | Record<string, MessageFormatElement[]>
  | undefined;

interface II18nProviderProps {
  messages: Messages;
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

interface II18nContextProps {
  currentLocale: Locale;
  setLocale: (locale: Locale) => void;
  dateFormat: string;
  dateTimeFormat: string;
  shortDateTimeFormat: string;
}

export const I18nContext = createContext<II18nContextProps>(
  {} as II18nContextProps,
);

/**
 * The provider use to implement i18n feature
 * @param props
 * @constructor
 */
export const I18nProvider: React.FunctionComponent<II18nProviderProps> = (
  props,
) => {
  return (
    <IntlProvider
      locale={props.currentLocale}
      messages={flattenMessages(props.messages)}
      defaultLocale={config.defaultLocale}
      onError={() => {}}
    >
      <I18nContext.Provider
        value={{
          setLocale: props.onLocaleChange,
          currentLocale: props.currentLocale,
          dateFormat: config.format[props.currentLocale].dateFormat,
          dateTimeFormat: config.format[props.currentLocale].dateFormat,
          shortDateTimeFormat:
            config.format[props.currentLocale].shortDateTimeFormat,
        }}
      >
        {props.children}
      </I18nContext.Provider>
    </IntlProvider>
  );
};
