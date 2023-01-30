import { AuthenticationContext } from "@hera/contexts";
import { IProductDetail, useGetProductReviews } from "@hera/data";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { memo, useContext, useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";
import {
  LcProductDetailComment,
  LcProductDetailDashBoard,
  LcProductDetailDescriptions,
  LcProductDetailSendRating,
} from "./index";
interface Props {
  productDetail: IProductDetail;
  setCommentCount: (e) => void;
  commentCount: number;
}

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
const LcProductDetailContentComponent = ({
  productDetail: product,
  commentCount,
  setCommentCount,
}: Props) => {
  let reviewData = null;
  if (typeof window !== "undefined") {
    reviewData = !localStorage?.getItem("reviewRoute")
      ? null
      : JSON.parse(localStorage?.getItem("reviewRoute"));
  }
  const [content, setContent] = useState<boolean>(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const [commentPaginationParams, setCommentPaginationParams] = useState({});

  const { data: getProductReviews, refetch: refetchProductReviews } =
    useGetProductReviews(
      //@ts-ignore
      commentPaginationParams,
    );

  useEffect(() => {
    if (reviewData !== null) {
      setContent(!reviewData.openReviewList);
      setCommentPaginationParams({
        sortBy: "latest",
        productId: product?.id,
        size: 5,
        page: 1,
      });
      localStorage?.removeItem("reviewRoute");
    } else {
      setCommentPaginationParams({
        sortBy: "latest",
        productId: product?.id,
        size: 5,
        page: 1,
      });
    }
    refetchProductReviews();
  }, [product?.id]);

  const pageContent = {
    description: formatMessage({ id: "productDetail.description" }),
    detail: formatMessage({ id: "productDetail.detail" }),
    review: formatMessage({ id: "productDetail.review" }),
  };

  const handlePanelExpand = (panel: string | null) =>
    setExpanded(expanded === panel ? null : panel);

  const handleChangeDescription = () => {
    setContent(true);
  };

  const handleChangeReview = () => {
    setContent(false);
  };

  const authen = useContext(AuthenticationContext);
  return (
    <>
      <Box
        sx={{
          mt: 2,
          borderTop: `1px solid`,
          borderColor: "grey.50",
          display: { xs: "block", sm: "none" },
        }}
      >
        <ProductDetailAccordion
          disableGutters
          onChange={() => handlePanelExpand("panel1")}
          expanded={expanded === "panel1"}
        >
          <AccordionSummary
            expandIcon={
              expanded === `panel1` ? (
                <RemoveIcon sx={{ color: "grey.600" }} />
              ) : (
                <AddIcon sx={{ color: "grey.600" }} />
              )
            }
          >
            <Typography textTransform="uppercase" variant="h6">
              {pageContent.description}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <LcProductDetailDescriptions description={product?.description} />
          </AccordionDetails>
        </ProductDetailAccordion>
        <ProductDetailAccordion
          disableGutters
          onChange={() => handlePanelExpand("panel2")}
          expanded={expanded === "panel2"}
        >
          <AccordionSummary
            expandIcon={
              expanded === `panel2` ? (
                <RemoveIcon sx={{ color: "grey.600" }} />
              ) : (
                <AddIcon sx={{ color: "grey.600" }} />
              )
            }
          >
            <Typography textTransform="uppercase" variant="h6">
              {pageContent.detail}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <LcProductDetailDashBoard product={product} />
          </AccordionDetails>
        </ProductDetailAccordion>
        <ProductDetailAccordion
          disableGutters
          onChange={() => handlePanelExpand("panel3")}
          expanded={expanded === "panel3"}
        >
          <AccordionSummary
            expandIcon={
              expanded === `panel3` ? (
                <RemoveIcon sx={{ color: "grey.600" }} />
              ) : (
                <AddIcon sx={{ color: "grey.600" }} />
              )
            }
          >
            <Typography textTransform="uppercase" variant="h6">
              {pageContent.review}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <LcProductDetailComment
              ratingAvg={product?.ratingAvg}
              reviewItem={getProductReviews?.data}
              productReviews={getProductReviews}
              commentCount={commentCount}
              //@ts-ignore
              commentPaginationParams={commentPaginationParams}
              setCommentPaginationParams={setCommentPaginationParams}
              setCommentCount={setCommentCount}
            />
            {authen.isLogin ? (
              <LcProductDetailSendRating product={product} />
            ) : (
              <Box></Box>
            )}
          </AccordionDetails>
        </ProductDetailAccordion>
      </Box>

      <Grid
        container
        mt={9.5}
        sx={{ display: { sm: "flex", xs: "none" } }}
        spacing={3}
      >
        <Grid item sm={8}>
          <Box>
            <Button
              variant="contained"
              size="large"
              color={content ? "primary" : "inherit"}
              sx={{
                textTransform: "uppercase",
                width: "160px",
                height: "44px",
                fontSize: theme.typography.subtitle1,
                backgroundColor: `${content ? "primary" : "grey.A200"}`,
              }}
              onClick={handleChangeDescription}
            >
              {pageContent.description}
            </Button>
            <Button
              variant="contained"
              size="large"
              color={!content ? "primary" : "inherit"}
              sx={{
                textTransform: "uppercase",
                ml: "16px",
                width: "160px",
                height: "44px",
                fontSize: theme.typography.subtitle1,
                backgroundColor: `${!content ? "primary" : "grey.A200"}`,
              }}
              onClick={handleChangeReview}
            >
              {pageContent.review}
            </Button>
            {content ? (
              <LcProductDetailDescriptions description={product?.description} />
            ) : (
              <LcProductDetailComment
                ratingAvg={product?.ratingAvg}
                reviewItem={getProductReviews?.data}
                productReviews={getProductReviews}
                commentCount={commentCount}
                //@ts-ignore
                commentPaginationParams={commentPaginationParams}
                setCommentPaginationParams={setCommentPaginationParams}
                setCommentCount={setCommentCount}
              />
            )}
          </Box>
        </Grid>
        <Grid item sm={4}>
          {content ? (
            <LcProductDetailDashBoard product={product} />
          ) : authen.isLogin ? (
            <LcProductDetailSendRating product={product} />
          ) : (
            <Box></Box>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export const LcProductDetailContent = memo(
  LcProductDetailContentComponent,
  isEqual,
);
