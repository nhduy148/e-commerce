import {
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControlLabel,
  FormGroup,
  IconButton,
  Slider,
  Typography,
} from "@mui/material";
import * as React from "react";

import { IBrand, ICategory, IDetailTaxon } from "@hera/data";
import { toCurrency } from "@hera/utils";
import { IFilterParams } from "@lc/types";
import { findParentTaxon, getAllTaxonvalues, spliceItem } from "@lc/utils";
import { memo, useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";
import { LcCategoryFilter } from "./LcCategoryFilter";

interface Props {
  isOpen?: boolean;
  brands?: IBrand[];
  brandsData?: IBrand;
  listCategories?: ICategory;
  taxonDetail?: IDetailTaxon;
  filtersParams?: IFilterParams;
  deleteAllFlag?: boolean;
  listBrandName?: string[];
  onOpenFilter?: () => void;
  onSetFilterParams?: (x) => void;
  onSetListBrandName?: (e) => void;
}
const minDistance = 0;
function LcFilterComponent({
  isOpen,
  brands,
  brandsData,
  listCategories,
  taxonDetail,
  filtersParams,
  deleteAllFlag,
  listBrandName,
  onOpenFilter,
  onSetFilterParams,
  onSetListBrandName,
}: Props) {
  const { formatMessage } = useIntl();
  const [listBrands, setListBrands] = useState([]);
  const [listTaxon, setlistTaxon] = useState([]);
  const [prices, setPrices] = useState<number[]>([0, 0]);
  const [priceOnChange, setPriceOnChange] = useState(false);
  const [brandNames, setBrandNames] = useState<string[]>([]);

  useEffect(() => {
    setListBrands([]);
    setPrices([0, 0]);
    setBrandNames([]);
  }, [listCategories, deleteAllFlag]);

  useEffect(() => {
    setlistTaxon(!filtersParams?.taxonIds ? [] : filtersParams?.taxonIds);
    setListBrands(!filtersParams?.brandIds ? [] : filtersParams?.brandIds);
  }, [filtersParams]);

  const handleChangePrice = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setPrices([Math.min(newValue[0], prices[1] - minDistance), prices[1]]);
    } else {
      setPrices([prices[0], Math.max(newValue[1], prices[0] + minDistance)]);
    }
    setPriceOnChange(true);
  };

  const getBrandValues = (e, brandId, brandName) => {
    if (e.target.checked) {
      setListBrands([...listBrands, brandId]);
      setBrandNames([...brandNames, brandName]);
    } else {
      const newListBrands = listBrands.filter((data) => data !== brandId);
      const newListBrandName = brandNames.filter((data) => data != brandName);
      setListBrands(newListBrands);
      setBrandNames(newListBrandName);
    }
  };

  const findDuplicates = (arr): number[] | string[] => {
    return arr.filter((item, index) => arr.indexOf(item) != index);
  };

  const getTaxonValues = (e, taxon: ICategory) => {
    const parentTaxon = findParentTaxon(listCategories, taxon);
    if (e.target.checked) {
      if (getAllTaxonvalues(taxon).length > 0) {
        let newListTaxon = [...listTaxon, taxon.id];

        if (newListTaxon.indexOf(taxonDetail?.id) > -1) {
          spliceItem(newListTaxon, taxonDetail?.id);
        }
        getAllTaxonvalues(taxon).forEach((item) => {
          newListTaxon.push(item.id);
        });

        if (findDuplicates(newListTaxon).length > 0) {
          setlistTaxon(
            newListTaxon.filter((item, pos, self) => {
              return self.indexOf(item) == pos;
            }),
          );
        } else {
          if (
            parentTaxon.taxons
              .map((t) => t.id)
              .every((item) => {
                if (newListTaxon.indexOf(item) > -1) {
                  return (item = newListTaxon[newListTaxon.indexOf(item)]);
                }
              })
          ) {
            newListTaxon = [...newListTaxon, parentTaxon.id];
          }
          setlistTaxon(newListTaxon);
        }
      } else {
        if (parentTaxon) {
          let newListTaxon = [...listTaxon, taxon.id].filter(
            (item) => item !== taxonDetail?.id,
          );

          let newArray = getAllParentCheckValues(taxon).map((i) => i.id);
          if (
            parentTaxon.taxons
              .map((t) => t.id)
              .every((item) => {
                if (newListTaxon.indexOf(item) > -1) {
                  return (item = newListTaxon[newListTaxon.indexOf(item)]);
                }
              })
          ) {
            newListTaxon = [...newListTaxon, parentTaxon.id];
          }

          if (
            getAllParentCheckValues(taxon).length > 0 &&
            AllParentValuesChecked(newArray[0], newListTaxon)
          ) {
            newListTaxon = [newArray[0], ...newListTaxon];
          }

          setlistTaxon(newListTaxon);
        } else {
          setlistTaxon([...listTaxon, taxon.id]);
        }
      }
    } else {
      if (getAllTaxonvalues(taxon).length > 0) {
        getAllParentCheckValues(taxon);
        let newListTaxon = listTaxon;

        if (newListTaxon.indexOf(taxonDetail?.id) > -1) {
          spliceItem(newListTaxon, taxonDetail?.id);
        }

        if (newListTaxon.indexOf(taxon.id) > -1) {
          spliceItem(newListTaxon, taxon.id);
        }

        getAllTaxonvalues(taxon).forEach((item) => {
          if (newListTaxon.indexOf(item.id) > -1) {
            let newArray = getAllParentCheckValues(taxon).map((i) => i.id);
            if (
              getAllParentCheckValues(taxon).length > 0 &&
              newListTaxon.indexOf(newArray[0]) > -1
            ) {
              spliceItem(newListTaxon, newArray[0]);
            }
            spliceItem(newListTaxon, item.id);
          }
        });
        if (newListTaxon.length === 0) {
          setlistTaxon([]);
        } else {
          setlistTaxon([...newListTaxon]);
        }
      } else {
        if (parentTaxon) {
          let newListTaxon = listTaxon;
          if (newListTaxon.indexOf(taxonDetail?.id) > -1) {
            spliceItem(newListTaxon, taxonDetail?.id);
          }

          if (
            parentTaxon.taxons
              .map((t) => t.id)
              .every((item) => {
                if (newListTaxon.indexOf(item) > -1) {
                  return (item = newListTaxon[newListTaxon.indexOf(item)]);
                }
              })
          ) {
            if (listTaxon.indexOf(parentTaxon.id) > -1) {
              let newArray = getAllParentCheckValues(taxon).map((i) => i.id);
              if (
                getAllParentCheckValues(taxon).length > 0 &&
                newListTaxon.indexOf(newArray[0]) > -1
              ) {
                spliceItem(newListTaxon, newArray[0]);
              }
              setlistTaxon(spliceItem(newListTaxon, parentTaxon.id));
            }
          }
        }
        const newListTaxon = listTaxon.filter((data) => data != taxon.id);
        setlistTaxon(newListTaxon);
      }
    }
  };

  const getAllParentCheckValues = (taxon: ICategory) => {
    let newArray = [];
    let listAllTaxonValues = getAllTaxonvalues(listCategories);
    newArray = listAllTaxonValues.filter((item) => {
      return taxon.slug.indexOf(item.slug) > -1;
    });
    return newArray;
  };

  const AllParentValuesChecked = (taxonId: number, listTaxon: number[]) => {
    let newArray = [];
    let secondArray = [];
    let flag = false;
    let listAllTaxonValues = getAllTaxonvalues(listCategories);
    let newArrayTaxon = listTaxon;
    if (listTaxon.indexOf(taxonId) > -1) {
      newArrayTaxon = newArrayTaxon.filter((item) => item !== taxonId);
    }

    newArray = listAllTaxonValues.filter((item) => {
      return [taxonId].indexOf(item.parentId) > -1;
    });

    secondArray = newArrayTaxon.filter((item) => {
      return newArray.map((i) => i.id).indexOf(item) > -1;
    });
    if (newArray.length === secondArray.length) {
      flag = true;
    }
    return flag;
  };

  const valueLabelFormat = (values: number) => {
    return toCurrency(values);
  };

  const setDataToFilter = () => {
    onSetFilterParams([
      {
        filterName: "brandIds",
        dataFilter: listBrands.map((i) => Number(i)),
      },
      {
        filterName: "prices",
        dataFilter: priceOnChange && prices[1] > 0 ? prices : [],
      },
      {
        filterName: "taxonIds",
        dataFilter: listTaxon.map((i) => Number(i)),
      },
    ]);
    onSetListBrandName(brandNames);
  };

  const handleCancel = () => {
    let checkNull = !filtersParams?.taxonIds;
    setlistTaxon(
      checkNull ? [] : filtersParams?.taxonIds.map((i) => Number(i)),
    );
    setListBrands(!filtersParams?.brandIds ? [] : filtersParams?.brandIds);
    setBrandNames(!filtersParams?.brandIds ? [] : listBrandName);
    onOpenFilter();
  };

  const list = () => (
    <Box
      sx={{ width: { xs: "100vw", sm: "25vw" } }}
      borderTop="4px solid"
      borderColor="primary.main"
      role="presentation"
      display="flex"
      flexDirection="column"
      height="100%"
    >
      <Box
        display="flex"
        alignItems="center"
        position="relative"
        p={1.5}
        borderBottom="1px solid"
        borderColor="grey.300"
        flex="1 1 auto"
      >
        <IconButton
          aria-label="close"
          sx={{ position: "absolute" }}
          onClick={handleCancel}
        >
          <CloseIcon width={14} height={14} />
        </IconButton>
        <Box display="flex" justifyContent="center" width="100%">
          <Typography variant="h5" textTransform="uppercase">
            {formatMessage({
              id: "productsPage.Filter",
            })}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ flex: "1 1 100%", overflowY: "auto" }}>
        <Box px={3} py={3}>
          {brands && (
            <Box>
              <Typography textTransform="uppercase" variant="subtitle1">
                {formatMessage({
                  id: "productsPage.Brands",
                })}
              </Typography>
              <Box pl={1.5} mt={3}>
                <FormGroup>
                  {brands?.map((brand, index) => {
                    return (
                      <FormControlLabel
                        key={index}
                        onChange={(e) =>
                          getBrandValues(e, brand.id, brand.name)
                        }
                        control={
                          <Checkbox
                            value={brand.id}
                            disabled={brandsData?.id === brand.id}
                            checked={
                              listBrands.some((data) => data == brand.id) ||
                              brandsData?.id === brand.id
                            }
                          />
                        }
                        label={
                          <Typography variant="body2">{brand.name}</Typography>
                        }
                      />
                    );
                  })}
                </FormGroup>
              </Box>
            </Box>
          )}
          {listCategories?.taxons.length === 0 ? (
            <Box></Box>
          ) : (
            <LcCategoryFilter
              listCategories={listCategories}
              getTaxonValues={getTaxonValues}
              taxonDetail={taxonDetail}
              listTaxon={listTaxon.map((i) => Number(i))}
            />
          )}
          <Box>
            <Box mt={4}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography textTransform="uppercase">
                  {formatMessage({
                    id: "productsPage.Prices",
                  })}
                </Typography>
              </Box>
              <Box width="100%">
                <Slider
                  getAriaLabel={() => "Minimum distance"}
                  value={prices}
                  onChange={handleChangePrice}
                  max={10000000}
                  valueLabelDisplay="auto"
                  valueLabelFormat={valueLabelFormat}
                  disableSwap
                />
                <Box display="flex" justifyContent="space-between">
                  <Box display="flex">
                    <Typography variant="subtitle2">
                      {formatMessage({
                        id: "productsPage.Lowest",
                      })}
                      :&nbsp;
                    </Typography>
                    <Typography variant="subtitle2">{toCurrency(0)}</Typography>
                  </Box>
                  <Box display="flex">
                    <Typography variant="subtitle2">
                      {formatMessage({
                        id: "productsPage.Highest",
                      })}
                      :&nbsp;
                    </Typography>
                    <Typography variant="subtitle2">
                      {toCurrency(10000000)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        flex="1 1 auto"
        p={1.5}
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        borderTop="1px solid"
        borderColor="primary.main"
      >
        <Button variant="contained" onClick={setDataToFilter}>
          {formatMessage({
            id: "productsPage.FilterApply",
          })}
        </Button>
        <Button
          variant="contained"
          color="inherit"
          sx={{ ml: 2 }}
          onClick={handleCancel}
        >
          {formatMessage({
            id: "productsPage.FilterCancel",
          })}
        </Button>
      </Box>
    </Box>
  );

  return (
    <div>
      <React.Fragment>
        <Box
          sx={{
            mt: { xs: "0", sm: "36px" },
            mb: { xs: "0", sm: "20px" },
            justifyContent: { xs: "flex-end", sm: "center" },
          }}
          display="flex"
          width="100%"
          onClick={onOpenFilter}
        >
          <Button
            color="primary"
            variant="contained"
            size="small"
            endIcon={<KeyboardArrowDownIcon />}
          >
            <Typography variant="overline">
              {formatMessage({
                id: "productsPage.Filter",
              })}
            </Typography>
          </Button>
        </Box>
        <Drawer
          disableScrollLock
          anchor="right"
          open={isOpen}
          onClose={handleCancel}
        >
          {list()}
        </Drawer>
      </React.Fragment>
    </div>
  );
}

export const LcFilter = memo(LcFilterComponent, isEqual);
