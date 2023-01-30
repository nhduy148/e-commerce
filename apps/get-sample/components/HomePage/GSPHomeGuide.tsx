import { GSPSectionHeading, GSPStaticImage } from "@gsp/components";
import { GuideCategory, GuideStep } from "@gsp/types";
import { useFormatter } from "@hera/i18n";
import { Divider, Grid, Stack, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { Fragment, memo, useCallback } from "react";

interface IProps {
  steps: GuideStep[];
  categories: GuideCategory[];
}

export const GSPHomeGuide = memo(({ steps = [], categories = [] }: IProps) => {
  const { palette } = useTheme();
  const { __ } = useFormatter();

  const renderStepItem = useCallback((step: GuideStep, index: number) => {
    return (
      <Fragment key={index}>
        <Grid item xs={12} sm={4}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            position="relative"
            px={2}
            width={1}
          >
            {index > 0 && (
              <Divider
                orientation="vertical"
                color={palette.grey[300]}
                sx={{
                  width: "1px",
                  height: 200,
                  position: "absolute",
                  top: { xs: "-50%", sm: 20 },
                  bottom: { xs: "unset", sm: 20 },
                  left: 0,
                }}
              />
            )}
            <Typography variant="h5" textAlign="center" color="primary">
              {`${__({ defaultMessage: "Bước" })} ${index + 1}`}
            </Typography>
            <Box my={2}>
              <GSPStaticImage
                src={step.image}
                alt={step.text}
                width={170}
                height={160}
                objectFit="contain"
                objectPosition="center center"
              />
            </Box>
            <Typography variant="h6" textAlign="center" color="textSecondary">
              {step.text}
            </Typography>
          </Box>
        </Grid>
      </Fragment>
    );
  }, []);

  const renderCategoryItem = useCallback(
    (cate: GuideCategory, index: number) => {
      return (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          px={{ xs: 0.5, sm: 3 }}
          py={2.5}
          key={index}
          width={1}
          maxWidth={{ xs: 160, sm: 180 }}
        >
          <Box mb={1.5}>
            <GSPStaticImage
              src={cate.image}
              alt={cate.name}
              width={60}
              height={60}
              objectFit="contain"
              objectPosition="center center"
            />
          </Box>
          <Typography variant="h6" textAlign="center">
            {cate.name}
          </Typography>
        </Box>
      );
    },
    [],
  );

  return (
    <Box>
      <Box maxWidth={720} mb={5} mx="auto">
        <GSPSectionHeading
          text={__({
            defaultMessage: "Nhận miễn phí sản phẩm chỉ trong 3 bước",
          })}
        />
      </Box>
      <Box
        sx={{
          p: 3,
          border: "1px solid",
          borderColor: palette.primary.main,
          borderRadius: 1.25,
        }}
      >
        <Grid
          container
          spacing={{ xs: 10, sm: 0 }}
          justifyContent="space-between"
        >
          {steps.map(renderStepItem)}
        </Grid>
      </Box>

      <Stack
        spacing={{ xs: 0, sm: 3 }}
        justifyContent={{ xs: "space-between", sm: "center" }}
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        py={5}
      >
        {categories.map(renderCategoryItem)}
      </Stack>
    </Box>
  );
});
