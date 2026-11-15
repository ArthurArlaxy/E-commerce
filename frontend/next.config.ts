import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  watchOptions: {
    pollIntervalMs: 1000,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;