import { IPostItem } from "@hera/data";
import { Image } from "@hera/ui";
import { formatDetailDayTime } from "@hera/utils";
import { useBreakPoint } from "@lc/hooks";
import { itemBreakPoint } from "@lc/utils";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Link,
  styled,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { memo } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";

const SubImageWrapper = styled(Box)`
  position: relative;
  width: 100%;
  height: 100%;
`;
interface Props {
  bgColor?: string;
  onBorder?: boolean;
  layoutLeft: any;
  layoutRight: any;
  hiddenContent?: boolean;
  tipName: string;
  postData?: IPostItem;
  imageMaxHeight?: string;
  height?: string;
  fontType:
    | "button"
    | "caption"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "inherit"
    | "overline"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2";
}

const TypographyComponent = styled(Typography)`
  display: inline;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
`;

const BlogSubCardComponent = ({
  bgColor,
  onBorder = true,
  hiddenContent = true,
  tipName,
  layoutLeft,
  layoutRight,
  postData,
  imageMaxHeight,
  height,
  fontType,
}: Props) => {
  const responsiveItemLeft = itemBreakPoint(layoutLeft);
  const responsiveItemRight = itemBreakPoint(layoutRight);
  const { locale } = useIntl();
  const isPC = useBreakPoint("sm");

  const router = useRouter();
  return (
    <Card sx={{ display: "flex", boxShadow: "none" }}>
      <Grid container spacing={2}>
        <Grid item {...responsiveItemLeft} maxHeight={imageMaxHeight}>
          <Link
            href="#"
            underline="none"
            onClick={(e) => {
              e.preventDefault();
              router.push(`/blog/p/${postData?.slug}`);
            }}
          >
            <SubImageWrapper>
              <Box
                position="absolute"
                display="flex"
                alignItems="center"
                sx={{
                  zIndex: 1,
                  backgroundColor: "common.black",
                  py: "2px",
                  px: "8px",
                  top: { xs: "2px", sm: "8px" },
                  left: { xs: "2px", sm: "8px" },
                }}
              >
                <Typography
                  variant={isPC ? "body1" : "caption"}
                  color="common.white"
                  textAlign="center"
                >
                  {postData?.category?.name}
                </Typography>
              </Box>
              <Image
                layout="fill"
                src={postData?.coverImage}
                alt={postData?.category.name}
              />
            </SubImageWrapper>
          </Link>
        </Grid>
        <Grid item {...responsiveItemRight}>
          <Box
            sx={{ display: "flex", flexDirection: "column" }}
            height={height}
          >
            <Link
              href="#"
              underline="none"
              onClick={(e) => {
                e.preventDefault();
                router.push(`/blog/p/${postData?.slug}`);
              }}
            >
              <CardContent
                sx={{
                  backgroundColor: `${bgColor}`,
                  p: "0!important",
                  flex: "1 0 auto",
                }}
              >
                <TypographyComponent variant={fontType} color="grey.900">
                  {postData?.title}
                </TypographyComponent>

                <Typography variant="caption" color="grey.500">
                  LGCosmetics &nbsp; | &nbsp;
                  {formatDetailDayTime(postData?.updatedAt, locale)}
                </Typography>
                {!onBorder ? (
                  <Box></Box>
                ) : (
                  <Box
                    sx={{
                      width: "100px",
                      backgroundColor: "grey.900",
                      height: "1px",
                      my: "8px",
                    }}
                  ></Box>
                )}
                {hiddenContent ? (
                  <Box></Box>
                ) : (
                  <Box>
                    <TypographyComponent variant="subtitle2" color="grey.700">
                      {postData?.excerpt}
                    </TypographyComponent>
                  </Box>
                )}
              </CardContent>
            </Link>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

BlogSubCardComponent.defaultProps = {
  imageMaxHeight: "100px",
  height: "0",
  fontType: "subtitle2",
};
export const BlogSubCard = memo(BlogSubCardComponent, isEqual);
