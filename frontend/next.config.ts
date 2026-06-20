import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: "http://localhost:8080",
  },
};

export default nextConfig;
