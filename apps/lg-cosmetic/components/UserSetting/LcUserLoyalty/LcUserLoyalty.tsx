import { useContext } from "react";

import { AuthenticationContext } from "@hera/contexts";
import {
  useCurrentUser,
  useGetActiveProgramQuery,
  useGetProgramExpiredTimeQuery,
} from "@hera/data";
import {
  LcLoyaltyPoints,
  LcUserPointsHistory,
} from "@lc/UserSettingComponents";
import { Box } from "@mui/material";

export const LcUserLoyalty = () => {
  const { isLogin } = useContext(AuthenticationContext);
  const { data: userInfo } = useCurrentUser(isLogin);
  const { data: activeProgramResponse } = useGetActiveProgramQuery();
  const { data: programExpiredTimeResponse } = useGetProgramExpiredTimeQuery();

  const hasActiveProgram = activeProgramResponse?.data?.msg === "Ok";
  const userPoints = userInfo?.user?.pointLoyalty;
  const programExpiredTime = programExpiredTimeResponse?.data?.msg;

  return (
    <Box>
      <LcLoyaltyPoints
        userPoints={userPoints}
        hasActiveProgram={hasActiveProgram}
        expiredAt={programExpiredTime}
      />
      <LcUserPointsHistory userId={userInfo?.user?.id} />
    </Box>
  );
};
