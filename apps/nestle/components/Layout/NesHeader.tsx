import * as config from "@hera/config";
import { AuthenticationContext } from "@hera/contexts";
import {
  IBrand,
  ICategory,
  IMenu,
  ISearchKeyword,
  ITopBrands,
  useLogout,
  useSearchKeywordsQuery,
} from "@hera/data";
import { useToggleOpenTawkTo } from "@hera/hooks";
import { useFormatter } from "@hera/i18n";
import { ElevationScroll } from "@hera/ui";
import {
  Logout as LogoutIcon,
  PersonOutline as PersonOutlineIcon,
  ReceiptLong as ReceiptLongIcon,
  Search as SearchIcon,
  ShoppingCartOutlined as ShoppingCartIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Autocomplete,
  Badge,
  Box,
  Button,
  CircularProgress,
  Container,
  debounce,
  ListItemButton,
  Popover,
  Stack,
  styled,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import {
  NesAuthenControlModal,
  NesIconButton,
  NesLogo,
} from "@nestle/components";
import { useBreakPoint, useCart } from "@nestle/hooks";
import { AuthenticationModal } from "@nestle/types";
import { useRouter } from "next/router";
import React, {
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";
import { NesContactButton } from "./NesContactButton";
import { NesDesktopMenu } from "./NesDesktopMenu";
import { INesLayoutProps } from "./NesLayout";
import { NesMobileMenu } from "./NesMobileMenu";
import { NesShoppingCart } from "./NesShoppingCart";
interface IHeaderProps extends Omit<INesLayoutProps, "children"> {
  window?: () => Window;
  menu?: IMenu[];
  isLoading: boolean;
  topBrands: ITopBrands[];
  listBrands: IBrand[];
  listCategories: ICategory[];
}

const SyledBoxUser = styled(Box)`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.palette.grey[100]};
  }
`;

const NesHeaderComponent = forwardRef<HTMLDivElement, IHeaderProps>(
  ({ menu, isLoading, topBrands, listBrands, listCategories }, ref: any) => {
    const { palette } = useTheme();
    const { __ } = useFormatter();
    const router = useRouter();
    const isPC = useBreakPoint("md");
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [modal, setModal] = useState<AuthenticationModal>("login");
    const { data: cartData, refetch: refetchShoppingCart } = useCart();
    const { formatMessage } = useIntl();
    const [isShoppingCartOpened, setOpenShoppingCart] =
      useState<boolean>(false);
    const [mobileMenuOpened, setOpenMobileMenu] = useState<boolean>(false);
    const [searchTerms, setSearchTerms] = useState<string>("");
    const [isOpen, setOpen] = useState<boolean>(false);
    const { data: searchResults = [], isFetching } = useSearchKeywordsQuery({
      searchTerms,
    });
    useToggleOpenTawkTo(mobileMenuOpened || openModal || isShoppingCartOpened);
    const { onLogout, isLogin } = useContext(AuthenticationContext);
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

    const { mutate } = useLogout();

    const handleGoToRegister = (e: Event) => {
      e.preventDefault();
      setModal("register");
    };
    const handleGoToForgotPassword = (e: Event) => {
      e.preventDefault();
      setModal("forgotPassword");
    };
    const handleBackToLogin = () => setModal("login");

    const handleAuthenticationOpen = () => {
      setOpenModal(true);
    };

    const handleAuthenticationClose = () => {
      setOpenModal(false);
      setModal("login");
    };
    // DropDown UserInfo
    const [userDropdownPosition, setUserDropdownPosition] =
      useState<HTMLButtonElement | null>(null);

    const handleUserDropDownClick = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      setUserDropdownPosition(event.currentTarget);
    };

    const handleUserDropDownClose = () => {
      setUserDropdownPosition(null);
    };

    const handleLogout = () => {
      mutate(null, {
        onSuccess() {
          onLogout();
          localStorage?.removeItem(config.env.authKey);
          localStorage?.removeItem(config.env.shoppingCartKey);
          refetchShoppingCart();
          handleUserDropDownClose();
        },
      });
    };

    const disableCart = router.asPath.includes("checkout");

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
              defaultMessage: "Bạn đang muốn tìm sản phẩm nào?",
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
                borderRadius: "100px",
                overflow: "hidden",
                position: "relative",
                padding: "8px 56px 8px 8px !important",
                bgcolor: "common.white",
              },
              endAdornment: (
                <>
                  {isFetching && (
                    <CircularProgress
                      color="inherit"
                      size={20}
                      sx={{ mx: 2 }}
                    />
                  )}
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      borderRadius: "0 100px 100px 0",
                      minWidth: 56,
                      px: 2,
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: "auto",
                    }}
                    onClick={() => onSearchItemClick(searchTerms)}
                  >
                    <SearchIcon />
                  </Button>
                </>
              ),
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

    const renderNavActions = (
      <Stack sx={{ display: "flex", ml: 2 }} direction="row">
        {isPC && (
          <>
            <NesIconButton
              onClick={
                isLogin ? handleUserDropDownClick : handleAuthenticationOpen
              }
              iconName={isLogin ? "person" : "person_outline"}
              color="inherit"
              iconColor="primary"
            />
          </>
        )}
        <NesIconButton
          onClick={
            disableCart
              ? (e) => e.preventDefault()
              : () => setOpenShoppingCart(true)
          }
          iconColor="primary"
          disabled={disableCart}
        >
          <Badge
            color="primary"
            badgeContent={cartData?.itemCount ?? 0}
            showZero
          >
            <ShoppingCartIcon color="primary" fontSize="inherit" />
          </Badge>
        </NesIconButton>
      </Stack>
    );

    return (
      <>
        <ElevationScroll>
          <AppBar
            color="inherit"
            ref={ref}
            sx={{
              backgroundColor: palette.custom.primaryBackground,
            }}
          >
            <Toolbar
              variant="dense"
              sx={{
                borderBottom: {
                  sm: "none",
                  xs: `1px solid ${palette.custom.secondaryBorder}`,
                },
                px: { xs: 0, sm: 0 },
              }}
            >
              <Box width={1}>
                <Container maxWidth="lg">
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                    py={1}
                  >
                    {!isPC && (
                      <NesIconButton
                        iconName="menu"
                        onClick={() => setOpenMobileMenu(true)}
                      />
                    )}
                    <Box
                      flex={!isPC ? "1 1 121px" : "1 1 100%"}
                      maxWidth={!isPC ? 121 : 179}
                      sx={
                        isPC
                          ? {}
                          : { display: "flex", justifyContent: "center" }
                      }
                    >
                      <NesLogo clickable full />
                    </Box>
                    {isPC && (
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flex="0 1 100%"
                        px={3}
                      >
                        {renderSearchField}
                      </Box>
                    )}
                    {!isPC ? renderNavActions : <NesContactButton />}
                  </Box>
                </Container>
                {isPC ? (
                  <Box
                    borderTop={`1px solid ${palette.custom.secondaryBorder}`}
                    borderBottom={`1px solid ${palette.custom.secondaryBorder}`}
                  >
                    <Container maxWidth="lg">
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        py={1.5}
                      >
                        <Box flex="0 1 auto">
                          <NesDesktopMenu
                            listCategories={listCategories}
                            listBrands={listBrands}
                            isLoading={isLoading}
                            menu={menu}
                          />
                        </Box>
                        {renderNavActions}
                      </Box>
                    </Container>
                  </Box>
                ) : (
                  <NesMobileMenu
                    open={mobileMenuOpened}
                    menu={menu}
                    listCategories={listCategories}
                    listBrands={listBrands}
                    onLoginButtonClick={handleAuthenticationOpen}
                    onClose={() => setOpenMobileMenu(false)}
                  />
                )}
              </Box>
            </Toolbar>
          </AppBar>
        </ElevationScroll>

        <NesAuthenControlModal
          onOpen={handleAuthenticationOpen}
          onClose={handleAuthenticationClose}
          modal={modal}
          onGoToRegister={handleGoToRegister}
          onGoToForgotPassword={handleGoToForgotPassword}
          onBackToLogin={handleBackToLogin}
          isOpen={openModal}
        />

        <NesShoppingCart
          open={isShoppingCartOpened}
          onClose={() => setOpenShoppingCart(false)}
        />

        <Popover
          id={userDropdownPosition ? "simple-popover" : undefined}
          open={userDropdownPosition ? true : false}
          anchorEl={userDropdownPosition}
          onClose={handleUserDropDownClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          disableScrollLock
          PaperProps={{
            sx: {
              boxShadow: "0px 6px 32px rgba(34, 34, 34, 0.08)",
              border: "1px solid",
              borderColor: palette.custom.secondaryBorder,
            },
          }}
        >
          <Box
            sx={{
              backgroundColor: palette.custom.secondaryBackground,
            }}
          >
            <Box>
              <SyledBoxUser onClick={() => router.push("/account/profile")}>
                <PersonOutlineIcon fontSize="small" />
                <Typography ml={1.5} variant="subtitle2">
                  {formatMessage({ id: "header.userProfile" })}
                </Typography>
              </SyledBoxUser>
              <SyledBoxUser onClick={() => router.push("/account/order")}>
                <ReceiptLongIcon fontSize="small" />
                <Typography ml={1.5} variant="subtitle2">
                  {formatMessage({ id: "header.order" })}
                </Typography>
              </SyledBoxUser>
            </Box>
            <Box>
              <Box
                px={2}
                sx={{
                  "::before": {
                    content: `""`,
                    display: "block",
                    height: "1px",
                    borderBottom: "1px solid",
                    borderColor: palette.custom.secondaryBorder,
                  },
                }}
              ></Box>
              <SyledBoxUser onClick={handleLogout}>
                <LogoutIcon fontSize="small" color="error" />
                <Typography ml={1.5} variant="subtitle2" color="error">
                  {formatMessage({ id: "header.logout" })}
                </Typography>
              </SyledBoxUser>
            </Box>
          </Box>
        </Popover>
      </>
    );
  },
);

NesHeaderComponent.defaultProps = {
  isLoading: false,
};

NesHeaderComponent.displayName = "LcHeader";

export const NesHeader = memo(NesHeaderComponent, isEqual);
