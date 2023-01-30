import { formatDetailDayTime } from "@hera/utils";
import { useBreakPoint } from "@lc/hooks";
import {
  Avatar,
  Box,
  Button,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";

import { AuthenticationContext } from "@hera/contexts";
import { IReviewReply } from "@hera/data";
import { stringAvatar } from "@lc/utils";
import { useContext } from "react";
import { useIntl } from "react-intl";

interface IProps {
  replyData: IReviewReply;
  onReplyButtonPress: () => void;
}

const StyledBox = styled(Box)`
  border-right: 1px solid;
  border-color: ${({ theme }) => theme.palette.grey[300]};
  ${({ theme }) => theme.breakpoints.down("sm")} {
    border: none;
  }
`;

export const LcProductReviewReply = ({
  onReplyButtonPress,
  replyData,
}: IProps) => {
  const theme = useTheme();
  const isPC = useBreakPoint("sm");
  const { formatMessage, locale } = useIntl();

  const { isLogin } = useContext(AuthenticationContext);

  const renderFullName = () => {
    const { admin, user } = replyData;

    if (user && user.firstName && user.lastName && isPC) {
      return `${user?.lastName} ${user?.firstName}`;
    }

    if (user && user.firstName && user.lastName) {
      return `${user?.lastName}`;
    }

    if (admin && isPC) {
      return `${admin?.lastName} ${admin?.firstName}`;
    }

    if (admin) {
      return `${admin?.lastName}`;
    }

    return "Khách";
  };

  const renderAvatarName = () => {
    const { admin, user } = replyData;

    if (user && user.firstName && user.lastName) {
      return `${user?.lastName} ${user?.firstName}`;
    }

    if (admin) {
      return `${admin?.lastName} ${admin?.firstName}`;
    }

    return "Khách";
  };

  const fullName = renderFullName();
  const avatarName = renderAvatarName();

  return (
    <Box py={{ xs: 1, sm: 2 }}>
      <Stack direction="row" spacing={{ xs: 2, sm: 3 }} alignItems="center">
        <Stack direction="row" spacing={{ xs: 1, sm: 3 }} alignItems="center">
          <Avatar
            {...(avatarName !== "Khách" && { ...stringAvatar(avatarName) })}
            sx={{
              bgcolor: theme.palette.primary.main,
              width: isPC ? 44 : 36,
              height: isPC ? 44 : 36,
            }}
          />
          <Box>
            <Typography variant="h6">{fullName}</Typography>
            <Typography color="grey.500" variant="subtitle2">
              {formatDetailDayTime(replyData?.insertedAt, locale)}
            </Typography>
          </Box>
        </Stack>
        {isLogin && (
          <Box flex={1} display="flex" justifyContent="flex-end">
            <Button
              variant="text"
              size="small"
              color="inherit"
              onClick={
                typeof onReplyButtonPress === "function" && onReplyButtonPress
              }
            >
              <Typography
                variant="body2"
                textTransform="initial"
                fontWeight="500"
              >
                {formatMessage({ id: "productDetail.reply" })}
              </Typography>
            </Button>
          </Box>
        )}
      </Stack>
      <Box py={1}>
        <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
          {replyData?.content}
        </Typography>
      </Box>
    </Box>
  );
};
