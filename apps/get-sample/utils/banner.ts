import { IMainBanner, ISliderItem } from "@hera/data";

export const getBannerImageSource = (
  banner: IMainBanner | ISliderItem,
  isPC?: boolean,
): string => {
  if (isPC) {
    return (
      // @ts-ignore
      banner?.desktopPhotoUrl ||
      banner?.desktopImage ||
      // @ts-ignore
      banner?.listingBannerDesktop ||
      // @ts-ignore
      banner?.desktopImageUrl
    );
  } else {
    return (
      // @ts-ignore
      banner?.mobilePhotoUrl ||
      banner?.mobileImage ||
      // @ts-ignore
      banner?.listingBannerMobile ||
      // @ts-ignore
      banner?.mobileImageUrl
    );
  }
};
