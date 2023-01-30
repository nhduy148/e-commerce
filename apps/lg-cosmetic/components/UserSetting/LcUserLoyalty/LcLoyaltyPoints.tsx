import { FC } from "react";

import { formatDate } from "@hera/utils";
import {
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_MEDIUM,
  FONT_WEIGHT_REGULAR,
} from "@lc/constants";
import { UserLoyalty } from "@lc/static/images";
import { Box, Divider, Paper, styled, Typography } from "@mui/material";

import { useBreakPoint } from "@lc/hooks";
import Image from "next/image";
import { useIntl } from "react-intl";

interface IProps {
  userPoints: number;
  hasActiveProgram: boolean;
  expiredAt: string;
}

const SettingMenuPaper = styled(Paper)`
  border-top: 4px solid ${({ theme }) => theme.palette.primary.main};
  padding: 32px;
`;

export const LcLoyaltyPoints: FC<IProps> = ({
  userPoints,
  hasActiveProgram,
  expiredAt,
}) => {
  const { formatMessage } = useIntl();
  const isPC = useBreakPoint("sm");

  const formattedExpiredDate = formatDate(expiredAt);

  return (
    <SettingMenuPaper sx={{ p: 2, mb: 1.5 }}>
      <Box display={{ sm: "flex", xs: "inline-block" }}>
        <Box
          sx={{
            flex: 30,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="title"
            color="inherit"
            fontWeight={FONT_WEIGHT_MEDIUM}
            sx={{ mb: 1.5 }}
          >
            {formatMessage({ id: "userSetting.loyaltyPoints" })}
          </Typography>
          <Box sx={{ mb: 1.5 }}>
            <Image src={UserLoyalty.src} width={80} height={80} />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "end",
              color: "success.main",
              letterSpacing: "-0.05rem",
              mb: 1.5,
            }}
          >
            <Typography
              variant="h4"
              color="inherit"
              letterSpacing="-0.05rem"
              fontWeight={FONT_WEIGHT_BOLD}
            >
              {userPoints || 0}
            </Typography>
            &nbsp;
            <Typography
              variant="h5"
              color="inherit"
              letterSpacing="-0.04rem"
              fontWeight={FONT_WEIGHT_REGULAR}
            >
              {formatMessage({ id: "userSetting.points" })}
            </Typography>
          </Box>
        </Box>
        <Divider
          orientation={isPC ? "vertical" : "horizontal"}
          flexItem
          sx={{ mx: { sm: 2, xs: 0 }, mb: { sm: 0, xs: 2 } }}
        />
        <Box sx={{ flex: 70 }}>
          <Box>
            <Typography
              variant={isPC ? "title" : "h5"}
              color="inherit"
              fontWeight={FONT_WEIGHT_MEDIUM}
              sx={{
                mb: 1.5,
                textAlign: { sm: "unset", xs: "center" },
                display: "block",
              }}
            >
              {formatMessage({ id: "userSetting.howToUse" })}
            </Typography>

            {hasActiveProgram || userPoints > 0 ? (
              <Typography variant="body1" color="inherit">
                Thời hạn điểm thưởng đến hết ngày{" "}
                <strong>{formattedExpiredDate}</strong>. Hãy sử dụng điểm thưởng
                của bạn trước khi hết hạn
              </Typography>
            ) : (
              <Typography variant="body1" color="inherit">
                Hiện tại chưa có chương trình tích điểm nào. Vui lòng theo dõi
                LG Vina để đừng bỏ lỡ cơ hội tích điểm và nhận những phần quà
                giá trị nhé.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </SettingMenuPaper>
  );
};
