import { Box, Typography } from "@mui/material";
import { NesStaticImage } from "@nestle/components";
import { useIntl } from "react-intl";

export const NesEmptyCart = () => {
  const { formatMessage } = useIntl();
  return (
    <Box
      height={1}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      px={2}
      pb={10}
    >
      <Box maxWidth={160} mb={2} width={1}>
        <Box position="relative" pt="100%">
          <NesStaticImage src="EmptyCart" layout="fill" />
        </Box>
      </Box>
      <Typography variant="h5" textAlign="center" color="primary" gutterBottom>
        {formatMessage({ id: "shoppingCart.emptyTitle" })}
      </Typography>
      <Typography variant="body1" textAlign="center">
        {formatMessage({ id: "shoppingCart.emptyDescription" }, { br: <br /> })}
      </Typography>
    </Box>
  );
};
