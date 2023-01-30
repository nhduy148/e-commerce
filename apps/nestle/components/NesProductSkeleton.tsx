import { Card, Skeleton } from "@mui/material";

export const NesProductSkeleton = () => {
  return (
    <Card
      sx={{
        padding: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Skeleton
        sx={{
          height: { lg: 330, md: 280, sm: 230, xs: 180 },
          width: "100%",
          mb: 4,
        }}
      />
      <Skeleton width="80%" height={40} />
      <Skeleton width="30%" height={30} />
    </Card>
  );
};
