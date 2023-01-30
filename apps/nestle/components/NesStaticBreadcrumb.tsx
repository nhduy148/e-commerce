import { IBreadcrumb } from "@hera/data";
import { NavigateNext as NavigateNextIcon } from "@mui/icons-material";
import { Breadcrumbs, Link, styled, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { memo } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";

interface IProps {
  breadcrumbLinks: IBreadcrumb[];
}

const BreadcrumbLink = styled(Link)`
  color: ${({ theme }) => theme.palette.grey[600]};
  ${({ theme }) => theme.typography.body2};
`;

const NesStaticBreadcrumbComponent = ({ breadcrumbLinks }: IProps) => {
  const { push, query } = useRouter();
  const { formatMessage } = useIntl();

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={
        <NavigateNextIcon
          fontSize="small"
          sx={{
            color: "grey.500",
          }}
        />
      }
      sx={{
        ".MuiBreadcrumbs-separator ": { mx: "6px" },
      }}
    >
      <BreadcrumbLink
        href="/"
        underline="hover"
        onClick={(e) => {
          e.preventDefault();
          push("/");
        }}
      >
        {formatMessage({ id: "breadcrumb.homePage" })}
      </BreadcrumbLink>
      {breadcrumbLinks &&
        breadcrumbLinks.map((breadcrumb, index) =>
          // * Last breadcrumb is not a link
          index < breadcrumbLinks.length - 1 ? (
            <BreadcrumbLink
              href={`/${breadcrumb.url}`}
              key={index}
              underline="hover"
              onClick={(e) => {
                e.preventDefault();
                push(`/${breadcrumb.url}`);
              }}
            >
              {breadcrumb.name}
            </BreadcrumbLink>
          ) : (
            <Typography variant="body2" color="primary">
              {breadcrumb.name}
            </Typography>
          ),
        )}
    </Breadcrumbs>
  );
};

export const NesStaticBreadcrumb = memo(NesStaticBreadcrumbComponent, isEqual);
