import type { NextConfig } from 'next';
const githubPages = process.env.GITHUB_PAGES === 'true';
const basePath = githubPages ? '/museum' : '';
const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ['127.0.0.1'],
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  ...(githubPages ? { output: 'export', basePath, trailingSlash: true } : {}),
};
export default nextConfig;
