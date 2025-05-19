/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
// @ts-check

// Load environment variables
import("./src/env.js");

/** @type {import("next").NextConfig} */
const nextConfig = {
  // Other Next.js config options
  serverExternalPackages: ["@prisma/client"],
  // Configure server options
  experimental: {
    serverMinification: false,
  },
  // PWA configuration
  headers: async () => {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ];
  },
};

// Export the final config
export default nextConfig;
