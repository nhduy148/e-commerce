import { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import * as config from "@hera/config";
import { AuthenticationProvider } from "@hera/contexts";
import { DataProvider, User } from "@hera/data";
import { I18nProvider, Locale, Messages } from "@hera/i18n";
import { ThemeProvider } from "@lc/contexts";
import { LcAppLoading, LcLayout } from "@lc/LayoutComponents";
import { IThemeMode } from "@lc/types";
import { CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";
import dayjs from "dayjs";
import CustomParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import utc from "dayjs/plugin/utc";
import { DefaultSeo } from "next-seo";
import { AppContext, AppProps, default as NextApp } from "next/app";
import { SnackbarProvider } from "notistack";
import numeral from "numeral";
import "numeral/locales/es";
import "numeral/locales/vi";
import { Fragment, useEffect, useState } from "react";
import TagManager from "react-gtm-module";
import { Hydrate } from "react-query";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import SEO from "../next-seo.config";
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
  const [messages, setMessages] = useState<Messages>({});
  const [isLoading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState(0);

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
  }, [router.locale]);

  useEffect(() => {
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

    dayjs.extend(isBetween);
    dayjs.extend(utc);
    dayjs.extend(isSameOrAfter);
    dayjs.extend(CustomParseFormat);

    TagManager.initialize({
      gtmId: config.env.googleTagManagerId,
    });

    import("react-facebook-pixel")
      .then((module) => module.default)
      .then((ReactPixel) => {
        ReactPixel.init(config.env.metaPixelId, null, {
          autoConfig: true,
          debug: true,
        });
        ReactPixel.pageView();
      });

    const authData = JSON.parse(localStorage.getItem(config.env.authKey));
    if (authData) {
      if (authData.timestamp * 1000 < Date.now()) {
        User.logout();
        localStorage?.removeItem(config.env.authKey);
        router.push("/");
      }
    }

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 10);

    loadMessages(router.locale as Locale).then((data) => {
      setMessages(data);
      setLoading(false);
      clearTimeout(timer);
    });

    return () => {
      clearTimeout(timer);
    };
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
                    <>
                      <LcAppLoading isLoading={isLoading} progress={progress} />
                      <LcLayout>
                        <Fragment>
                          <DefaultSeo {...SEO} />
                          <Component {...pageProps} err={err} />
                        </Fragment>
                      </LcLayout>
                      <TawkMessengerReact
                        propertyId={config.env.tawkToPropertyId}
                        widgetId={config.env.tawkToWidgetId}
                      />
                    </>
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
