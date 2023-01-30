import { useFormatter } from "@hera/i18n";
import { NavigateNext as NavigateNextIcon } from "@mui/icons-material";
import {
  Breadcrumbs,
  Link,
  Skeleton,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { FC } from "react";

interface IBreadcrumbLink {
  name: string;
  link?: string;
}
interface IProps {
  data: IBreadcrumbLink[];
  isLoading?: boolean;
}

export const GSPBreadcrumb: FC<IProps> = ({ data, isLoading }) => {
  const { __ } = useFormatter();
  const { push } = useRouter();

  const BreadcrumbLink = styled(Link)`
    color: ${({ theme }) => theme.palette.grey[600]};
    ${({ theme }) => theme.typography.body2};
  `;

  if (isLoading) {
    return (
      <Stack direction="row" spacing={1}>
        {[...Array(3).keys()].map((_, i) => (
          <Skeleton width={50} height={15} />
        ))}
      </Stack>
    );
  }

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
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          event.preventDefault();
          push("/");
        }}
      >
        {__({ defaultMessage: "Trang chủ" })}
      </BreadcrumbLink>

      {data &&
        data.map((el, index) => {
          if (index < data.length - 1) {
            return (
              <BreadcrumbLink
                key={index}
                underline="hover"
                onClick={(event: React.MouseEvent<HTMLElement>) => {
                  event.preventDefault();
                  push(`/${el.link}`);
                }}
              >
                {el.name}
              </BreadcrumbLink>
            );
          } else {
            //? Last one is not a link
            return (
              <Typography variant="body2" color="primary" key={index}>
                {el.name}
              </Typography>
            );
          }
        })}
    </Breadcrumbs>
  );
};
