import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/takvim",    destination: "/konular",   permanent: true },
      { source: "/yks",       destination: "/harita",    permanent: true },
      { source: "/hesaplama", destination: "/denemeler", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
    ],
  },
};

export default nextConfig;
