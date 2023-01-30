import { Card, Skeleton } from "@mui/material";

export const LcProductSkeleton = () => {
  return (
    <Card
      sx={{
        maxWidth: { lg: 350, md: 300, sm: 250, sx: 200 },
        padding: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Skeleton
        sx={{
          height: { lg: 330, md: 280, sm: 230, xs: 180 },
          width: { lg: 330, md: 280, sm: 230, xs: 180 },
          mb: 4,
        }}
      />
      <Skeleton width="80%" height={40} />
      <Skeleton width="30%" height={30} />
    </Card>
  );
};
