import { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { GSPDefaultHead } from "@gsp/components";
import { ThemeProvider } from "@gsp/contexts";
import { GSPLayout } from "@gsp/LayoutComponents";
import { IThemeMode } from "@gsp/types";
import { DataProvider } from "@hera/data";
import { I18nProvider, Locale } from "@hera/i18n";
import { CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import dayjs from "dayjs";
import CustomParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import utc from "dayjs/plugin/utc";
import { AppContext, AppProps, default as NextApp } from "next/app";
import { SnackbarProvider } from "notistack";
import numeral from "numeral";
import "numeral/locales/es";
import "numeral/locales/vi";
import { useEffect, useState } from "react";
import { Hydrate } from "react-query";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { createEmotionCache } from "../styles/css_cache";

export * as jwt from "jwt-decode";

export interface IAppProps extends AppProps {
  emotionCache: EmotionCache;
  themeMode: IThemeMode;
  err?: any;
}

function loadMessages(locale: Locale) {
  return import(`../lang/${locale}.json`);
  // Right way to use i18n
  //return import(`../compiled_lang/${locale}.json`);
}

const clientSideEmotionCache = createEmotionCache();

function App(props: IAppProps) {
  const [messages, setMessages] = useState<any | null>(null);
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    themeMode,
    pageProps,
    router,
    err,
  } = props;

  useEffect(() => {
    numeral.locale(router.locale || "vi");
    numeral.localeData("vi").delimiters = {
      thousands: ".",
      decimal: ",",
    };
    numeral.localeData("vi").currency = {
      symbol: "₫",
    };
    numeral.localeData("en").currency = {
      symbol: "₫",
    };

    dayjs.extend(utc);
    dayjs.extend(isSameOrAfter);
    dayjs.extend(CustomParseFormat);
    dayjs.extend(isBetween);

    loadMessages(router.locale as Locale).then(setMessages);
  }, [router.locale]);

  return (
    <I18nProvider
      messages={messages}
      currentLocale={router.locale as Locale}
      onLocaleChange={(locale) => router.replace(router.pathname, locale)}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DataProvider>
          <CacheProvider value={emotionCache}>
            <ThemeProvider initialAppTheme={themeMode}>
              <CssBaseline />
              <Hydrate state={pageProps?.dehydratedState}>
                <SnackbarProvider
                  maxSnack={3}
                  autoHideDuration={3000}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  preventDuplicate
                  dense
                >
                  <GSPLayout>
                    <>
                      <GSPDefaultHead />
                      <Component {...pageProps} err={err} />
                    </>
                  </GSPLayout>
                </SnackbarProvider>
              </Hydrate>
            </ThemeProvider>
          </CacheProvider>
        </DataProvider>
      </LocalizationProvider>
    </I18nProvider>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);

  const themeMode: IThemeMode =
    // @ts-ignore
    appContext?.ctx?.req?.headers?.cookie?.themeMode || "light";
  return { ...appProps, themeMode };
};

export default App;
