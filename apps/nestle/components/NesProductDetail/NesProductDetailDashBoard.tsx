import { IProductDetail } from "@hera/data";
import { Box, styled, Typography } from "@mui/material";
import { memo } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";

interface Props {
  product: IProductDetail;
}

const StyledBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid;
  border-color: ${({ theme }) => theme.palette.grey[200]};
  padding: 8px 0;
`;

const NesProductDetailDashBoardComponent = ({ product }: Props) => {
  const { formatMessage } = useIntl();

  const pageContent = {
    detail: formatMessage({ id: "productDetail.detail" }),
    brand: formatMessage({ id: "productDetail.brand" }),
    color: formatMessage({ id: "productDetail.color" }),
    weight: formatMessage({ id: "productDetail.weight" }),
    yearOfManufacturer: formatMessage({
      id: "productDetail.yearOfManufacturer",
    }),
    madeIn: formatMessage({ id: "productDetail.madeIn" }),
    red: formatMessage({ id: "color.red" }),
    korea: formatMessage({ id: "country.korea" }),
  };
  return (
    <Box>
      <Box
        pb={1}
        borderBottom="1px solid"
        borderColor="grey.200"
        sx={{ display: { xs: "none", sm: "block" } }}
      >
        <Typography variant="h6" color="text.main">
          {pageContent.detail}
        </Typography>
      </Box>
      <Box>
        <StyledBox>
          <Typography>{pageContent.brand}</Typography>
          <Typography textTransform="uppercase">
            {product?.brand?.name}
          </Typography>
        </StyledBox>
        <StyledBox>
          <Typography>{pageContent.color}</Typography>
          <Typography>{pageContent.red}</Typography>
        </StyledBox>
        <StyledBox>
          <Typography>{pageContent.weight}</Typography>
          <Typography>50g</Typography>
        </StyledBox>
        <StyledBox>
          <Typography>{pageContent.yearOfManufacturer}</Typography>
          <Typography>2022</Typography>
        </StyledBox>
        <StyledBox>
          <Typography>{pageContent.madeIn}</Typography>
          <Typography>{product?.madeIn}</Typography>
        </StyledBox>
      </Box>
    </Box>
  );
};

export const NesProductDetailDashBoard = memo(
  NesProductDetailDashBoardComponent,
  isEqual,
);
