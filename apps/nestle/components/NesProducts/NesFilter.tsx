import { IBrand, IDetailTaxon } from "@hera/data";
import { toCurrency } from "@hera/utils";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Slider,
  Typography,
  useTheme,
} from "@mui/material";
import { IFilterParams } from "@nestle/types";
import * as React from "react";
import { memo, useEffect, useRef, useState } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";

interface Props {
  onSetFilterParams?: (x) => void;
  brands?: IBrand[];
  taxonDetail?: IDetailTaxon;
  deleteAllFlag?: boolean;
  filtersParams?: IFilterParams;
}
const minDistance = 0;
function NesFilterComponent({
  onSetFilterParams,
  brands,
  taxonDetail,
  deleteAllFlag,
  filtersParams,
}: Props) {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const [listBrands, setListBrands] = useState([]);
  const [listTaxon, setlistTaxon] = useState([]);
  const [prices, setPrices] = useState<number[]>([0, 0]);
  const [priceOnChange, setPriceOnChange] = useState(false);
  const filterValues = useRef([]);

  useEffect(() => {
    setlistTaxon([]);
    setListBrands([]);
    setPrices([0, 0]);
  }, [taxonDetail, deleteAllFlag]);

  useEffect(() => {
    filterValues.current = [
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
    ];
  }, [listBrands, listTaxon, prices]);

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

  const getBrandValues = (e) => {
    if (e.target.checked) {
      const newArr = filterValues.current.map((obj) => {
        if (obj.filterName === "brandIds") {
          return {
            ...obj,
            dataFilter: [...listBrands, e.target.value].map((i) => Number(i)),
          };
        }
        return obj;
      });
      onSetFilterParams(newArr);
      setListBrands([...listBrands, e.target.value]);
    } else {
      const newListBrands = listBrands.filter(
        (data) => data !== e.target.value,
      );
      const newArr = filterValues.current.map((obj) => {
        if (obj.filterName === "brandIds") {
          return {
            ...obj,
            dataFilter: newListBrands.map((i) => Number(i)),
          };
        }
        return obj;
      });
      onSetFilterParams(newArr);
      setListBrands(newListBrands);
    }
  };

  const getTaxonValues = (e) => {
    if (e.target.checked) {
      const newArr = filterValues.current.map((obj) => {
        if (obj.filterName === "taxonIds") {
          return {
            ...obj,
            dataFilter: [...listTaxon, e.target.value].map((i) => Number(i)),
          };
        }
        return obj;
      });
      onSetFilterParams(newArr);
      setlistTaxon([...listTaxon, e.target.value]);
    } else {
      const newListTaxons = listTaxon.filter((data) => data !== e.target.value);
      const newArr = filterValues.current.map((obj) => {
        if (obj.filterName === "taxonIds") {
          return {
            ...obj,
            dataFilter: newListTaxons.map((i) => Number(i)),
          };
        }
        return obj;
      });
      onSetFilterParams(newArr);
      setlistTaxon(newListTaxons);
    }
  };

  const valueLabelFormat = (values: number) => {
    return toCurrency(values);
  };

  const setDataToFilter = () => {
    const newArr = filterValues.current.map((obj) => {
      if (obj.filterName === "prices") {
        return {
          ...obj,
          dataFilter: priceOnChange && prices[1] > 0 ? prices : [],
        };
      }
      return obj;
    });
    onSetFilterParams(newArr);
  };

  return (
    <div>
      <React.Fragment>
        <Box
          role="presentation"
          display="flex"
          flexDirection="column"
          height="100%"
        >
          <Box display="flex" alignItems="center" position="relative" py={2.75}>
            <Box>
              <Typography variant="h6">
                {formatMessage({
                  id: "productsPage.Filter",
                })}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box>
              <Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>
                    {formatMessage({
                      id: "productsPage.Prices",
                    })}
                  </Typography>
                </Box>
                <Box width="100%">
                  <Box p={3}>
                    <Slider
                      getAriaLabel={() => "Minimum distance"}
                      color="secondary"
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
                          {toCurrency(0)}
                        </Typography>
                      </Box>
                      <Box display="flex">
                        <Typography variant="subtitle2">
                          {toCurrency(10000000)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Button
                    size="large"
                    variant="outlined"
                    onClick={setDataToFilter}
                  >
                    {formatMessage({
                      id: "productsPage.FilterApply",
                    })}
                  </Button>
                </Box>
              </Box>
            </Box>
            <Box pt={2.5} pb={3}>
              {brands && (
                <Box>
                  <Typography
                    fontWeight="fontWeightMedium"
                    color={theme.palette.text.secondary}
                  >
                    {formatMessage({
                      id: "productsPage.Brands",
                    })}
                  </Typography>
                  <Box pl={1.5} mt="6px">
                    <FormGroup>
                      {brands?.map((brand, index) => {
                        return (
                          <FormControlLabel
                            key={index}
                            onChange={getBrandValues}
                            control={
                              <Checkbox
                                sx={{
                                  padding: "7px",
                                }}
                                size="small"
                                value={brand.id}
                                checked={listBrands.some(
                                  (data) => data == brand.id,
                                )}
                              />
                            }
                            label={
                              <Typography variant="subtitle2">
                                {brand.name}
                              </Typography>
                            }
                          />
                        );
                      })}
                    </FormGroup>
                  </Box>
                </Box>
              )}
              {!taxonDetail?.children || taxonDetail?.children?.length === 0 ? (
                <Box></Box>
              ) : (
                <Box mt="6px">
                  <Typography
                    fontWeight="fontWeightMedium"
                    color={theme.palette.text.secondary}
                  >
                    {taxonDetail?.name}
                  </Typography>
                  <Box pl={1.5} mt="6px">
                    <FormGroup>
                      {taxonDetail?.children.map((taxon, index) => {
                        return (
                          <FormControlLabel
                            key={index}
                            onChange={getTaxonValues}
                            control={
                              <Checkbox
                                sx={{ padding: "7px" }}
                                size="small"
                                value={taxon.id}
                                checked={listTaxon.some(
                                  (data) => data == taxon.id,
                                )}
                              />
                            }
                            label={
                              <Typography variant="subtitle2">
                                {taxon.name}
                              </Typography>
                            }
                          />
                        );
                      })}
                    </FormGroup>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </React.Fragment>
    </div>
  );
}

export const NesFilter = memo(NesFilterComponent, isEqual);
