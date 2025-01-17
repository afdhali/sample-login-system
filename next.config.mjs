/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
    ],
  },

  // Configuration for SQLite in Next.js (especially important for Vercel deployment)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle these modules on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        stream: false,
        string_decoder: false,
      };
    }
    return config;
  },
};

export default nextConfig;
