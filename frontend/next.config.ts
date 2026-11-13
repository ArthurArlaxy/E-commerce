import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  watchOptions: {
    pollIntervalMs: 1000,
  },
  images: {
    // o backend está num IP privado da rede do Docker; só liberamos isso em desenvolvimento, configuração deve ser alterada em prod
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        hostname: "backend",
        port: "3333",
        pathname: "/api/images/**",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        hostname: "localhost"
      }
    ],
  },
};

export default nextConfig;