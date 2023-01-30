import {
  CHECK_SHOPPING_CART_KEY,
  ILineItem,
  useRemoveCartItem,
} from "@hera/data";
import { Divider } from "@mui/material";
import {
  NesCartItem,
  NesConfirmationDialog,
  NesGiftItem,
} from "@nestle/components";
import {
  IAddToCartPayloadCallback,
  useAddToCart,
  useCart,
} from "@nestle/hooks";
import { debounce, partition } from "lodash-es";
import { useSnackbar } from "notistack";
import { FC, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useQueryClient } from "react-query";

interface IProps {
  lineItems: ILineItem[];
  itemType: "checkout" | "shoppingCart";
  enableCheckoutItemAdjustment?: boolean;
}

const NesCartList: FC<IProps> = ({
  lineItems,
  itemType,
  enableCheckoutItemAdjustment,
}) => {
  const { formatMessage } = useIntl();
  const queryClient = useQueryClient();
  const { refetch: refetchShoppingCart } = useCart();
  const [isDeleteDialogOpened, setOpenDeleteDialog] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [currentDeleteCartItem, setCurrentDeleteCartItem] =
    useState<ILineItem | null>(null);

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    debounce(() => {
      setCurrentDeleteCartItem(null);
    }, 100);
  };
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync: removeCartItemAsync } = useRemoveCartItem();
  const _handleAddToCart = useAddToCart();

  const handleQuantityChange: IAddToCartPayloadCallback = async (
    payload,
    callback = {},
  ) => {
    _handleAddToCart(
      payload,
      {
        successCallback: async (data) => {
          if (itemType === "checkout") {
            await queryClient.refetchQueries([CHECK_SHOPPING_CART_KEY]);
          }
          if (typeof callback?.successCallback === "function") {
            callback?.successCallback(data);
          }
        },
        errorCallback: callback?.errorCallback,
        finallyCallback: callback?.finallyCallback,
      },
      true,
    );
  };

  const handleRemoveCartItem = (lineItem: ILineItem) => {
    setCurrentDeleteCartItem(lineItem);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!currentDeleteCartItem?.id) {
      handleCancelDelete();
      return;
    }
    setIsDeleting(true);
    try {
      await removeCartItemAsync({ id: currentDeleteCartItem.id });
      await refetchShoppingCart();
      if (itemType === "checkout") {
        await queryClient.refetchQueries([CHECK_SHOPPING_CART_KEY]);
      }
    } catch (error) {
      enqueueSnackbar(formatMessage({ id: "shoppingCart.removeItemFailed" }), {
        variant: "error",
      });
    } finally {
      handleCancelDelete();
      setIsDeleting(false);
    }
  };

  const [gifts, products] = useMemo(
    () => partition(lineItems, (item) => item.label === "gift"),
    [lineItems],
  );

  return (
    <>
      {products
        .sort((a, b) => a.id - b.id)
        .map((lineItem, index) => (
          <>
            <NesCartItem
              type={itemType}
              lineItem={lineItem}
              onQuantityChange={handleQuantityChange}
              onDeleteItem={handleRemoveCartItem}
              enableCheckoutItemAdjustment={enableCheckoutItemAdjustment}
              key={index}
            />
            {index < lineItems?.length - 1 && <Divider />}
          </>
        ))}
      {gifts
        .sort((a, b) => a.id - b.id)
        .map((cartItem, index) => (
          <>
            <NesGiftItem cartItem={cartItem} key={cartItem?.id} />
            {index < gifts.length - 1 && <Divider sx={{ my: 1 }} />}
          </>
        ))}
      <NesConfirmationDialog
        open={isDeleteDialogOpened && currentDeleteCartItem !== null}
        title={formatMessage({ id: "shoppingCart.deleteDialog.title" })}
        description={
          currentDeleteCartItem?.product?.inStock > 0
            ? formatMessage(
                { id: "shoppingCart.deleteDialog.description" },
                { productName: currentDeleteCartItem?.product?.name },
              )
            : formatMessage(
                { id: "shoppingCart.deleteDialog.descriptionWithOutOfStock" },
                {
                  productName: currentDeleteCartItem?.product?.name,
                  br: <br />,
                },
              )
        }
        onConfirmClick={handleConfirmDelete}
        onCancelClick={handleCancelDelete}
        isLoading={isDeleting}
      />
    </>
  );
};

NesCartList.defaultProps = {
  lineItems: [],
};

export { NesCartList };
