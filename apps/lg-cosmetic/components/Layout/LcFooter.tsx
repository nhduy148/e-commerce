import {
  FooterCash,
  FooterMastercard,
  FooterMobilePay,
  FooterVisaPay,
  MOIT,
} from "@lc/static/images";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import { FunctionComponent, memo, useState } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";
import { LcLogo } from "../LcLogo";

const Wrapper = styled("div")`
  background-color: ${({ theme }) => theme.palette.grey[900]};
  color: ${({ theme }) => theme.palette.grey[50]};
`;

const ContentWrapper = styled(Wrapper)`
  border-bottom: 0.5px solid ${({ theme }) => theme.palette.grey[800]};
  border-top: 0.5px solid ${({ theme }) => theme.palette.grey[800]};
  padding-top: 24px;
`;

const FooterMobile = styled(Box)``;

const FooterAccordion = styled(Accordion)`
  width: 100%;
  background-color: ${({ theme }) => theme.palette.grey[900]};
  color: ${({ theme }) => theme.palette.grey[50]};
  ::before {
    height: 0;
  }
  box-shadow: none;
  border-bottom: 1px solid ${({ theme }) => theme.palette.grey[800]};

  .MuiAccordionSummary-root {
    display: flex;
    align-items: center;
    padding: 0;
  }

  .MuiAccordionSummaryContent-root {
    display: flex;
    align-items: center;
  }

  .MuiAccordionDetails-root {
    padding: 16px 0;
  }
`;

const LcFooterComponent: FunctionComponent = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const { formatMessage } = useIntl();

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
  ];

  return (
    <Box component="footer">
      <ContentWrapper>
        <Container maxWidth="lg">
          <Grid container spacing={1}>
            <Grid item lg={6} md={6} sm={12} xs={12} py={3}>
              <Box sx={{ mb: 3 }}>
                <LcLogo clickable color="white" height={45} width={390} />
              </Box>

              <Typography variant="body2" sx={{ mb: 3 }}>
                Số ĐKKD: 3600254869 do Sở KHĐT Đồng Nai cấp ngày 22/10/1997
                <br />
                Nhà máy: KCN Nhơn Trạch II, Hiệp Phước, Nhơn Trạch, Đồng Nai
                <br />
                Hotline CSKH: 02873056686
              </Typography>

              <FooterMobile
                component="footer"
                sx={{ display: { sm: "none", xs: "block" } }}
              >
                <FooterAccordion
                  disableGutters
                  onChange={() =>
                    setExpanded((item) => (item === "policy" ? null : "policy"))
                  }
                  expanded={expanded === `policy`}
                >
                  <AccordionSummary
                    expandIcon={
                      expanded === `policy` ? (
                        <RemoveIcon sx={{ color: "grey.50" }} />
                      ) : (
                        <AddIcon sx={{ color: "grey.50" }} />
                      )
                    }
                  >
                    <Typography variant="h6">
                      {formatMessage({ id: "footer.information" })}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
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
                  </AccordionDetails>
                </FooterAccordion>
              </FooterMobile>
            </Grid>
            <Grid
              item
              lg={3}
              md={2}
              sm={4}
              xs={12}
              py={3}
              sx={{ display: { xs: "none", sm: "block" } }}
            >
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
                Phương thức thanh toán
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
            </Grid>
          </Grid>
        </Container>
      </ContentWrapper>
      <Wrapper>
        <Container sx={{ py: 4 }} maxWidth="lg">
          <Typography variant="body2" fontStyle="italic">
            Copyright © 2022 LG VINA Cosmetics. All rights reserved.
          </Typography>
        </Container>
      </Wrapper>
    </Box>
  );
};

export const LcFooter = memo(LcFooterComponent, isEqual);
