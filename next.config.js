/** @type {import("next").NextConfig} */
const withPlugins = require('next-compose-plugins');
const removeImports = require('next-remove-imports')();

const twind = require('twind');
const autoprefix = require('@twind/preset-autoprefix');
const tailwind = require('@twind/preset-tailwind');

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    emotion: true,
  },
};

/**
 * @type {import('next').NextConfig}
 **/
module.exports = withPlugins(
  [
    [twind],
    [autoprefix],
    [tailwind],
    [
      removeImports({
        experimental: { esmExternals: true },
      }),
    ],
  ],
  nextConfig,
);
