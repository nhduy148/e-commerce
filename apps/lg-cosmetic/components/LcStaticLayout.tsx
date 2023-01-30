import React from "react";

import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  styled,
  Typography,
} from "@mui/material";

import { Image } from "@hera/ui";
interface IBreadcrumb {
  name: string;
  url: string;
}

interface IStaticLayout {
  breadcrumb: IBreadcrumb;
  pageName: string;
}

const BreadcrumbsLink = styled(Link)`
  color: ${({ theme }) => theme.palette.text.primary};
  text-transform: uppercase;
`;

const HeadingContainer = styled(Box)`
  padding-top: 20px;
  position: relative;
  text-align: center;
  text-transform: uppercase;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 56px;
    height: 2px;
    background-color: ${({ theme }) => theme.palette.primary.main};
  }
`;

const BrandItem = styled(Box)`
  background-color: ${({ theme }) => theme.palette.grey[100]};
  display: flex;
  align-items: center;
  padding: 12px;
`;

const CustomerImage = styled(Box)`
  border: 4px solid ${({ theme }) => theme.palette.common.white};
`;

const dummyImage =
  "https://dummyimage.com/1320x460/d4d4d4/000.png&text=LG+Vina+cosmetics";

const dummyCustomersImage =
  "https://dummyimage.com/355x240/d4d4d4/000.png&text=LG+Vina+cosmetics";

const dummyBrands = [
  {
    name: "O HUI",
    logo: "https://dummyimage.com/60x60/d4d4d4/000.png&text=LG+Vina+cosmetics",
  },
  {
    name: "Lorem ipsum dolor",
    logo: "https://dummyimage.com/60x60/d4d4d4/000.png&text=LG+Vina+cosmetics",
  },
  {
    name: "Lorem ipsum dolor",
    logo: "https://dummyimage.com/60x60/d4d4d4/000.png&text=LG+Vina+cosmetics",
  },
  {
    name: "Lorem ipsum dolor",
    logo: "https://dummyimage.com/60x60/d4d4d4/000.png&text=LG+Vina+cosmetics",
  },
  {
    name: "Lorem ipsum dolor",
    logo: "https://dummyimage.com/60x60/d4d4d4/000.png&text=LG+Vina+cosmetics",
  },
  {
    name: "Lorem ipsum dolor",
    logo: "https://dummyimage.com/60x60/d4d4d4/000.png&text=LG+Vina+cosmetics",
  },
  {
    name: "Lorem ipsum dolor",
    logo: "https://dummyimage.com/60x60/d4d4d4/000.png&text=LG+Vina+cosmetics",
  },
];

export const LcStaticLayout: React.FunctionComponent<IStaticLayout> = ({
  breadcrumb,
  pageName,
  children,
}) => {
  const breadcrumbLinks: IBreadcrumb[] = [
    {
      name: "Trang chủ",
      url: "/",
    },
    breadcrumb,
  ];

  return (
    <Container>
      <Box mb={4} mt={2.75}>
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{ display: { sm: "block", xs: "none" } }}
        >
          {breadcrumbLinks.map((link, key) => (
            <BreadcrumbsLink
              href={link.url}
              underline="hover"
              variant="body2"
              key={key}
            >
              {link.name}
            </BreadcrumbsLink>
          ))}
        </Breadcrumbs>
      </Box>
      <Box>
        <Typography
          textTransform="uppercase"
          sx={{ typography: { xs: "h5", sm: "h4" } }}
          mt={4}
          mb={{ sm: 6.5, xs: 2.5 }}
        >
          {pageName}
        </Typography>
        <Box sx={{ mb: { sm: 9, xs: 3.75 } }}>
          <Image
            src="https://lgvina.vn/uploads/slider/Aboutusnew-min.jpg"
            width={1240}
            height={330}
          />
        </Box>
      </Box>
      <Box sx={{ mb: 10.75 }}>{children}</Box>
      {/* <Box sx={{ mb: 10.75 }}>
          <HeadingContainer sx={{ mb: { sm: 10.75, xs: 6.5 }, mt: 10.5 }}>
            <Typography color="text.main" variant="h6">
              Thương hiệu
            </Typography>
          </HeadingContainer>
          <Grid container sx={{ justifyContent: "center" }} spacing={2}>
            {dummyBrands.map((brand, index) => (
              <Grid item lg={3} sm={5} xs={12} key={index}>
                <BrandItem>
                  <Image
                    src={brand.logo}
                    alt="brand logos"
                    width="56"
                    height="56"
                  />
                  <Typography sx={{ ml: 3 }}>{brand.name}</Typography>
                </BrandItem>
              </Grid>
            ))}
          </Grid>
        </Box> */}
      {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            mb: 10.75,
          }}
        >
          <HeadingContainer sx={{ pb: 3 }}>
            <Typography color="text.main" variant="h6">
              Khách hàng nói gì về chúng tôi
            </Typography>
          </HeadingContainer>
          <Box sx={{ width: { sm: "50%", xs: "100%" }, mb: 7 }}>
            <Typography color="text.secondary" align="center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Elementum, enim enim nascetur in in molestie. Vitae, nec dignissim
              laoreet felis magna. Molestie est semper quis amet purus eget.
            </Typography>
          </Box>
          <Box
            display="flex"
            sx={{ flexDirection: { sm: "row", xs: "column" } }}
          >
            <CustomerImage>
              <Image
                src={dummyCustomersImage}
                alt="Customers"
                width="355"
                height="240"
              />
            </CustomerImage>
            <CustomerImage>
              <Image
                src={dummyCustomersImage}
                alt="Customers"
                width="355"
                height="240"
              />
            </CustomerImage>
            <CustomerImage>
              <Image
                src={dummyCustomersImage}
                alt="Customers"
                width="355"
                height="240"
              />
            </CustomerImage>
          </Box>
        </Box> */}
    </Container>
  );
};
