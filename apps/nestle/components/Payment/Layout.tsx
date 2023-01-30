import { IBreadcrumb } from "@hera/data";
import { Box, Breadcrumbs, Container, Link, styled } from "@mui/material";

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

export function NesPaymentLayout({ children }) {
  return (
    <Container>
      <Box mt={2.75}>
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{ display: { xs: "none", sm: "block" } }}
        >
          {breadcrumbLinks.map((link, key) => (
            <BreadcrumbsLink
              href={link.slug}
              underline="hover"
              variant="body2"
              key={key}
            >
              {link.name}
            </BreadcrumbsLink>
          ))}
        </Breadcrumbs>
      </Box>
      <Box my={8.25}>{children}</Box>
    </Container>
  );
}
