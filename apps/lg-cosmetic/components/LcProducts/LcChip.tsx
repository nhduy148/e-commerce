import { ICategory, IDetailTaxon } from "@hera/data";
import { toCurrency } from "@hera/utils";
import { IFilterParams } from "@lc/types";
import { getAllTaxonvalues } from "@lc/utils";
import { Box, Button, Chip } from "@mui/material";
import { memo } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";

interface IProps {
  filtersParams?: IFilterParams;
  onDeleteAllFilter?: () => void;
  listBrandName?: string[];
  listCategories: ICategory[];
  taxonDetail?: IDetailTaxon;
}

const LcChipComponent = ({
  filtersParams,
  onDeleteAllFilter,
  listBrandName,
  listCategories,
  taxonDetail,
}: IProps) => {
  const { formatMessage } = useIntl();

  const pricesMessage = formatMessage({
    id: "productsPage.Prices",
  });

  const filterTaxonName = () => {
    let newListTaxonName = [];
    //@ts-ignore
    let allValues = getAllTaxonvalues(listCategories);
    if (allValues.length > 0 && Array.isArray(filtersParams?.taxonIds)) {
      let newListTaxon = filtersParams?.taxonIds;
      if (newListTaxon.indexOf(taxonDetail?.id) > -1) {
        newListTaxon = filtersParams?.taxonIds.filter(
          (item) => item !== taxonDetail?.id,
        );
      }
      if (newListTaxon.length > 0) {
        newListTaxonName = allValues.filter((item) => {
          return newListTaxon.indexOf(item.id) > -1;
        });
      }
    }
    return newListTaxonName;
  };
  return (
    <Box mb={1}>
      <Box display="flex" alignItems="center" flexWrap="wrap">
        {listBrandName &&
          listBrandName.map((brand, index) => {
            return (
              <Chip
                key={index}
                color="primary"
                label={brand}
                sx={{ marginRight: "8px", marginTop: "4px" }}
              />
            );
          })}
        {filterTaxonName() &&
          filterTaxonName().map((name, index) => {
            return (
              <Chip
                key={index}
                color="primary"
                label={name.name}
                sx={{ marginRight: "8px", marginTop: "4px" }}
              />
            );
          })}
        {filtersParams?.prices && (
          <Chip
            color="primary"
            sx={{ marginRight: "8px", marginTop: "4px" }}
            label={`${pricesMessage}: ${toCurrency(
              filtersParams?.prices[0],
            )} - ${toCurrency(filtersParams?.prices[1])}`}
          />
        )}
        {listBrandName?.length > 0 ||
        filterTaxonName()?.length > 0 ||
        filtersParams?.prices?.length > 0 ? (
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

export const LcChip = memo(LcChipComponent, isEqual);
