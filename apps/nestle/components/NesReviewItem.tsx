import { IPostItem } from "@hera/data";
import { Image } from "@hera/ui";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { Box, Button, Stack, styled, Tooltip, Typography } from "@mui/material";
import { DefaultProductImage } from "@nestle/static/images";
import { useRouter } from "next/router";
import { FunctionComponent, memo } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";

interface IProps extends IPostItem {}

const StyledTitle = styled(Typography)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const StyledExcerpt = styled(Typography)`
  color: ${({ theme }) => theme.palette.text.secondary};
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NesReviewItemComponent: FunctionComponent<IProps> = ({
  coverImage,
  title,
  excerpt,
  slug,
}) => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const renderImage = coverImage || DefaultProductImage?.src;
  return (
    <Box>
      <Box sx={{ paddingTop: "44.5%", mb: 3, position: "relative" }}>
        <Image
          src={renderImage}
          alt={title}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </Box>
      <Stack spacing={3}>
        <Tooltip title={title}>
          <StyledTitle variant="body1">
            <b>{title}</b>
          </StyledTitle>
        </Tooltip>
        <StyledExcerpt variant="body2">{excerpt}</StyledExcerpt>
        <Button
          href={`/blog/p/${slug}`}
          endIcon={<ArrowForwardIcon />}
          variant="text"
          size="medium"
          sx={{ alignSelf: "flex-start" }}
          onClick={(e) => {
            e.preventDefault();
            router.push(`/blog/p/${slug}`);
          }}
        >
          {formatMessage({ id: "common.seeMore" })}
        </Button>
      </Stack>
    </Box>
  );
};

export const NesReviewItem = memo(NesReviewItemComponent, isEqual);
