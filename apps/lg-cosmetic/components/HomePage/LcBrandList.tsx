import { IShoppageBrand } from "@hera/data";
import { Banner } from "@hera/ui";
import { ratioToPercentage } from "@hera/utils";
import { LcSectionHeading, LcSliderListProduct } from "@lc/components";
import { useBreakPoint } from "@lc/hooks";
import {
  Box,
  Container,
  lighten,
  Stack,
  styled,
  useTheme,
} from "@mui/material";
import { FC, useState } from "react";

interface IProps {
  brands: IShoppageBrand[];
  heading?: string;
}

const StyledBrandLogo = styled("img")`
  object-position: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const LcBrandList: FC<IProps> = ({ brands, heading }) => {
  const { palette } = useTheme();
  const isPC = useBreakPoint("sm");
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <Stack spacing={4}>
      {heading && heading.length > 0 && <LcSectionHeading text={heading} />}
      <Box>
        <Container>
          <Box display="flex" flexWrap={isPC ? "nowrap" : "wrap"}>
            {(brands || []).map((brand, index) => (
              <Box
                sx={{
                  flex: 1,
                  flexBasis: isPC ? "100%" : "50%",
                  position: "relative",
                  pt: ratioToPercentage(isPC ? 300 : 160, isPC ? 30 : 50),
                  backgroundColor:
                    activeIndex === index
                      ? palette.primary.main
                      : palette.common.white,
                  transition: "300ms",
                  cursor: "pointer",

                  ":hover": {
                    backgroundColor:
                      activeIndex === index
                        ? palette.primary.main
                        : lighten(palette.primary.main, 0.9),
                  },
                }}
                key={index}
                onClick={() => setActiveIndex(index)}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    right: 10,
                    bottom: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    position="relative"
                    width={1}
                    height={1}
                    maxWidth={{ xs: 80, sm: 100 }}
                  >
                    <StyledBrandLogo
                      src={brand.inactiveImage}
                      style={{
                        opacity: activeIndex === index ? 0 : 1,
                      }}
                    />
                    <StyledBrandLogo
                      src={brand.activeImage}
                      style={{
                        opacity: activeIndex === index ? 1 : 0,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
      <Box>
        <Container>
          <Banner
            source={brands[activeIndex]}
            ratio={isPC ? { x: 1120, y: 250 } : { x: 343, y: 157 }}
          />
        </Container>
      </Box>
      <LcSliderListProduct products={brands[activeIndex]?.products || []} />
    </Stack>
  );
};

export { LcBrandList };
