import { IBreadcrumb } from "@hera/data";
import { NavigateNext as NavigateNextIcon } from "@mui/icons-material";
import { Breadcrumbs, Link, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { memo } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";

interface Props {
  breadcrumbList: Array<IBreadcrumb>;
}

const NesProductDetailBreadcrumbsComponent = ({ breadcrumbList }: Props) => {
  const { push, query } = useRouter();
  const { formatMessage } = useIntl();
  const theme = useTheme();

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
      separator={
        <NavigateNextIcon
          sx={{ color: theme.palette.grey[500] }}
          fontSize="small"
        />
      }
    >
      <Link
        href="/"
        underline="hover"
        color="grey.600"
        variant="body2"
        fontWeight="fontWeightMedium"
        onClick={(e) => {
          e.preventDefault();
          push("/");
        }}
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
              color="grey.600"
              variant="body2"
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
      <Typography variant="body2" color="primary" fontWeight="fontWeightMedium">
        {breadcrumbList?.[breadcrumbList.length - 1]?.name}
      </Typography>
    </Breadcrumbs>
  );
};

export const NesProductDetailBreadcrumbs = memo(
  NesProductDetailBreadcrumbsComponent,
  isEqual,
);
