import { GSPLogo } from "@gsp/components";
import { IBrand, ICategory, IMenu } from "@hera/data";
import { useFormatter } from "@hera/i18n";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Drawer,
  DrawerProps,
  Icon,
  InputAdornment,
  ListItemText,
  MenuItem,
  MenuList,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { FC, useState } from "react";

interface IProps extends DrawerProps {
  listCategories: ICategory[];
  listBrands: IBrand[];
  menu: IMenu[];
}

export const GSPMobileMenu: FC<IProps> = ({
  listCategories,
  listBrands,
  menu,
  ...props
}) => {
  const { __ } = useFormatter();
  const { push } = useRouter();
  const { typography, palette } = useTheme();
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
      placeholder={__({ defaultMessage: "Tìm kiếm" })}
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
                  key={index}
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
                      {subMenu.map((menu, index) => (
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
      </Box>
    </Box>
  );

  return (
    <Drawer
      anchor="right"
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
            <GSPLogo
              BoxProps={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
              width={121}
              height={44}
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
            {__({ defaultMessage: "Đóng" })}
          </Button>
        </Box>
        <Box mb={1}>{renderSearchField}</Box>
        {renderMenuList}
      </Box>
    </Drawer>
  );
};
