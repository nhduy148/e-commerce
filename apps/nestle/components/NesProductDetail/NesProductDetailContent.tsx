import { AuthenticationContext } from "@hera/contexts";
import { IProductDetail, useGetProductReviews } from "@hera/data";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  lighten,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { memo, useContext, useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";
import {
  NesProductDetailComment,
  NesProductDetailDescriptions,
  NesProductDetailSendRating,
} from "./index";
interface Props {
  productDetail: IProductDetail;
  productDetailRefetch: () => void;
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
const NesProductDetailContentComponent = ({
  productDetail: product,
  productDetailRefetch,
}: Props) => {
  const [isReviewing, setIsReviewing] = useState<boolean>(false);

  const [expanded, setExpanded] = useState<string | null>(null);
  const [reviewList, setReviewList] = useState([]);
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const [commentPaginationParams, setCommentPaginationParams] = useState({
    productId: product?.id,
    size: 5,
    page: 1,
  });

  const { data: getProductReviews, refetch: productReviewRefetch } =
    //@ts-ignore
    useGetProductReviews(commentPaginationParams);

  useEffect(() => {
    setReviewList(getProductReviews?.data);
  }, [getProductReviews?.data?.length, commentPaginationParams]);

  const pageContent = {
    description: formatMessage({ id: "productDetail.description" }),
    detail: formatMessage({ id: "productDetail.detail" }),
    review: formatMessage({ id: "productDetail.review" }),
  };

  const handlePanelExpand = (panel: string | null) =>
    setExpanded(expanded === panel ? null : panel);

  const handleChangeDescription = () => {
    setIsReviewing(false);
  };

  const handleChangeReview = () => {
    setIsReviewing(true);
  };

  const authen = useContext(AuthenticationContext);

  return (
    <>
      <Box
        sx={{
          mt: 2,
          borderRadius: "8px",
          borderTop: `1px solid`,
          borderColor: "grey.50",
          display: { xs: "block", sm: "none" },
        }}
      >
        <ProductDetailAccordion
          sx={{
            backgroundColor: theme.palette.custom.primaryBackground,
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
                <RemoveIcon sx={{ color: "text.main" }} />
              ) : (
                <AddIcon sx={{ color: "text.main" }} />
              )
            }
          >
            <Typography variant="subtitle1">
              {pageContent?.description}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <NesProductDetailDescriptions description={product?.description} />
          </AccordionDetails>
        </ProductDetailAccordion>
        {/* <ProductDetailAccordion
          disableGutters
          onChange={() => handlePanelExpand("panel2")}
          expanded={expanded === "panel2"}
        >
          <AccordionSummary
            expandIcon={
              expanded === `panel2` ? (
                <RemoveIcon sx={{ color: "text.main" }} />
              ) : (
                <AddIcon sx={{ color: "text.main" }} />
              )
            }
          >
            <Typography textTransform="uppercase" variant="h6">
              {pageContent?.detail}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <NesProductDetailDashBoard product={product} />
          </AccordionDetails>
        </ProductDetailAccordion> */}
        <ProductDetailAccordion
          sx={{
            backgroundColor: theme.palette.custom.primaryBackground,
          }}
          disableGutters
          onChange={() => handlePanelExpand("panel3")}
          expanded={expanded === "panel3"}
        >
          <AccordionSummary
            sx={{
              borderTop: `0.5px solid`,
              borderColor: theme.palette.divider,
            }}
            expandIcon={
              expanded === `panel3` ? (
                <RemoveIcon sx={{ color: "text.main" }} />
              ) : (
                <AddIcon sx={{ color: "text.main" }} />
              )
            }
          >
            <Typography variant="subtitle1">{pageContent?.review}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <NesProductDetailComment
              ratingAvg={product?.ratingAvg}
              reviewItem={getProductReviews?.data}
              productReviews={getProductReviews}
              //@ts-ignore
              commentPaginationParams={commentPaginationParams}
              setCommentPaginationParams={setCommentPaginationParams}
            />
            {isReviewing && authen.isLogin ? (
              <NesProductDetailSendRating
                setCommentPaginationParams={setCommentPaginationParams}
                product={product}
                productReviewRefetch={productReviewRefetch}
                productDetailRefetch={productDetailRefetch}
              />
            ) : (
              <></>
            )}
          </AccordionDetails>
        </ProductDetailAccordion>
      </Box>

      <Grid
        container
        mt={5.5}
        sx={{ display: { sm: "flex", xs: "none" } }}
        spacing={3}
      >
        <Grid item sm={8}>
          <Box>
            <Box
              mb={3}
              sx={{
                display: "flex",
                cursor: "pointer",
              }}
            >
              <Box
                sx={{
                  mr: 2,
                  backgroundColor: `${
                    !isReviewing
                      ? `${lighten(theme.palette.primary.main, 0.8)}`
                      : "none"
                  }`,
                  borderRadius: "6px",
                  padding: "10px 16px",
                  color: `${!isReviewing ? "primary.main" : "text.main"}`,
                }}
                onClick={handleChangeDescription}
              >
                {pageContent?.description}
              </Box>
              <Box
                sx={{
                  backgroundColor: `${
                    isReviewing
                      ? `${lighten(theme.palette.primary.main, 0.8)}`
                      : "none"
                  }`,
                  borderRadius: "6px",
                  padding: "10px 16px",
                  color: `${isReviewing ? "primary.main" : "text.main"}`,
                }}
                onClick={handleChangeReview}
              >
                {pageContent?.review}
              </Box>
            </Box>
            {!isReviewing ? (
              <NesProductDetailDescriptions
                description={product?.description}
              />
            ) : (
              <NesProductDetailComment
                ratingAvg={product?.ratingAvg}
                reviewItem={getProductReviews?.data}
                productReviews={getProductReviews}
                //@ts-ignore
                commentPaginationParams={commentPaginationParams}
                setCommentPaginationParams={setCommentPaginationParams}
              />
            )}
          </Box>
        </Grid>
        <Grid item sm={4}>
          {isReviewing && authen.isLogin ? (
            <NesProductDetailSendRating
              setCommentPaginationParams={setCommentPaginationParams}
              product={product}
              productReviewRefetch={productReviewRefetch}
              productDetailRefetch={productDetailRefetch}
            />
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export const NesProductDetailContent = memo(
  NesProductDetailContentComponent,
  isEqual,
);
