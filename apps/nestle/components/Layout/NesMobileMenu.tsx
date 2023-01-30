import { AuthenticationContext } from "@hera/contexts";
import { IBrand, ICategory, IMenu } from "@hera/data";
import {
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerProps,
  Icon,
  InputAdornment,
  ListItemText,
  MenuItem,
  MenuList,
  TextField,
  Typography,
  useTheme
} from "@mui/material";
import { NesLogo } from "@nestle/components";
import { useRouter } from "next/router";
import { FC, useContext, useState } from "react";
import { useIntl } from "react-intl";
import { NesContactButton } from "./NesContactButton";

interface IProps extends DrawerProps {
  listCategories: ICategory[];
  listBrands: IBrand[];
  menu: IMenu[];
  onLoginButtonClick?: (e?: any) => void;
}

export const NesMobileMenu: FC<IProps> = ({
  listCategories,
  listBrands,
  menu,
  onLoginButtonClick,
  ...props
}) => {
  const { formatMessage } = useIntl();
  const { isLogin } = useContext(AuthenticationContext);
  const { push } = useRouter();
  const { typography, palette } = useTheme();
  const translate = {
    account: formatMessage({ id: "common.account" }),
    login: formatMessage({ id: "authentication.login" }),
    search: formatMessage({ id: "common.search" }),
    close: formatMessage({ id: "common.close" }),
  };
  const [searchValue, setSearchValue] = useState<string>("");
  const handleNavigation = (e, url) => {
    push(url);
    if (typeof props?.onClose === "function") {
      props.onClose(e, "backdropClick");
    }
  };
  const handleSearch = (e) => {
    if (searchValue) {
      push(`/search?q=${searchValue}`);
    }
    if (typeof props?.onClose === "function") {
      props.onClose(e, "backdropClick");
    }
  };

  const renderSearchField = (
    <TextField
      value={searchValue}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Icon fontSize="medium">search</Icon>
          </InputAdornment>
        ),
        endAdornment: searchValue.length > 0 && (
          <InputAdornment position="start">
            <Icon fontSize="medium" color="primary" onClick={handleSearch}>
              east
            </Icon>
          </InputAdornment>
        ),
        sx: {
          px: 1,
          "&.Mui-focused": { backgroundColor: palette.common.white },
        },
      }}
      placeholder={translate.search}
      onChange={(e) => setSearchValue(e.target.value)}
      fullWidth
      size="small"
    />
  );

  const renderMenuList = (
    <Box flex={1} overflow="auto">
      <Box>
        <MenuList dense disablePadding>
          {menu?.map((menuItem: IMenu, index) => {
            const { rootTaxon, displayType } = menuItem;
            let subMenu = [];
            if (displayType === "menu") {
              subMenu =
                listCategories.find((category) => category.slug === rootTaxon)
                  ?.taxons || [];
            } else if (displayType === "brand") {
              subMenu = listBrands || [];
            }

            if (subMenu.length > 0) {
              return (
                <Accordion
                  elevation={0}
                  sx={{
                    "&.Mui-expanded": {
                      m: 0,
                    },
                    "&::before": {
                      content: "none",
                    },
                  }}
                >
                  <AccordionSummary
                    sx={{
                      p: 0,
                      minHeight: "auto",
                      border: 0,
                      "&.Mui-expanded": {
                        minHeight: "auto",
                        ".MuiTypography-root": {
                          fontWeight: typography.fontWeightBold,
                        },
                      },
                      ".MuiAccordionSummary-content, .MuiAccordionSummary-content.Mui-expanded":
                        { my: 1 },
                    }}
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography variant="body1">{menuItem.text}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <MenuList dense disablePadding>
                      {subMenu.map((menu) => (
                        <MenuItem
                          sx={{ px: 0, py: 1 }}
                          disableRipple
                          key={index}
                          onClick={(e) =>
                            handleNavigation(
                              e,
                              `/${
                                displayType === "menu" ? "category" : "brand"
                              }/${menu.slug}`,
                            )
                          }
                        >
                          <ListItemText>
                            <Typography variant="body1">{menu.name}</Typography>
                          </ListItemText>
                        </MenuItem>
                      ))}
                    </MenuList>
                  </AccordionDetails>
                </Accordion>
              );
            }
            return (
              <MenuItem
                sx={{ px: 0, py: 1 }}
                disableRipple
                key={index}
                onClick={(e) => {
                  handleNavigation(e, menuItem?.url);
                }}
              >
                <ListItemText>
                  <Typography variant="body1">{menuItem.text}</Typography>
                </ListItemText>
              </MenuItem>
            );
          })}
        </MenuList>
        <Divider sx={{ mt: 1, mb: 2 }} />
        <MenuItem
          onClick={(e) => {
            if (!isLogin) {
              if (typeof onLoginButtonClick === "function") {
                onLoginButtonClick(e);
                if (typeof props?.onClose === "function") {
                  props?.onClose(e, "backdropClick");
                }
              }
            } else {
              handleNavigation(e, "/account/profile");
            }
          }}
          component="div"
          sx={{ px: 0, py: 1, minHeight: 0 }}
          disableTouchRipple
          disableRipple
        >
          <ListItemText>
            <Typography variant="body1">
              {isLogin ? translate.account : translate.login}
            </Typography>
          </ListItemText>
          <ChevronRightIcon fontSize="small" />
        </MenuItem>
      </Box>
    </Box>
  );

  return (
    <Drawer
      PaperProps={{
        sx: {
          width: 1,
          height: 1,
          display: "flex",
          flexDirection: "column",
          p: 2,
        },
      }}
      {...props}
    >
      <Box height={1} display="flex" flexDirection="column">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flex="0 0 auto"
          mb={3}
        >
          <Box maxWidth={121}>
            <NesLogo
              BoxProps={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
              width={121}
              height={44}
              full
            />
          </Box>
          <Button
            variant="text"
            size="large"
            endIcon={<Icon fontSize="inherit">close</Icon>}
            sx={{ ".MuiButton-endIcon": { margin: 0 } }}
            onClick={(e) =>
              props?.onClose && props?.onClose(e, "backdropClick")
            }
          >
            {translate.close}
          </Button>
        </Box>
        <Box mb={1}>{renderSearchField}</Box>
        {renderMenuList}
        <Divider sx={{ mb: 1.5 }} />
        <Box display="flex">
          <Box m="auto">
            <NesContactButton size="small" />
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};
