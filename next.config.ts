import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      /* postgres is an optional backup store — ignore if not installed */
      config.externals = [...(config.externals ?? []), "postgres"];
    }
    return config;
  },
};

export default nextConfig;
