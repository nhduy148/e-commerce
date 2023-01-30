import {
  GSPBreadcrumb,
  GSPSectionHeading,
  GSPSingleBanner,
} from "@gsp/components";
import { IMainBanner, useStaticPageDataQuery } from "@hera/data";
import { Box, Container, useTheme } from "@mui/material";
import { FC } from "react";

interface IProps {
  slug: string;
}

export const GSPStaticLayout: FC<IProps> = ({ slug }) => {
  const theme = useTheme();
  const { data } = useStaticPageDataQuery({ slug });

  const staticPageData = data?.data;
  const desktopImageUrl = staticPageData?.desktopPhotoUrl;
  const mobileImageUrl = staticPageData?.mobilePhotoUrl;
  const pageContent = staticPageData?.content;

  return (
    <Container>
      <Box mb={4} mt={2.75}>
        <GSPBreadcrumb
          data={[
            { name: staticPageData?.name, link: `/${staticPageData?.slug}` },
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
        <GSPSingleBanner
          banner={
            {
              desktopImageUrl,
              mobileImageUrl,
              name: "GSP Static Page",
            } as IMainBanner
          }
          ratio={{ x: 1120, y: 320 }}
        />
      </Box>

      <GSPSectionHeading
        text={staticPageData?.name}
        sx={{ marginBottom: 6.25 }}
      />

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
