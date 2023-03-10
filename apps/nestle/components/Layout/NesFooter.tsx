import { useFormatter } from "@hera/i18n";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import {
  Box,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { CONTACT_INFORMATION } from "@nestle/constants";
import {
  FooterCash,
  FooterMastercard,
  FooterMobilePay,
  FooterVisaPay,
  MOIT,
} from "@nestle/static/images";
import Image from "next/image";
import { FunctionComponent, memo } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";
import { NesLogo } from "../NesLogo";

const Wrapper = styled("div")`
  background-color: ${({ theme }) => theme.palette.custom.footerBackground};
`;
const BottomWrapper = styled("div")`
  background-color: ${({ theme }) => theme.palette.text.primary};
`;

const ContentWrapper = styled(Wrapper)`
  border-top: 1px solid ${({ theme }) => theme.palette.custom.primaryBorder};
  padding-top: 26.5px;
`;

const NesFooterComponent: FunctionComponent = () => {
  const { __ } = useFormatter();
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const infoLinks = [
    { name: `${formatMessage({ id: "footer.aboutUs" })}`, url: "/about" },

    { name: `${formatMessage({ id: "footer.terms" })}`, url: "/terms" },
    {
      name: `${formatMessage({ id: "footer.returnPolicy" })}`,
      url: "/return-policy",
    },
    {
      name: `${formatMessage({ id: "footer.securityPolicy" })}`,
      url: "/security-policy",
    },
    {
      name: `${formatMessage({ id: "footer.userGuide" })}`,
      url: "/user-guide",
    },
  ];

  return (
    <Box component="footer">
      <ContentWrapper>
        <Container maxWidth="lg">
          <Grid container spacing={1}>
            <Grid item lg={6} md={6} sm={12} xs={12} py={3}>
              <Box mb={{ md: 4, xs: 2 }}>
                <NesLogo clickable />
              </Box>
              <Typography variant="body2" gutterBottom>
                {__({
                  defaultMessage: "C??ng ty TNHH Nestl?? Vi???t Nam",
                })}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {CONTACT_INFORMATION.address}
              </Typography>
              {/* <Typography variant="body2" gutterBottom>
                {__({ defaultMessage: "Email h??? tr???: " })}{" "}
                <Link
                  underline="none"
                  href={`mailto:${CONTACT_INFORMATION.email}`}
                  target="_blank"
                >
                  {CONTACT_INFORMATION.email}
                </Link>
              </Typography> */}
              <Typography variant="body2" gutterBottom>
                {__({
                  defaultMessage:
                    "S??? gi???y CN??KKD: 3600235305 | Ng??y c???p: 01/03/1995",
                })}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {__({
                  defaultMessage:
                    "N??i c???p: S??? K??? ho???ch v?? ?????u t?? t???nh ?????ng Nai",
                })}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {__({
                  defaultMessage:
                    "Ph??n ph???i s???n ph???m b???i C??ng ty OnPoint, m?? s??? ??KKD 0314709816, ?????i l?? ???y quy???n c???a Nestl?? Vi???t Nam.",
                })}
              </Typography>
            </Grid>
            <Grid item lg={3} md={2} sm={4} xs={12} py={3}>
              <Typography variant="h6" sx={{ mb: 2.5 }}>
                {formatMessage({ id: "footer.information" })}
              </Typography>
              <Stack spacing={2}>
                {infoLinks.map((item) => (
                  <Link
                    variant="body2"
                    color="inherit"
                    underline="none"
                    href={item.url}
                  >
                    {item.name}
                  </Link>
                ))}
              </Stack>
            </Grid>
            <Grid item lg={3}>
              <Typography variant="h6" sx={{ mb: 2.5 }}>
                {__({ defaultMessage: "Ph????ng th???c thanh to??n" })}
              </Typography>
              <Stack spacing={2} direction="row" mb={3}>
                <Box>
                  <Image
                    src={FooterCash}
                    alt="Cash payment"
                    width={37}
                    height={25}
                  />
                </Box>

                <Box>
                  <Image
                    src={FooterMobilePay}
                    alt="Mobile payment"
                    width={23}
                    height={25}
                  />
                </Box>

                <Box>
                  <Image
                    src={FooterVisaPay.src}
                    alt="Mobile payment"
                    width={36}
                    height={25}
                  />
                </Box>

                <Box>
                  <Image
                    src={FooterMastercard.src}
                    alt="Mobile payment"
                    width={38}
                    height={25}
                  />
                </Box>
              </Stack>

              <Image
                src={MOIT.src}
                alt="Ministry of Industry and Trade"
                width={185}
                height={70}
              />
              <Box>
                <Link href="https://www.facebook.com/NestleMomAndMeVN">
                  <FacebookRoundedIcon
                    fontSize="large"
                    sx={{ color: theme.palette.primary.main }}
                  />
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </ContentWrapper>
      <BottomWrapper>
        <Container maxWidth="lg">
          <Typography
            variant="body2"
            color="primary.contrastText"
            sx={{ py: 3 }}
          >
            {__({
              defaultMessage:
                "Copyright ?? 2022 by Nestle. All Rights Reserved.",
            })}
          </Typography>
        </Container>
      </BottomWrapper>
    </Box>
  );
};

export const NesFooter = memo(NesFooterComponent, isEqual);
