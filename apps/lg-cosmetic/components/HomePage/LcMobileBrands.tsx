import { IBannerData } from "@hera/data";
import { ratioToPercentage } from "@hera/utils";
import { ServerImage } from "@lc/components";
import { useBreakPoint } from "@lc/hooks";
import { Box, Container, Divider } from "@mui/material";
import { useRouter } from "next/router";
import { FC } from "react";

interface IProps {
  listBrands: IBannerData[];
  onClick?: (event?: any, url?: string) => void;
}

const LcMobileBrands: FC<IProps> = ({ listBrands, onClick }) => {
  const isPC = useBreakPoint("sm");
  if (isPC) {
    return null;
  }
  const { push } = useRouter();
  const handleBrandItemClick = (url: string) => push(url);

  const renderDivider = (index: number) => {
    if (listBrands.length === 1) {
      return null;
    }
    if ((index + 1) % 2 !== 0 && index < listBrands.length - 1) {
      return (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 0,
            bottom: 10,
            left: "unset",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Divider
            flexItem
            orientation="vertical"
            sx={{
              background: "transparent",
              boxShadow: "inset 0px -1px 0px #EDEDED",
              width: "1px",
              height: 1,
            }}
          />
        </Box>
      );
    }
    if (listBrands.length % 2 !== 0 && index === listBrands.length - 1) {
      return (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 10,
            bottom: "unset",
            left: 10,
            display: "flex",
            justifyContent: "flex-start",
            flexDirection: "column",
          }}
        >
          <Divider
            flexItem
            sx={{
              background: "transparent",
              boxShadow: "inset 0px -1px 0px #EDEDED",
              width: 1,
              height: "1px",
            }}
          />
        </Box>
      );
    }
  };

  return listBrands?.length > 0 ? (
    <Container>
      <Box bgcolor="common.white" position="relative">
        <Box display="flex" flexWrap="wrap">
          {listBrands?.map((brand, index) => (
            <Box
              key={index}
              flex="1 1 50%"
              position="relative"
              pt={ratioToPercentage(160, 50)}
            >
              <Box
                onClick={(e) =>
                  onClick ? onClick(e, brand?.url || "#") : handleBrandItemClick
                }
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  bottom: 10,
                  left: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "all 300ms",
                  ":hover": {
                    opacity: 0.6,
                  },
                }}
              >
                <Box maxWidth={{ xs: 90, sm: 120 }}>
                  <ServerImage
                    src={brand.mobilePhotoUrl}
                    layout="fill"
                    objectFit="contain"
                    objectPosition="center center"
                    width={3840}
                    quality={100}
                  />
                </Box>
              </Box>
              {renderDivider(index)}
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  ) : null;
};

export { LcMobileBrands };
