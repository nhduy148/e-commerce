import { useBreakPoint } from "@lc/hooks";
import { Box, Button, Collapse } from "@mui/material";
import { memo, useLayoutEffect, useRef, useState } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";

interface Props {
  description: string;
}
const LcProductDetailDescriptionsComponent = ({ description }: Props) => {
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
  }, [descriptionRef, isPC]);
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
        <Box position="relative">
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
                background:
                  "linear-gradient(to bottom,rgba(255 255 255/0),rgba(255 255 255/62.5),rgba(255 255 255/1))",
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
          <Button onClick={handleChange}>
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

export const LcProductDetailDescriptions = memo(
  LcProductDetailDescriptionsComponent,
  isEqual,
);
