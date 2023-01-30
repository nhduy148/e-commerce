import { createTheme, lighten, ThemeOptions } from "@mui/material";
import {
  BORDER_RADIUS,
  BREAK_POINTS,
  DEFAULT_FONT_SIZE,
  DEFAULT_HTML_FONTSIZE,
  DESKTOP_FONTSIZE,
  FONT_FAMILIES,
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_LIGHT,
  FONT_WEIGHT_MEDIUM,
  FONT_WEIGHT_REGULAR,
  pxToRem,
  TRANSITION_DURATION_COMPLEX,
  TRANSITION_DURATION_ENTERINGSCREEN,
  TRANSITION_DURATION_LEAVINGSCREEN,
  TRANSITION_DURATION_SHORT,
  TRANSITION_DURATION_SHORTER,
  TRANSITION_DURATION_SHORTEST,
  TRANSITION_DURATION_STANDARD,
  TRANSITION_EASING_EASEIN,
  TRANSITION_EASING_EASEINOUT,
  TRANSITION_EASING_EASEOUT,
  TRANSITION_EASING_SHARP,
  ZINDEX_APPBAR,
  ZINDEX_DRAWER,
  ZINDEX_FAB,
  ZINDEX_MOBILESTEPPER,
  ZINDEX_MODAL,
  ZINDEX_SNACKBAR,
  ZINDEX_SPEEDDIAL,
  ZINDEX_TOOLTIP
} from "@nestle/constants";
import { IThemeMode } from "@nestle/types";
import darkPalette from "./dark";
import lightPalette from "./light";

declare module "@mui/material/styles" {
  interface CustomPalette {
    custom?: {
      primaryBackground?: string;
      secondaryBackground?: string;
      primaryBlur?: string;
      primaryBorder?: string;
      secondaryBorder?: string;
      homeBannerArrowBackground?: string;
      footerBackground?: string;
      hoveredProductItemBackground?: string;
      getSampleFormColor?: string;
    };
  }
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    containedBlur: true;
  }
}

const theme: ThemeOptions = {
  breakpoints: {
    keys: ["xs", "sm", "md", "lg", "xl"],
    values: BREAK_POINTS,
    unit: "px",
  },
  direction: "ltr",
  shape: {
    borderRadius: BORDER_RADIUS,
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
      fontWeight: FONT_WEIGHT_LIGHT,
      lineHeight: 1.44,
    },
    h2: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.h2),
      fontWeight: FONT_WEIGHT_LIGHT,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.h3),
      fontWeight: FONT_WEIGHT_REGULAR,
      lineHeight: 1.16,
    },
    h4: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.h4),
      fontWeight: FONT_WEIGHT_REGULAR,
      lineHeight: 1.23,
    },
    h5: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.h5),
      fontWeight: FONT_WEIGHT_MEDIUM,
      lineHeight: 1.32,
    },
    h6: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.h6),
      fontWeight: FONT_WEIGHT_MEDIUM,
      lineHeight: 1.24,
    },
    subtitle1: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.subtitle1),
      fontWeight: FONT_WEIGHT_MEDIUM,
      lineHeight: 1.37,
    },
    subtitle2: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.subtitle2),
      fontWeight: FONT_WEIGHT_MEDIUM,
      lineHeight: 1.57,
    },
    body1: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.body1),
      fontWeight: FONT_WEIGHT_REGULAR,
      lineHeight: 1.24,
    },
    body2: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.body2),
      fontWeight: FONT_WEIGHT_REGULAR,
      lineHeight: 1.43,
    },
    button: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.button),
      fontWeight: FONT_WEIGHT_REGULAR,
      lineHeight: 1,
    },
    caption: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.caption),
      fontWeight: FONT_WEIGHT_REGULAR,
      display: "inline-block",
      lineHeight: 1.66,
    },
    overline: {
      fontSize: pxToRem(DESKTOP_FONTSIZE.overline),
      fontWeight: FONT_WEIGHT_REGULAR,
      textTransform: "unset",
      lineHeight: 1.66,
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
      easeInOut: TRANSITION_EASING_EASEINOUT,
      easeOut: TRANSITION_EASING_EASEOUT,
      easeIn: TRANSITION_EASING_EASEIN,
      sharp: TRANSITION_EASING_SHARP,
    },
    duration: {
      shortest: TRANSITION_DURATION_SHORTEST,
      shorter: TRANSITION_DURATION_SHORTER,
      short: TRANSITION_DURATION_SHORT,
      standard: TRANSITION_DURATION_STANDARD,
      complex: TRANSITION_DURATION_COMPLEX,
      enteringScreen: TRANSITION_DURATION_ENTERINGSCREEN,
      leavingScreen: TRANSITION_DURATION_LEAVINGSCREEN,
    },
  },
  zIndex: {
    mobileStepper: ZINDEX_MOBILESTEPPER,
    fab: ZINDEX_FAB,
    speedDial: ZINDEX_SPEEDDIAL,
    appBar: ZINDEX_APPBAR,
    drawer: ZINDEX_DRAWER,
    modal: ZINDEX_MODAL,
    snackbar: ZINDEX_SNACKBAR,
    tooltip: ZINDEX_TOOLTIP,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
      *, *::before, *::after {
        box-sizing: border-box;
      }
    `,
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
      variants: [
        {
          props: { color: "error" },
          style: ({ theme: MUITheme }) => ({
            "&.lc-icon-button:hover, &.lc-icon-button.Mui-active": {
              color: MUITheme.palette.error.main,
            },
          }),
        },
      ],
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "revert",
        },
        sizeMedium: {
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 16,
          paddingRight: 16,
          fontSize: pxToRem(DESKTOP_FONTSIZE.button),
        },
        sizeSmall: {
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 16,
          paddingRight: 16,
          fontSize: pxToRem(DESKTOP_FONTSIZE.buttonSm),
        },
        sizeLarge: {
          fontSize: pxToRem(DESKTOP_FONTSIZE.buttonLg),
        },
      },
      // defaultProps: {
      //   size: "large",
      // },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: pxToRem(DESKTOP_FONTSIZE.inputLabel),
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: pxToRem(DESKTOP_FONTSIZE.helperText),
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          fontSize: pxToRem(DESKTOP_FONTSIZE.inputText),
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: pxToRem(DESKTOP_FONTSIZE.avatarInitial),
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: pxToRem(DESKTOP_FONTSIZE.chip),
        },
      },
    },
    MuiAlertTitle: {
      styleOverrides: {
        root: {
          fontSize: pxToRem(DESKTOP_FONTSIZE.alertTitle),
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          fontSize: pxToRem(DESKTOP_FONTSIZE.tableHeader),
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontSize: pxToRem(DESKTOP_FONTSIZE.badgeLabel),
        },
      },
    },
  },
};

const dark = createTheme({ palette: darkPalette, ...theme });

const light = createTheme({ palette: lightPalette, ...theme });

const themes = { dark, light };

export function getTheme(theme: IThemeMode) {
  const defaultTheme = themes[theme];
  return defaultTheme;
}
