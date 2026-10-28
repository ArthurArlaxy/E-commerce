import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  watchOptions: {
    pollIntervalMs: 1000,
  },
  images: {
    remotePatterns: [{ hostname: "i.ibb.co" }],
  },
};

export default nextConfig;