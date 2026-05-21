/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["puppeteer"],
  eslint: {
    // Linting is run separately via `pnpm run lint`.
    // FlatCompat + eslint-plugin-react produces circular JSON during build.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
