import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@cultivator/ui", "@cultivator/types", "@cultivator/utils"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
};

export default nextConfig;
