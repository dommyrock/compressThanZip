const WorkerPlugin = require("worker-plugin");
const withPWA = require("next-pwa");
// const withOffline = require("next-offline");
// const runtimeCaching = require("next-pwa/cache");

const prod = process.env.NODE_ENV === "production";
module.exports = withPWA({
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
  pwa: {
    dest: "public",
    disable: prod ? false : true, // solution from https://github.com/GoogleChrome/workbox/issues/1790
    // runtimeCaching,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!isServer) {
      config.plugins.push(
        new WorkerPlugin({
          // use "self" as the global object when receiving hot updates.
          globalObject: "self",
        })
      );
      // config.module.rules.push({
      //   // All the codec files define a global with the same name as their file name. `exports-loader` attaches those to `module.exports`.
      //   test: /\.js$/,
      //   include: path.join(__dirname, "src", "codecs"),
      //   loader: "exports-loader",
      // });
      //https://github.com/vercel/next.js/issues/7755
      config.node = {
        fs: "empty",
      };
    }
    return config;
  },
});

/**
 * Source
 * https://github.com/vercel/next.js/tree/canary/examples/with-web-worker
 * https://github.com/koheitakumi/nextjs-typescript-comlink
 */
