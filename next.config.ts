import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "file.hstatic.net",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  // Allow cross-origin requests from local network in development
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.1.60",
  ],
};

export default nextConfig;
