import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint during builds
  },
  // You can add more config options here if needed
};

export default nextConfig;
