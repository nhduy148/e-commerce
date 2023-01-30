import { AuthenticationContext } from "@hera/contexts";
import { useLogout } from "@hera/data";
import { CSRPrivateRoute } from "@hera/ui";
import {
  Favorite as FavoriteIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Logout as LogoutIcon,
  Moped as MopedIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import {
  Box,
  Container,
  Grid,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  styled,
  SvgIconProps,
  Typography,
} from "@mui/material";
import {
  NesConfirmationDialog,
  NesLogo,
  NesStaticBreadcrumb,
} from "@nestle/components";
import { useBreakPoint } from "@nestle/hooks";
import {
  NesUserOrders,
  NesUserProfile,
  NesUserShippingAddress,
  NesUserWishlist,
} from "@nestle/UserSettingComponents";
import { useRouter } from "next/router";
import { ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";

const slugs = ["profile", "wishlist", "order", "address"] as const;
type Slug = typeof slugs[number];

interface IBreadcrumb {
  name: string;
  url: string;
}

type IUserContent = {
  [type in Slug]: {
    name: string;
    icon: React.ReactElement<SvgIconProps>;
    component: JSX.Element | ReactNode;
  };
};

const BreadcrumbsLink = styled(Link)`
  color: ${({ theme }) => theme.palette.text.primary};
  text-transform: uppercase;
`;

const SettingMenu = styled(List)`
  background-color: ${({ theme }) => theme.palette.common.white};
  border-radius: 10px;
  border: 1px solid;
  border-color: ${({ theme }) => theme.palette.grey.A100};
  padding: 16px;
  color: ${({ theme }) => theme.palette.text.secondary};
  box-shadow: ${({ theme }) => theme.shadows[3]};

  .MuiListItemButton-root:last-child {
    margin-bottom: 0;
  }

  .Mui-selected {
    color: ${({ theme }) => theme.palette.primary.main};

    svg {
      fill: ${({ theme }) => theme.palette.primary.main};
    }
  }
`;

const SettingMenuItem = styled(ListItemButton)`
  padding: 8px;
  border-radius: 6px;
  margin-bottom: 6px;

  :last-child() {
    margin-bottom: 0;
  }
`;

const SettingMenuPaper = styled(Paper)`
  box-shadow: ${({ theme }) => theme.shadows[3]};
`;

const breadcrumbLinks: IBreadcrumb[] = [
  {
    name: "Cá nhân",
    url: "/account",
  },
];

const AccountPage = ({ slug }) => {
  const { push } = useRouter();
  const { formatMessage } = useIntl();
  const [isLogout, setIsLogout] = useState(false);
  const { mutate } = useLogout();
  const { isLogin, onLogout } = useContext(AuthenticationContext);
  const isPC = useBreakPoint("sm");
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState<boolean>(false);

  const handleLogout = () => {
    setIsLogout(true);

    mutate(null, {
      onSuccess() {
        setIsLogout(false);
        onLogout();
      },
    });
  };

  const contents: IUserContent = {
    profile: {
      name: formatMessage({ id: "userSetting.labels.profile" }),
      icon: <PersonIcon />,
      component: <NesUserProfile />,
    },
    wishlist: {
      name: formatMessage({ id: "userSetting.labels.wishlist" }),
      icon: <FavoriteIcon />,
      component: <NesUserWishlist />,
    },
    address: {
      name: formatMessage({ id: "userSetting.labels.address" }),
      icon: <MopedIcon />,
      component: <NesUserShippingAddress />,
    },
    order: {
      name: formatMessage({ id: "userSetting.labels.order" }),
      icon: <InsertDriveFileIcon />,
      component: <NesUserOrders />,
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
          <NesLogo />
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
            <NesStaticBreadcrumb breadcrumbLinks={breadcrumbLinks} />
          </Box>
          <Typography
            sx={{
              mb: { sm: 4.75, xs: 2.5 },
            }}
            variant="h5"
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
                      <ListItemIcon sx={{ minWidth: 24, marginRight: "6px" }}>
                        {value?.icon}
                      </ListItemIcon>
                      <ListItemText>{value?.name}</ListItemText>
                    </SettingMenuItem>
                  );
                })}
                <SettingMenuItem
                  onClick={() => {
                    setLogoutModalOpen(true);
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 24,
                      marginRight: "6px",
                      color: "grey.500",
                    }}
                  >
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText sx={{ color: "grey.500" }}>
                    {formatMessage({ id: "userSetting.logout" })}
                  </ListItemText>
                </SettingMenuItem>
              </SettingMenu>
            </Grid>
            <Grid item md={9} sm={12} xs={12} sx={{ mb: 20 }}>
              <SettingMenuPaper elevation={0}>
                {contents?.[slug]?.component || <></>}
              </SettingMenuPaper>
            </Grid>
          </Grid>

          <NesConfirmationDialog
            sx={{
              ".MuiDialog-paper": {
                minWidth: isPC ? "400px" : "90%",
              },
            }}
            open={isLogoutModalOpen}
            onCancelClick={() => setLogoutModalOpen(false)}
            title={formatMessage({ id: "userSetting.logout" })}
            description={formatMessage({ id: "userSetting.logoutConfirm" })}
            onConfirmClick={handleLogout}
            isLoading={isLogout}
            confirmText={formatMessage({ id: "userSetting.logout" })}
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
