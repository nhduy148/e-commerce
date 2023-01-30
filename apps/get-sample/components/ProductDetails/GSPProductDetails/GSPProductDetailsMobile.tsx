import {
  GSPProductDetailsDashBoard,
  GSPProductDetailsDescriptions,
  IProductDetailsProps,
} from "@gsp/components";
import { useFormatter } from "@hera/i18n";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { FC, useState } from "react";

const ProductDetailAccordion = styled(Accordion)`
  width: 100%;
  :before {
    height: 0;
  }
  box-shadow: none;

  .MuiAccordionSummary-root {
    display: flex;
    align-items: center;
    padding: 0;
    flex-direction: row-reverse;
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey[50]};
  }

  .MuiAccordionSummaryContent-root {
    display: flex;
    align-items: center;
  }

  .MuiAccordionDetails-root {
    padding: 16px 0;
  }

  .MuiAccordionSummary-expandIconWrapper {
    margin-right: 8px;
  }
`;

export const GSPProductDetailsMobile: FC<IProductDetailsProps> = ({
  productDetail,
}) => {
  const { __ } = useFormatter();
  const theme = useTheme();

  const [expanded, setExpanded] = useState<string | null>(null);
  const handlePanelExpand = (panel: string | null) =>
    setExpanded(expanded === panel ? null : panel);

  return (
    <Box
      sx={{
        mt: 2,
        borderRadius: "8px",
        borderTop: `1px solid`,
        borderColor: "grey.50",
      }}
    >
      <ProductDetailAccordion
        sx={{
          backgroundColor: theme.palette.background.default,
        }}
        disableGutters
        onChange={() => handlePanelExpand("panel1")}
        expanded={expanded === "panel1"}
      >
        <AccordionSummary
          sx={{
            borderTop: `0.5px solid`,
            borderColor: theme.palette.divider,
          }}
          expandIcon={
            expanded === `panel1` ? (
              <RemoveIcon sx={{ color: theme.palette.text.primary }} />
            ) : (
              <AddIcon sx={{ color: theme.palette.text.primary }} />
            )
          }
        >
          <Typography variant="subtitle1">
            {__({ defaultMessage: "Miêu tả" })}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <GSPProductDetailsDescriptions
            description={productDetail?.description}
          />
        </AccordionDetails>
      </ProductDetailAccordion>

      <ProductDetailAccordion
        sx={{
          backgroundColor: theme.palette.background.default,
        }}
        disableGutters
        onChange={() => handlePanelExpand("panel2")}
        expanded={expanded === "panel2"}
      >
        <AccordionSummary
          expandIcon={
            expanded === `panel2` ? (
              <RemoveIcon sx={{ color: theme.palette.text.primary }} />
            ) : (
              <AddIcon sx={{ color: theme.palette.text.primary }} />
            )
          }
        >
          <Typography variant="subtitle1">
            {__({ defaultMessage: "Chi tiết" })}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <GSPProductDetailsDashBoard productDetail={productDetail} />
        </AccordionDetails>
      </ProductDetailAccordion>
    </Box>
  );
};
