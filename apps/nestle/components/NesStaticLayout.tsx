import { IMainBanner, useStaticPageDataQuery } from "@hera/data";
import { Box, Container, Typography, useTheme } from "@mui/material";
import { NesSingleBanner, NesStaticBreadcrumb } from "@nestle/components";
import React from "react";

interface IStaticLayout {
  slug: string;
}

export const NesStaticLayout: React.FunctionComponent<IStaticLayout> = ({
  slug,
}) => {
  const theme = useTheme();
  const { data } = useStaticPageDataQuery({ slug });
  const staticPageData = data?.data;
  const desktopImageUrl = staticPageData?.desktopPhotoUrl;
  const mobileImageUrl = staticPageData?.mobilePhotoUrl;
  const pageContent = staticPageData?.content;

  return (
    <Container>
      <Box mb={4} mt={2.75}>
        <NesStaticBreadcrumb
          breadcrumbLinks={[
            { name: staticPageData?.name, url: `/${staticPageData?.slug}` },
          ]}
        />
      </Box>

      <Box
        sx={{
          mb: 3,
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <NesSingleBanner
          banner={
            {
              desktopImageUrl,
              mobileImageUrl,
              name: "Nestle Static Page",
            } as IMainBanner
          }
          ratio={{ x: 1120, y: 320 }}
        />
      </Box>

      <Typography variant="h4" fontWeight={theme.typography.fontWeightBold}>
        {staticPageData?.name}
      </Typography>
      <Box
        sx={{
          mb: 4,
          "& img": {
            maxWidth: "100%",
            display: "block",
            margin: "0 auto",
          },
        }}
        dangerouslySetInnerHTML={{ __html: pageContent }}
      />
    </Container>
  );
};
