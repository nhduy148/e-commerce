import * as config from "@hera/config";
import { NextSeo } from "next-seo";
import { FC } from "react";

interface ILinkTags {
  rel: string;
  href: string;
}

interface IOpenGraphImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
  type?: string;
}

interface IOpenGraphTags {
  type?: string;
  title?: string;
  url?: string;
  images: IOpenGraphImage[];
  description: string;
}

export interface NextSEOProps {
  title: string;
  titleTemplate?: string;
  description: string;
  linkTags?: ILinkTags[];
  openGraph: IOpenGraphTags;
}

const shareDomain = config.env.shareDomain;
const siteUrl = config.env.siteUrl;

export const NextSEO: FC<NextSEOProps> = ({
  title,
  titleTemplate,
  description,
  linkTags,
  openGraph,
  ...props
}) => {
  return (
    <NextSeo
      canonical={shareDomain}
      title={title}
      titleTemplate={titleTemplate}
      defaultTitle="CÔNG TY TNHH MỸ PHẨM LG VINA"
      description={description}
      additionalLinkTags={[
        ...(linkTags || []),
        { rel: "icon", href: `${siteUrl}/favicon.png` },
      ]}
      openGraph={{
        ...openGraph,
        type: openGraph?.type || "website",
        images: [
          {
            url:
              // @ts-ignore
              openGraph?.images?.[0]?.url ||
              `${siteUrl}/assets/images/lg-cosmetic.webp`,
            width: 1200,
            height: 630,
            alt: "CÔNG TY TNHH MỸ PHẨM LG VINA",
          },
        ],
      }}
      {...props}
    />
  );
};
