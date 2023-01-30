import { IProductDetailsProps } from "@gsp/components";
import { useFormatter } from "@hera/i18n";
import { Box, Skeleton, styled, Typography } from "@mui/material";
import { FC, memo } from "react";
import isEqual from "react-fast-compare";

const StyledBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid;
  border-color: ${({ theme }) => theme.palette.grey[200]};
  padding: 8px 0;
`;

const GSPProductDetailDashBoardComponent: FC<IProductDetailsProps> = ({
  productDetail,
  isLoading,
}) => {
  const { __ } = useFormatter();

  return (
    <>
      {isLoading ? (
        <>
          <Skeleton
            width={100}
            height={40}
            animation="wave"
            sx={{ marginBottom: 3 }}
          />
          <Skeleton
            width="100%"
            height={300}
            animation="wave"
            variant="rounded"
          />
        </>
      ) : (
        <>
          <Box
            sx={{
              marginBottom: 3,
              display: { xs: "none", sm: "block" },
            }}
          >
            <Typography variant="h4" color="text.main">
              {__({ defaultMessage: "Chi tiết" })}
            </Typography>
          </Box>
          <Box>
            {productDetail?.brand?.name && (
              <StyledBox>
                <Typography>{__({ defaultMessage: "Thương hiệu" })}</Typography>
                <Typography textTransform="uppercase">
                  {productDetail?.brand?.name}
                </Typography>
              </StyledBox>
            )}
            {productDetail?.taxons[0]?.name && (
              <StyledBox>
                <Typography>{__({ defaultMessage: "Danh mục" })}</Typography>
                <Typography>{productDetail?.taxons[0]?.name}</Typography>
              </StyledBox>
            )}
            {productDetail?.width && productDetail?.height && (
              <StyledBox>
                <Typography>{__({ defaultMessage: "Kích thước" })}</Typography>
                <Typography>
                  {productDetail?.height} x {productDetail?.width}
                </Typography>
              </StyledBox>
            )}
            {productDetail?.weight && (
              <StyledBox>
                <Typography>{__({ defaultMessage: "Trọng lượng" })}</Typography>
                <Typography>{productDetail?.weight}</Typography>
              </StyledBox>
            )}
          </Box>
        </>
      )}
    </>
  );
};

export const GSPProductDetailsDashBoard = memo(
  GSPProductDetailDashBoardComponent,
  isEqual,
);
