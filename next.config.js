/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const nextConfig = {
  // Other Next.js config options
  serverExternalPackages: ["@prisma/client"],
  // Configure server options
  experimental: {
    serverMinification: false,
  },
};

// Export the final config
export default nextConfig;
