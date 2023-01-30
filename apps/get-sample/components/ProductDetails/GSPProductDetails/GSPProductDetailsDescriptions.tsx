import { useBreakPoint } from "@gsp/hooks";
import { useFormatter } from "@hera/i18n";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import { Box, Button, Collapse } from "@mui/material";
import { FC, memo, useLayoutEffect, useRef, useState } from "react";
import isEqual from "react-fast-compare";

interface IProps {
  description: string;
}

const GSPProductDetailDescriptionsComponent: FC<IProps> = ({ description }) => {
  const [descriptionHeight, setDescriptionHeight] = useState(500);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const descriptionRef = useRef(null);

  const { __ } = useFormatter();
  const isPC = useBreakPoint("sm");

  useLayoutEffect(() => {
    setDescriptionHeight(descriptionRef?.current?.offsetHeight);
  }, [description]);

  const pointHeight = isPC ? 500 : 300;

  const handleExpandDescription = () => {
    setIsDescriptionExpanded((prevState) => !prevState);
  };

  return (
    <Box>
      <Box
        sx={{
          "& > :not(style)": {
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
          },
        }}
      >
        <Box position="relative" sx={{ wordBreak: "break-word" }}>
          <Collapse in={isDescriptionExpanded} collapsedSize={500}>
            <Box
              ref={descriptionRef}
              sx={{ "& img": { width: "100%" } }}
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            />
          </Collapse>
          {!isDescriptionExpanded && descriptionHeight > pointHeight && (
            <Box
              sx={{
                background: `linear-gradient(to bottom,rgba(255 255 255/0),rgba(255 255 255/62.5),rgba(255 255 255/1))`,
                bottom: "0",
                height: "105px",
                left: "0",
                position: "absolute",
                width: "100%",
              }}
            />
          )}
        </Box>
      </Box>
      {descriptionHeight > pointHeight && (
        <Box width="100%" display="flex" justifyContent="center">
          <Button
            onClick={handleExpandDescription}
            endIcon={
              isDescriptionExpanded ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )
            }
            size="large"
          >
            {isDescriptionExpanded
              ? __({ defaultMessage: "Ẩn bớt" })
              : __({ defaultMessage: "Xem thêm" })}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export const GSPProductDetailsDescriptions = memo(
  GSPProductDetailDescriptionsComponent,
  isEqual,
);
