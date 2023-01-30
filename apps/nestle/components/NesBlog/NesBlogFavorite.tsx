import { AuthenticationContext } from "@hera/contexts";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { memo, useContext } from "react";
import isEqual from "react-fast-compare";
interface Props {
  isfavorite: boolean;
  favoriteCount: number;
  onClickFavorites: () => void;
  onClickDeleteFavorite: () => void;
  isLogin: boolean;
  disableFavorite: boolean;
}

const NesBlogFavoriteComponent = ({
  isLogin,
  onClickFavorites,
  isfavorite,
  onClickDeleteFavorite,
  favoriteCount,
  disableFavorite,
}: Props) => {
  const authen = useContext(AuthenticationContext);
  return (
    <Box display="flex" alignItems="center">
      <IconButton
        color="primary"
        aria-label="favorite"
        disabled={disableFavorite || !authen.isLogin}
        sx={{ "&.Mui-disabled": { color: "primary.main" } }}
      >
        {isfavorite && isLogin ? (
          <FavoriteIcon onClick={onClickDeleteFavorite} />
        ) : (
          <FavoriteBorderIcon onClick={onClickFavorites} />
        )}
      </IconButton>
      <Typography variant="body1">{favoriteCount}</Typography>
    </Box>
  );
};

export const NesBlogFavorite = memo(NesBlogFavoriteComponent, isEqual);
