import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: 'http://168.144.125.16:5001/api/:path*',
        },
      ],
    }
  },

};

export default nextConfig;
