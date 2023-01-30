import { FC, useState } from "react";

import { useGetLoyaltyQuery } from "@hera/data";
import { formatDate } from "@hera/utils";
import { FONT_WEIGHT_MEDIUM } from "@lc/constants";
import {
  CircularProgress,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { useBreakPoint } from "@lc/hooks";
import { useIntl } from "react-intl";
import { LcUserPagination } from "../LcUserPagination";

interface IProps {
  userId: number | string;
}

const SettingMenuPaper = styled(Paper)`
  border-top: 4px solid ${({ theme }) => theme.palette.primary.main};
  padding: 32px;
`;

const StyleTable = styled(Table)`
  border: 2px solid ${({ theme }) => theme.palette.divider};

  & .MuiTableHead-root {
    border: unset;
    border-bottom: 2px solid ${({ theme }) => theme.palette.divider};
    white-space: nowrap;
  }

  & > .MuiTableBody-root .MuiTableRow-root {
    border: unset;
    border-bottom: 2px solid ${({ theme }) => theme.palette.divider};
  }
`;

export const LcUserPointsHistory: FC<IProps> = ({ userId }) => {
  const [page, setPage] = useState(1);
  const isPC = useBreakPoint("sm");
  const { formatMessage } = useIntl();

  const { data: loyaltyPointsHistory, isLoading } = useGetLoyaltyQuery({
    userId,
    page,
    size: 10,
  });

  const createData = (
    reason: string,
    date: string | Date,
    pointsUpdates: number,
  ) => {
    return { reason, date, pointsUpdates };
  };

  const tableHeads = [
    { name: "STT" },
    { name: "Lý do" },

    { name: "Ngày tạo" },
    { name: "Điểm tích luỹ" },
  ];

  const tableData = loyaltyPointsHistory?.data?.map((item) => {
    return createData(
      item?.reasonUpdate,
      formatDate(item?.datetimeUpdate, isPC ? undefined : "DD/MM YYYY"),
      item?.pointUpdate,
    );
  });

  return (
    loyaltyPointsHistory?.data.length > 0 && (
      <SettingMenuPaper sx={{ p: 2 }}>
        <Typography
          variant="h5"
          color="inherit"
          fontWeight={FONT_WEIGHT_MEDIUM}
          textTransform="uppercase"
          sx={{ mb: 3 }}
        >
          {formatMessage({ id: "userSetting.pointsHistory" })}
        </Typography>
        <TableContainer sx={{ mb: 3 }}>
          {isLoading ? (
            <CircularProgress size={50} />
          ) : (
            <StyleTable aria-label="points history table" size="medium">
              <TableHead>
                <TableRow>
                  {tableHeads.map((tableHead, index) => (
                    <TableCell
                      key={index}
                      align={
                        tableHead.name === "Điểm tích luỹ" ? "right" : "left"
                      }
                    >
                      {tableHead.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell>{row.reason}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell align="right">
                      <Typography
                        fontWeight={FONT_WEIGHT_MEDIUM}
                        variant="body2"
                        color={
                          row.pointsUpdates >= 0 ? "success.main" : "error.main"
                        }
                      >
                        {row.pointsUpdates >= 0
                          ? `+${row.pointsUpdates}`
                          : row.pointsUpdates}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </StyleTable>
          )}
        </TableContainer>
        <LcUserPagination
          count={loyaltyPointsHistory?.paginate?.totalPages}
          page={page}
          onSetPage={setPage}
          sx={{
            justifyContent: "flex-end",
          }}
        />
      </SettingMenuPaper>
    )
  );
};
