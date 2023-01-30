import { IMainBanner } from "@hera/data";

export const getBannerUrl = (banner: IMainBanner, isPC?: boolean): any => {
  const desktopUrl =
    banner?.desktopPhotoUrl ||
    banner?.desktopImage ||
    banner?.listingBannerDesktop ||
    banner?.desktopImageUrl ||
    banner?.bannerImage ||
    null;
  const mobileUrl =
    banner?.mobilePhotoUrl ||
    banner?.mobileImage ||
    banner?.listingBannerMobile ||
    banner?.mobileImageUrl ||
    banner?.bannerImageMobile ||
    null;

  return isPC ? desktopUrl : mobileUrl;
};
