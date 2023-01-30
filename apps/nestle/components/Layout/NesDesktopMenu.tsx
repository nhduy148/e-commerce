import { IBrand, ICategory, IMenu } from "@hera/data";

import {
  Box,
  Link,
  LinkProps,
  MenuItem,
  Skeleton,
  Stack,
  styled,
  Theme,
} from "@mui/material";
import { useRouter } from "next/router";
import { FC, MouseEvent } from "react";

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
    font-size: ${theme.typography.subtitle1.fontSize};
    font-weight: ${theme.typography.fontWeightBold};
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
      background-color: ${theme.palette.primary.main};
    }
    :hover {
      color: ${theme.palette.primary.main};
    }
  `,
);

const StyledSubMenu = styled(Stack)`
  position: absolute;
  top: 44px;
  left: 0;
  transform: translateY(-12px);
  visibility: hidden;
  opacity: 0;
  transition: ${({ theme }) => theme.transitions.duration.standard}ms;
  background-color: ${({ theme }) => theme.palette.custom.secondaryBackground};
  border: 1px solid;
  border-color: ${({ theme }) => theme.palette.custom.secondaryBorder};
  padding: 8px;
  border-radius: 6px;
  box-shadow: 0px 6px 32px rgba(34, 34, 34, 0.08);
`;

const StyledMenuItemWrapper = styled(Box)`
  position: relative;
  padding: 12px 16px;
  &:hover {
    .sub-menu {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

interface IProps {
  isLoading?: boolean;
  listCategories: ICategory[];
  listBrands: IBrand[];
  menu: IMenu[];
}

export const NesDesktopMenu: FC<IProps> = ({
  isLoading,
  menu,
  listCategories,
  listBrands,
}) => {
  const { push, asPath } = useRouter();

  const onNavigate = (e: MouseEvent, url: string) => {
    e?.preventDefault();
    push(url);
  };

  const renderNav = (
    <Box display="flex">
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
            >
              {text}
            </StyledLink>
            {subMenu?.length > 0 && (
              <StyledSubMenu spacing={0.75} className="sub-menu">
                {subMenu.map((menu) => (
                  <MenuItem
                    onClick={(e: any) =>
                      onNavigate(
                        e,
                        `/${displayType === "menu" ? "category" : "brand"}/${
                          menu.slug
                        }`,
                      )
                    }
                  >
                    {menu.name}
                  </MenuItem>
                ))}
              </StyledSubMenu>
            )}
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
