import { useShopInShop } from "@hera/data";
import { useFormatter } from "@hera/i18n";
import { Box, Container, Skeleton, Stack } from "@mui/material";
import { NesGetSampleBanner, NesGetSampleForm } from "@nestle/getSamples";
import { useBreakPoint } from "@nestle/hooks";
import { NesBreadcrumbs } from "@nestle/NesProductsComponent";

type Props = {};

const GetSample = (props: Props) => {
  const { __ } = useFormatter();
  const isPC = useBreakPoint("sm");
  const { data: pageData, isLoading } = useShopInShop("get-sample");

  if (isLoading) {
    return (
      <Container>
        <Stack spacing={2} sx={{ pt: { sm: 12, xs: 8 }, pb: 10 }}>
          <Box height={498}>
            <Skeleton width="100%" height="100%" variant="rectangular" />
          </Box>
        </Stack>
      </Container>
    );
  }

  const banner = pageData?.data?.content.find((data) => data.type === "banner");

  return (
    <Box mb={{ lg: 9, sm: 7, xs: 5 }} mt={3}>
      <Container maxWidth="lg">
        <Box mt={4} mb={{ xs: 5, md: 9 }}>
          {isPC ? (
            <Box mb={{ xs: 3, md: 4 }}>
              <NesBreadcrumbs
                loading={isLoading}
                brandName={
                  pageData?.data.title ||
                  __({ defaultMessage: "Không tìm thấy" })
                }
              />
            </Box>
          ) : (
            <Box></Box>
          )}

          <Box>
            <NesGetSampleBanner banner={banner.bannerImage} bannerLink={""} />
            <Box mt={isPC ? "82px" : "32px"}>
              <NesGetSampleForm />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default GetSample;
