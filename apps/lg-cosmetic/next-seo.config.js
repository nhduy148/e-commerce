import * as config from "@hera/config";

export default {
  defaultTitle: "CÔNG TY TNHH MỸ PHẨM LG VINA",
  description:
    "Công ty TNHH Mỹ phẩm LG VINA tự hào mang đến cho khách hàng Việt Nam những thương hiệu mỹ phẩm uy tín và các thương hiệu chăm sóc nhà cửa, chăm sóc cá nhân cao cấp.",
  additionalLinkTags: [
    { rel: "icon", href: `${config.env.siteUrl}/favicon.png` },
  ],
  openGraph: {
    type: "website",
    title: "CÔNG TY TNHH MỸ PHẨM LG VINA",
    url: config.env.siteUrl,
    images: [
      {
        url: `${config.env.siteUrl}/assets/images/lg-cosmetic.webp`,
        width: 1200,
        height: 630,
        alt: "CÔNG TY TNHH MỸ PHẨM LG VINA",
      },
    ],
  },
};
