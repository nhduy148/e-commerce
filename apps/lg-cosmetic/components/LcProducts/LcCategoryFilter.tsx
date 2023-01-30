import { ICategory, IDetailTaxon } from "@hera/data";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import {
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionProps,
  AccordionSummary as MuiAccordionSummary,
  AccordionSummaryProps,
  Box,
  Checkbox,
  FormControlLabel,
  styled,
  Typography,
} from "@mui/material";
import { memo } from "react";
import isEqual from "react-fast-compare";

interface Props {
  listCategories?: ICategory;
  getTaxonValues: (x, y) => void;
  taxonDetail: IDetailTaxon;
  listTaxon: number[];
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary {...props} />
))(({ theme }) => ({
  padding: "0px",
  "& .MuiAccordionSummary-content": {
    margin: "0px",
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: "0px",
}));

const LcCategoryFilterComponent = ({
  listCategories,
  getTaxonValues,
  taxonDetail,
  listTaxon,
}: Props) => {
  const categoryList = (listItem) => {
    if (listItem.taxons.length > 0) {
      return listItem.taxons.map((taxon: ICategory, index) => {
        let checkSlug = !taxonDetail
          ? false
          : !taxonDetail?.slug.indexOf(taxon.slug);
        return (
          <Box
            key={index}
            sx={{ display: "flex", flexDirection: "column", ml: 3 }}
          >
            <FormControlLabel
              label={taxon.name}
              onChange={(value) => {
                getTaxonValues(value, taxon);
              }}
              control={
                <Checkbox
                  disabled={
                    !taxonDetail
                      ? false
                      : taxon.id == taxonDetail?.id || checkSlug
                  }
                  checked={
                    listTaxon.some((data) => {
                      return data == taxon.id;
                    }) ||
                    taxon.id == taxonDetail?.id ||
                    checkSlug
                  }
                />
              }
            />
            {categoryList(taxon)}
          </Box>
        );
      });
    }
  };

  return (
    <Box mt="14px">
      <Typography textTransform="uppercase" variant="subtitle1">
        Danh mục
      </Typography>
      <Box sx={{ pl: "14px", pt: "16px" }}>
        <Box>
          {listCategories?.taxons.map((taxon, index) => {
            let checkSlug = !taxonDetail
              ? false
              : !taxonDetail?.slug.indexOf(taxon.slug);
            return (
              <Accordion key={index}>
                <AccordionSummary
                  aria-controls="subCategory-content"
                  id="subCategory-header"
                  expandIcon={
                    taxon.taxons.length === 0 ? "" : <ExpandMoreIcon />
                  }
                >
                  <FormControlLabel
                    onChange={(value) => getTaxonValues(value, taxon)}
                    control={
                      <Checkbox
                        disabled={
                          !taxonDetail
                            ? false
                            : taxon.id == taxonDetail?.id || checkSlug
                        }
                        value={taxon.id}
                        checked={
                          listTaxon.some((data) => {
                            return data == taxon.id;
                          }) ||
                          taxon.id == taxonDetail?.id ||
                          checkSlug
                        }
                      />
                    }
                    label={
                      <Typography variant="body2">{taxon.name}</Typography>
                    }
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <Box>{categoryList(taxon)}</Box>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export const LcCategoryFilter = memo(LcCategoryFilterComponent, isEqual);
