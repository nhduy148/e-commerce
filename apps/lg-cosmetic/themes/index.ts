import { pxToRem } from "@lc/constants";
import { IThemeMode } from "@lc/types";
import {
  createTheme,
  lighten,
  responsiveFontSizes,
  ThemeOptions,
} from "@mui/material";
import { TypographyOptions } from "@mui/material/styles/createTypography";
import {
  BREAK_POINTS,
  BUTTON_COLOR,
  BUTTON_CONTAINED_INHERIT_BACKGROUND_COLOR,
  BUTTON_CONTAINED_INHERIT_COLOR,
  DEFAULT_FONT_SIZE,
  DEFAULT_HTML_FONTSIZE,
  DESKTOP_FONTSIZE,
  FONT_FAMILIES,
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_LIGHT,
  FONT_WEIGHT_MEDIUM,
  FONT_WEIGHT_REGULAR,
} from "apps/lg-cosmetic/constants";
import darkPalette from "./dark";
import lightPalette from "./light";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    title: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    title?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    title: true;
  }
}

interface ExtendedTypographyOptions extends TypographyOptions {
  title: React.CSSProperties;
}

const theme: ThemeOptions = {
  breakpoints: {
    keys: ["xs", "sm", "md", "lg", "xl"],
    values: BREAK_POINTS,
    unit: "px",
  },
  direction: "ltr",
  shape: {
    borderRadius: 0,
  },
  unstable_strictMode: true,
  typography: {
    fontFamily: FONT_FAMILIES.join(),
    htmlFontSize: DEFAULT_HTML_FONTSIZE,
    fontSize: DEFAULT_FONT_SIZE,
    fontWeightLight: FONT_WEIGHT_LIGHT,
    fontWeightRegular: FONT_WEIGHT_REGULAR,
    fontWeightMedium: FONT_WEIGHT_MEDIUM,
    fontWeightBold: FONT_WEIGHT_BOLD,
    h1: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.h1),
      fontWeight: FONT_WEIGHT_BOLD,
      lineHeight: 1.28,
    },
    h2: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.h2),
      fontWeight: FONT_WEIGHT_BOLD,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.h3),
      fontWeight: FONT_WEIGHT_BOLD,
      lineHeight: 1.38,
    },
    h4: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.h4),
      fontWeight: FONT_WEIGHT_BOLD,
      lineHeight: 1.38,
    },
    h5: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.h5),
      fontWeight: FONT_WEIGHT_BOLD,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.h6),
      fontWeight: FONT_WEIGHT_BOLD,
      lineHeight: 1.5,
    },
    button: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.button),
      fontWeight: FONT_WEIGHT_REGULAR,
      lineHeight: 1.75,
    },
    title: {
      fontWeight: FONT_WEIGHT_REGULAR,
      lineHeight: 1.57,
    },
    subtitle1: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.subtitle1),
      fontWeight: FONT_WEIGHT_MEDIUM,
      lineHeight: 1.3333333333333333,
    },
    subtitle2: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.subtitle2),
      fontWeight: FONT_WEIGHT_MEDIUM,
      lineHeight: 1.57,
    },
    body1: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.body1),
      fontWeight: FONT_WEIGHT_REGULAR,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.body2),
      fontWeight: FONT_WEIGHT_REGULAR,
      lineHeight: 1.38,
    },
    caption: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.caption),
      fontWeight: FONT_WEIGHT_REGULAR,
      display: "inline-block",
      lineHeight: 1.5,
    },
    overline: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.overline),
      fontWeight: FONT_WEIGHT_REGULAR,
      lineHeight: 1.5,
    },
  },
  mixins: {
    toolbar: {
      minHeight: 56,
      "@media (min-width:0px) and (orientation: landscape)": {
        minHeight: 48,
      },
      "@media (min-width:600px)": {
        minHeight: 64,
      },
    },
  },
  shadows: [
    "none",
    "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
    "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
    "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
    "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
    "0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)",
    "0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)",
    "0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)",
    "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
    "0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)",
    "0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)",
    "0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)",
    "0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)",
    "0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)",
    "0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)",
    "0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)",
    "0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)",
    "0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)",
    "0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)",
    "0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)",
    "0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)",
    "0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)",
    "0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)",
    "0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)",
    "0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)",
  ],
  transitions: {
    easing: {
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
  zIndex: {
    mobileStepper: 1000,
    fab: 1050,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
      *, *::before, *::after {
        box-sizing: border-box;
      }
    `,
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: ({ theme: MUITheme }) => ({
          color: BUTTON_COLOR,
          "&:hover": {
            backgroundColor: MUITheme.palette.primary.light,
          },
        }),
        containedInherit: {
          color: BUTTON_CONTAINED_INHERIT_COLOR,
          backgroundColor: BUTTON_CONTAINED_INHERIT_BACKGROUND_COLOR,
        },
        outlinedPrimary: ({ theme: MUITheme }) => ({
          "&:hover": {
            backgroundColor: lighten(MUITheme.palette.primary.main, 0.9),
          },
        }),
        sizeSmall: {
          fontSize: DESKTOP_FONTSIZE.buttonSm,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme: MUITheme }) => ({
          "&.lc-icon-button:hover, &.lc-icon-button.Mui-active": {
            color: MUITheme.palette.primary.main,
            backgroundColor: lighten(MUITheme.palette.primary.main, 0.9),
          },
        }),
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        rounded: ({ theme: MUITheme }) => ({
          "&.Mui-selected": {
            backgroundColor: MUITheme.palette.primary.main,
            color: MUITheme.palette.common.white,
            pointerEvents: "none",
          },
        }),
      },
    },
  },
};

const dark = responsiveFontSizes(
  createTheme({ palette: darkPalette, ...theme }),
);

const light = responsiveFontSizes(
  createTheme({ palette: lightPalette, ...theme }),
);

const themes = { dark, light };

export function getTheme(theme: IThemeMode) {
  const defaultTheme = themes[theme];
  defaultTheme.typography.title = {
    [defaultTheme.breakpoints.up(defaultTheme.breakpoints.values.md)]: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.title),
    },
    fontSize: pxToRem(DESKTOP_FONTSIZE.titleMobile),
  };
  return defaultTheme;
}
