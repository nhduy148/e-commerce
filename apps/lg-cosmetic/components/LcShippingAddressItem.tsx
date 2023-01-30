import { IShippingInfo } from "@hera/data";
import {
  Circle as CircleIcon,
  CircleOutlined as CircleOutlinedIcon,
  LocalPhone as LocalPhoneIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material";
import {
  Box,
  Checkbox,
  lighten,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

interface IProps {
  data: IShippingInfo;
  clickAction: "select" | "check";
  onClick?: (data?: IShippingInfo) => void;
  index: number;
  selected?: boolean;
}

export const LcShippingAddressItem = ({
  data,
  clickAction,
  onClick,
  index,
  selected,
}: IProps) => {
  const theme = useTheme();
  const { addressLine, ward, district, province } = data;
  const address = [addressLine, ward, district, province]
    .filter(Boolean)
    // @ts-ignore
    .map((part) => part?.name || part)
    .join(", ");

  return (
    <Box
      sx={{
        display: "flex",
        cursor: "pointer",
        ":hover": {
          backgroundColor: lighten(theme.palette.primary.main, 0.94),
          ".lc-shippong-number": {
            backgroundColor: lighten(theme.palette.primary.main, 0.22),
          },
        },
        backgroundColor: "grey.50",
      }}
      onClick={() => {
        onClick && onClick(data);
      }}
    >
      <Box
        sx={{
          display: "flex",
          backgroundColor: `${selected ? "primary.main" : `grey.500`}`,
          alignItems: "center",
          justifyContent: "center",
          color: "common.white",
          flex: 1,
          flexBasis: 48,
        }}
        className="lc-shippong-number"
      >
        {index || 0}
      </Box>

      <Box
        sx={{
          px: 1.5,
          pb: 1.5,
          pt: 1,
          flex: 1,
          flexBasis: "calc(100% - 48px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box color="text.main">
          <Typography textTransform="capitalize" mb={1}>
            <b>
              {data?.displayName ||
                [data?.firstName, data?.lastName].filter(Boolean).join(" ")}
            </b>
          </Typography>

          <Stack spacing={0.5}>
            <Box alignItems="center" display="flex">
              <LocalPhoneIcon sx={{ mr: 1 }} fontSize="inherit" />
              <Typography variant="body2">{data.phone}</Typography>
            </Box>
            <Box alignItems="center" display="flex">
              <LocationOnIcon sx={{ mr: 1 }} fontSize="inherit" />
              <Typography variant="body2">{address}</Typography>
            </Box>
          </Stack>
        </Box>
        {clickAction === "check" && (
          <Checkbox
            onChange={(e) => {
              e.stopPropagation();
              onClick && onClick(data);
            }}
            checked={selected}
            icon={<CircleOutlinedIcon fontSize="small" />}
            checkedIcon={<CircleIcon fontSize="small" />}
          />
        )}
      </Box>
    </Box>
  );
};
