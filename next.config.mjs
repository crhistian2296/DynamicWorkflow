/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    "puppeteer",
    "puppeteer-core",
    "@sparticuz/chromium",
  ],
  outputFileTracingIncludes: {
    // ajusta la clave a la ruta que ejecuta tu executor
    "/api/**/*": ["./node_modules/@sparticuz/chromium/bin/**"],
  },
  eslint: {
    // Linting is run separately via `pnpm run lint`.
    // FlatCompat + eslint-plugin-react produces circular JSON during build.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
