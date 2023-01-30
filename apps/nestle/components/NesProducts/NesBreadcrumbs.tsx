import { IBreadcrumbItems } from "@hera/data";
import { NavigateNext as NavigateNextIcon } from "@mui/icons-material";
import { Box, Breadcrumbs, Link, Skeleton } from "@mui/material";
import { useRouter } from "next/router";
import { memo } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";
interface Props {
  breadcrumbs?: IBreadcrumbItems[];
  brandName?: string;
  loading?: boolean;
}

const NesBreadcrumbsComponent = ({
  breadcrumbs,
  brandName,
  loading,
}: Props) => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  return (
    <Box>
      <Breadcrumbs
        separator={
          <NavigateNextIcon fontSize="small" sx={{ color: "grey.500" }} />
        }
        aria-label="breadcrumb"
        sx={{ "& ol .MuiBreadcrumbs-separator ": { mx: "4px" } }}
      >
        <Link
          href="/"
          underline="hover"
          color="grey.500"
          variant="subtitle2"
          onClick={(e) => {
            e.preventDefault();
            router.push("/");
          }}
          fontWeight="fontWeightRegular"
        >
          {loading ? (
            <Skeleton width="70px" />
          ) : (
            formatMessage({
              id: "productsPage.BreadcrumbHomePage",
            })
          )}
        </Link>
        {breadcrumbs?.length > 0 ? (
          breadcrumbs?.map((data, index) => {
            if (index === breadcrumbs?.length - 1) {
              return (
                <Link
                  key={index}
                  underline="none"
                  color="text.primary"
                  variant="subtitle2"
                  fontWeight="fontWeightRegular"
                >
                  {loading ? <Skeleton width="70px" /> : data.name}
                </Link>
              );
            }
            return (
              <Link
                href={`/category/${data.slug}`}
                key={index}
                underline="hover"
                color={"grey.500"}
                variant="subtitle2"
                fontWeight="fontWeightRegular"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/category/${data.slug}`);
                }}
              >
                {loading ? <Skeleton width="70px" /> : data.name}
              </Link>
            );
          })
        ) : (
          <Link
            component="button"
            underline="hover"
            color="text.primary"
            variant="subtitle2"
            fontWeight="fontWeightRegular"
          >
            {loading ? (
              <Skeleton width="70px" />
            ) : brandName ? (
              brandName
            ) : (
              formatMessage({
                id: "productsPage.BreadcrumbAllProducts",
              })
            )}
          </Link>
        )}
      </Breadcrumbs>
    </Box>
  );
};

export const NesBreadcrumbs = memo(NesBreadcrumbsComponent, isEqual);
