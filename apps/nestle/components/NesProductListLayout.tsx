import { Box, Container } from "@mui/material";
import { useBreakPoint } from "@nestle/hooks";

interface Props {
  children: JSX.Element;
}

const NesProductListLayout = ({ children }: Props) => {
  const isPC = useBreakPoint("sm");
  return (
    <Container>
      <Box mt={isPC ? 4 : 0} sx={{ mb: "36px" }} minHeight="100vh">
        {children}
      </Box>
    </Container>
  );
};

export default NesProductListLayout;
