import { IPaginateData, IProduct } from "@hera/data";
import { Box, Typography } from "@mui/material";
import { memo } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";

interface Props {
  response: IPaginateData<IProduct>;
  isLoading: boolean;
}
const NesProductCountsComponent = ({ response, isLoading }: Props) => {
  const { formatMessage } = useIntl();
  let productPerPage = 0;
  let productInPage = 1;
  if (!isLoading) {
    productPerPage = response?.paginate.page * response?.paginate.size;
    if (
      response?.paginate.page * response?.paginate.size >
      response?.paginate.total
    ) {
      productPerPage =
        response?.paginate.page * response?.paginate.size -
        (response?.paginate.page * response?.paginate.size -
          response?.paginate.total);
    }
    if (response?.paginate.page > 1) {
      productInPage =
        (response?.paginate.page - 1) * response?.paginate.size + 1;
    }
  }
  return (
    <Box>
      {response?.paginate.total > 0 ? (
        <Typography variant="subtitle2">{`Hiển thị ${productInPage}–${productPerPage}  của ${
          !response ? 0 : response?.paginate.total
        } sản phẩm`}</Typography>
      ) : (
        <Typography variant="subtitle2">
          {formatMessage({ id: "productsPage.NoProducts" })}
        </Typography>
      )}
    </Box>
  );
};

export const NesProductCounts = memo(NesProductCountsComponent, isEqual);
