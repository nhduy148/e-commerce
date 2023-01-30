import { useFormatter } from "@hera/i18n";
import { Box, Container, Grid, Typography } from "@mui/material";
import { NesStaticImage } from "@nestle/components";
import { useBreakPoint } from "@nestle/hooks";

type Props = {};

export const NesHomeServices = (props: Props) => {
  const isPC = useBreakPoint("sm");
  const { __ } = useFormatter();
  const services = [
    {
      imageKey: "Service01",
      content: __(
        { defaultMessage: "Nhập khẩu chính hãng{br}bởi Nestlé Việt Nam" },
        { br: <br /> },
      ),
    },
    {
      imageKey: "Service02",
      content: __(
        { defaultMessage: "Giao hàng{br}nhanh chóng" },
        { br: <br /> },
      ),
    },
    {
      imageKey: "Service03",
      content: __(
        { defaultMessage: "Chăm sóc{br}khách hàng trực tuyến" },
        { br: <br /> },
      ),
    },
  ];
  const renderItem = ({ content, imageKey }, index) => {
    return (
      <Grid item sm="auto" xs={12}>
        <Box key={index} display="flex" alignItems="center">
          <NesStaticImage
            src={imageKey}
            width={isPC ? 56 : 44}
            height={isPC ? 56 : 44}
          />
          <Typography variant="body1" color="common.white" sx={{ ml: 2 }}>
            {content}
          </Typography>
        </Box>
      </Grid>
    );
  };
  return (
    <Box bgcolor="primary.main" py={3}>
      <Container>
        <Grid
          container
          justifyContent="space-between"
          flexWrap="wrap"
          spacing={{ md: 3, xs: 2 }}
        >
          {services.map(renderItem)}
        </Grid>
      </Container>
    </Box>
  );
};
