import { IPostItem } from "@hera/data";
import { Image } from "@hera/ui";
import { formatDetailDayTime } from "@hera/utils";
import {
  Box,
  Card,
  CardContent,
  Link,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { memo } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";

const ImageWrapper = styled(Box)`
  position: relative;
  padding-top: 60%;
`;

interface Props {
  bgColor?: string;
  onBorder?: boolean;
  hiddenContent?: boolean;
  tipName: string;
  postData?: IPostItem;
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

const BlogCardComponent = ({
  bgColor,
  onBorder,
  hiddenContent,
  tipName,
  postData,
}: Props) => {
  const { locale } = useIntl();
  const theme = useTheme();
  const isPC = useMediaQuery(theme.breakpoints.up("sm"));

  const router = useRouter();
  return (
    <Card sx={{ width: "100%", boxShadow: "none" }}>
      <Link
        href={`/blog/p/${postData?.slug}`}
        underline="none"
        onClick={(e) => {
          e.preventDefault();
          router.push(`/blog/p/${postData?.slug}`);
        }}
      >
        <ImageWrapper>
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
            >
              {postData?.category?.name}
            </Typography>
          </Box>

          <Image
            src={postData?.coverImage}
            alt={postData?.category.name}
            layout="fill"
          />
        </ImageWrapper>

        <CardContent
          sx={{
            backgroundColor: `${bgColor}`,
            py: "8px!important",
            px: "0",
          }}
        >
          <TypographyComponent variant="subtitle2" color="grey.900">
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
    </Card>
  );
};
export const BlogCard = memo(BlogCardComponent, isEqual);
