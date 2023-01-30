import {
  IBrand,
  ICategory,
  IMenu,
  IMenuDisplayType,
  ITopBrands,
} from "@hera/data";
import {
  Box,
  lighten,
  Link,
  LinkProps,
  Skeleton,
  styled,
  Tabs,
  Theme,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { FC, useRef, useState } from "react";
import { LcMegaMenu } from "./LcMegaMenu";

interface StyledLinkProps extends LinkProps {
  theme?: Theme;
  active?: boolean;
}

const StyledLink = styled(Link)<StyledLinkProps>(
  ({ theme, active }) => `
    white-space: nowrap;
    flex: 1;
    max-width: 160px;
    transition-duration: ${theme.transitions.duration.standard}ms;
    transition-timingFunction: ${theme.transitions.easing.easeInOut};
    text-align: center;
    position: relative;
    font-size: ${theme.typography.subtitle2.fontSize};
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.palette.text.primary};
    padding: 16px 20px;
    ::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      height: 4px;
      width: ${active ? "100%" : 0};
      transition-duration: ${theme.transitions.duration.standard}ms;
      transition-timingFunction: ${theme.transitions.easing.easeInOut};
      background-color: ${theme.palette.primary.main};
    }
    :hover {
      color: ${theme.palette.primary.main};
      background-color: ${lighten(theme.palette.primary.main, 0.96)};
      ::before {
        width: 100%;
      }
    }
  `,
);

interface IProps {
  isLoading?: boolean;
  topBrands: ITopBrands[];
  listBrands: IBrand[];
  listCategories: ICategory[];
  menu: IMenu[];
}

export const LcDesktopMenu: FC<IProps> = ({
  isLoading,
  topBrands,
  listBrands,
  listCategories,
  menu,
}) => {
  const { palette } = useTheme();
  const { push, asPath } = useRouter();
  const menuWrapperRef = useRef<Element | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [currentDisplayType, setCurrentDisplayType] =
    useState<IMenuDisplayType | null>(null);
  const [currentCategoryHovered, setHoverCategory] = useState<string | null>(
    null,
  );

  const onNavigate = (e: MouseEvent, url: string) => {
    e?.preventDefault();
    push(url);
  };

  const handleMouseEnterMenu = (menuItem: IMenu) => {
    setOpenMenu(true);
    setCurrentDisplayType(menuItem.displayType);
    setHoverCategory(menuItem.rootTaxon);
  };
  const handleMouseLeaveMenu = () => {
    setOpenMenu(false);
  };
  const handleKeepOpenMenu = ({ currentTarget }) => {
    setOpenMenu(menuRef.current.isEqualNode(currentTarget));
  };

  const renderNav = (
    <Box ref={menuWrapperRef}>
      <Tabs
        value={0}
        variant="scrollable"
        scrollButtons="auto"
        draggable
        allowScrollButtonsMobile
        TabIndicatorProps={{ style: { height: 0 } }}
        TabScrollButtonProps={{
          sx: {
            transition: "all 100ms",
            "&:hover": {
              backgroundColor: lighten(palette.primary.main, 0.96),
              color: palette.primary.main,
            },
            "&.Mui-disabled": {
              opacity: 0.3,
            },
          },
        }}
      >
        {menu?.map((menuItem, index) => {
          const { rootTaxon, displayType, url, text } = menuItem;
          let href = "#";
          if (displayType === "menu") {
            href = `/category/${rootTaxon}`;
          }
          if (displayType === "link") {
            href = url || "#";
          }

          return (
            <StyledLink
              key={index}
              onClick={(e: any) => onNavigate(e, href)}
              href={href}
              title={text}
              underline="none"
              active={href === asPath}
              onMouseEnter={() => handleMouseEnterMenu(menuItem)}
              onMouseLeave={handleMouseLeaveMenu}
            >
              {text}
            </StyledLink>
          );
        })}
      </Tabs>
    </Box>
  );

  const renderLoadingNav = (
    <Box display="flex">
      {[...Array(8).keys()].map((_, index) => (
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

  return (
    <>
      {isLoading ? renderLoadingNav : renderNav}
      <LcMegaMenu
        anchorEl={menuWrapperRef.current}
        disablePortal
        hideBackdrop
        disableRestoreFocus
        disableScrollLock
        sx={{
          pointerEvents: "none",
        }}
        open={
          openMenu &&
          (currentDisplayType === "brand" || currentDisplayType === "menu")
        }
        PaperProps={{
          ref: menuRef,
          onMouseEnter: handleKeepOpenMenu,
          onMouseLeave: () => handleKeepOpenMenu({ currentTarget: null }),
          sx: {
            width: menuWrapperRef?.current?.clientWidth || 0,
            minHeight: 300,
            // @ts-ignore
            top: `${window?.megaMenuPositionTop || 182}px !important`,
            pointerEvents: "all",
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        displayType={currentDisplayType}
        topBrands={topBrands}
        listBrands={listBrands}
        listCategories={listCategories}
        currentCategoryHovered={currentCategoryHovered}
      />
    </>
  );
};
