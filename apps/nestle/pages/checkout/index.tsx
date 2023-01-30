import { IBreadcrumb } from "@hera/data";
import { Box, Breadcrumbs, Container, Link, styled } from "@mui/material";
import { NesCheckout } from "@nestle/NesCheckoutComponent";

interface ICheckoutProps {}

const breadcrumbLinks: IBreadcrumb[] = [
  {
    name: "Trang chủ",
    slug: "/",
    type: "",
  },
  {
    name: "Thanh toán",
    slug: "#",
    type: "",
  },
];

const BreadcrumbsLink = styled(Link)`
  color: ${({ theme }) => theme.palette.text.primary};
  text-transform: uppercase;
`;

const CheckoutPage: React.FunctionComponent<ICheckoutProps> = () => {
  return (
    <Container>
      <Box mt={2.75}>
        <Box mb={4}>
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            {breadcrumbLinks.map((link, key) => (
              <BreadcrumbsLink
                href={link.slug}
                underline="hover"
                variant="overline"
                key={key}
              >
                {link.name}
              </BreadcrumbsLink>
            ))}
          </Breadcrumbs>
        </Box>
      </Box>
      <NesCheckout />
    </Container>
  );
};

export default CheckoutPage;
