/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep M0's "build doesn't gate on types" behavior. (Next.js 16 no longer runs ESLint
  // during `next build`, so the old `eslint.ignoreDuringBuilds` key is gone.)
  typescript: { ignoreBuildErrors: true },
};
export default nextConfig;
