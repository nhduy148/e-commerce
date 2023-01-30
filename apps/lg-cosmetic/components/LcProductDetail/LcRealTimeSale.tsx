import { Box, styled, Typography } from "@mui/material";
import dayjs from "dayjs";
import { memo, useEffect, useRef, useState } from "react";
import isEqual from "react-fast-compare";

interface Props {
  saleTimeStart: string;
  saleTimeEnd: string;
  productDetailRefetch: () => void;
}
const StyledDotsBox = styled(Typography)`
  height: 18px;
  width: 4px;
  color: white;
  display: flex;
  font-size: 12px;
  align-items: center;
  justify-content: center;
  margin: 0 2px;
`;

const StyledBox = styled(Box)`
  height: 18px;
  padding: 2px 2px;
  width: auto;
  border-radius: 2px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.palette.primary.main};
  margin: 2px 0;
`;

const StyledTypography = styled(Typography)`
  line-height: normal;
`;

const LcRealTimeSaleComponent = ({
  saleTimeStart,
  saleTimeEnd,
  productDetailRefetch,
}: Props) => {
  const [timerHours, setTimerHours] = useState<number | string>(0);
  const [timerMinutes, setTimerMinutes] = useState<number | string>(0);
  const [timerSeconds, setTimerSeconds] = useState<number | string>(0);

  let interval = useRef(null);
  const startTimer = () => {
    const endAt = dayjs(saleTimeEnd);

    interval.current = setInterval(() => {
      const distance = new Date(saleTimeEnd).getTime() - new Date().getTime();
      const startAt = dayjs();

      const hours = endAt.diff(startAt, "hours");
      const minutes = endAt.diff(startAt, "minutes") % 60;
      const seconds = endAt.diff(startAt, "seconds") % 60;
      if (distance < 0) {
        clearInterval(interval.current);
        productDetailRefetch();
      } else {
        setTimerHours(hours);
        setTimerMinutes(minutes);
        setTimerSeconds(seconds);
      }
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(interval.current);
    };
  }, []);
  return (
    <Box display="flex" justifyContent="flex-end">
      <StyledBox>
        <StyledTypography variant="overline" fontWeight="fontWeightBold">
          {`0${timerHours}`.slice(timerHours <= 99 ? -2 : -3)}
        </StyledTypography>
      </StyledBox>
      <StyledDotsBox>:</StyledDotsBox>
      <StyledBox>
        <StyledTypography variant="overline" fontWeight="fontWeightBold">
          {`0${timerMinutes}`.slice(-2)}
        </StyledTypography>
      </StyledBox>
      <StyledDotsBox>:</StyledDotsBox>
      <StyledBox>
        <StyledTypography variant="overline" fontWeight="fontWeightBold">
          {`0${timerSeconds}`.slice(-2)}
        </StyledTypography>
      </StyledBox>
    </Box>
  );
};

export const LcRealTimeSale = memo(LcRealTimeSaleComponent, isEqual);
