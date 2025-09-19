/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Ensure proper asset loading
  assetPrefix: process.env.NODE_ENV === "production" ? undefined : "",
  // Set port for development
  devIndicators: {
    buildActivity: true,
  },
};

module.exports = nextConfig;
