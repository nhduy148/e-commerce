import { useBreakPoint } from "@lc/hooks";
import { Box, Container } from "@mui/material";
import { LcCategoryProductBanner } from "./LcProducts";

interface Props {
  children: JSX.Element;
  banner?: string;
  setBanner?: boolean;
}

const LcProductListLayout = ({ children, banner, setBanner }: Props) => {
  const isPC = useBreakPoint("sm");
  return (
    <>
      {!setBanner ? (
        <Box></Box>
      ) : (
        <Box sx={{ display: { sm: "block", xs: "block" } }} mt="40px">
          {banner && (
            <Box px={isPC ? 0 : 1}>
              <Box
                position="relative"
                left="50%"
                sx={{
                  borderColor: "primary.main",
                  transform: "translateX(-50%)",
                }}
                p="10px"
                border="1px solid"
                maxWidth="1320px"
              >
                <LcCategoryProductBanner src={banner} />
              </Box>
            </Box>
          )}
        </Box>
      )}
      <Container>
        <Box
          sx={{
            mb: { xs: "80px", sm: "136px" },
          }}
          minHeight="100vh"
        >
          {children}
        </Box>
      </Container>
    </>
  );
};

export default LcProductListLayout;
