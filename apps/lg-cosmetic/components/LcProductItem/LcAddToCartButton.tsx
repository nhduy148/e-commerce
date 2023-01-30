import { LcLoadingButton } from "@lc/components";
import { AddShoppingCart as AddShoppingCartIcon } from "@mui/icons-material";
import {
  CircularProgress,
  Fab,
  lighten,
  styled,
  Tooltip,
  useTheme,
} from "@mui/material";
import { FC } from "react";
import { useIntl } from "react-intl";

const StyledAddToCartButton = styled(LcLoadingButton)`
  white-space: nowrap;
  overflow: hidden;
  background-color: ${({ theme }) => lighten(theme.palette.primary.main, 0.96)};
`;

interface IProps {
  cardWidth: number;
  isLoading?: boolean;
  onAddToCart?: (event?: any) => void;
}

export const LcAddToCartButton: FC<IProps> = ({
  cardWidth,
  isLoading,
  onAddToCart,
}) => {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  if (cardWidth >= 160) {
    return (
      <StyledAddToCartButton
        isLoading={isLoading}
        variant="outlined"
        startIcon={<AddShoppingCartIcon />}
        onClick={onAddToCart}
        size="small"
        title={formatMessage({ id: "button.addToCart" })}
      >
        {formatMessage({ id: "button.addToCart" })}
      </StyledAddToCartButton>
    );
  } else {
    if (isLoading) {
      return (
        <Fab
          size="large"
          sx={{ position: "relative" }}
          color="primary"
          disabled={isLoading}
          onClick={onAddToCart}
        >
          <AddShoppingCartIcon htmlColor="white" />
          <CircularProgress
            sx={{
              position: "absolute",
              color: lighten(theme.palette.primary.main, 0.6),
              top: -2,
              right: -2,
              bottom: -2,
              left: -2,
              width: "auto !important",
              height: "auto !important",
              zIndex: 1,
            }}
          />
        </Fab>
      );
    } else {
      return (
        <Tooltip title={formatMessage({ id: "button.addToCart" })}>
          <Fab size="large" color="primary" onClick={onAddToCart}>
            <AddShoppingCartIcon htmlColor="white" />
          </Fab>
        </Tooltip>
      );
    }
  }
};
