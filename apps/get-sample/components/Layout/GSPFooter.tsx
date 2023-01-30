import { GSPLogo, GSPStaticImage } from "@gsp/components";
import { useFormatter } from "@hera/i18n";
import {
  Email as EmailIcon,
  PhoneInTalk as PhoneInTalkIcon,
} from "@mui/icons-material";
import {
  Box,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import NextLink from "next/link";
import { FC, memo } from "react";
import isEqual from "react-fast-compare";

const GSPFooterComponent: FC = () => {
  const { __ } = useFormatter();
  const theme = useTheme();

  const aboutLinks = [
    { name: `${__({ defaultMessage: "Giới thiệu" })}`, url: "/about-us" },

    { name: `${__({ defaultMessage: "Quy định sử dụng" })}`, url: "/#" },
    {
      name: `${__({ defaultMessage: "Chính sách bảo mật" })}`,
      url: "/#",
    },

    {
      name: `${__({ defaultMessage: "Liên hệ" })}`,
      url: "/#",
    },
  ];

  const customerServiceLinks = [
    {
      name: `${__({ defaultMessage: "Các câu hỏi thường gặp" })}`,
      url: "/#",
    },

    {
      name: `${__({ defaultMessage: "Hướng dẫn sử dụng" })}`,
      url: "/#",
    },
    {
      name: `${__({ defaultMessage: "Khiếu nại/đổi trả" })}`,
      url: "/#",
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        paddingTop: 8.75,
        backgroundColor: theme.palette.text.primary,
        color: theme.palette.common.white,
      }}
    >
      <Container maxWidth="lg" sx={{ marginBottom: 3.75 }}>
        <Grid container spacing={1}>
          <Grid item lg={3} md={3} sm={12} xs={12} py={3}>
            <Stack spacing={2.5}>
              <GSPLogo isWhite clickable />
              <Typography variant="body1">
                {__({
                  defaultMessage:
                    "27B Nguyen Dinh Chieu St., Da Kao Ward, District 1, HCMC",
                })}
              </Typography>
              <Link color="inherit" underline="none" href="tel:028 7305 6686">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PhoneInTalkIcon
                    sx={{ marginRight: 1, color: theme.palette.secondary.main }}
                  />
                  <Typography variant="body1">(+84) 028 7305 6686 </Typography>
                </Box>
              </Link>
              <Box sx={{ display: "flex" }}>
                <EmailIcon
                  sx={{ marginRight: 1, color: theme.palette.secondary.main }}
                />
                <Box>
                  <Link
                    color="inherit"
                    underline="none"
                    href="mailto:contact@onpoint.vn"
                  >
                    <Typography variant="body1">contact@onpoint.vn</Typography>
                  </Link>
                  <Link
                    color="inherit"
                    underline="none"
                    href="mailto:sales@onpoint.vn"
                  >
                    <Typography variant="body1">sales@onpoint.vn</Typography>
                  </Link>
                </Box>
              </Box>
            </Stack>
          </Grid>

          <Grid item lg={3} md={2} sm={4} xs={12} py={3}>
            <Typography variant="h6" sx={{ mb: 2.5 }}>
              {__({ defaultMessage: "Về chúng tôi" })}
            </Typography>
            <Stack spacing={2}>
              {aboutLinks.map((link, index) => (
                <Box key={index} sx={{ cursor: "pointer" }}>
                  <NextLink href={link.url} key={index}>
                    <Link variant="body2" color="inherit" underline="none">
                      {link.name}
                    </Link>
                  </NextLink>
                </Box>
              ))}
            </Stack>
          </Grid>

          <Grid item lg={3} md={3} sm={12} xs={12} py={3}>
            <Typography variant="h6" sx={{ mb: 2.5 }}>
              {__({ defaultMessage: "Hỗ trợ khách hàng" })}
            </Typography>
            <Stack spacing={2}>
              {customerServiceLinks.map((link, index) => (
                <Box key={index} sx={{ cursor: "pointer" }}>
                  <NextLink href={link.url} key={index}>
                    <Link variant="body2" color="inherit" underline="none">
                      {link.name}
                    </Link>
                  </NextLink>
                </Box>
              ))}
            </Stack>
          </Grid>

          <Grid item lg={3}>
            <Typography variant="h6" sx={{ mb: 2.5 }}>
              {__({ defaultMessage: "Liên kết" })}
            </Typography>
            <Stack spacing={2} direction="row" mb={3}>
              <Link href="#">
                <GSPStaticImage
                  src="FacebookIcon"
                  alt="Facebook"
                  width={48}
                  height={48}
                />
              </Link>

              <Link href="#">
                <GSPStaticImage
                  src="LinkedinIcon"
                  alt="Linkedin"
                  width={48}
                  height={48}
                />
              </Link>
            </Stack>

            <GSPStaticImage
              src="MOIT"
              alt="Ministry of Industry and Trade"
              width={185}
              height={70}
            />
          </Grid>
        </Grid>
      </Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Typography variant="body2" color={theme.palette.grey[300]}>
          {__({
            defaultMessage: "OnPoint © 2022. All Rights Reserved.",
          })}
        </Typography>
      </Box>
    </Box>
  );
};

export const GSPFooter = memo(GSPFooterComponent, isEqual);
