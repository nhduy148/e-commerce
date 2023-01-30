import { IFilterParams } from "@gsp/types";
import { IBrand, IDetailTaxon } from "@hera/data";
import { toCurrency } from "@hera/utils";
import { Box, Button, Chip } from "@mui/material";
import { memo } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";

interface IProps {
  brands?: IBrand[];
  filtersParams?: IFilterParams;
  taxonDetail?: IDetailTaxon;
  taxonId?: number;
  onDeleteAllFilter?: () => void;
}

const GSPChipComponent = ({
  brands,
  filtersParams,
  taxonDetail,
  taxonId,
  onDeleteAllFilter,
}: IProps) => {
  const { formatMessage } = useIntl();
  const newListBrands = brands?.filter((x, y) => {
    if (!filtersParams.brandIds) return;
    return filtersParams.brandIds.includes(x.id);
  });

  const newListTaxons = taxonDetail?.children?.filter((x, y) => {
    if (!filtersParams.taxonIds) return;
    if (filtersParams.taxonIds[y] === taxonId) return;
    return filtersParams.taxonIds.includes(x.id);
  });
  const pricesMessage = formatMessage({
    id: "productsPage.Prices",
  });
  return (
    <Box mb={1}>
      <Box display="flex" alignItems="center" flexWrap="wrap">
        {newListBrands &&
          newListBrands.map((data, index) => {
            return (
              <Chip
                key={index}
                color="primary"
                label={data.name}
                sx={{ marginRight: "8px", marginTop: "4px" }}
              />
            );
          })}
        {newListTaxons &&
          newListTaxons.map((data, index) => {
            return (
              <Chip
                key={index}
                color="primary"
                label={data.name}
                sx={{ marginRight: "8px", marginTop: "4px" }}
              />
            );
          })}
        {filtersParams.prices && (
          <Chip
            color="primary"
            sx={{ marginRight: "8px", marginTop: "4px" }}
            label={`${pricesMessage}: ${toCurrency(
              filtersParams.prices[0],
            )} - ${toCurrency(filtersParams.prices[1])}`}
          />
        )}
        {newListBrands?.length > 0 ||
        newListTaxons?.length > 0 ||
        filtersParams.prices?.length > 0 ? (
          <Box mt={0.5}>
            <Button
              variant="text"
              size="small"
              onClick={onDeleteAllFilter}
              sx={{ ml: "8px" }}
            >
              {formatMessage({
                id: "productsPage.DeleteAll",
              })}
            </Button>
          </Box>
        ) : (
          <Box></Box>
        )}
      </Box>
    </Box>
  );
};

export const GSPChip = memo(GSPChipComponent, isEqual);
