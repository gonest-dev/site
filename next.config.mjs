import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// Set to '/site' for gonest-dev.github.io/site; empty string once a custom
// domain is attached (project page becomes the domain root).
const basePath = process.env.NEXT_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'export',
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default withMDX(config);
