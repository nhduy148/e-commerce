import { IUserOrderLineItem } from "@hera/data";
import { Image } from "@hera/ui";
import { toCurrency } from "@hera/utils";
import { Box, Divider, styled, Typography } from "@mui/material";
import { useIntl } from "react-intl";

interface IUserOrderPromotionProductProps {
  item: IUserOrderLineItem;
}

const UserOrdersAccordionDetailDivider = styled(Divider)`
  &::before {
    width: 0%;
  }

  .MuiDivider-wrapper {
    padding-left: 0;
  }
`;

const LcUserOrderPromotionItem: React.FunctionComponent<
  IUserOrderPromotionProductProps
> = ({ item }) => {
  const { formatMessage } = useIntl();

  return (
    <Box>
      <UserOrdersAccordionDetailDivider textAlign="left">
        <Typography variant="body2">
          {formatMessage({ id: "userSetting.promotionProduct" })}
        </Typography>
      </UserOrdersAccordionDetailDivider>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", flex: 5 }}>
          <Box>
            <Image
              src={
                item.product.images.find((image) => image.isDefault === true)
                  ?.thumb
              }
              alt="Dummy item"
              height={60}
              width={60}
            />
          </Box>
          <Box sx={{ ml: { sm: 3, xs: 1 } }}>
            <Typography variant="body2">{item.product.name}</Typography>
            <Typography variant="body2" color="grey.600">
              {toCurrency(item.product.sellingPrice)}
            </Typography>
            <Box display={{ sm: "none", xs: "block" }}>
              <Typography variant="body2">{`x${item.quantity}`}</Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{ flex: 2, textAlign: "right" }}
          display={{ sm: "block", xs: "none" }}
        >
          <Typography variant="body2">{`x${item.quantity}`}</Typography>
        </Box>
        <Box
          sx={{ flex: 3, textAlign: "right" }}
          display={{ sm: "block", xs: "none" }}
        >
          <Typography variant="body2">{toCurrency(item.totalPrice)}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LcUserOrderPromotionItem;
