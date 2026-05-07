import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const proxyDestination = process.env.PROXY_API_DESTINATION || 'http://168.144.125.16:5001';
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${proxyDestination}/api/:path*`,
        },
      ],
    }
  },

};

export default nextConfig;
