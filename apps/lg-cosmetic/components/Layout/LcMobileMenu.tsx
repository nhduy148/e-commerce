import { AuthenticationContext } from "@hera/contexts";
import {
  IBrand,
  ICategory,
  IMenu,
  IMenuDisplayType,
  ITopBrands,
} from "@hera/data";
import { LcIconButton, LcLogo } from "@lc/components";
import { ChevronRight as ChevronRightIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerProps,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Slide,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { FC, useContext, useMemo, useState } from "react";
import { useIntl } from "react-intl";

interface IProps extends DrawerProps {
  topBrands: ITopBrands[];
  listBrands: IBrand[];
  listCategories: ICategory[];
  menu: IMenu[];
  onLoginButtonClick?: (e?: any) => void;
}

interface ISubMenuData {
  open: boolean;
  type: IMenuDisplayType | null;
  slug: string | null;
  label: string | null;
}

interface I2ndSubMenuData {
  open: boolean;
  parentId: number | null;
  label: string | null;
}

const initSubMenuData = {
  open: false,
  type: null,
  slug: null,
  label: null,
};

const init2ndSubMenuData = {
  open: false,
  parentId: null,
  label: null,
};

export const LcMobileMenu: FC<IProps> = ({
  topBrands,
  listBrands,
  listCategories,
  menu,
  onLoginButtonClick,
  ...props
}) => {
  const { formatMessage } = useIntl();
  const { push } = useRouter();
  const { isLogin: isLoggedIn } = useContext(AuthenticationContext);
  const translate = {
    userProfile: formatMessage({ id: "header.userProfile" }),
    login: formatMessage({ id: "authentication.login" }),
  };
  const [subMenuData, setSubMenuData] = useState<ISubMenuData>(initSubMenuData);
  const [secondarySubMenuData, set2ndSubMenuData] =
    useState<I2ndSubMenuData>(init2ndSubMenuData);

  const categories = useMemo(
    () =>
      listCategories.find((category) => category.slug === subMenuData.slug)
        ?.taxons || [],
    [listCategories, subMenuData.slug],
  );

  const subCategories = useMemo(
    () =>
      categories.find(
        (category) => category.id === secondarySubMenuData.parentId,
      )?.taxons || [],
    [categories, secondarySubMenuData.parentId],
  );

  const handleNavigation = (e, url) => {
    push(url);
    if (typeof props?.onClose === "function") {
      props.onClose(e, "backdropClick");
    }
  };

  const renderSubMenuList = {
    brand: (
      <MenuList dense disablePadding>
        {listBrands?.map((brand, index) => (
          <Box key={index}>
            <MenuItem
              onClick={(e) => handleNavigation(e, `/brand/${brand.slug}`)}
              sx={{ px: 0, py: 1.5625 }}
              disableRipple
            >
              <ListItemText>
                <Typography variant="subtitle2">{brand.name}</Typography>
              </ListItemText>
            </MenuItem>
            {index !== listBrands.length - 1 && (
              <Divider sx={{ my: "0 !important" }} />
            )}
          </Box>
        ))}
      </MenuList>
    ),
    menu: (
      <MenuList dense disablePadding>
        {categories.map((category, index) => (
          <Box key={index}>
            <MenuItem
              onClick={(e) => {
                if (category?.taxons?.length > 0) {
                  set2ndSubMenuData({
                    open: true,
                    parentId: category.id,
                    label: category.name,
                  });
                } else {
                  handleNavigation(e, `/category/${category.slug}`);
                }
              }}
              sx={{ px: 0, py: 1.5625 }}
              disableRipple
            >
              <ListItemText>
                <Typography variant="subtitle2">{category.name}</Typography>
              </ListItemText>
              {category?.taxons?.length > 0 && (
                <ChevronRightIcon fontSize="small" />
              )}
            </MenuItem>
            {index !== categories.length - 1 && (
              <Divider sx={{ my: "0 !important" }} />
            )}
          </Box>
        ))}
      </MenuList>
    ),
  };

  const render2ndSubMenuList = (
    <MenuList dense disablePadding>
      {subCategories.map((category, index) => (
        <Box key={index}>
          <MenuItem
            onClick={(e) => handleNavigation(e, `/category/${category.slug}`)}
            sx={{ px: 0, py: 1.5625 }}
            disableRipple
          >
            <ListItemText>
              <Typography variant="subtitle2">{category.name}</Typography>
            </ListItemText>
          </MenuItem>
          {index !== categories.length - 1 && (
            <Divider sx={{ my: "0 !important" }} />
          )}
        </Box>
      ))}
    </MenuList>
  );

  const renderSubMenuLayout = (
    children: JSX.Element,
    level: "1st" | "2nd" = "1st",
  ) => (
    <Paper
      elevation={0}
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        height: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        flex="0 0 auto"
      >
        <Typography variant="subtitle1">
          <b>{subMenuData.label}</b>
        </Typography>
        <LcIconButton
          iconName="keyboard_backspace"
          onClick={() => {
            if (level === "1st") {
              setSubMenuData(initSubMenuData);
            } else {
              set2ndSubMenuData(init2ndSubMenuData);
            }
          }}
        />
      </Box>
      <Divider sx={{ m: 0 }} />
      <Box p={2} flex={1} overflow="auto">
        {children}
      </Box>
    </Paper>
  );

  const renderSubmenu = (
    <Slide in={subMenuData?.open} direction="right">
      {renderSubMenuLayout(renderSubMenuList[subMenuData.type])}
    </Slide>
  );

  const render2ndSubMenu = (
    <Slide in={secondarySubMenuData?.open} direction="right">
      {renderSubMenuLayout(render2ndSubMenuList, "2nd")}
    </Slide>
  );

  const renderMainMenu = (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        flex="0 0 auto"
      >
        <LcLogo
          BoxProps={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
          color="gray"
          width={191}
          height={24}
        />
        <LcIconButton
          iconName="close"
          onClick={(e) => props?.onClose && props?.onClose(e, "backdropClick")}
        />
      </Box>
      <Divider sx={{ m: 0 }} />
      <Box p={2} flex={1} overflow="auto">
        <Box>
          <MenuList dense disablePadding>
            {menu?.map((menuItem, index) => (
              <MenuItem
                sx={{ px: 0, py: 1 }}
                disableRipple
                key={index}
                onClick={(e) => {
                  if (
                    menuItem.displayType === "menu" ||
                    menuItem.displayType === "brand"
                  ) {
                    setSubMenuData({
                      open: true,
                      type: menuItem.displayType,
                      slug: menuItem.rootTaxon,
                      label: menuItem.text,
                    });
                  } else {
                    handleNavigation(e, menuItem?.url);
                  }
                }}
              >
                <ListItemText>
                  <Typography variant="subtitle2">{menuItem.text}</Typography>
                </ListItemText>
                <ChevronRightIcon fontSize="small" />
              </MenuItem>
            ))}
          </MenuList>
          <Divider sx={{ my: 2 }} />
          {isLoggedIn ? (
            <MenuItem
              onClick={(e) => handleNavigation(e, "/account/profile")}
              component="div"
              sx={{ px: 0, py: 1, minHeight: 0 }}
              disableTouchRipple
              disableRipple
            >
              <ListItemText>
                <Typography variant="subtitle2">
                  {translate.userProfile}
                </Typography>
              </ListItemText>
              <ChevronRightIcon fontSize="small" />
            </MenuItem>
          ) : (
            <Button
              variant="text"
              size="small"
              color="inherit"
              onClick={(e) => {
                if (typeof props?.onClose === "function") {
                  props?.onClose(e, "backdropClick");
                }
                if (typeof onLoginButtonClick === "function") {
                  onLoginButtonClick(e);
                }
              }}
            >
              <b>{translate.login}</b>
            </Button>
          )}
        </Box>
      </Box>
    </>
  );

  return (
    <Drawer
      PaperProps={{
        sx: { width: 1, height: 1, display: "flex", flexDirection: "column" },
      }}
      {...props}
    >
      {renderMainMenu}
      {renderSubmenu}
      {render2ndSubMenu}
    </Drawer>
  );
};
