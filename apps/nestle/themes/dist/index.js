"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.getTheme = void 0;
var material_1 = require("@mui/material");
var constants_1 = require("@nestle/constants");
var dark_1 = require("./dark");
var light_1 = require("./light");
var theme = {
    breakpoints: {
        keys: ["xs", "sm", "md", "lg", "xl"],
        values: constants_1.BREAK_POINTS,
        unit: "px"
    },
    direction: "ltr",
    shape: {
        borderRadius: constants_1.BORDER_RADIUS
    },
    unstable_strictMode: true,
    typography: {
        fontFamily: constants_1.FONT_FAMILIES.join(),
        htmlFontSize: constants_1.DEFAULT_HTML_FONTSIZE,
        fontSize: constants_1.DEFAULT_FONT_SIZE,
        fontWeightLight: constants_1.FONT_WEIGHT_LIGHT,
        fontWeightRegular: constants_1.FONT_WEIGHT_REGULAR,
        fontWeightMedium: constants_1.FONT_WEIGHT_MEDIUM,
        fontWeightBold: constants_1.FONT_WEIGHT_BOLD,
        h1: {
            fontSize: constants_1.pxToRem(constants_1.DESKTOP_FONTSIZE.h1),
            fontWeight: constants_1.FONT_WEIGHT_LIGHT,
            lineHeight: 1.44
        },
        h2: {
            fontSize: constants_1.pxToRem(constants_1.DESKTOP_FONTSIZE.h2),
            fontWeight: constants_1.FONT_WEIGHT_LIGHT,
            lineHeight: 1.2
        },
        h3: {
            fontSize: constants_1.pxToRem(constants_1.DESKTOP_FONTSIZE.h3),
            fontWeight: constants_1.FONT_WEIGHT_REGULAR,
            lineHeight: 1.16
        },
        h4: {
            fontSize: constants_1.pxToRem(constants_1.DESKTOP_FONTSIZE.h4),
            fontWeight: constants_1.FONT_WEIGHT_REGULAR,
            lineHeight: 1.23
        },
        h5: {
            fontSize: constants_1.pxToRem(constants_1.DESKTOP_FONTSIZE.h5),
            fontWeight: constants_1.FONT_WEIGHT_MEDIUM,
            lineHeight: 1.32
        },
        h6: {
            fontSize: constants_1.pxToRem(constants_1.DESKTOP_FONTSIZE.h6),
            fontWeight: constants_1.FONT_WEIGHT_MEDIUM,
            lineHeight: 1.24
        },
        subtitle1: {
            fontSize: constants_1.pxToRem(constants_1.DESKTOP_FONTSIZE.subtitle1),
            fontWeight: constants_1.FONT_WEIGHT_MEDIUM,
            lineHeight: 1.37
        },
        subtitle2: {
            fontSize: constants_1.pxToRem(constants_1.DESKTOP_FONTSIZE.subtitle2),
            fontWeight: constants_1.FONT_WEIGHT_MEDIUM,
            lineHeight: 1.57
        },
        body1: {
            fontSize: constants_1.pxToRem(constants_1.DESKTOP_FONTSIZE.body1),
            fontWeight: constants_1.FONT_WEIGHT_REGULAR,
            lineHeight: 1.24
        },
        body2: {
            fontSize: constants_1.pxToRem(constants_1.DESKTOP_FONTSIZE.body2),
            fontWeight: constants_1.FONT_WEIGHT_REGULAR,
            lineHeight: 1.43
        },
        button: {
            fontSize: constants_1.pxToRem(constants_1.DESKTOP_FONTSIZE.button),
            fontWeight: constants_1.FONT_WEIGHT_REGULAR,
            lineHeight: 1
        },
        caption: {
            fontSize: constants_1.pxToRem(constants_1.DESKTOP_FONTSIZE.caption),
            fontWeight: constants_1.FONT_WEIGHT_REGULAR,
            display: "inline-block",
            lineHeight: 1.66
        },
        overline: {
            fontSize: constants_1.pxToRem(constants_1.DESKTOP_FONTSIZE.overline),
            fontWeight: constants_1.FONT_WEIGHT_REGULAR,
            textTransform: "unset",
            lineHeight: 1.66
        }
    },
    mixins: {
        toolbar: {
            minHeight: 56,
            "@media (min-width:0px) and (orientation: landscape)": {
                minHeight: 48
            },
            "@media (min-width:600px)": {
                minHeight: 64
            }
        }
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
            easeInOut: constants_1.TRANSITION_EASING_EASEINOUT,
            easeOut: constants_1.TRANSITION_EASING_EASEOUT,
            easeIn: constants_1.TRANSITION_EASING_EASEIN,
            sharp: constants_1.TRANSITION_EASING_SHARP
        },
        duration: {
            shortest: constants_1.TRANSITION_DURATION_SHORTEST,
            shorter: constants_1.TRANSITION_DURATION_SHORTER,
            short: constants_1.TRANSITION_DURATION_SHORT,
            standard: constants_1.TRANSITION_DURATION_STANDARD,
            complex: constants_1.TRANSITION_DURATION_COMPLEX,
            enteringScreen: constants_1.TRANSITION_DURATION_ENTERINGSCREEN,
            leavingScreen: constants_1.TRANSITION_DURATION_LEAVINGSCREEN
        }
    },
    zIndex: {
        mobileStepper: constants_1.ZINDEX_MOBILESTEPPER,
        fab: constants_1.ZINDEX_FAB,
        speedDial: constants_1.ZINDEX_SPEEDDIAL,
        appBar: constants_1.ZINDEX_APPBAR,
        drawer: constants_1.ZINDEX_DRAWER,
        modal: constants_1.ZINDEX_MODAL,
        snackbar: constants_1.ZINDEX_SNACKBAR,
        tooltip: constants_1.ZINDEX_TOOLTIP
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: "\n      *, *::before, *::after {\n        box-sizing: border-box;\n      }\n    "
        },
        MuiIconButton: {
            styleOverrides: {
                root: function (_a) {
                    var MUITheme = _a.theme;
                    return ({
                        "&.lc-icon-button:hover, &.lc-icon-button.Mui-active": {
                            color: MUITheme.palette.primary.main,
                            backgroundColor: material_1.lighten(MUITheme.palette.primary.main, 0.9)
                        }
                    });
                }
            },
            variants: [
                {
                    props: { color: "error" },
                    style: function (_a) {
                        var MUITheme = _a.theme;
                        return ({
                            "&.lc-icon-button:hover, &.lc-icon-button.Mui-active": {
                                color: MUITheme.palette.error.main
                            }
                        });
                    }
                },
            ]
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "revert"
                },
                sizeMedium: {
                    paddingTop: 12,
                    paddingBottom: 12,
                    paddingLeft: 16,
                    paddingRight: 16,
                    fontSize: constants_1.pxToRem(constants_1.DESKTOP_FONTSIZE.button)
                },
                sizeSmall: {
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 16,
                    paddingRight: 16,
                    fontSize: constants_1.pxToRem(constants_1.DESKTOP_FONTSIZE.buttonSm)
                },
                sizeLarge: {
                    fontSize: constants_1.pxToRem(constants_1.DESKTOP_FONTSIZE.buttonLg)
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontSize: constants_1.pxToRem(constants_1.DESKTOP_FONTSIZE.inputLabel)
                }
            }
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    fontSize: constants_1.pxToRem(constants_1.DESKTOP_FONTSIZE.helperText)
                }
            }
        },
        MuiInput: {
            styleOverrides: {
                root: {
                    fontSize: constants_1.pxToRem(constants_1.DESKTOP_FONTSIZE.inputText)
                }
            }
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    fontSize: constants_1.pxToRem(constants_1.DESKTOP_FONTSIZE.avatarInitial)
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontSize: constants_1.pxToRem(constants_1.DESKTOP_FONTSIZE.chip)
                }
            }
        },
        MuiAlertTitle: {
            styleOverrides: {
                root: {
                    fontSize: constants_1.pxToRem(constants_1.DESKTOP_FONTSIZE.alertTitle)
                }
            }
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    fontSize: constants_1.pxToRem(constants_1.DESKTOP_FONTSIZE.tableHeader)
                }
            }
        },
        MuiBadge: {
            styleOverrides: {
                badge: {
                    fontSize: constants_1.pxToRem(constants_1.DESKTOP_FONTSIZE.badgeLabel)
                }
            }
        }
    }
};
var dark = material_1.createTheme(__assign({ palette: dark_1["default"] }, theme));
var light = material_1.createTheme(__assign({ palette: light_1["default"] }, theme));
var themes = { dark: dark, light: light };
function getTheme(theme) {
    var defaultTheme = themes[theme];
    return defaultTheme;
}
exports.getTheme = getTheme;
