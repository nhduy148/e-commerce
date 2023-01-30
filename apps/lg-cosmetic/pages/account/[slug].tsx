import { AuthenticationContext } from "@hera/contexts";
import { CSRPrivateRoute } from "@hera/ui";
import { LcLogo } from "@lc/components";
import {
  LcUserLogout,
  LcUserLoyalty,
  LcUserOrders,
  LcUserProfile,
  LcUserShippingAddress,
  LcUserWishlist,
} from "@lc/UserSettingComponents";
import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  Link,
  List,
  ListItemButton,
  styled,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";

const BreadcrumbsLink = styled(Link)`
  color: ${({ theme }) => theme.palette.text.primary};
  text-transform: uppercase;
`;

const SettingMenu = styled(List)`
  background-color: ${({ theme }) => theme.palette.common.white};
  box-shadow: ${({ theme }) => theme.shadows[3]};

  .Mui-selected {
    border-left: 3px solid ${({ theme }) => theme.palette.primary.main};
  }
`;

const SettingMenuItem = styled(ListItemButton)`
  padding: 16px;
`;

const slugs = ["profile", "wishlist", "order", "address", "loyalty"] as const;
type Slug = typeof slugs[number];

interface IBreadcrumbs {
  name: string;
  url: string;
}
type IUserContent = {
  [type in Slug]: {
    name: string;
    component: JSX.Element | ReactNode;
  };
};

const breadcrumbLinks: IBreadcrumbs[] = [
  {
    name: "Trang chủ",
    url: "/",
  },
  {
    name: "Cá nhân",
    url: "/account",
  },
];

const AccountPage = ({ slug }) => {
  const { push } = useRouter();
  const { formatMessage } = useIntl();
  const { isLogin } = useContext(AuthenticationContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState<boolean>(false);

  const contents: IUserContent = {
    profile: {
      name: formatMessage({ id: "userSetting.labels.profile" }),
      component: <LcUserProfile />,
    },
    wishlist: {
      name: formatMessage({ id: "userSetting.labels.wishlist" }),
      component: <LcUserWishlist />,
    },
    loyalty: {
      name: formatMessage({ id: "userSetting.labels.loyalty" }),
      component: <LcUserLoyalty />,
    },
    address: {
      name: formatMessage({ id: "userSetting.labels.address" }),
      component: <LcUserShippingAddress />,
    },
    order: {
      name: formatMessage({ id: "userSetting.labels.order" }),
      component: <LcUserOrders />,
    },
  };

  const handleCloseModal = () => {
    setLogoutModalOpen(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);

  const loadingComponent = useMemo(
    () => (
      <Box
        width={1}
        height={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Box mb={2}>
          <LcLogo color="gray" />
        </Box>
        <Typography variant="subtitle1">
          {formatMessage({
            id: "common.authenticatingYourAccount",
            defaultMessage: "Đang xác thực thông tin người dùng...",
          })}
        </Typography>
      </Box>
    ),
    [],
  );

  return (
    <CSRPrivateRoute loadingComponent={loadingComponent} isLoading={isLoading}>
      <Container>
        <Box mt={2.75}>
          <Box mb={4}>
            <Breadcrumbs
              aria-label="breadcrumb"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              {breadcrumbLinks.map((link, key) => (
                <BreadcrumbsLink
                  href={link.url}
                  underline="hover"
                  variant="overline"
                  key={key}
                >
                  {link.name}
                </BreadcrumbsLink>
              ))}
            </Breadcrumbs>
          </Box>
          <Typography
            textTransform="uppercase"
            sx={{
              mb: { sm: 4.75, xs: 2.5 },
              typography: { xs: "h5", sm: "h4" },
            }}
          >
            {formatMessage({ id: "userSetting.userInfo" })}
          </Typography>
          <Grid container spacing={3}>
            <Grid item md={3} sm={12} xs={12}>
              <SettingMenu disablePadding>
                {Object.entries(contents).map(([key, value]) => {
                  return (
                    <SettingMenuItem
                      key={key}
                      onClick={() => {
                        push(`/account/${key}`);
                      }}
                      selected={key === slug}
                    >
                      {value?.name}
                    </SettingMenuItem>
                  );
                })}
                <SettingMenuItem
                  onClick={() => {
                    setLogoutModalOpen(true);
                  }}
                >
                  {formatMessage({ id: "userSetting.logout" })}
                </SettingMenuItem>
              </SettingMenu>
            </Grid>
            <Grid item md={9} sm={12} xs={12} sx={{ mb: 20 }}>
              <Box>{contents?.[slug]?.component || <></>}</Box>
            </Grid>
          </Grid>
          <LcUserLogout
            open={isLogoutModalOpen}
            closeModal={handleCloseModal}
          />
        </Box>
      </Container>
    </CSRPrivateRoute>
  );
};

export const getStaticPaths = async () => {
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  return {
    props: {
      slug: params.slug,
    },
  };
};

export default AccountPage;
