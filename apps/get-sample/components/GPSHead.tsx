import { DefaultSeo, NextSeo, NextSeoProps } from "next-seo";
import { FC } from "react";

export const GSPHead: FC<NextSeoProps> = (props) => {
  return <NextSeo {...props} />;
};

export const GSPDefaultHead: FC = () => {
  return (
    <DefaultSeo
      title="Quà tặng miễn phí"
      titleTemplate="%s | Onpoint Việt Nam"
      canonical="htts://quatangmienphi.vn"
      openGraph={{
        url: "htts://quatangmienphi.vn",
        title: "Quà Tặng Miễn Phí | Onpoint Việt Nam",
        description:
          "Chương trình quà tặng miễn phí mang đến cho các bạn những hộp quà hấp dẫn, giao tận nơi và hoàn toàn miễn phí.",
        type: "website",
      }}
    />
  );
};
