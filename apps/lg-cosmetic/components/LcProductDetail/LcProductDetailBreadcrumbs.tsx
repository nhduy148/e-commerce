import { IBreadcrumb } from "@hera/data";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { memo } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";

interface Props {
  breadcrumbList: Array<IBreadcrumb>;
}

const LcProductDetailBreadcrumbsComponent = ({ breadcrumbList }: Props) => {
  const { push, query } = useRouter();
  const { formatMessage } = useIntl();

  const pageContent = {
    homePage: formatMessage({ id: "breadcrumb.homePage" }),
  };
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{
        "& ol .MuiBreadcrumbs-separator ": { mx: "4px" },
        display: {
          sm: "block",
          xs: "none",
        },
      }}
    >
      <Link
        href="/"
        underline="hover"
        color="text.primary"
        variant="overline"
        fontWeight="fontWeightMedium"
        onClick={(e) => {
          e.preventDefault();
          push("/");
        }}
        textTransform="uppercase"
      >
        {pageContent.homePage}
      </Link>
      {breadcrumbList &&
        breadcrumbList.map((breadcrumb, index) => {
          if (index === breadcrumbList.length - 1) {
            return;
          }
          return (
            <Link
              href={`/category/${breadcrumb.slug}`}
              key={index}
              underline="hover"
              color="text.primary"
              textTransform="uppercase"
              variant="overline"
              fontWeight="fontWeightMedium"
              onClick={(e) => {
                e.preventDefault();
                push(`/category/${breadcrumb.slug}`);
              }}
            >
              {breadcrumb.name}
            </Link>
          );
        })}
      <Typography
        variant="overline"
        color="text.primary"
        fontWeight="fontWeightMedium"
      >
        {breadcrumbList?.[breadcrumbList.length - 1]?.name}
      </Typography>
    </Breadcrumbs>
  );
};

export const LcProductDetailBreadcrumbs = memo(
  LcProductDetailBreadcrumbsComponent,
  isEqual,
);
