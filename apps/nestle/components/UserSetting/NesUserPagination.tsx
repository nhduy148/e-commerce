import { Pagination, PaginationItem, styled } from "@mui/material";
import { FC } from "react";

interface IProps {
  page: number;
  onSetPage: (page: number) => void;
  count: number;
}

const UserPagination = styled(Pagination)`
  .MuiPaginationItem-root {
    border: none;
    color: ${({ theme }) => theme.palette.text.primary};
  }
  .MuiPaginationItem-rounded {
    border-radius: 4px;
  }
`;

export const NesUserPagination: FC<IProps> = ({
  page,
  onSetPage,
  count,
  ...props
}) => {
  return (
    <UserPagination
      {...props}
      sx={{
        display: "flex",
        justifyContent: { sm: "flex-end", xs: "center" },
      }}
      renderItem={(item) => (
        <PaginationItem {...item} sx={{ mr: 1 }} variant="outlined" />
      )}
      variant="outlined"
      shape="rounded"
      page={page}
      count={count}
      onChange={(e, page) => {
        onSetPage(page);
      }}
    />
  );
};
