import { IBrand, ICategory, IMenu } from "@hera/data";

import {
  Box,
  Icon,
  Link,
  LinkProps,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Skeleton,
  styled,
  Theme,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { FC, MouseEvent, useCallback } from "react";

interface StyledLinkProps extends LinkProps {
  theme?: Theme;
  active?: boolean;
}

const StyledLink = styled(Link)<StyledLinkProps>(
  ({ theme, active }) => `
    white-space: nowrap;
    flex: 1;
    min-width: 80px;
    transition-duration: ${theme.transitions.duration.standard}ms;
    transition-timingFunction: ${theme.transitions.easing.easeInOut};
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: ${theme.typography.body2.fontSize};
    font-weight: ${theme.typography.fontWeightMedium};
    color: ${theme.palette.text.primary};
    ::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: auto;
      height: ${active ? 4 : 0}px;
      transition-duration: ${theme.transitions.duration.standard}ms;
      transition-timingFunction: ${theme.transitions.easing.easeInOut};
      background-color: ${theme.palette.secondary.main};
    }
    :hover {
      color: ${theme.palette.secondary.main};
    }
  `,
);

const StyledSubMenu = styled(Box)`
  position: absolute;
  top: 44px;
  left: 0;
  min-width: 100%;
  transform: translateY(-12px);
  visibility: hidden;
  opacity: 0;
  transition: ${({ theme }) => theme.transitions.duration.standard}ms;
  background-color: ${({ theme }) => theme.palette.background.default};
  border-radius: 6px;
  box-shadow: 0px 6px 32px rgba(34, 34, 34, 0.05);
  z-index: 9998;
  padding: 4px 0;
`;

const StyledMenuItemWrapper = styled(Box)`
  position: relative;
  padding: 12px;
  &:hover {
    .MuiNavigationMenuItem-root {
      color: ${({ theme }) => theme.palette.secondary.main};
    }
    .sub-menu {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StyledSubMenuItem = styled(Box)`
  position: relative;
  padding: 4px 8px;
  &:hover {
    .sub-submenu {
      visibility: visible;
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const StyledSubSubmenu = styled(Box)`
  position: absolute;
  top: 0;
  left: calc(100% + 4px);
  transform: translateX(-12px);
  visibility: hidden;
  opacity: 0;
  transition: ${({ theme }) => theme.transitions.duration.standard}ms;
  background-color: ${({ theme }) => theme.palette.background.default};
  border-radius: 6px;
  box-shadow: 2px 2px 5px rgba(34, 34, 34, 0.05);
  z-index: 9999;
  min-width: 160px;
  padding: 4px 0;
`;

interface IProps {
  isLoading?: boolean;
  listCategories: ICategory[];
  listBrands: IBrand[];
  menu: IMenu[];
}

export const GSPDesktopMenu: FC<IProps> = ({
  isLoading,
  menu,
  listCategories,
  listBrands,
}) => {
  const { push, asPath } = useRouter();
  const { palette } = useTheme();

  const onNavigate = (e: MouseEvent, url: string) => {
    e?.preventDefault();
    push(url);
  };

  const renderSubmenuLevel1 = useCallback((subMenu: ICategory[]) => {
    if (subMenu?.length <= 0) {
      return null;
    }
    return (
      <StyledSubSubmenu className="sub-submenu">
        {subMenu.map((menu: ICategory) => (
          <StyledSubMenuItem>
            <MenuItem
              onClick={(e: any) => onNavigate(e, `/category/${menu.slug}`)}
              sx={{
                backgroundColor: palette.background.default,
                ":hover, :focus": {
                  backgroundColor: palette.background.paper,
                },
              }}
            >
              <ListItemText>{menu.name}</ListItemText>
            </MenuItem>
          </StyledSubMenuItem>
        ))}
      </StyledSubSubmenu>
    );
  }, []);

  const renderSubmenu = useCallback(
    (subMenu: ICategory[], { displayType }: IMenu) => {
      if (subMenu?.length <= 0) {
        return null;
      }
      return (
        <StyledSubMenu className="sub-menu">
          {subMenu.map((menu: ICategory) => {
            let hrefLv01 = `/brand/${menu.slug}`;

            let subMenuLv01 = [];
            if (displayType === "menu") {
              subMenuLv01 =
                subMenu.find((cat: ICategory) => cat.slug === menu.slug)
                  ?.taxons || [];
              if (subMenuLv01?.length > 0) {
                hrefLv01 = "#";
              } else {
                hrefLv01 = `/category/${menu.slug}`;
              }
            }
            return (
              <StyledSubMenuItem
                sx={{
                  ":hover, :focus": {
                    "> .MuiMenuItem-root": {
                      backgroundColor: palette.background.paper,
                    },
                    ".MuiIcon-root": {
                      color: palette.primary.main,
                    },
                  },
                }}
              >
                <MenuItem
                  onClick={(e: any) => onNavigate(e, hrefLv01)}
                  sx={{
                    backgroundColor: palette.background.default,
                    ":hover, :focus": {
                      backgroundColor: palette.background.paper,
                      ".MuiIcon-root": {
                        color: palette.primary.main,
                      },
                    },
                  }}
                >
                  <ListItemText>{menu.name}</ListItemText>
                  {subMenuLv01?.length > 0 && (
                    <ListItemIcon>
                      <Icon sx={{ ml: "auto" }}>arrow_right_alt</Icon>
                    </ListItemIcon>
                  )}
                </MenuItem>
                {renderSubmenuLevel1(subMenuLv01)}
              </StyledSubMenuItem>
            );
          })}
        </StyledSubMenu>
      );
    },
    [renderSubmenuLevel1],
  );

  const renderNav = (
    <Box display="flex" flexWrap="wrap">
      {menu?.map((menuItem, index) => {
        const { rootTaxon, displayType, url, text } = menuItem;
        let href = "#";
        let subMenu = [];
        if (displayType === "menu") {
          href = `/category/${rootTaxon}`;
          subMenu =
            listCategories.find(
              (category) => category.slug === menuItem.rootTaxon,
            )?.taxons || [];
        } else if (displayType === "link") {
          href = url || "#";
        } else if (displayType === "brand") {
          href = "#";
          subMenu = listBrands || [];
        }

        return (
          <StyledMenuItemWrapper>
            <StyledLink
              key={index}
              onClick={(e: any) => onNavigate(e, href)}
              href={href}
              title={text}
              underline="none"
              active={href === asPath}
              textTransform="uppercase"
              className="MuiNavigationMenuItem-root"
            >
              {text}
              {subMenu?.length > 0 && (
                <Icon sx={{ ml: 1 }} fontSize="inherit">
                  expand_more
                </Icon>
              )}
            </StyledLink>
            {renderSubmenu(subMenu, menuItem)}
          </StyledMenuItemWrapper>
        );
      })}
    </Box>
  );

  const renderLoadingNav = (
    <Box display="flex">
      {[...Array(4).keys()].map((_, index) => (
        <Skeleton
          width={160}
          height={50}
          sx={{ mr: 1 }}
          animation="wave"
          key={index}
        />
      ))}
    </Box>
  );

  return <>{isLoading ? renderLoadingNav : renderNav}</>;
};
