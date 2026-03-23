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
        hostname: "img.passfit.in",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/gym-login",
        destination: "/partner/login",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
