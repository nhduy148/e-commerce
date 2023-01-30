import { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import * as config from "@hera/config";
import { AuthenticationProvider } from "@hera/contexts";
import { DataProvider, User } from "@hera/data";
import { I18nProvider, Locale } from "@hera/i18n";
import { CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { KOL_KOC_TRACKING_KEY } from "@nestle/constants";
import { ThemeProvider } from "@nestle/contexts";
import { NesLayout } from "@nestle/LayoutComponents";
import { IThemeMode } from "@nestle/types";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";
import dayjs from "dayjs";
import CustomParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import utc from "dayjs/plugin/utc";
import { AppContext, AppProps, default as NextApp } from "next/app";
import Head from "next/head";
import { SnackbarProvider } from "notistack";
import numeral from "numeral";
import "numeral/locales/es";
import "numeral/locales/vi";
import { useEffect, useState } from "react";
import { Hydrate } from "react-query";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { createEmotionCache } from "../styles/css_cache";
// eslint-disable-next-line
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

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem(config.env.authKey));
    if (authData) {
      if (authData.timestamp * 1000 < Date.now()) {
        User.logout();
        localStorage?.removeItem(config.env.authKey);
        router.push("/");
      }
    }

    const currentKOLKOCTrackingKey = localStorage.getItem(KOL_KOC_TRACKING_KEY);

    if (
      Object.keys(router.query).includes(KOL_KOC_TRACKING_KEY) &&
      router.query[KOL_KOC_TRACKING_KEY] !== currentKOLKOCTrackingKey
    ) {
      localStorage.setItem(
        KOL_KOC_TRACKING_KEY,
        router.query?.[KOL_KOC_TRACKING_KEY] as string,
      );
    }
  }, []);

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
              <AuthenticationProvider>
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
                    <Head>
                      <title>Nestlé Việt Nam - Sống Vui Khoẻ</title>
                    </Head>
                    <NesLayout>
                      <Component {...pageProps} err={err} />
                    </NesLayout>
                    <TawkMessengerReact
                      propertyId={config.env.tawkToPropertyId}
                      widgetId={config.env.tawkToWidgetId}
                    />
                  </SnackbarProvider>
                </Hydrate>
              </AuthenticationProvider>
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
