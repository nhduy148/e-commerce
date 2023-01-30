import { IBreadcrumbItems } from "@hera/data";
import { Breadcrumbs, Link } from "@mui/material";
import { useRouter } from "next/router";
import { memo } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";

interface Props {
  breadcrumbs?: IBreadcrumbItems[];
  brandName?: string;
}

const LcBreadcrumbsComponent = ({ breadcrumbs, brandName }: Props) => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{ "& ol .MuiBreadcrumbs-separator ": { mx: "4px" } }}
    >
      <Link
        href="/"
        underline="hover"
        color="text.primary"
        variant="overline"
        onClick={(e) => {
          e.preventDefault();
          router.push("/");
        }}
        fontWeight="fontWeightMedium"
        textTransform="uppercase"
      >
        {formatMessage({
          id: "productsPage.BreadcrumbHomePage",
        })}
      </Link>
      {breadcrumbs?.length > 0 ? (
        breadcrumbs?.map((data, index) => {
          return (
            <Link
              href={`/category/${data.slug}`}
              key={index}
              underline="hover"
              color="text.primary"
              textTransform="uppercase"
              variant="overline"
              fontWeight="fontWeightMedium"
              onClick={(e) => {
                e.preventDefault();
                router.push(`/category/${data.slug}`);
              }}
            >
              {data.name}
            </Link>
          );
        })
      ) : (
        <Link
          component="button"
          underline="hover"
          color="text.primary"
          textTransform="uppercase"
          variant="overline"
          fontWeight="fontWeightMedium"
        >
          {brandName
            ? brandName
            : formatMessage({
                id: "productsPage.BreadcrumbAllProducts",
              })}
        </Link>
      )}
    </Breadcrumbs>
  );
};

export const LcBreadcrumbs = memo(LcBreadcrumbsComponent, isEqual);
