// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  //cacheComponents: true,
  //partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  
  // ADD THIS BLOCK:
  images: {
    dangerouslyAllowLocalIP: true, // Required for Next 16 to allow 127.0.0.1
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;