import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { memo, useState } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";

const LcFavoriteButtonDesktopComponent = ({ sx }) => {
  const [favorite, setFavorite] = useState<boolean>(true);

  const { formatMessage } = useIntl();

  const pageContent = {
    addToFavorite: formatMessage({ id: "productDetail.addToFavorite" }),
  };

  const handleClick = () => {
    setFavorite(!favorite);
  };

  return (
    <Button
      variant="text"
      color={favorite ? "primary" : "inherit"}
      startIcon={favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      onClick={handleClick}
      sx={sx}
    >
      {pageContent.addToFavorite}
    </Button>
  );
};

const LcFavoriteButtonMobileComponent = ({ sx }) => {
  const [favorite, setFavorite] = useState<boolean>(true);

  const handleClick = () => {
    setFavorite(!favorite);
  };

  return (
    <IconButton
      color={favorite ? "primary" : "inherit"}
      edge="start"
      onClick={handleClick}
      sx={sx}
    >
      {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </IconButton>
  );
};

export const LcFavoriteButtonDesktop = memo(
  LcFavoriteButtonDesktopComponent,
  isEqual,
);

export const LcFavoriteButtonMobile = memo(
  LcFavoriteButtonMobileComponent,
  isEqual,
);
