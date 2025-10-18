/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: { forceSwcTransforms: true },
  generateBuildId: async () => "build",
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;
