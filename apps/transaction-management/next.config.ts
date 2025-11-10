import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8083/api/:path*", // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
