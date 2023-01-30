import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import { Box, Button, Collapse } from "@mui/material";
import { useBreakPoint } from "@nestle/hooks";
import { memo, useLayoutEffect, useRef, useState } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";

interface Props {
  description: string;
}
const NesProductDetailDescriptionsComponent = ({ description }: Props) => {
  const { formatMessage } = useIntl();
  const descriptionRef = useRef(null);
  const isPC = useBreakPoint("sm");
  const [descriptionHeight, setDescriptionHeight] = useState(500);
  const [checked, setChecked] = useState(false);
  const handleChange = () => {
    setChecked(!checked);
  };
  useLayoutEffect(() => {
    setDescriptionHeight(descriptionRef?.current?.offsetHeight);
  }, [isPC]);
  setTimeout(() => {
    setDescriptionHeight(descriptionRef?.current?.offsetHeight);
  }, 500);
  const pointHeight = isPC ? 500 : 300;
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
          <Collapse in={checked} collapsedSize={500}>
            <Box
              ref={descriptionRef}
              sx={{ "& img": { width: "100%" } }}
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            />
          </Collapse>
          {!checked && descriptionHeight > pointHeight && (
            <Box
              sx={{
                background: `linear-gradient(to bottom,rgba(255 247 236/0),rgba(255 247 236/62.5),rgba(255 247 236/1))`,
                bottom: "0",
                height: "105px",
                left: "0",
                position: "absolute",
                width: "100%",
              }}
            ></Box>
          )}
        </Box>
      </Box>
      {descriptionHeight > pointHeight ? (
        <Box width="100%" display="flex" justifyContent="center">
          <Button
            onClick={handleChange}
            endIcon={
              checked ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
            }
            size="large"
          >
            {checked
              ? formatMessage({ id: "productDetail.hidden" })
              : formatMessage({ id: "productDetail.more" })}
          </Button>
        </Box>
      ) : (
        <Box></Box>
      )}
    </Box>
  );
};

export const NesProductDetailDescriptions = memo(
  NesProductDetailDescriptionsComponent,
  isEqual,
);
