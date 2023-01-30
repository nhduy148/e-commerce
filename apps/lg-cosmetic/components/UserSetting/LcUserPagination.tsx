import { Pagination, PaginationItem, styled, SxProps } from "@mui/material";
import { FC } from "react";

interface IProps {
  page: number;
  onSetPage: (page: number) => void;
  count: number;
  sx?: SxProps;
}

const UserPagination = styled(Pagination)`
  .Mui-selected {
    color: ${({ theme }) => theme.palette.common.white};
    background-color: ${({ theme }) => theme.palette.primary.main} !important;
    border: 1px solid ${({ theme }) => theme.palette.primary.main} !important;
  }

  .MuiPaginationItem-root {
    border: 1px solid ${({ theme }) => theme.palette.grey[900]};
    margin: 0 4px;
  }

  .MuiPaginationItem-rounded {
    border-radius: 0;
  }

  .MuiPaginationItem-ellipsis {
    border: none;
    height: 5px;
    margin: 0;
    font-weight: 900;
  }
`;

export const LcUserPagination: FC<IProps> = ({
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
        ...props.sx,
      }}
      hideNextButton
      hidePrevButton
      renderItem={(item) => <PaginationItem variant="outlined" {...item} />}
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
