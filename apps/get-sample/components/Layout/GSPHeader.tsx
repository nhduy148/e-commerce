import { GSPIconButton, GSPLogo } from "@gsp/components";
import { useBreakPoint } from "@gsp/hooks";
import {
  IBrand,
  ICategory,
  IMenu,
  ISearchKeyword,
  ITopBrands,
  useSearchKeywordsQuery,
} from "@hera/data";
import { useToggleOpenTawkTo } from "@hera/hooks";
import { useFormatter } from "@hera/i18n";
import { ElevationScroll } from "@hera/ui";
import { Search as SearchIcon } from "@mui/icons-material";
import {
  AppBar,
  Autocomplete,
  Box,
  CircularProgress,
  Container,
  debounce,
  ListItemButton,
  Stack,
  TextField,
  Toolbar,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { forwardRef, memo, useCallback, useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import { GSPDesktopMenu } from "./GSPDesktopMenu";
import { IGSPLayoutProps } from "./GSPLayout";
import { GSPMobileMenu } from "./GSPMobileMenu";

interface IHeaderProps extends Omit<IGSPLayoutProps, "children"> {
  window?: () => Window;
  menu?: IMenu[];
  isLoading: boolean;
  topBrands: ITopBrands[];
  listBrands: IBrand[];
  listCategories: ICategory[];
}

const GSPHeaderComponent = forwardRef<HTMLDivElement, IHeaderProps>(
  ({ menu, isLoading, topBrands, listBrands, listCategories }, ref: any) => {
    const { palette } = useTheme();
    const { __ } = useFormatter();
    const router = useRouter();
    const isPC = useBreakPoint("md");
    const [mobileMenuOpened, setOpenMobileMenu] = useState<boolean>(false);
    const [searchTerms, setSearchTerms] = useState<string>("");
    const [isOpen, setOpen] = useState<boolean>(false);
    const { data: searchResults = [], isFetching } = useSearchKeywordsQuery({
      searchTerms,
    });
    useToggleOpenTawkTo(mobileMenuOpened);
    const onSearchTermChange = useCallback(
      debounce((e) => setSearchTerms(e.target.value), 1000),
      [],
    );

    const onSearchItemClick = (keyword?: string) => {
      if (keyword) {
        router.push(`/search?q=${keyword}`);
      }
      setSearchTerms(keyword);
      (document.activeElement as HTMLElement).blur();
    };

    useEffect(() => {
      if (isPC) {
        setOpenMobileMenu(false);
      }
    }, [isPC]);

    const renderSearchField = (
      <Autocomplete
        open={isOpen}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        fullWidth
        disableClearable
        value={searchTerms}
        clearOnBlur={false}
        filterOptions={(x) => x}
        getOptionLabel={(option: ISearchKeyword) =>
          option?.keyword ?? searchTerms
        }
        options={searchResults}
        loading={isFetching}
        sx={{
          maxWidth: 343,
          ml: "auto",
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            autoFocus
            variant="outlined"
            size="small"
            placeholder={__({
              defaultMessage: "Tìm kiếm",
            })}
            onChange={onSearchTermChange}
            onKeyUp={(e) => {
              if (e.code === "Enter") {
                // @ts-ignore
                onSearchItemClick(e.target.value);
              }
            }}
            InputProps={{
              ...params.InputProps,
              sx: {
                borderRadius: 1,
                overflow: "hidden",
                position: "relative",
                bgcolor: "common.white",
              },
              endAdornment: isFetching && (
                <CircularProgress color="inherit" size={20} sx={{ mx: 2 }} />
              ),
              startAdornment: <SearchIcon color="action" />,
            }}
          />
        )}
        openOnFocus={false}
        renderOption={(props) => (
          <ListItemButton
            key={props.id}
            // @ts-ignore
            onClick={() => onSearchItemClick(props.key)}
          >
            {/* @ts-ignore */}
            {props.key}
          </ListItemButton>
        )}
        noOptionsText={__({
          defaultMessage: "Không có kết quả",
        })}
        loadingText={__({
          defaultMessage: "Đang tải...",
        })}
      />
    );

    return (
      <ElevationScroll>
        <AppBar color="inherit" ref={ref}>
          <Toolbar
            variant="dense"
            sx={{
              borderBottom: {
                sm: "none",
                xs: `1px solid ${palette.grey[300]}`,
              },
              px: { xs: 0, sm: 0 },
            }}
          >
            <Box width={1}>
              <Container maxWidth="lg">
                <Stack
                  spacing={3}
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                  py={2}
                  direction="row"
                >
                  <Box>
                    <GSPLogo clickable />
                  </Box>
                  {isPC ? (
                    <Box
                      flex="0 1 auto"
                      maxWidth="calc( 100% - (65px + 24px + 24px + 220px))"
                    >
                      <GSPDesktopMenu
                        listCategories={listCategories}
                        listBrands={listBrands}
                        isLoading={isLoading}
                        menu={menu}
                      />
                    </Box>
                  ) : (
                    <GSPMobileMenu
                      open={mobileMenuOpened}
                      menu={menu}
                      listCategories={listCategories}
                      listBrands={listBrands}
                      onClose={() => setOpenMobileMenu(false)}
                    />
                  )}
                  {isPC ? (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      flex="1 1 220px"
                    >
                      {renderSearchField}
                    </Box>
                  ) : (
                    <GSPIconButton
                      iconName="menu"
                      onClick={() => setOpenMobileMenu(true)}
                    />
                  )}
                </Stack>
              </Container>
            </Box>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
    );
  },
);

GSPHeaderComponent.defaultProps = {
  isLoading: false,
};

GSPHeaderComponent.displayName = "LcHeader";

export const GSPHeader = memo(GSPHeaderComponent, isEqual);
