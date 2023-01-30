// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require("@nrwl/next/plugins/with-nx");
const { withSentryConfig } = require("@sentry/nextjs");

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },

  i18n: {
    locales: ["vi", "en"],
    defaultLocale: "vi",
    localeDetection: false,
  },

  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [
      "dev-files.moira.vn",
      "files.moira.vn",
      "mall.lgvina.vn",
      "dev-hera-files.onpoint.vn",
      "stg-hera-files.onpoint.vn",
      "dev-api-hera.onpoint.vn",
      "lgvina.vn",
      "s3.ap-southeast-1.amazonaws.com",
    ],
  },

  async redirects() {
    return [
      {
        source: "/account",
        destination: "/account/profile",
        permanent: true,
      },
    ];
  },
};

const SentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withNx(
  withSentryConfig(nextConfig, SentryWebpackPluginOptions),
);
