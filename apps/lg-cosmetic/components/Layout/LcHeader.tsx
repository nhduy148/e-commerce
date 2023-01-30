import { AuthenticationContext } from "@hera/contexts";
import {
  IBrand,
  ICategory,
  IMenu,
  ISearchKeyword,
  ITopBrands,
  useLogout,
  useSearchKeywordsQuery,
  useUserWishlist,
} from "@hera/data";
import { useToggleOpenTawkTo } from "@hera/hooks";
import { LcAuthenControlModal, LcIconButton, LcLogo } from "@lc/components";
import { useBreakPoint, useCart } from "@lc/hooks";
import { gtmEvent } from "@lc/libs";
import { AuthenticationModal } from "@lc/types";
import {
  CardGiftcard as CardGiftcardIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Logout as LogoutIcon,
  PersonOutline as PersonOutlineIcon,
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
  Modal,
  Popover,
  Slide,
  styled,
  TextField,
  Toolbar,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
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
import { LcDesktopMenu } from "./LcDesktopMenu";
import { LcMobileMenu } from "./LcMobileMenu";
import { LcShoppingCart } from "./LcShoppingCart";
interface IHeaderProps {
  window?: () => Window;
  menu?: IMenu[];
  isLoading: boolean;
  topBannerComponent: JSX.Element | null;
  topBrands: ITopBrands[];
  listBrands: IBrand[];
  listCategories: ICategory[];
  hasTopBanner?: boolean;
}

const SyledBoxUser = styled(Box)`
  display: flex;
  align-items: center;
  padding: 8px 8px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.palette.grey[100]};
  }
`;

const LcHeaderComponent = forwardRef<HTMLDivElement, IHeaderProps>(
  (
    {
      hasTopBanner,
      topBannerComponent,
      window,
      menu,
      isLoading,
      topBrands,
      listBrands,
      listCategories,
    },
    ref: any,
  ) => {
    const isPC = useBreakPoint("sm");
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [modal, setModal] = useState<AuthenticationModal>("login");
    const { data: cartData, refetch: refetchShoppingCart } = useCart();
    const { formatMessage } = useIntl();
    const [isShoppingCartOpened, setOpenShoppingCart] =
      useState<boolean>(false);
    const { isLogin, onLogout } = useContext(AuthenticationContext);
    const router = useRouter();
    const [mobileMenuOpened, setOpenMobileMenu] = useState<boolean>(false);

    const { data: wishlistData } = useUserWishlist(isLogin);
    const [searchTerms, setSearchTerms] = useState<string>("");
    const [isSearchOpen, setOpenSearch] = useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();

    const [isMobileSearchModalOpen, setOpenMobileSearchModal] =
      useState<boolean>(false);
    const { data: searchResults = [], isFetching } = useSearchKeywordsQuery({
      searchTerms,
    });
    useToggleOpenTawkTo(
      isMobileSearchModalOpen ||
        mobileMenuOpened ||
        openModal ||
        isShoppingCartOpened,
    );

    const onSearchTermChange = useCallback(
      debounce((e) => setSearchTerms(e.target.value), 1000),
      [],
    );

    const onSearchItemClick = (keyword?: string) => {
      if (keyword) {
        setSearchTerms(keyword);
        router.push(`/search?q=${keyword}`);
      }
      setOpenMobileSearchModal(false);
      (document.activeElement as HTMLElement).blur();
    };

    useEffect(() => {
      if (isPC) {
        setOpenMobileMenu(false);
      }
    }, [isPC]);

    useEffect(() => {
      if (!hasTopBanner) {
        ref.current.style.transform = null;
      }
    }, [hasTopBanner]);

    const { mutate } = useLogout();

    const scrollTrigger = useScrollTrigger({
      disableHysteresis: true,
      threshold: ref?.current?.clientHeight || 0,
      target: window ? window() : undefined,
    });

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
          enqueueSnackbar(
            formatMessage({ id: "authentication.logoutSuccess" }),
            {
              variant: "success",
            },
          );
          onLogout(() => {
            setTimeout(() => {
              location.href = "/";
            }, 1000);
          });
        },
      });
    };

    const disableCart = router.asPath.includes("checkout");
    const handleOpenCart = () => {
      setOpenShoppingCart(true);
      gtmEvent("view_cart", cartData?.lineItems || []);
    };

    const renderSearchField = (
      <Autocomplete
        open={isSearchOpen}
        onOpen={() => setOpenSearch(true)}
        onClose={() => setOpenSearch(false)}
        disableClearable
        value={searchTerms}
        clearOnBlur={false}
        filterOptions={(x) => x}
        getOptionLabel={(option: ISearchKeyword) =>
          option?.keyword ?? searchTerms
        }
        options={searchResults}
        loading={isFetching}
        fullWidth
        renderInput={(params) => (
          <TextField
            {...params}
            autoFocus
            variant="outlined"
            size="small"
            placeholder={formatMessage({ id: "common.searchPlaceholder" })}
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
                borderRadius: "3px",
                overflow: "hidden",
                position: "relative",
                padding: "8px 56px 8px 8px !important",
                border: "1px solid",
                borderColor: "primary.main",
                maxWidth: 600,
                m: "auto",
                "> fieldset": {
                  border: 0,
                },
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
                      borderRadius: "0 3px 3px 0",
                      minWidth: 56,
                      px: 2,
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: "unset",
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
        noOptionsText={formatMessage({ id: "common.noOptionsText" })}
        loadingText={formatMessage({ id: "common.loadingText" })}
      />
    );

    const renderNavActions = (
      <Box display="flex" justifyContent="flex-end" alignItems="center">
        {!isPC && (
          <LcIconButton
            color="inherit"
            iconName="search"
            onClick={() => setOpenMobileSearchModal(true)}
            sx={{ padding: { sm: 1, xs: 0.25 } }}
          />
        )}
        {isLogin && (
          <LcIconButton
            color="inherit"
            sx={{
              padding: { sm: 1, xs: 0.25 },
              pr: { xs: wishlistData?.paginate?.total > 99 ? 2 : 1, sm: 1 },
            }}
          >
            <Badge
              color="primary"
              badgeContent={wishlistData?.paginate?.total ?? 0}
              showZero
              onClick={() => {
                router.push("/account/wishlist");
              }}
            >
              <FavoriteBorderIcon color="inherit" fontSize="inherit" />
            </Badge>
          </LcIconButton>
        )}
        <LcIconButton
          onClick={disableCart ? (e) => e.preventDefault() : handleOpenCart}
          color="inherit"
          disabled={disableCart}
          sx={{
            padding: { sm: 1, xs: 0.25 },
            pr: { xs: cartData?.itemCount > 99 ? 1 : 0.75, sm: 1 },
          }}
        >
          <Badge
            color="primary"
            badgeContent={cartData?.itemCount ?? 0}
            showZero
          >
            <ShoppingCartIcon color="inherit" fontSize="inherit" />
          </Badge>
        </LcIconButton>
        {isPC && (
          <LcIconButton
            iconName={isLogin ? "person" : "person_outline"}
            onClick={
              isLogin ? handleUserDropDownClick : handleAuthenticationOpen
            }
            color="inherit"
          />
        )}
      </Box>
    );

    return (
      <>
        <AppBar
          color="inherit"
          ref={ref}
          sx={{
            transition: "all 300ms",
            boxShadow: "inset 0px -1px 0px #ededed",
          }}
        >
          {hasTopBanner && (
            <Slide
              in={!scrollTrigger}
              appear={false}
              direction="down"
              onEnter={(e) => {
                ref.current.style.transform = `translateY(0)`;
              }}
              onExit={(e) => {
                ref.current.style.transform = `translateY(-${e.clientHeight}px)`;
              }}
            >
              <Box>{topBannerComponent}</Box>
            </Slide>
          )}
          <Toolbar variant="dense" sx={{ px: { sm: 3, xs: 1 } }}>
            <Container maxWidth="lg" sx={{ px: { xs: 0, lg: 2 } }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
                py={{ xs: 1, sm: 2 }}
              >
                {!isPC && (
                  <Box minWidth={56}>
                    <LcIconButton
                      iconName="menu"
                      onClick={() => setOpenMobileMenu(true)}
                      sx={{ padding: 0.25 }}
                    />
                  </Box>
                )}
                <Box maxWidth={isPC ? "100%" : 160}>
                  <LcLogo
                    clickable
                    color="gray"
                    width={isPC ? 265 : 170}
                    height={isPC ? 29 : 19}
                  />
                </Box>
                {isPC ? (
                  <Box flex={1} px={5}>
                    {renderSearchField}
                  </Box>
                ) : (
                  <Modal
                    open={isMobileSearchModalOpen}
                    onClose={() => setOpenMobileSearchModal(false)}
                  >
                    <Slide in={isMobileSearchModalOpen}>
                      <Box
                        sx={{ backgroundColor: "common.white", px: 2, py: 1 }}
                      >
                        {renderSearchField}
                      </Box>
                    </Slide>
                  </Modal>
                )}
                {renderNavActions}
              </Box>
              {isPC ? (
                <LcDesktopMenu
                  isLoading={isLoading}
                  menu={menu}
                  topBrands={topBrands}
                  listBrands={listBrands}
                  listCategories={listCategories}
                />
              ) : (
                <LcMobileMenu
                  open={mobileMenuOpened}
                  menu={menu}
                  topBrands={topBrands}
                  listBrands={listBrands}
                  listCategories={listCategories}
                  onClose={() => setOpenMobileMenu(false)}
                  onLoginButtonClick={handleAuthenticationOpen}
                />
              )}
            </Container>
          </Toolbar>
        </AppBar>

        <LcAuthenControlModal
          onOpen={handleAuthenticationOpen}
          onClose={handleAuthenticationClose}
          modal={modal}
          onGoToRegister={handleGoToRegister}
          onGoToForgotPassword={handleGoToForgotPassword}
          onBackToLogin={handleBackToLogin}
          isOpen={openModal}
        />

        <LcShoppingCart
          open={isShoppingCartOpened}
          onClose={() => setOpenShoppingCart(false)}
        />

        <Popover
          disableScrollLock
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
        >
          <Box>
            <Box borderBottom="1px solid" borderColor="grey.400">
              <SyledBoxUser
                onClick={() => {
                  handleUserDropDownClose();
                  router.push("/account/profile");
                }}
              >
                <PersonOutlineIcon fontSize="small" />
                <Typography ml={1.5} variant="subtitle2">
                  {formatMessage({ id: "header.userProfile" })}
                </Typography>
              </SyledBoxUser>
              <SyledBoxUser
                onClick={() => {
                  handleUserDropDownClose();
                  router.push("/account/order");
                }}
              >
                <CardGiftcardIcon fontSize="small" />
                <Typography ml={1.5} variant="subtitle2">
                  {formatMessage({ id: "header.order" })}
                </Typography>
              </SyledBoxUser>
            </Box>
            <Box>
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

LcHeaderComponent.defaultProps = {
  isLoading: false,
};

export const LcHeader = memo(LcHeaderComponent, isEqual);
