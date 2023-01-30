import { GSPServerImage } from "@gsp/components";
import { default as StaticImage } from "@gsp/static/images";
import { IBrand, ICategory, IMenuDisplayType, ITopBrands } from "@hera/data";
import { Image } from "@hera/ui";
import { chunkArray } from "@hera/utils";
import {
  Box,
  Button,
  lighten,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  MenuItem,
  MenuList,
  Popover,
  PopoverProps,
  styled,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

interface IMegaMenuProps extends PopoverProps {
  topBrands: ITopBrands[];
  listBrands: IBrand[];
  listCategories: ICategory[];
  displayType: IMenuDisplayType;
  currentCategoryHovered: string | null;
}

type RenderMenuObject = {
  [key in IMenuDisplayType]: JSX.Element;
};

const StyledScrollbar = styled(Box)`
  *::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  *::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 0 transparent;
  }
  *::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) =>
      lighten(theme.palette.primary.main, 0.22)};
    outline: 0;
  }
`;

const StyledStickyListHeader = styled(ListSubheader)`
  padding: 8px 16px;
  background-color: ${({ theme }) => lighten(theme.palette.primary.main, 0.9)};
  margin-right: 16px;
`;

export const GSPMegaMenu = ({
  topBrands,
  listBrands,
  listCategories,
  displayType,
  currentCategoryHovered,
  ...popoverProps
}: IMegaMenuProps) => {
  const { PaperProps } = popoverProps;
  const { push } = useRouter();
  const groupCharacter = [
    ...new Set(listBrands?.map((brand) => brand?.name?.charAt(0)) || []),
  ].sort();
  const groupBrand = groupCharacter.map((char) => ({
    key: char,
    list: listBrands.filter((brand) => brand?.name?.charAt(0) === char),
  }));

  const currentCategory = listCategories?.find((category) => {
    return category.slug === currentCategoryHovered;
  });

  const renderBrand = (
    <Box
      height={1}
      display="flex"
      overflow="hidden"
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      <List
        sx={{
          bgcolor: "background.paper",
          position: "relative",
          overflow: "auto",
          minWidth: 300,
          maxWidth: 500,
          height: 1,
          "& ul": { p: 0 },
        }}
        subheader={<li />}
      >
        {groupBrand.map(({ key, list }) => (
          <li key={key}>
            <ul>
              <StyledStickyListHeader>
                <Typography variant="subtitle1" color="primary">
                  <b>{key}</b>
                </Typography>
              </StyledStickyListHeader>
              {list.map(({ name, slug }) => (
                <ListItemButton sx={{ mr: 2 }} key={slug}>
                  <ListItemText
                    onClick={() => push(`/brand/${slug}`)}
                    secondary={name}
                  />
                </ListItemButton>
              ))}
            </ul>
          </li>
        ))}
      </List>
      <Box
        display="flex"
        flexWrap="wrap"
        flex={1}
        pl={2}
        maxHeight={1}
        overflow="auto"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        {topBrands.map((brand, key) => {
          return (
            <Box m={0.5} flex="1 1 200px" maxWidth={200}>
              <Button
                variant="contained"
                key={key}
                sx={{ paddingBottom: "25%", position: "relative", width: 1 }}
                onClick={() => push(brand?.url || "#")}
              >
                <GSPServerImage
                  key={brand?.desktopPhotoUrl}
                  src={brand?.desktopPhotoUrl}
                  alt={brand?.name}
                  layout="fill"
                  fallbackImage={StaticImage.FallbackImage600x300}
                  objectFit="contain"
                  objectPosition="center"
                />
              </Button>
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  const renderMenu = (
    <Box height={1} display="flex" overflow="hidden">
      <Box display="flex" width="calc(100% - 212px)" height={1} overflow="auto">
        {chunkArray(currentCategory?.taxons || [], 3)?.map((col) => {
          return (
            <Box flex={1}>
              {col.map((category) => {
                return (
                  <MenuList dense sx={{ flex: 1 }}>
                    <MenuItem
                      onClick={() => push(`/category/${category.slug}`)}
                    >
                      <Typography variant="subtitle2">
                        <b>{category.name}</b>
                      </Typography>
                    </MenuItem>
                    <MenuList dense>
                      {category?.taxons?.map((subCategory: ICategory) => (
                        <MenuItem
                          onClick={() => push(`/category/${subCategory.slug}`)}
                        >
                          <Typography variant="body2">
                            {subCategory.name}
                          </Typography>
                        </MenuItem>
                      ))}
                    </MenuList>
                  </MenuList>
                );
              })}
            </Box>
          );
        })}
      </Box>
      <Box ml={2} width={180}>
        <Box pb="150%" position="relative">
          <Image
            key={currentCategory?.menuBanner}
            src={currentCategory?.menuBanner}
            layout="fill"
            objectPosition="top center"
            objectFit="contain"
          />
        </Box>
      </Box>
    </Box>
  );

  const renderMenuObject: RenderMenuObject = {
    brand: renderBrand,
    menu: renderMenu,
    link: undefined,
  };

  return (
    <Popover
      {...popoverProps}
      PaperProps={{
        ...PaperProps,
        elevation: 1,
        sx: { height: 300, ...PaperProps.sx },
      }}
    >
      <StyledScrollbar p={2} height={1}>
        {renderMenuObject[displayType]}
      </StyledScrollbar>
    </Popover>
  );
};
