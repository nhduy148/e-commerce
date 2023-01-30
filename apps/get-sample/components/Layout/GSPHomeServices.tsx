import { GSPStaticImage } from "@gsp/components";
import { useFormatter } from "@hera/i18n";
import { Box, Container, Grid, SxProps, Typography } from "@mui/material";
import { FC } from "react";

interface IProps {
  sx: SxProps;
}

export const GSPHomeServices: FC<IProps> = ({ sx, ...props }) => {
  const { __ } = useFormatter();

  const services = [
    {
      imageKey: "Service01",
      content: __({ defaultMessage: "Hàng chính hãng" }),
    },
    {
      imageKey: "Service02",
      content: __({ defaultMessage: "Miễn phí vận chuyển" }),
    },
    {
      imageKey: "Service03",
      content: __({ defaultMessage: "Dùng thử miễn phí" }),
    },
    {
      imageKey: "Service04",
      content: __({ defaultMessage: "Hỗ trợ 24/7" }),
    },
  ];

  return (
    <Box sx={sx} {...props}>
      <Container>
        <Grid
          container
          justifyContent="space-around"
          flexWrap="wrap"
          spacing={{ md: 3.75, xs: 2 }}
          rowSpacing={{ sm: 0, xs: 3.75 }}
        >
          {services.map(({ imageKey, content }, index) => {
            return (
              <Grid item xs={6} sm={3} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <GSPStaticImage src={imageKey} width={72} height={72} />
                  <Typography
                    variant="body1"
                    sx={{
                      marginTop: 1.5,
                    }}
                  >
                    {content}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};
