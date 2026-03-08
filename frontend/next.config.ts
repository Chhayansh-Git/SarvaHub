import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sarvahub.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/:path*`,
      },
    ];
  },
  experimental: {
    // @ts-ignore - Next.js config types sometimes lag behind experimental features
    turbopack: {
      root: process.cwd(),
    },
  },
};

export default nextConfig;
