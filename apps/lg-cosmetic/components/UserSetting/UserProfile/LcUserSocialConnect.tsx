import { FacebookLogo, GoogleLogo } from "@lc/static/images";
import { Box, Link, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useIntl } from "react-intl";
interface IUserSocialConnect {}

export const LcUserSocialConnect: React.FunctionComponent<
  IUserSocialConnect
> = () => {
  const { formatMessage } = useIntl();

  return (
    <Box>
      <Typography variant="body1" textTransform="uppercase" sx={{ mb: 3 }}>
        {formatMessage({
          id: "userSetting.socialAccountConnection",
        })}
      </Typography>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Box
          display="flex"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box display="flex" sx={{ alignItems: "center" }}>
            <Box sx={{ mr: 2 }}>
              <Image
                src={FacebookLogo.src}
                alt="Facebook logo"
                width={32}
                height={32}
              />
            </Box>
            <Typography variant="body1">Facebook</Typography>
          </Box>
          <Link href="#" variant="body2" color="error.main" underline="none">
            {formatMessage({ id: "userSetting.disconnect" })}
          </Link>
        </Box>
        <Box
          display="flex"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Box display="flex" sx={{ alignItems: "center" }}>
            <Box sx={{ mr: 2 }}>
              <Image
                src={GoogleLogo.src}
                alt="Google logo"
                width={32}
                height={32}
              />
            </Box>
            <Typography variant="body1">Google</Typography>
          </Box>
          <Link href="#" variant="body2" color="info.main" underline="none">
            {formatMessage({ id: "userSetting.connect" })}
          </Link>
        </Box>
      </Stack>
    </Box>
  );
};
